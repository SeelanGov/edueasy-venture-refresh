
-- Create partner tiers enum
CREATE TYPE public.partner_tier AS ENUM ('basic', 'standard', 'premium');

-- Create partner types enum  
CREATE TYPE public.partner_type AS ENUM ('university', 'tvet', 'funder', 'seta', 'other');

-- Create partner status enum
CREATE TYPE public.partner_status AS ENUM ('active', 'inactive', 'pending', 'suspended');

-- Create partners table
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type partner_type NOT NULL,
  tier partner_tier NOT NULL DEFAULT 'basic',
  status partner_status NOT NULL DEFAULT 'pending',
  email TEXT NOT NULL,
  phone TEXT,
  website TEXT,
  contact_person TEXT,
  contact_email TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  postal_code TEXT,
  annual_investment DECIMAL(10,2) DEFAULT 0,
  contract_start_date TIMESTAMP WITH TIME ZONE,
  contract_end_date TIMESTAMP WITH TIME ZONE,
  integration_status TEXT DEFAULT 'not_started',
  api_key TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create partner payments table
CREATE TABLE public.partner_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  invoice_number TEXT,
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create partner notes table for communication history
CREATE TABLE public.partner_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  note_type TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create partner tier configurations table
CREATE TABLE public.partner_tier_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tier partner_tier NOT NULL UNIQUE,
  name TEXT NOT NULL,
  annual_fee DECIMAL(10,2) NOT NULL,
  max_applications INTEGER,
  api_rate_limit INTEGER,
  support_level TEXT,
  features JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_tier_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for partners (admin only access)
CREATE POLICY "Admin users can view all partners" 
  ON public.partners 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can insert partners" 
  ON public.partners 
  FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can update partners" 
  ON public.partners 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can delete partners" 
  ON public.partners 
  FOR DELETE 
  USING (public.is_admin(auth.uid()));

-- Create RLS policies for partner payments (admin only access)
CREATE POLICY "Admin users can view all partner payments" 
  ON public.partner_payments 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can insert partner payments" 
  ON public.partner_payments 
  FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can update partner payments" 
  ON public.partner_payments 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can delete partner payments" 
  ON public.partner_payments 
  FOR DELETE 
  USING (public.is_admin(auth.uid()));

-- Create RLS policies for partner notes (admin only access)
CREATE POLICY "Admin users can view all partner notes" 
  ON public.partner_notes 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can insert partner notes" 
  ON public.partner_notes 
  FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can update partner notes" 
  ON public.partner_notes 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can delete partner notes" 
  ON public.partner_notes 
  FOR DELETE 
  USING (public.is_admin(auth.uid()));

-- Create RLS policies for partner tier config (admin only access)
CREATE POLICY "Admin users can view partner tier config" 
  ON public.partner_tier_config 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can insert partner tier config" 
  ON public.partner_tier_config 
  FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admin users can update partner tier config" 
  ON public.partner_tier_config 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));

-- Add updated_at triggers
CREATE TRIGGER update_partners_updated_at 
  BEFORE UPDATE ON public.partners 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partner_payments_updated_at 
  BEFORE UPDATE ON public.partner_payments 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partner_tier_config_updated_at 
  BEFORE UPDATE ON public.partner_tier_config 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default tier configurations
INSERT INTO public.partner_tier_config (tier, name, annual_fee, max_applications, api_rate_limit, support_level, features) VALUES
('basic', 'Basic Partner', 50000.00, 100, 1000, 'email', '["basic_reporting", "standard_support"]'),
('standard', 'Standard Partner', 150000.00, 500, 5000, 'phone', '["advanced_reporting", "priority_support", "bulk_operations"]'),
('premium', 'Premium Partner', 300000.00, -1, 10000, 'dedicated', '["real_time_reporting", "dedicated_support", "custom_integrations", "advanced_analytics"]');
