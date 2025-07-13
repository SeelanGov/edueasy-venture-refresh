-- Security Fixes Migration
-- Fixes critical security vulnerabilities identified in security review

-- ========================================
-- CRITICAL SECURITY FIXES
-- ========================================

-- 1. Fix overly permissive system_error_logs policy
-- Remove the policy that allows any user to insert error logs
DROP POLICY IF EXISTS "system_insert_error_logs" ON public.system_error_logs;

-- Create a more restrictive policy that only allows system/edge functions to insert
-- This should be called from edge functions with service role, not from client
CREATE POLICY "system_insert_error_logs" ON public.system_error_logs
FOR INSERT WITH CHECK (
  -- Only allow inserts from authenticated users (edge functions)
  auth.uid() IS NOT NULL
  -- Additional restriction: only allow from specific contexts
  AND (
    -- Allow from edge functions (they use service role)
    current_setting('role') = 'service_role'
    -- Or allow from admin users for debugging
    OR is_admin(auth.uid())
  )
);

-- 2. Fix document_verification_logs policy to remove unauthenticated access
DROP POLICY IF EXISTS "document_verification_logs_access" ON public.document_verification_logs;

CREATE POLICY "document_verification_logs_access" ON public.document_verification_logs
FOR ALL USING (
  -- Only allow authenticated users
  auth.uid() IS NOT NULL
  AND (
    -- Users can view their own verification logs
    user_id = auth.uid()
    -- Admins can view all verification logs
    OR is_admin(auth.uid())
    -- Edge functions can access for processing
    OR current_setting('role') = 'service_role'
  )
)
WITH CHECK (
  -- Only allow authenticated users to insert
  auth.uid() IS NOT NULL
  AND (
    -- Users can insert their own verification logs
    user_id = auth.uid()
    -- Admins can insert verification logs
    OR is_admin(auth.uid())
    -- Edge functions can insert for processing
    OR current_setting('role') = 'service_role'
  )
);

-- 3. Fix sponsors table policy logic
-- The current policy has confusing logic with (id = auth.uid()) which shouldn't match UUID patterns
DROP POLICY IF EXISTS "sponsors_own_record_access" ON public.sponsors;

CREATE POLICY "sponsors_own_record_access" ON public.sponsors
FOR ALL USING (
  -- Only allow authenticated users
  auth.uid() IS NOT NULL
  AND (
    -- Sponsors can access their own record via user_id
    user_id = auth.uid()
    -- Admins can access all sponsor records
    OR is_admin(auth.uid())
  )
)
WITH CHECK (
  -- Only allow authenticated users
  auth.uid() IS NOT NULL
  AND (
    -- Sponsors can manage their own record via user_id
    user_id = auth.uid()
    -- Admins can manage all sponsor records
    OR is_admin(auth.uid())
  )
);

-- 4. Add role assignment restrictions to prevent privilege escalation
-- Create a function to safely assign user roles (admin only)
CREATE OR REPLACE FUNCTION assign_user_role(
  target_user_id UUID,
  new_role TEXT
) RETURNS BOOLEAN AS $$
BEGIN
  -- Only allow admins to assign roles
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only administrators can assign user roles';
  END IF;
  
  -- Prevent self-role assignment (additional security)
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot assign roles to yourself';
  END IF;
  
  -- Validate role
  IF new_role NOT IN ('admin', 'student', 'sponsor', 'institution', 'consultant') THEN
    RAISE EXCEPTION 'Invalid role: %', new_role;
  END IF;
  
  -- Insert or update the role
  INSERT INTO public.user_roles (user_id, role, assigned_by, assigned_at)
  VALUES (target_user_id, new_role, auth.uid(), now())
  ON CONFLICT (user_id, role) DO UPDATE SET
    assigned_by = auth.uid(),
    assigned_at = now();
    
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (admin check is inside function)
GRANT EXECUTE ON FUNCTION assign_user_role(UUID, TEXT) TO authenticated;

-- 5. Add audit logging for role assignments
CREATE TABLE IF NOT EXISTS public.role_assignment_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_user_id UUID NOT NULL,
  old_role TEXT,
  new_role TEXT NOT NULL,
  assigned_by UUID NOT NULL REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on audit table
ALTER TABLE public.role_assignment_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "admin_role_audit_access" ON public.role_assignment_audit
FOR ALL USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Update the assign_user_role function to log audit trail
CREATE OR REPLACE FUNCTION assign_user_role(
  target_user_id UUID,
  new_role TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  old_role TEXT;
BEGIN
  -- Only allow admins to assign roles
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Only administrators can assign user roles';
  END IF;
  
  -- Prevent self-role assignment (additional security)
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot assign roles to yourself';
  END IF;
  
  -- Validate role
  IF new_role NOT IN ('admin', 'student', 'sponsor', 'institution', 'consultant') THEN
    RAISE EXCEPTION 'Invalid role: %', new_role;
  END IF;
  
  -- Get current role for audit
  SELECT role INTO old_role 
  FROM public.user_roles 
  WHERE user_id = target_user_id 
  LIMIT 1;
  
  -- Insert or update the role
  INSERT INTO public.user_roles (user_id, role, assigned_by, assigned_at)
  VALUES (target_user_id, new_role, auth.uid(), now())
  ON CONFLICT (user_id, role) DO UPDATE SET
    assigned_by = auth.uid(),
    assigned_at = now();
    
  -- Log audit trail
  INSERT INTO public.role_assignment_audit (
    target_user_id, 
    old_role, 
    new_role, 
    assigned_by,
    ip_address,
    user_agent
  ) VALUES (
    target_user_id,
    old_role,
    new_role,
    auth.uid(),
    inet_client_addr(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
    
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Add rate limiting for sensitive operations
-- Create a rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(
  operation TEXT,
  max_attempts INTEGER DEFAULT 5,
  window_minutes INTEGER DEFAULT 15
) RETURNS BOOLEAN AS $$
DECLARE
  attempt_count INTEGER;
BEGIN
  -- Count recent attempts for this operation and user
  SELECT COUNT(*) INTO attempt_count
  FROM public.rate_limit_log
  WHERE user_id = auth.uid()
    AND operation = $1
    AND attempted_at > now() - interval '1 minute' * window_minutes;
    
  -- If under limit, log this attempt and allow
  IF attempt_count < max_attempts THEN
    INSERT INTO public.rate_limit_log (user_id, operation, attempted_at)
    VALUES (auth.uid(), $1, now());
    RETURN TRUE;
  END IF;
  
  -- Over limit
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  operation TEXT NOT NULL,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on rate limit table
ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

-- Users can only see their own rate limit logs
CREATE POLICY "users_own_rate_limit_access" ON public.rate_limit_log
FOR ALL USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_rate_limit_log_user_operation_time 
ON public.rate_limit_log(user_id, operation, attempted_at);

-- 7. Update policy registry with new security policies
INSERT INTO public.rls_policy_registry (table_name, policy_name, policy_type, description) VALUES
('system_error_logs', 'system_insert_error_logs', 'INSERT', 'Restricted system error log insertion'),
('document_verification_logs', 'document_verification_logs_access', 'ALL', 'Authenticated access to verification logs'),
('sponsors', 'sponsors_own_record_access', 'ALL', 'Fixed sponsor record access policy'),
('role_assignment_audit', 'admin_role_audit_access', 'ALL', 'Admin access to role assignment audit'),
('rate_limit_log', 'users_own_rate_limit_access', 'ALL', 'Users can access their own rate limit logs')
ON CONFLICT (table_name, policy_name) DO UPDATE SET
  description = EXCLUDED.description,
  updated_at = now();

-- ========================================
-- SECURITY HEADERS AND CONFIGURATION
-- ========================================

-- Add security-related configuration
INSERT INTO public.system_config (key, value, description) VALUES
('security.max_login_attempts', '5', 'Maximum login attempts before lockout'),
('security.lockout_duration_minutes', '15', 'Account lockout duration in minutes'),
('security.session_timeout_minutes', '480', 'Session timeout in minutes (8 hours)'),
('security.require_strong_passwords', 'true', 'Require strong password complexity'),
('security.enable_audit_logging', 'true', 'Enable comprehensive audit logging')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description,
  updated_at = now(); 