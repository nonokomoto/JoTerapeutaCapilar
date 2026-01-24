-- =====================================================
-- PDR 002: Tabela de Histórico de Marcações
-- =====================================================

-- 1. Criar tabela de marcações
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    appointment_date TIMESTAMPTZ NOT NULL,
    appointment_type TEXT NOT NULL DEFAULT 'tratamento',
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT fk_client FOREIGN KEY (client_id)
        REFERENCES profiles(id) ON DELETE CASCADE
);

-- 2. Índices
CREATE INDEX IF NOT EXISTS idx_appointments_client_id ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_client_date ON appointments(client_id, appointment_date DESC);

-- 3. Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_appointments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS appointments_updated_at ON appointments;
CREATE TRIGGER appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_appointments_updated_at();

-- 4. RLS Policies
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Admin pode ver todas as marcações
CREATE POLICY "Admin can view all appointments"
ON appointments FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Admin pode criar/editar/apagar marcações
CREATE POLICY "Admin can manage appointments"
ON appointments FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- Clientes NÃO podem ver a tabela de marcações
-- (sem policy para clientes = sem acesso)

-- 5. Comentários
COMMENT ON TABLE appointments IS 'Histórico completo de marcações dos clientes';
COMMENT ON COLUMN appointments.appointment_type IS 'Tipo: tratamento, consulta, retorno';
COMMENT ON COLUMN appointments.completed IS 'Se a marcação foi realizada';
