-- Tabela para reações em posts/publicações
-- Similar a update_reactions mas para posts públicos

CREATE TABLE IF NOT EXISTS post_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reaction TEXT NOT NULL CHECK (reaction IN ('like', 'celebrate', 'helpful', 'question')),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Cada utilizador só pode ter uma reação de cada tipo por post
    UNIQUE(post_id, user_id, reaction)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user_id ON post_reactions(user_id);

-- RLS Policies
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;

-- Qualquer utilizador autenticado pode ver reações em posts publicados
CREATE POLICY "Users can view reactions on published posts"
ON post_reactions
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM posts
        WHERE posts.id = post_reactions.post_id
        AND posts.published = true
    )
);

-- Utilizadores podem adicionar reações aos posts publicados
CREATE POLICY "Users can add reactions to published posts"
ON post_reactions
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
        SELECT 1 FROM posts
        WHERE posts.id = post_reactions.post_id
        AND posts.published = true
    )
);

-- Utilizadores podem remover as suas próprias reações
CREATE POLICY "Users can delete their own reactions"
ON post_reactions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
