-- =====================================================
-- Jo Terapeuta Capilar - Row Level Security Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES Policies
-- =====================================================

-- Admin can see all profiles
CREATE POLICY "Admin can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can update any profile
CREATE POLICY "Admin can update all profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin can delete profiles (except own)
CREATE POLICY "Admin can delete profiles"
  ON profiles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
    AND id != auth.uid()
  );

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid() 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid()) -- Can't change own role
  );

-- =====================================================
-- CLIENT_UPDATES Policies
-- =====================================================

-- Admin can do everything with updates
CREATE POLICY "Admin full access to updates"
  ON client_updates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Clients can only view their own updates
CREATE POLICY "Clients can view own updates"
  ON client_updates FOR SELECT
  USING (client_id = auth.uid());

-- =====================================================
-- ATTACHMENTS Policies
-- =====================================================

-- Admin can do everything with attachments
CREATE POLICY "Admin full access to attachments"
  ON attachments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Clients can view attachments from their own updates
CREATE POLICY "Clients can view own attachments"
  ON attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM client_updates 
      WHERE id = attachments.update_id 
      AND client_id = auth.uid()
    )
  );

-- =====================================================
-- POSTS Policies
-- =====================================================

-- Admin can do everything with posts
CREATE POLICY "Admin full access to posts"
  ON posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- All authenticated users can view published posts
CREATE POLICY "Authenticated can view published posts"
  ON posts FOR SELECT
  USING (published = true AND auth.uid() IS NOT NULL);

-- =====================================================
-- STORAGE Policies (for Supabase Storage)
-- =====================================================
-- Note: Run these in the Supabase Dashboard under Storage > Policies

-- Create bucket for client files (run in Dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('client-files', 'client-files', false);

-- Policy: Admin can upload to any folder
-- Policy: Admin can view/delete any file
-- Policy: Clients can only view files in their folder
