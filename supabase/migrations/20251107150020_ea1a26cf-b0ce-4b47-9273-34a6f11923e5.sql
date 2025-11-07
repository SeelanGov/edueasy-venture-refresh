-- Fix handle_new_user to read user_type from raw_user_meta_data
-- This resolves NSFAS and Consultant registration failures

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_type TEXT;
  v_tracking_id TEXT;
BEGIN
  -- Read user_type from the raw metadata Supabase stores on auth.users
  v_user_type := COALESCE(
    NEW.raw_user_meta_data ->> 'user_type',
    'student'
  );

  -- Validate user_type against allowed set
  IF v_user_type NOT IN ('student', 'institution', 'sponsor', 'consultant', 'admin', 'nsfas') THEN
    v_user_type := 'student';
  END IF;

  -- Generate tracking ID using existing generator
  v_tracking_id := public.generate_tracking_id();

  -- Insert or update users table with data from auth.users + metadata
  INSERT INTO public.users (
    id,
    email,
    full_name,
    tier_level,
    consent_given,
    current_plan,
    user_type,
    tracking_id,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NULL),
    'free',
    false,
    'free',
    v_user_type,
    v_tracking_id,
    COALESCE(NEW.created_at, now())
  )
  ON CONFLICT (id) DO UPDATE SET
    user_type = EXCLUDED.user_type,
    full_name = COALESCE(public.users.full_name, EXCLUDED.full_name),
    tracking_id = COALESCE(public.users.tracking_id, EXCLUDED.tracking_id),
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;