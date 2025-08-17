-- Migration: Fix Student Tracking System
-- Date: 2025-01-15
-- Description: Fix registration flow to automatically generate tracking IDs for all new users
-- and backfill existing users without tracking IDs

-- Phase 1: Update handle_new_user() function to generate tracking IDs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_user_type TEXT;
  v_tracking_id TEXT;
BEGIN
  -- Get user_type from session variable or default to 'student'
  v_user_type := COALESCE(current_setting('request.user_type', true), 'student');
  
  -- Validate user_type - includes all supported types
  IF v_user_type NOT IN ('student', 'institution', 'sponsor', 'consultant', 'admin', 'nsfas') THEN
    v_user_type := 'student';
  END IF;
  
  -- Generate tracking ID for ALL new users
  v_tracking_id := public.generate_tracking_id();
  
  -- Insert user record with tracking ID
  INSERT INTO public.users (
    id, 
    email, 
    tier_level, 
    consent_given, 
    current_plan, 
    user_type,
    tracking_id
  )
  VALUES (
    NEW.id, 
    NEW.email, 
    'free', 
    false, 
    'free',
    v_user_type,
    v_tracking_id
  )
  ON CONFLICT (id) DO UPDATE SET
    user_type = EXCLUDED.user_type,
    tracking_id = COALESCE(public.users.tracking_id, EXCLUDED.tracking_id);
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Phase 2: Backfill tracking IDs for existing users
-- Only update users who don't have tracking IDs yet
UPDATE public.users 
SET tracking_id = public.generate_tracking_id()
WHERE tracking_id IS NULL;

-- Phase 3: Create function to manually assign tracking IDs (for admin use)
CREATE OR REPLACE FUNCTION public.assign_tracking_id_to_user(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_tracking_id TEXT;
  v_existing_tracking_id TEXT;
BEGIN
  -- Check if user already has a tracking ID
  SELECT tracking_id INTO v_existing_tracking_id
  FROM public.users
  WHERE id = p_user_id;
  
  IF v_existing_tracking_id IS NOT NULL THEN
    RETURN v_existing_tracking_id;
  END IF;
  
  -- Generate new tracking ID
  v_tracking_id := public.generate_tracking_id();
  
  -- Update user with tracking ID
  UPDATE public.users
  SET tracking_id = v_tracking_id
  WHERE id = p_user_id;
  
  RETURN v_tracking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 4: Create function to get tracking ID statistics
CREATE OR REPLACE FUNCTION public.get_tracking_id_stats()
RETURNS JSONB AS $$
DECLARE
  v_stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_users', COUNT(*),
    'users_with_tracking_id', COUNT(tracking_id),
    'users_without_tracking_id', COUNT(*) - COUNT(tracking_id),
    'tracking_id_coverage_percentage', ROUND((COUNT(tracking_id)::DECIMAL / COUNT(*)) * 100, 2),
    'last_generated_tracking_id', MAX(tracking_id),
    'sequence_current_value', currval('tracking_id_seq')
  ) INTO v_stats
  FROM public.users;
  
  RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 5: Add indexes for tracking ID performance
CREATE INDEX IF NOT EXISTS idx_users_tracking_id_lookup ON public.users(tracking_id) WHERE tracking_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_created_at_tracking ON public.users(created_at) WHERE tracking_id IS NOT NULL;

-- Phase 6: Create audit log for tracking ID assignments
CREATE TABLE IF NOT EXISTS public.tracking_id_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  tracking_id TEXT NOT NULL,
  assigned_by UUID REFERENCES public.users(id),
  assignment_method TEXT NOT NULL, -- 'automatic', 'manual', 'backfill'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.tracking_id_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audit log
CREATE POLICY "Admins can view tracking ID audit log"
ON public.tracking_id_audit_log
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert tracking ID audit log"
ON public.tracking_id_audit_log
FOR INSERT
WITH CHECK (true);

-- Phase 7: Log the backfill operation
INSERT INTO public.tracking_id_audit_log (user_id, tracking_id, assigned_by, assignment_method)
SELECT 
  id,
  tracking_id,
  NULL, -- System assignment
  'backfill'
FROM public.users
WHERE tracking_id IS NOT NULL
AND created_at < now() - interval '1 minute'; -- Only log existing users, not newly created ones

-- Phase 8: Create function to validate tracking ID format
CREATE OR REPLACE FUNCTION public.validate_tracking_id_format(p_tracking_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if tracking ID matches expected format: EDU-ZA-YY-XXXXXX
  RETURN p_tracking_id ~ '^EDU-ZA-\d{2}-\d{6}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Phase 9: Add constraint to ensure tracking ID format
ALTER TABLE public.users 
ADD CONSTRAINT check_tracking_id_format 
CHECK (tracking_id IS NULL OR public.validate_tracking_id_format(tracking_id));

-- Phase 10: Create function to get next tracking ID (for testing)
CREATE OR REPLACE FUNCTION public.peek_next_tracking_id()
RETURNS TEXT AS $$
DECLARE
  v_next_id INT;
  v_year_suffix TEXT;
BEGIN
  v_next_id := nextval('tracking_id_seq');
  v_year_suffix := to_char(current_date, 'YY');
  
  -- Reset sequence to previous value
  PERFORM setval('tracking_id_seq', v_next_id - 1);
  
  RETURN 'EDU-ZA-' || v_year_suffix || '-' || lpad(v_next_id::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log migration completion
DO $$
BEGIN
  RAISE NOTICE 'Student tracking system migration completed successfully';
  RAISE NOTICE 'Tracking IDs will now be automatically generated for all new user registrations';
  RAISE NOTICE 'Existing users without tracking IDs have been backfilled';
END $$;