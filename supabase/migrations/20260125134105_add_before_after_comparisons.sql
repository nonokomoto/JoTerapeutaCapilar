-- Create table for before/after photo comparisons
CREATE TABLE IF NOT EXISTS before_after_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    admin_id UUID NOT NULL REFERENCES profiles(id),

    -- Before photo
    before_image_url TEXT NOT NULL,
    before_date DATE NOT NULL,
    before_label TEXT DEFAULT 'Antes',

    -- After photo
    after_image_url TEXT NOT NULL,
    after_date DATE NOT NULL,
    after_label TEXT DEFAULT 'Depois',

    -- Metadata
    title TEXT,
    description TEXT,
    is_featured BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster client lookups
CREATE INDEX IF NOT EXISTS idx_before_after_client_id ON before_after_comparisons(client_id);
CREATE INDEX IF NOT EXISTS idx_before_after_featured ON before_after_comparisons(client_id, is_featured) WHERE is_featured = true;

-- Enable RLS
ALTER TABLE before_after_comparisons ENABLE ROW LEVEL SECURITY;

-- Policy: Clients can only view their own comparisons
CREATE POLICY "Clients can view own comparisons"
    ON before_after_comparisons
    FOR SELECT
    TO authenticated
    USING (
        client_id = auth.uid()
        OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy: Only admins can insert comparisons
CREATE POLICY "Admins can insert comparisons"
    ON before_after_comparisons
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy: Only admins can update comparisons
CREATE POLICY "Admins can update comparisons"
    ON before_after_comparisons
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy: Only admins can delete comparisons
CREATE POLICY "Admins can delete comparisons"
    ON before_after_comparisons
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Add updated_at trigger
CREATE TRIGGER update_before_after_comparisons_updated_at
    BEFORE UPDATE ON before_after_comparisons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
