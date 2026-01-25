-- Create reaction_type enum
CREATE TYPE reaction_type AS ENUM ('like', 'celebrate', 'helpful', 'question');

-- Create update_reactions table
CREATE TABLE update_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  update_id UUID NOT NULL REFERENCES client_updates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction reaction_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(update_id, user_id, reaction)
);

-- Create index for faster queries
CREATE INDEX idx_update_reactions_update ON update_reactions(update_id);
CREATE INDEX idx_update_reactions_user ON update_reactions(user_id);

-- Enable RLS
ALTER TABLE update_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view reactions on accessible updates
CREATE POLICY "Users can view reactions on accessible updates"
ON update_reactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM client_updates cu
    WHERE cu.id = update_reactions.update_id
    AND (
      cu.client_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
      )
    )
  )
);

-- Users can add reactions to updates they can view
CREATE POLICY "Users can add reactions"
ON update_reactions FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM client_updates cu
    WHERE cu.id = update_reactions.update_id
    AND (
      cu.client_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'admin'
      )
    )
  )
);

-- Users can remove their own reactions
CREATE POLICY "Users can remove own reactions"
ON update_reactions FOR DELETE
USING (auth.uid() = user_id);
