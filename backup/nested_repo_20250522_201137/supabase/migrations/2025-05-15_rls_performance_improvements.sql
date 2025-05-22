-- Supabase RLS and Performance Improvements Migration
-- Date: 2025-05-15

-- 1. Consolidate and Update RLS Policies
-- Example for documents table (repeat for other user-owned tables as needed)
DROP POLICY IF EXISTS "Users can view their own documents" ON documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON documents;

CREATE POLICY "Users can manage their own documents"
  ON documents
  FOR ALL
  USING (user_id = auth.uid());

-- 2. Restrict Public Access Policies
-- Remove public access from sensitive tables
DROP POLICY IF EXISTS "Public can view documents" ON documents;

CREATE POLICY "Authenticated users can view their documents"
  ON documents
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- 3. Optimize Policies to Minimize Subqueries
-- (Assume all policies now use direct user_id = auth.uid() checks)

-- 4. Create Missing Indexes
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents (user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications (user_id);
CREATE INDEX IF NOT EXISTS idx_education_records_user_id ON education_records (user_id);

-- 5. Restrict Error Log Access
DROP POLICY IF EXISTS "Public can view error logs" ON error_logs;
CREATE POLICY "Admins can manage error logs"
  ON error_logs
  FOR ALL
  USING (auth.role() = 'admin');

-- 6. (Optional) Add more policies for other tables as needed

-- 7. (Optional) Add test instructions for RLS validation
-- See docs/security.md for test strategy.
