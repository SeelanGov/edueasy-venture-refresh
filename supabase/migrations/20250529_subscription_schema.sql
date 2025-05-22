-- Migration for EduEasy Subscription System
-- This migration adds the necessary tables and schema for the freemium model

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create subscription_tiers table
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10, 2) NOT NULL,
  price_yearly DECIMAL(10, 2) NOT NULL,
  max_applications INT NOT NULL,
  max_documents INT NOT NULL,
  includes_verification BOOLEAN NOT NULL DEFAULT FALSE,
  includes_ai_assistance BOOLEAN NOT NULL DEFAULT FALSE,
  includes_priority_support BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default tiers
INSERT INTO subscription_tiers (name, description, price_monthly, price_yearly, max_applications, max_documents, includes_verification, includes_ai_assistance, includes_priority_support)
VALUES 
  ('Free', 'Basic access to EduEasy with limited applications and documents', 0, 0, 3, 5, FALSE, FALSE, FALSE),
  ('Standard', 'Enhanced access with document verification and more applications', 49.99, 499.99, 10, 20, TRUE, FALSE, FALSE),
  ('Premium', 'Full access with AI assistance, priority support, and unlimited applications', 99.99, 999.99, 50, 100, TRUE, TRUE, TRUE);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier_id UUID NOT NULL REFERENCES subscription_tiers(id),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  payment_method VARCHAR(50),
  auto_renew BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_active_subscription UNIQUE (user_id, is_active)
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZAR',
  status VARCHAR(20) NOT NULL,
  payment_method VARCHAR(50),
  payment_reference VARCHAR(100),
  transaction_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id),
  referred_id UUID NOT NULL REFERENCES auth.users(id),
  status VARCHAR(20) DEFAULT 'pending',
  reward_amount DECIMAL(10, 2),
  reward_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_referral UNIQUE (referrer_id, referred_id)
);

-- Add referral_code to profiles table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'referral_code') THEN
      ALTER TABLE profiles ADD COLUMN referral_code VARCHAR(20) UNIQUE;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'referred_by') THEN
      ALTER TABLE profiles ADD COLUMN referred_by UUID REFERENCES auth.users(id);
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verifications_used') THEN
      ALTER TABLE profiles ADD COLUMN verifications_used INT DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'verifications_limit') THEN
      ALTER TABLE profiles ADD COLUMN verifications_limit INT DEFAULT 0;
    END IF;
  END IF;
END $$;

-- Add subscription-related fields to applications table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'applications') THEN
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'tier_level') THEN
      ALTER TABLE applications ADD COLUMN tier_level VARCHAR(20);
    END IF;
  END IF;
END $$;

-- Add RLS policies
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Subscription tiers policies
CREATE POLICY "Anyone can view subscription tiers"
  ON subscription_tiers FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify subscription tiers"
  ON subscription_tiers FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- User subscriptions policies
CREATE POLICY "Users can view their own subscriptions"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions"
  ON user_subscriptions FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can modify all subscriptions"
  ON user_subscriptions FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can modify all transactions"
  ON transactions FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Referrals policies
CREATE POLICY "Users can view their own referrals"
  ON referrals FOR SELECT
  USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can create referrals"
  ON referrals FOR INSERT
  WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Admins can view all referrals"
  ON referrals FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can modify all referrals"
  ON referrals FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Create function to assign free tier to new users
CREATE OR REPLACE FUNCTION assign_free_tier_to_new_user()
RETURNS TRIGGER AS $$
DECLARE
  free_tier_id UUID;
BEGIN
  -- Get the ID of the free tier
  SELECT id INTO free_tier_id FROM subscription_tiers WHERE name = 'Free' LIMIT 1;
  
  -- Insert a new subscription for the user
  INSERT INTO user_subscriptions (user_id, tier_id, start_date, end_date, is_active)
  VALUES (NEW.id, free_tier_id, NOW(), NULL, TRUE);
  
  -- Generate a unique referral code for the user
  UPDATE profiles 
  SET referral_code = LOWER(SUBSTRING(MD5(NEW.id::text || NOW()::text) FROM 1 FOR 8))
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to assign free tier to new users
DROP TRIGGER IF EXISTS assign_free_tier_trigger ON auth.users;
CREATE TRIGGER assign_free_tier_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION assign_free_tier_to_new_user();

-- Create function to check subscription limits
CREATE OR REPLACE FUNCTION check_subscription_limits()
RETURNS TRIGGER AS $$
DECLARE
  user_tier_id UUID;
  max_apps INT;
  current_apps INT;
BEGIN
  -- Get the user's active subscription tier
  SELECT tier_id INTO user_tier_id 
  FROM user_subscriptions 
  WHERE user_id = NEW.user_id AND is_active = TRUE 
  LIMIT 1;
  
  -- Get the maximum number of applications allowed for this tier
  SELECT max_applications INTO max_apps 
  FROM subscription_tiers 
  WHERE id = user_tier_id;
  
  -- Count the user's current applications
  SELECT COUNT(*) INTO current_apps 
  FROM applications 
  WHERE user_id = NEW.user_id;
  
  -- Check if the user has reached their limit
  IF current_apps >= max_apps THEN
    RAISE EXCEPTION 'You have reached the maximum number of applications allowed for your subscription tier.';
  END IF;
  
  -- Set the tier level on the application
  NEW.tier_level := (SELECT name FROM subscription_tiers WHERE id = user_tier_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to check subscription limits when creating applications
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'applications') THEN
    DROP TRIGGER IF EXISTS check_subscription_limits_trigger ON applications;
    CREATE TRIGGER check_subscription_limits_trigger
    BEFORE INSERT ON applications
    FOR EACH ROW
    EXECUTE FUNCTION check_subscription_limits();
  END IF;
END $$;