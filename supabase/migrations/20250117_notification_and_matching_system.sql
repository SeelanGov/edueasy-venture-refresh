-- Migration for Notification and Matching System
-- This migration adds tables for notifications, matching rules, and automated assignments

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Notification Preferences
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT TRUE,
  in_app_enabled BOOLEAN DEFAULT TRUE,
  payment_notifications BOOLEAN DEFAULT TRUE,
  sponsorship_notifications BOOLEAN DEFAULT TRUE,
  system_notifications BOOLEAN DEFAULT TRUE,
  marketing_notifications BOOLEAN DEFAULT FALSE,
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'in_app')),
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. In-App Notifications
CREATE TABLE IF NOT EXISTS in_app_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Notification Audit Logs
CREATE TABLE IF NOT EXISTS notification_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Sponsor Matching Rules
CREATE TABLE IF NOT EXISTS sponsor_matching_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('academic', 'financial', 'demographic', 'preference', 'custom')),
  criteria JSONB NOT NULL,
  weight INTEGER NOT NULL DEFAULT 50 CHECK (weight >= 0 AND weight <= 100),
  is_active BOOLEAN DEFAULT TRUE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Student Profiles (for matching)
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  academic_level TEXT NOT NULL,
  field_of_study TEXT NOT NULL,
  institution TEXT NOT NULL,
  gpa DECIMAL(3,2),
  financial_need TEXT NOT NULL CHECK (financial_need IN ('low', 'medium', 'high', 'critical')),
  household_income INTEGER,
  location TEXT NOT NULL,
  ethnicity TEXT,
  gender TEXT,
  disability_status BOOLEAN DEFAULT FALSE,
  first_generation BOOLEAN DEFAULT FALSE,
  rural_background BOOLEAN DEFAULT FALSE,
  academic_achievements TEXT[],
  extracurricular_activities TEXT[],
  community_service BOOLEAN DEFAULT FALSE,
  leadership_experience BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 7. Sponsor Profiles (for matching)
CREATE TABLE IF NOT EXISTS sponsor_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sponsor_id UUID NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  organization_type TEXT NOT NULL CHECK (organization_type IN ('individual', 'company', 'ngo', 'government', 'foundation')),
  industry TEXT,
  location TEXT NOT NULL,
  funding_capacity TEXT NOT NULL CHECK (funding_capacity IN ('low', 'medium', 'high', 'unlimited')),
  preferred_academic_levels TEXT[] NOT NULL,
  preferred_fields TEXT[] NOT NULL,
  preferred_locations TEXT[] NOT NULL,
  preferred_demographics JSONB,
  minimum_gpa DECIMAL(3,2),
  maximum_household_income INTEGER,
  funding_amount_range JSONB NOT NULL,
  funding_frequency TEXT NOT NULL CHECK (funding_frequency IN ('one_time', 'monthly', 'quarterly', 'annually')),
  application_deadline TIMESTAMP WITH TIME ZONE,
  special_criteria TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sponsor_id)
);

-- 8. Matching Results
CREATE TABLE IF NOT EXISTS sponsor_matching_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sponsor_id UUID NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  matched_criteria TEXT[],
  unmatched_criteria TEXT[],
  funding_amount INTEGER NOT NULL,
  confidence_level TEXT NOT NULL CHECK (confidence_level IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, sponsor_id)
);

-- 9. Sponsor Allocations
CREATE TABLE IF NOT EXISTS sponsor_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sponsor_id UUID NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  match_score INTEGER NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  assignment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(sponsor_id, student_id)
);

-- 10. Assignment Workflows
CREATE TABLE IF NOT EXISTS assignment_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Bulk Matching Jobs
CREATE TABLE IF NOT EXISTS bulk_matching_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  total_students INTEGER DEFAULT 0,
  total_sponsors INTEGER DEFAULT 0,
  matches_found INTEGER DEFAULT 0,
  assignments_made INTEGER DEFAULT 0,
  errors TEXT[],
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Payment Test Data
CREATE TABLE IF NOT EXISTS payment_test_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL,
  amount INTEGER NOT NULL,
  payment_method TEXT NOT NULL,
  expected_status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Payment Test Results
CREATE TABLE IF NOT EXISTS payment_test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scenario_id TEXT NOT NULL,
  scenario_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'timeout', 'error')),
  duration INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  details JSONB NOT NULL,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Notification Trigger Logs
CREATE TABLE IF NOT EXISTS notification_trigger_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trigger_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_data JSONB NOT NULL,
  notification_sent BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

CREATE INDEX IF NOT EXISTS idx_in_app_notifications_user_id ON in_app_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_in_app_notifications_read ON in_app_notifications(read);

CREATE INDEX IF NOT EXISTS idx_matching_results_student_id ON sponsor_matching_results(student_id);
CREATE INDEX IF NOT EXISTS idx_matching_results_sponsor_id ON sponsor_matching_results(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_matching_results_score ON sponsor_matching_results(score);

CREATE INDEX IF NOT EXISTS idx_sponsor_allocations_sponsor_id ON sponsor_allocations(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_allocations_student_id ON sponsor_allocations(student_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_allocations_status ON sponsor_allocations(status);

CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_academic_level ON student_profiles(academic_level);
CREATE INDEX IF NOT EXISTS idx_student_profiles_financial_need ON student_profiles(financial_need);

CREATE INDEX IF NOT EXISTS idx_sponsor_profiles_sponsor_id ON sponsor_profiles(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_profiles_is_active ON sponsor_profiles(is_active);

-- Create RLS policies
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE in_app_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_matching_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_matching_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_matching_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_test_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_trigger_logs ENABLE ROW LEVEL SECURITY;

-- User notification preferences policies
CREATE POLICY "Users can view own notification preferences" ON user_notification_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences" ON user_notification_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences" ON user_notification_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all notifications" ON notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    )
  );

-- In-app notifications policies
CREATE POLICY "Users can view own in-app notifications" ON in_app_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own in-app notifications" ON in_app_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Student profiles policies
CREATE POLICY "Users can view own student profile" ON student_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own student profile" ON student_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own student profile" ON student_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sponsor profiles policies
CREATE POLICY "Sponsors can view own sponsor profile" ON sponsor_profiles
  FOR SELECT USING (auth.uid() = sponsor_id);

CREATE POLICY "Sponsors can update own sponsor profile" ON sponsor_profiles
  FOR UPDATE USING (auth.uid() = sponsor_id);

CREATE POLICY "Sponsors can insert own sponsor profile" ON sponsor_profiles
  FOR INSERT WITH CHECK (auth.uid() = sponsor_id);

-- Matching results policies
CREATE POLICY "Users can view own matching results" ON sponsor_matching_results
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Sponsors can view own matching results" ON sponsor_matching_results
  FOR SELECT USING (auth.uid() = sponsor_id);

-- Sponsor allocations policies
CREATE POLICY "Users can view own allocations" ON sponsor_allocations
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Sponsors can view own allocations" ON sponsor_allocations
  FOR SELECT USING (auth.uid() = sponsor_id);

-- Admin policies for system tables
CREATE POLICY "Admins can manage matching rules" ON sponsor_matching_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can manage workflows" ON assignment_workflows
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can manage bulk jobs" ON bulk_matching_jobs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can manage test data" ON payment_test_data
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can manage test results" ON payment_test_results
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_user_notification_preferences_updated_at 
  BEFORE UPDATE ON user_notification_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at 
  BEFORE UPDATE ON notifications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_in_app_notifications_updated_at 
  BEFORE UPDATE ON in_app_notifications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsor_matching_rules_updated_at 
  BEFORE UPDATE ON sponsor_matching_rules 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at 
  BEFORE UPDATE ON student_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsor_profiles_updated_at 
  BEFORE UPDATE ON sponsor_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsor_matching_results_updated_at 
  BEFORE UPDATE ON sponsor_matching_results 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsor_allocations_updated_at 
  BEFORE UPDATE ON sponsor_allocations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignment_workflows_updated_at 
  BEFORE UPDATE ON assignment_workflows 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 