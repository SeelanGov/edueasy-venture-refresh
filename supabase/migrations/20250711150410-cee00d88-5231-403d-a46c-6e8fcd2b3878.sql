-- PHASE 2: Function Hardening - Add search_path security

-- ✅ Harden handle_new_user() function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_type TEXT;
BEGIN
  -- Get user_type from session variable or default to 'student'
  v_user_type := COALESCE(current_setting('request.user_type', true), 'student');
  
  -- Validate user_type
  IF v_user_type NOT IN ('student', 'institution', 'sponsor', 'consultant', 'admin') THEN
    v_user_type := 'student';
  END IF;
  
  INSERT INTO public.users (
    id, 
    email, 
    tier_level, 
    consent_given, 
    current_plan, 
    user_type
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    'free', 
    false, 
    'free',
    v_user_type
  )
  ON CONFLICT (id) DO UPDATE SET
    user_type = EXCLUDED.user_type;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ✅ Harden assign_user_role() function
CREATE OR REPLACE FUNCTION public.assign_user_role(p_user_id uuid, p_user_type text, p_additional_data jsonb DEFAULT '{}'::jsonb)
RETURNS boolean AS $$
DECLARE
  v_result BOOLEAN := FALSE;
BEGIN
  -- Validate user_type
  IF p_user_type NOT IN ('student', 'institution', 'sponsor', 'consultant', 'admin') THEN
    RAISE EXCEPTION 'Invalid user_type: %', p_user_type;
  END IF;
  
  -- Update user_type in users table
  UPDATE public.users 
  SET user_type = p_user_type 
  WHERE id = p_user_id;
  
  -- Create role-specific records
  CASE p_user_type
    WHEN 'consultant' THEN
      INSERT INTO public.consultants (user_id, full_name, specialization, assigned_region)
      VALUES (
        p_user_id,
        p_additional_data->>'full_name',
        p_additional_data->>'specialization',
        p_additional_data->>'assigned_region'
      )
      ON CONFLICT (user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        specialization = EXCLUDED.specialization,
        assigned_region = EXCLUDED.assigned_region;
    WHEN 'admin' THEN
      INSERT INTO public.user_roles (user_id, role)
      VALUES (p_user_id, 'admin')
      ON CONFLICT (user_id, role) DO NOTHING;
    ELSE
      -- For institution and sponsor, records are created separately as needed
      NULL;
  END CASE;
  
  v_result := TRUE;
  RETURN v_result;
EXCEPTION WHEN OTHERS THEN
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ✅ Harden is_admin() function
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean AS $$
DECLARE
  v_is_admin boolean;
BEGIN
  -- Log check attempt for audit trail
  INSERT INTO system_error_logs (
    message,
    category,
    severity,
    component,
    action,
    user_id,
    details
  ) VALUES (
    'Admin role check performed',
    'SECURITY',
    'INFO',
    'RLS',
    'ADMIN_CHECK',
    user_uuid,
    jsonb_build_object('timestamp', now())
  );

  -- Check admin role
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = user_uuid
    AND role = 'admin'
  ) INTO v_is_admin;
  
  RETURN v_is_admin;
EXCEPTION WHEN OTHERS THEN
  -- Log error
  INSERT INTO system_error_logs (
    message,
    category,
    severity,
    component,
    action,
    user_id,
    details
  ) VALUES (
    'Admin check failed: ' || SQLERRM,
    'SECURITY',
    'ERROR',
    'RLS',
    'ADMIN_CHECK',
    user_uuid,
    jsonb_build_object('error', SQLERRM, 'stack', pg_exception_context())
  );
  
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;