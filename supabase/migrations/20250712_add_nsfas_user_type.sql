-- Migration: Add NSFAS user type and table
-- Date: 2025-07-12
-- Description: Safely add nsfas user type and create nsfas_users table

-- Step 1: Create nsfas_users table
CREATE TABLE IF NOT EXISTS public.nsfas_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  department TEXT,
  region TEXT,
  position TEXT,
  employee_number TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Step 2: Enable RLS on nsfas_users table
ALTER TABLE public.nsfas_users ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policies for nsfas_users
CREATE POLICY "NSFAS users can view their own record"
ON public.nsfas_users
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "NSFAS users can update their own record"
ON public.nsfas_users
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all NSFAS users"
ON public.nsfas_users
FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Users can insert NSFAS record for themselves"
ON public.nsfas_users
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Step 4: Update user_type validation functions to include 'nsfas'
-- Note: We'll update the validation logic in the functions to accept 'nsfas'

-- Step 5: Register RLS policies in the registry
SELECT public.register_rls_policy('nsfas_users', 'NSFAS users can view their own record', 'SELECT', 'Allow NSFAS users to view their own profile data');
SELECT public.register_rls_policy('nsfas_users', 'NSFAS users can update their own record', 'UPDATE', 'Allow NSFAS users to update their own profile data');
SELECT public.register_rls_policy('nsfas_users', 'Admins can manage all NSFAS users', 'ALL', 'Allow admins full access to NSFAS user records');

-- Step 6: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_nsfas_users_user_id ON nsfas_users(user_id);
CREATE INDEX IF NOT EXISTS idx_nsfas_users_region ON nsfas_users(region);
CREATE INDEX IF NOT EXISTS idx_nsfas_users_department ON nsfas_users(department); 