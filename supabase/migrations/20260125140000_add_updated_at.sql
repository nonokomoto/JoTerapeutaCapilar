-- Add updated_at field to client_updates
ALTER TABLE client_updates
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();

-- Create trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on client_updates
CREATE TRIGGER client_updates_updated_at
BEFORE UPDATE ON client_updates
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Backfill existing records (set updated_at = created_at for old records)
UPDATE client_updates
SET updated_at = created_at
WHERE updated_at IS NULL;
