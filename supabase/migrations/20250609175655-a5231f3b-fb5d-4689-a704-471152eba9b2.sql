
-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan TEXT NOT NULL,
  amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'failed')),
  transaction_id TEXT,
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_plans table
CREATE TABLE public.user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create plans table
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  price INTEGER NOT NULL,
  features TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add current_plan column to users table if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS current_plan TEXT;

-- Enable RLS on new tables
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin-only access
CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert payments" ON public.payments
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update payments" ON public.payments
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete payments" ON public.payments
  FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all user_plans" ON public.user_plans
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert user_plans" ON public.user_plans
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update user_plans" ON public.user_plans
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete user_plans" ON public.user_plans
  FOR DELETE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can view all plans" ON public.plans
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert plans" ON public.plans
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update plans" ON public.plans
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete plans" ON public.plans
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Allow users to view their own plans
CREATE POLICY "Users can view their own user_plans" ON public.user_plans
  FOR SELECT USING (auth.uid() = user_id);

-- Allow public read access to active plans for pricing page
CREATE POLICY "Anyone can view active plans" ON public.plans
  FOR SELECT USING (active = true);

-- Create function to activate user plan when payment is successful
CREATE OR REPLACE FUNCTION public.activate_user_plan()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process if payment status changed to 'paid'
  IF OLD.status != 'paid' AND NEW.status = 'paid' THEN
    -- Deactivate existing plans for this user
    UPDATE public.user_plans 
    SET active = false, updated_at = now()
    WHERE user_id = NEW.user_id AND active = true;
    
    -- Create new active plan
    INSERT INTO public.user_plans (user_id, plan, active, start_date)
    VALUES (NEW.user_id, NEW.plan, true, now());
    
    -- Update user's current_plan
    UPDATE public.users 
    SET current_plan = NEW.plan
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic plan activation
CREATE TRIGGER on_payment_status_change
  AFTER UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.activate_user_plan();

-- Insert default plans
INSERT INTO public.plans (name, price, features) VALUES
  ('starter', 0, ARRAY['1 Application', 'Basic APS calculator', 'Community support']),
  ('essential', 199, ARRAY['Up to 3 applications', 'Document management', 'NSFAS guidance', 'Email support']),
  ('pro-ai', 300, ARRAY['Up to 6 applications', 'Thandi AI guidance', 'Document reviews', 'Priority support'])
ON CONFLICT (name) DO NOTHING;

-- Create updated_at trigger for all new tables
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_plans_updated_at
  BEFORE UPDATE ON public.user_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON public.plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
