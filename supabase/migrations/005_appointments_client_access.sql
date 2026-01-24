-- =====================================================
-- PDR 003: Acesso de Clientes às Marcações
-- =====================================================

-- Clientes podem ver as suas próprias marcações
CREATE POLICY "Clients can view own appointments"
ON appointments FOR SELECT
TO authenticated
USING (client_id = auth.uid());

-- Comentário
COMMENT ON POLICY "Clients can view own appointments" ON appointments
IS 'Permite que clientes vejam apenas as suas próprias marcações';
