-- Add constraints and defaults to existing category field
-- This enables semantic categorization with color-coded badges

-- First, update any invalid category values to 'outro'
-- This includes NULL and any other non-standard values
UPDATE client_updates
SET category = 'outro'
WHERE category IS NULL
   OR category NOT IN ('evolucao', 'rotina', 'recomendacao', 'agendamento', 'outro');

-- Add default value for future inserts
ALTER TABLE client_updates ALTER COLUMN category SET DEFAULT 'outro';

-- Add check constraint for valid categories
ALTER TABLE client_updates ADD CONSTRAINT client_updates_category_check
  CHECK (category IN ('evolucao', 'rotina', 'recomendacao', 'agendamento', 'outro'));

-- Add index for efficient filtering by category
CREATE INDEX IF NOT EXISTS idx_client_updates_category ON client_updates(category);

-- Add comment for documentation
COMMENT ON COLUMN client_updates.category IS 'Categoria da atualização: evolucao (verde), rotina (azul), recomendacao (rose-gold), agendamento (amarelo), outro (cinza)';
