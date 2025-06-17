
-- Phase 1: Enable pgcrypto for proper encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Phase 2: Add rate limiting table for verification attempts
CREATE TABLE IF NOT EXISTS public.verification_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET,
  user_identifier TEXT, -- email or temp ID
  attempt_count INTEGER DEFAULT 1,
  first_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Phase 3: Update verification_logs to include more tracking
ALTER TABLE public.verification_logs 
ADD COLUMN IF NOT EXISTS ip_address INET,
ADD COLUMN IF NOT EXISTS attempt_number INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS verification_method TEXT DEFAULT 'api';

-- Phase 4: Ensure tracking_id is generated for existing users
UPDATE public.users 
SET tracking_id = public.generate_tracking_id()
WHERE tracking_id IS NULL;

-- Phase 5: Add RLS policies for national_id_encrypted protection
DROP POLICY IF EXISTS "Admins can view national_id" ON public.users;
CREATE POLICY "Admins only can view encrypted national_id" ON public.users
  FOR SELECT 
  USING (
    CASE 
      WHEN national_id_encrypted IS NULL THEN true
      ELSE public.is_admin(auth.uid())
    END
  );

-- Phase 6: Create function to safely decrypt national ID for admins
CREATE OR REPLACE FUNCTION public.decrypt_national_id(encrypted_id BYTEA, user_requesting UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
BEGIN
  -- Only admins can decrypt
  IF NOT public.is_admin(user_requesting) THEN
    RAISE EXCEPTION 'Unauthorized access to encrypted national ID';
  END IF;
  
  -- Return decrypted ID using pgcrypto
  RETURN pgp_sym_decrypt(encrypted_id, current_setting('app.encryption_key', true));
EXCEPTION WHEN OTHERS THEN
  RETURN '[DECRYPTION_ERROR]';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 7: Create function to handle verification success in one transaction
CREATE OR REPLACE FUNCTION public.handle_verification_success(
  p_user_id UUID,
  p_email TEXT,
  p_full_name TEXT,
  p_national_id TEXT,
  p_phone_number TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_tracking_id TEXT;
  v_encrypted_id BYTEA;
  v_result JSONB;
BEGIN
  -- Generate tracking ID
  v_tracking_id := public.generate_tracking_id();
  
  -- Encrypt national ID
  v_encrypted_id := pgp_sym_encrypt(p_national_id, current_setting('app.encryption_key', true));
  
  -- Insert or update user record
  INSERT INTO public.users (
    id,
    email,
    full_name,
    phone_number,
    tracking_id,
    national_id_encrypted,
    id_verified,
    current_plan,
    profile_status
  ) VALUES (
    p_user_id,
    p_email,
    p_full_name,
    p_phone_number,
    v_tracking_id,
    v_encrypted_id,
    true,
    'starter',
    'verified'
  )
  ON CONFLICT (id) DO UPDATE SET
    tracking_id = EXCLUDED.tracking_id,
    national_id_encrypted = EXCLUDED.national_id_encrypted,
    id_verified = EXCLUDED.id_verified,
    current_plan = EXCLUDED.current_plan,
    profile_status = EXCLUDED.profile_status,
    phone_number = EXCLUDED.phone_number;
  
  -- Return success result
  v_result := jsonb_build_object(
    'success', true,
    'tracking_id', v_tracking_id,
    'user_id', p_user_id,
    'plan', 'starter'
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Phase 8: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_verification_rate_limits_ip ON public.verification_rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_verification_rate_limits_user ON public.verification_rate_limits(user_identifier);
CREATE INDEX IF NOT EXISTS idx_verification_logs_user_id ON public.verification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_users_tracking_id ON public.users(tracking_id);

-- Phase 9: Enable RLS on new table
ALTER TABLE public.verification_rate_limits ENABLE ROW LEVEL SECURITY;

-- Phase 10: Create policy for rate limits (admins only)
CREATE POLICY "Admins can manage rate limits" ON public.verification_rate_limits
  FOR ALL USING (public.is_admin(auth.uid()));
