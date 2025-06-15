
-- 1. Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Extend the users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS national_id_encrypted BYTEA,
ADD COLUMN IF NOT EXISTS id_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tracking_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referrer_partner_id UUID REFERENCES public.partners(id),
ADD COLUMN IF NOT EXISTS sponsor_id UUID REFERENCES public.partners(id);

-- 3. Create tracking ID sequence and generator
CREATE SEQUENCE IF NOT EXISTS public.tracking_id_seq;

CREATE OR REPLACE FUNCTION public.generate_tracking_id()
RETURNS TEXT AS $$
DECLARE
  next_id INT;
  year_suffix TEXT;
BEGIN
  next_id := nextval('tracking_id_seq');
  year_suffix := to_char(current_date, 'YY');
  RETURN 'EDU-ZA-' || year_suffix || '-' || lpad(next_id::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- 4. Backfill tracking_id for existing users
UPDATE public.users
SET tracking_id = public.generate_tracking_id()
WHERE tracking_id IS NULL;

-- 5. Create verification logs table
CREATE TABLE IF NOT EXISTS public.verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  national_id_last4 TEXT,
  result TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- 6. Add RLS policy for admins to view national_id_encrypted
DO $$
BEGIN
  IF NOT EXISTS (
      SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view national_id'
        AND tablename = 'users'
        AND schemaname = 'public'
      )
  THEN
    CREATE POLICY "Admins can view national_id" ON public.users
      FOR SELECT TO authenticated
      USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
  END IF;
END $$;

-- (Optional) Recommend: Enable RLS if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
