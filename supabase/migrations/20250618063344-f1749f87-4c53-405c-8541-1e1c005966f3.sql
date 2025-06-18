
-- Create subscription tiers table
CREATE TABLE public.subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price_once_off NUMERIC NOT NULL DEFAULT 0,
  max_applications INTEGER NOT NULL,
  max_documents INTEGER,
  includes_verification BOOLEAN DEFAULT false,
  includes_ai_assistance BOOLEAN DEFAULT false,
  includes_priority_support BOOLEAN DEFAULT false,
  includes_document_reviews BOOLEAN DEFAULT false,
  includes_career_guidance BOOLEAN DEFAULT false,
  includes_auto_fill BOOLEAN DEFAULT false,
  includes_nsfas_guidance BOOLEAN DEFAULT false,
  thandi_tier TEXT NOT NULL CHECK (thandi_tier IN ('basic', 'guidance', 'advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES public.subscription_tiers(id),
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_tiers (public read access)
CREATE POLICY "Anyone can view subscription tiers" ON public.subscription_tiers
  FOR SELECT USING (true);

-- RLS Policies for user_subscriptions (users can only see their own)
CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" ON public.user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Insert default subscription tiers
INSERT INTO public.subscription_tiers (name, description, price_once_off, max_applications, max_documents, includes_verification, includes_ai_assistance, includes_priority_support, includes_document_reviews, includes_career_guidance, includes_auto_fill, includes_nsfas_guidance, thandi_tier) VALUES
('Starter', 'Get started with basic features', 0, 1, 5, false, true, false, false, false, false, false, 'basic'),
('Essential', 'Enhanced features for serious students', 199, 3, 20, true, true, false, false, false, true, true, 'guidance'),
('Pro + AI', 'All features with advanced AI guidance', 300, 6, null, true, true, true, true, true, true, true, 'advanced');

-- Add triggers for updated_at
CREATE TRIGGER update_subscription_tiers_updated_at
  BEFORE UPDATE ON public.subscription_tiers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON public.user_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
