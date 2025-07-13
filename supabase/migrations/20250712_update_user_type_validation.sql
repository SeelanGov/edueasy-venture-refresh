-- Migration: Update user_type validation to include 'nsfas'
-- Date: 2025-07-12
-- Description: Update functions to accept 'nsfas' user type

-- Step 1: Update handle_new_user() function to accept 'nsfas'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_type TEXT;
BEGIN
  -- Get user_type from session variable or default to 'student'
  v_user_type := COALESCE(current_setting('request.user_type', true), 'student');
  
  -- Validate user_type - now includes 'nsfas'
  IF v_user_type NOT IN ('student', 'institution', 'sponsor', 'consultant', 'admin', 'nsfas') THEN
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

-- Step 2: Update assign_user_role() function to handle 'nsfas'
CREATE OR REPLACE FUNCTION public.assign_user_role(p_user_id uuid, p_user_type text, p_additional_data jsonb DEFAULT '{}'::jsonb)
RETURNS boolean AS $$
DECLARE
  v_result BOOLEAN := FALSE;
BEGIN
  -- Validate user_type - now includes 'nsfas'
  IF p_user_type NOT IN ('student', 'institution', 'sponsor', 'consultant', 'admin', 'nsfas') THEN
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
    WHEN 'nsfas' THEN
      INSERT INTO public.nsfas_users (user_id, department, region, position, employee_number)
      VALUES (
        p_user_id,
        p_additional_data->>'department',
        p_additional_data->>'region',
        p_additional_data->>'position',
        p_additional_data->>'employee_number'
      )
      ON CONFLICT (user_id) DO UPDATE SET
        department = EXCLUDED.department,
        region = EXCLUDED.region,
        position = EXCLUDED.position,
        employee_number = EXCLUDED.employee_number;
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