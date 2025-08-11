-- Create user_consents table for POPIA compliance
CREATE TABLE IF NOT EXISTS public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  consent_type TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create verifyid_audit_log table for tracking verification attempts
CREATE TABLE IF NOT EXISTS public.verifyid_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  national_id_hash TEXT NOT NULL,
  verification_status TEXT NOT NULL,
  verification_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on both tables
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifyid_audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_consents
CREATE POLICY "Users can view their own consents" 
ON public.user_consents 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consents" 
ON public.user_consents 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consents" 
ON public.user_consents 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for verifyid_audit_log
CREATE POLICY "Users can view their own audit logs" 
ON public.verifyid_audit_log 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit logs" 
ON public.verifyid_audit_log 
FOR INSERT 
WITH CHECK (true);

-- Admin policies
CREATE POLICY "Admins can view all consents" 
ON public.user_consents 
FOR ALL 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can view all audit logs" 
ON public.verifyid_audit_log 
FOR ALL 
USING (is_admin(auth.uid()));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON public.user_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_type ON public.user_consents(consent_type);
CREATE INDEX IF NOT EXISTS idx_verifyid_audit_user_id ON public.verifyid_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_verifyid_audit_status ON public.verifyid_audit_log(verification_status);

-- Create trigger for updated_at
CREATE TRIGGER update_user_consents_updated_at
BEFORE UPDATE ON public.user_consents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();