-- Add RLS policy for clients to mark their own updates as read
-- The client_read_at field already exists, we just need the policy

-- Policy for clients to update their own client_read_at field
CREATE POLICY "Clients can mark own updates as read"
ON client_updates
FOR UPDATE
USING (auth.uid() = client_id)
WITH CHECK (auth.uid() = client_id);

-- Add index for efficient queries on unread updates
CREATE INDEX IF NOT EXISTS idx_client_updates_unread
ON client_updates(client_id, client_read_at)
WHERE client_read_at IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN client_updates.client_read_at IS 'Timestamp when client marked update as read. NULL = unread, used for "Novo" badges';
