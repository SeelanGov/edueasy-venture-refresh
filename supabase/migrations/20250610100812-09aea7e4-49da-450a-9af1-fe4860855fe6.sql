
-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add new columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS national_id_encrypted BYTEA,
ADD COLUMN IF NOT EXISTS id_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tracking_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referrer_partner_id UUID REFERENCES public.partners(id),
ADD COLUMN IF NOT EXISTS sponsor_id UUID REFERENCES public.partners(id);

-- Create sequence for tracking ID generation
CREATE SEQUENCE IF NOT EXISTS public.tracking_id_seq;

-- Create function to generate tracking IDs
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

-- Create verification logs table
CREATE TABLE IF NOT EXISTS public.verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  national_id_last4 TEXT,
  result TEXT NOT NULL,
  error_message TEXT,
  verification_method TEXT DEFAULT 'api',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on verification_logs
ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for verification_logs (admin only)
CREATE POLICY "Admins can view verification logs" ON public.verification_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policy to restrict access to encrypted national_id (admin only)
CREATE POLICY "Admins can view encrypted national_id" ON public.users
  FOR SELECT USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Backfill tracking_id for existing users
UPDATE public.users
SET tracking_id = public.generate_tracking_id()
WHERE tracking_id IS NULL;

-- Create index for tracking_id for better performance
CREATE INDEX IF NOT EXISTS idx_users_tracking_id ON public.users(tracking_id);
CREATE INDEX IF NOT EXISTS idx_users_id_verified ON public.users(id_verified);
CREATE INDEX IF NOT EXISTS idx_verification_logs_user_id ON public.verification_logs(user_id);
