-- Phase 4.1.2 Final Security Patch: Fix users table RLS policy
-- Remove unsafe read-all policy that allows any authenticated user to read all user data

-- Drop the existing unsafe policy that allows unrestricted read access
DROP POLICY IF EXISTS "Allow Read Access" ON public.users;

-- Create secure scoped access policy: users can only read their own data OR admins can read all
CREATE POLICY "users_secure_read_access" ON public.users
FOR SELECT USING (
  auth.uid() = id OR is_admin(auth.uid())
);

-- Ensure other user operations are also properly scoped
DROP POLICY IF EXISTS "Allow Update Access" ON public.users;
CREATE POLICY "users_secure_update_access" ON public.users
FOR UPDATE USING (
  auth.uid() = id OR is_admin(auth.uid())
) WITH CHECK (
  auth.uid() = id OR is_admin(auth.uid())
);

-- Allow users to insert their own records (for registration)
DROP POLICY IF EXISTS "Allow Insert Access" ON public.users;
CREATE POLICY "users_secure_insert_access" ON public.users
FOR INSERT WITH CHECK (
  auth.uid() = id
);

-- Log this critical security fix
INSERT INTO system_error_logs (
  message,
  category,
  severity,
  component,
  action,
  details
) VALUES (
  'Phase 4.1.2: Fixed critical users table RLS vulnerability',
  'SECURITY',
  'CRITICAL',
  'RLS',
  'POLICY_HARDENING',
  jsonb_build_object(
    'phase', '4.1.2',
    'action', 'users_table_rls_secured',
    'timestamp', now(),
    'policies_updated', jsonb_build_array('SELECT', 'UPDATE', 'INSERT')
  )
);