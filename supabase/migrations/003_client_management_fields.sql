-- =====================================================
-- PDR 002: Campos de Gestão de Clientes
-- =====================================================

-- 1. Adicionar campos à tabela profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS first_visit_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_appointment_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS next_appointment_date TIMESTAMPTZ;

-- Nota: status será calculado dinamicamente, não armazenado

-- 2. Índices para performance (queries filtradas)
CREATE INDEX IF NOT EXISTS idx_profiles_next_appointment
ON profiles(next_appointment_date)
WHERE role = 'client';

CREATE INDEX IF NOT EXISTS idx_profiles_last_appointment
ON profiles(last_appointment_date)
WHERE role = 'client';

-- 3. Comentários de documentação
COMMENT ON COLUMN profiles.first_visit_date IS 'Data da primeira visita do cliente (manual)';
COMMENT ON COLUMN profiles.last_appointment_date IS 'Data da última consulta/tratamento';
COMMENT ON COLUMN profiles.next_appointment_date IS 'Data da próxima marcação agendada';
