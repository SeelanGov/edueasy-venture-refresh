-- Step 2: Consolidate and Update RLS Policies
-- Generic user access policy for users table
CREATE POLICY IF NOT EXISTS "Users can access their own records"
  ON users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update their own profiles"
  ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Step 3: Optimize Performance (Indexes)
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_education_records_user_id ON public.education_records USING btree (user_id);

-- Step 4: Test Function for RLS Policies
CREATE OR REPLACE FUNCTION test_rls_policies_with_role(p_role text DEFAULT 'user')
RETURNS TABLE(table_name text, policy_name text, operation text, success boolean, details text) AS $$
BEGIN
    -- Implementation for testing policies goes here
    RETURN;
END;
$$ LANGUAGE plpgsql;
