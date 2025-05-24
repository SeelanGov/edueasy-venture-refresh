-- Migration for EduEasy Revenue Generation and Premium Features
-- This migration adds tables for sponsorships, career guidance, leads, and admin stats

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create sponsorships table
CREATE TABLE IF NOT EXISTS sponsorships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_name VARCHAR(100) NOT NULL,
  contact_name VARCHAR(100) NOT NULL,
  contact_email VARCHAR(100) NOT NULL,
  contact_phone VARCHAR(20),
  sponsorship_level VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  logo_url TEXT,
  website_url TEXT,
  description TEXT,
  benefits TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table (for additional payment tracking beyond transactions)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id),
  payment_provider VARCHAR(50) NOT NULL,
  payment_method_details JSONB,
  provider_transaction_id VARCHAR(100),
  provider_customer_id VARCHAR(100),
  receipt_url TEXT,
  is_refunded BOOLEAN DEFAULT FALSE,
  refund_reason TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create career_guidance table
CREATE TABLE IF NOT EXISTS career_guidance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type VARCHAR(50) NOT NULL,
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  results JSONB NOT NULL,
  recommendations JSONB,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create consultation_bookings table for premium consultations
CREATE TABLE IF NOT EXISTS consultation_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES auth.users(id),
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  meeting_link TEXT,
  notes TEXT,
  payment_id UUID REFERENCES payments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  organization VARCHAR(100),
  interest_type VARCHAR(50) NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'new',
  assigned_to UUID REFERENCES auth.users(id),
  source VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_stats table
CREATE TABLE IF NOT EXISTS admin_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  new_users INTEGER DEFAULT 0,
  active_subscriptions INTEGER DEFAULT 0,
  revenue_daily DECIMAL(10, 2) DEFAULT 0,
  active_applications INTEGER DEFAULT 0,
  premium_conversions INTEGER DEFAULT 0,
  referral_signups INTEGER DEFAULT 0,
  consultation_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_daily_stats UNIQUE (date)
);

-- Create usage_metrics table for tracking feature usage
CREATE TABLE IF NOT EXISTS usage_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_name VARCHAR(50) NOT NULL,
  usage_count INTEGER DEFAULT 1,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_feature UNIQUE (user_id, feature_name)
);

-- Add RLS policies
ALTER TABLE sponsorships ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_guidance ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;

-- Sponsorships policies
CREATE POLICY "Anyone can view active sponsorships"
  ON sponsorships FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Only admins can modify sponsorships"
  ON sponsorships FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Payments policies
CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM transactions 
    WHERE transactions.id = payments.transaction_id 
    AND transactions.user_id = auth.uid()
  ));

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can modify all payments"
  ON payments FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Career guidance policies
CREATE POLICY "Users can view their own career guidance"
  ON career_guidance FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own career guidance"
  ON career_guidance FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all career guidance"
  ON career_guidance FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can modify all career guidance"
  ON career_guidance FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Consultation bookings policies
CREATE POLICY "Users can view their own consultation bookings"
  ON consultation_bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own consultation bookings"
  ON consultation_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Consultants can view their assigned bookings"
  ON consultation_bookings FOR SELECT
  USING (auth.uid() = consultant_id);

CREATE POLICY "Admins can view all consultation bookings"
  ON consultation_bookings FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can modify all consultation bookings"
  ON consultation_bookings FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Leads policies
CREATE POLICY "Only admins can view leads"
  ON leads FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Only admins can modify leads"
  ON leads FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Admin stats policies
CREATE POLICY "Only admins can view admin stats"
  ON admin_stats FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Only admins can modify admin stats"
  ON admin_stats FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Usage metrics policies
CREATE POLICY "Users can view their own usage metrics"
  ON usage_metrics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage metrics"
  ON usage_metrics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all usage metrics"
  ON usage_metrics FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create function to update usage metrics
CREATE OR REPLACE FUNCTION update_feature_usage(
  p_user_id UUID,
  p_feature_name VARCHAR
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO usage_metrics (user_id, feature_name)
  VALUES (p_user_id, p_feature_name)
  ON CONFLICT (user_id, feature_name)
  DO UPDATE SET 
    usage_count = usage_metrics.usage_count + 1,
    last_used = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check premium feature access
CREATE OR REPLACE FUNCTION check_premium_feature_access(
  p_user_id UUID,
  p_feature_name VARCHAR
)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  -- Check if user has an active subscription that includes the feature
  SELECT EXISTS (
    SELECT 1 
    FROM user_subscriptions us
    JOIN subscription_tiers st ON us.tier_id = st.id
    WHERE us.user_id = p_user_id 
    AND us.is_active = TRUE
    AND (
      (p_feature_name = 'verification' AND st.includes_verification = TRUE) OR
      (p_feature_name = 'ai_assistance' AND st.includes_ai_assistance = TRUE) OR
      (p_feature_name = 'priority_support' AND st.includes_priority_support = TRUE) OR
      (st.name = 'Premium') -- Premium tier has access to all features
    )
  ) INTO has_access;
  
  -- Record the feature access attempt
  PERFORM update_feature_usage(p_user_id, p_feature_name);
  
  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update daily admin stats
CREATE OR REPLACE FUNCTION update_daily_admin_stats()
RETURNS VOID AS $$
DECLARE
  today DATE := CURRENT_DATE;
  new_user_count INTEGER;
  active_subs_count INTEGER;
  daily_rev DECIMAL(10, 2);
  active_apps_count INTEGER;
  premium_conv_count INTEGER;
  ref_signups_count INTEGER;
  consult_bookings_count INTEGER;
BEGIN
  -- Count new users today
  SELECT COUNT(*) INTO new_user_count
  FROM auth.users
  WHERE created_at::DATE = today;
  
  -- Count active subscriptions
  SELECT COUNT(*) INTO active_subs_count
  FROM user_subscriptions
  WHERE is_active = TRUE;
  
  -- Calculate daily revenue
  SELECT COALESCE(SUM(amount), 0) INTO daily_rev
  FROM transactions
  WHERE created_at::DATE = today
  AND status = 'completed';
  
  -- Count active applications
  SELECT COUNT(*) INTO active_apps_count
  FROM applications
  WHERE created_at::DATE = today;
  
  -- Count premium conversions
  SELECT COUNT(*) INTO premium_conv_count
  FROM user_subscriptions
  WHERE created_at::DATE = today
  AND tier_id IN (SELECT id FROM subscription_tiers WHERE name != 'Free');
  
  -- Count referral signups
  SELECT COUNT(*) INTO ref_signups_count
  FROM profiles
  WHERE created_at::DATE = today
  AND referred_by IS NOT NULL;
  
  -- Count consultation bookings
  SELECT COUNT(*) INTO consult_bookings_count
  FROM consultation_bookings
  WHERE created_at::DATE = today;
  
  -- Insert or update the stats for today
  INSERT INTO admin_stats (
    date, 
    new_users, 
    active_subscriptions, 
    revenue_daily, 
    active_applications, 
    premium_conversions, 
    referral_signups, 
    consultation_bookings
  )
  VALUES (
    today,
    new_user_count,
    active_subs_count,
    daily_rev,
    active_apps_count,
    premium_conv_count,
    ref_signups_count,
    consult_bookings_count
  )
  ON CONFLICT (date)
  DO UPDATE SET
    new_users = new_user_count,
    active_subscriptions = active_subs_count,
    revenue_daily = daily_rev,
    active_applications = active_apps_count,
    premium_conversions = premium_conv_count,
    referral_signups = ref_signups_count,
    consultation_bookings = consult_bookings_count,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a cron job to update admin stats daily
SELECT cron.schedule(
  'update-admin-stats',
  '0 0 * * *',  -- Run at midnight every day
  $$SELECT update_daily_admin_stats()$$
);