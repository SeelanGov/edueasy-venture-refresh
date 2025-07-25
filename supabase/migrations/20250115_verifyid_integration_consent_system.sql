-- Migration: VerifyID Integration with POPIA-Compliant Consent System
-- Date: 2025-01-15
-- Description: Comprehensive consent tracking, VerifyID integration, and audit systems

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create user_consents table for POPIA compliance
CREATE TABLE IF NOT EXISTS public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL, -- 'ID_verification', 'marketing', 'data_processing', 'privacy_policy', 'terms_of_service'
  consent_text TEXT NOT NULL, -- The exact text shown to user
  consent_version TEXT NOT NULL, -- Version of consent text
  accepted BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT unique_user_consent_type UNIQUE (user_id, consent_type)
);

-- 2. Add VerifyID-specific fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS verifyid_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verifyid_verification_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verifyid_response_data JSONB; -- Store non-sensitive verification data

-- 3. Create verification audit table
CREATE TABLE IF NOT EXISTS public.verifyid_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  api_request_id TEXT,
  verification_status TEXT NOT NULL, -- 'success', 'failed', 'error'
  error_message TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Create rate limiting table for verification attempts
CREATE TABLE IF NOT EXISTS public.verification_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address INET,
  user_identifier TEXT, -- email or user_id
  attempt_count INTEGER DEFAULT 1,
  first_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_attempt_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Create verification logs table (if not exists)
CREATE TABLE IF NOT EXISTS public.verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  national_id_last4 TEXT,
  result TEXT,
  ip_address INET,
  attempt_number INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Enable RLS on all new tables
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifyid_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_logs ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for user_consents
CREATE POLICY "Users can view their own consents"
  ON public.user_consents
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own consents"
  ON public.user_consents
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all consents"
  ON public.user_consents
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- 8. RLS Policies for verifyid_audit_log
CREATE POLICY "Users can view their own verification logs"
  ON public.verifyid_audit_log
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert verification logs"
  ON public.verifyid_audit_log
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all verification logs"
  ON public.verifyid_audit_log
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- 9. RLS Policies for verification_rate_limits
CREATE POLICY "System can manage rate limits"
  ON public.verification_rate_limits
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 10. RLS Policies for verification_logs
CREATE POLICY "System can manage verification logs"
  ON public.verification_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 11. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON public.user_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_type ON public.user_consents(consent_type);
CREATE INDEX IF NOT EXISTS idx_verifyid_audit_user_id ON public.verifyid_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_verifyid_audit_status ON public.verifyid_audit_log(verification_status);
CREATE INDEX IF NOT EXISTS idx_verification_rate_limits_ip ON public.verification_rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_verification_rate_limits_identifier ON public.verification_rate_limits(user_identifier);

-- 12. Create function to check if user has valid consent
CREATE OR REPLACE FUNCTION public.has_valid_consent(
  p_user_id UUID,
  p_consent_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_has_consent BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.user_consents 
    WHERE user_id = p_user_id 
    AND consent_type = p_consent_type 
    AND accepted = true
  ) INTO v_has_consent;
  
  RETURN v_has_consent;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create function to record consent
CREATE OR REPLACE FUNCTION public.record_user_consent(
  p_user_id UUID,
  p_consent_type TEXT,
  p_consent_text TEXT,
  p_consent_version TEXT,
  p_accepted BOOLEAN,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_consent_id UUID;
BEGIN
  INSERT INTO public.user_consents (
    user_id,
    consent_type,
    consent_text,
    consent_version,
    accepted,
    ip_address,
    user_agent
  ) VALUES (
    p_user_id,
    p_consent_type,
    p_consent_text,
    p_consent_version,
    p_accepted,
    p_ip_address,
    p_user_agent
  )
  ON CONFLICT (user_id, consent_type) 
  DO UPDATE SET
    consent_text = EXCLUDED.consent_text,
    consent_version = EXCLUDED.consent_version,
    accepted = EXCLUDED.accepted,
    ip_address = EXCLUDED.ip_address,
    user_agent = EXCLUDED.user_agent,
    created_at = now()
  RETURNING id INTO v_consent_id;
  
  RETURN v_consent_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Create function to log verification attempt
CREATE OR REPLACE FUNCTION public.log_verification_attempt(
  p_user_id UUID,
  p_api_request_id TEXT DEFAULT NULL,
  p_verification_status TEXT,
  p_error_message TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.verifyid_audit_log (
    user_id,
    api_request_id,
    verification_status,
    error_message,
    ip_address
  ) VALUES (
    p_user_id,
    p_api_request_id,
    p_verification_status,
    p_error_message,
    p_ip_address
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Update users table to track consent status
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS id_verification_consent_given BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS id_verification_consent_date TIMESTAMP WITH TIME ZONE;

-- 16. Create trigger to update user consent status
CREATE OR REPLACE FUNCTION public.update_user_consent_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.consent_type = 'ID_verification' AND NEW.accepted = true THEN
    UPDATE public.users 
    SET 
      id_verification_consent_given = true,
      id_verification_consent_date = NEW.created_at
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_user_consent_status
  AFTER INSERT OR UPDATE ON public.user_consents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_consent_status();

-- 17. Add comments for documentation
COMMENT ON TABLE public.user_consents IS 'Stores user consent records for POPIA compliance';
COMMENT ON TABLE public.verifyid_audit_log IS 'Audit trail for VerifyID API calls';
COMMENT ON TABLE public.verification_rate_limits IS 'Rate limiting for verification attempts';
COMMENT ON TABLE public.verification_logs IS 'General verification attempt logs';

COMMENT ON COLUMN public.users.verifyid_verified IS 'Whether user has been verified through VerifyID API';
COMMENT ON COLUMN public.users.verifyid_verification_date IS 'Date when VerifyID verification was completed';
COMMENT ON COLUMN public.users.verifyid_response_data IS 'Non-sensitive verification response data (JSON)';
COMMENT ON COLUMN public.users.id_verification_consent_given IS 'Whether user has given consent for ID verification';
COMMENT ON COLUMN public.users.id_verification_consent_date IS 'Date when ID verification consent was given'; 