-- 2025-05-15: Consolidate and Update RLS Policies, Restrict Public Access, Optimize, and Add Indexes

-- Users table: generic access and update policies
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

-- Documents table: restrict to authenticated users, all CRUD
CREATE POLICY IF NOT EXISTS "Authenticated users can view their own documents" 
ON documents 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Authenticated users can insert their own documents" 
ON documents 
FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Authenticated users can update their own documents" 
ON documents 
FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Authenticated users can delete their own documents" 
ON documents 
FOR DELETE 
TO authenticated 
USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications USING btree (user_id);
