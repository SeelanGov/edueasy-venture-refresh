-- Multi-Role Backend Upgrade Migration
-- Phase 1: Schema Updates (Non-Breaking)

-- Add user_type column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'student';

-- Add comment for documentation
COMMENT ON COLUMN public.users.user_type IS 'User role type: student, institution, sponsor, consultant, admin';

-- Link existing role tables to users
ALTER TABLE public.institutions
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE public.sponsors
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- Create consultants table with RLS-ready structure
CREATE TABLE IF NOT EXISTS public.consultants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT,
  specialization TEXT,
  assigned_region TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add unique constraint to prevent duplicate consultant records per user
ALTER TABLE public.consultants
ADD CONSTRAINT IF NOT EXISTS consultants_user_id_unique UNIQUE (user_id);

-- Add sponsor_id to applications for sponsor tracking
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS sponsor_id UUID REFERENCES public.sponsors(id) ON DELETE SET NULL;

-- Phase 2: Enhanced User Registration Function
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 3: RLS Policies for New Role Tables

-- Enable RLS on consultants table
ALTER TABLE public.consultants ENABLE ROW LEVEL SECURITY;

-- Consultants RLS policies
CREATE POLICY "Consultants can view their own record"
ON public.consultants
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Consultants can update their own record"
ON public.consultants
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all consultants"
ON public.consultants
FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Users can insert consultant record for themselves"
ON public.consultants
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Enhanced institutions RLS policies
CREATE POLICY "Institutions can view their own record"
ON public.institutions
FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Institutions can update their own record"
ON public.institutions
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all institutions"
ON public.institutions
FOR ALL USING (is_admin(auth.uid()));

-- Enhanced sponsors RLS policies  
CREATE POLICY "Sponsors can view their own record"
ON public.sponsors
FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Sponsors can update their own record"
ON public.sponsors
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all sponsors"
ON public.sponsors
FOR ALL USING (is_admin(auth.uid()));

-- Enhanced application policies for sponsor access
CREATE POLICY "Sponsors can view sponsored applications"
ON public.applications
FOR SELECT USING (
  sponsor_id IS NOT NULL
  AND sponsor_id IN (
    SELECT id FROM public.sponsors WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Institutions can view applications to their programs"
ON public.applications
FOR SELECT USING (
  institution_id IS NOT NULL
  AND institution_id IN (
    SELECT id FROM public.institutions WHERE user_id = auth.uid()
  )
);

-- Create updated_at trigger for consultants
CREATE TRIGGER update_consultants_updated_at
  BEFORE UPDATE ON public.consultants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create helper function to assign user roles
CREATE OR REPLACE FUNCTION public.assign_user_role(
  p_user_id UUID,
  p_user_type TEXT,
  p_additional_data JSONB DEFAULT '{}'::JSONB
)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Register RLS policies in the registry
SELECT public.register_rls_policy('consultants', 'Consultants can view their own record', 'SELECT', 'Allow consultants to view their own profile data');
SELECT public.register_rls_policy('consultants', 'Consultants can update their own record', 'UPDATE', 'Allow consultants to update their own profile data');
SELECT public.register_rls_policy('consultants', 'Admins can manage all consultants', 'ALL', 'Allow admins full access to consultant records');

-- Update existing users to have proper user_type based on their roles
UPDATE public.users 
SET user_type = 'admin' 
WHERE id IN (
  SELECT user_id FROM public.user_roles WHERE role = 'admin'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_user_type ON public.users(user_type);
CREATE INDEX IF NOT EXISTS idx_institutions_user_id ON public.institutions(user_id);
CREATE INDEX IF NOT EXISTS idx_sponsors_user_id ON public.sponsors(user_id);
CREATE INDEX IF NOT EXISTS idx_consultants_user_id ON public.consultants(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_sponsor_id ON public.applications(sponsor_id);