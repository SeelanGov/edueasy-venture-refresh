-- Migration: Notification and Matching System
-- Create tables for notification system and student-sponsor matching

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  push_notifications BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT false,
  notification_types JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sponsor profiles table
CREATE TABLE IF NOT EXISTS sponsor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  industry TEXT,
  location TEXT,
  description TEXT,
  website TEXT,
  logo_url TEXT,
  funding_capacity NUMERIC DEFAULT 0,
  preferred_academic_levels TEXT[] DEFAULT '{}',
  preferred_fields TEXT[] DEFAULT '{}',
  funding_amount_range JSONB DEFAULT '{"min": 0, "max": 0}'::jsonb,
  funding_frequency TEXT DEFAULT 'one-time',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create student profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  academic_level TEXT,
  field_of_study TEXT,
  gpa NUMERIC,
  financial_need_score NUMERIC,
  location TEXT,
  bio TEXT,
  achievements JSONB DEFAULT '[]'::jsonb,
  extracurricular_activities JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sponsor matching results table
CREATE TABLE IF NOT EXISTS sponsor_matching_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_score NUMERIC NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_matching_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_notification_preferences
CREATE POLICY "Users can manage own notification preferences" ON user_notification_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for sponsor_profiles
CREATE POLICY "Sponsors can manage own profiles" ON sponsor_profiles
  FOR ALL USING (sponsor_id IN (SELECT id FROM sponsors WHERE user_id = auth.uid()))
  WITH CHECK (sponsor_id IN (SELECT id FROM sponsors WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can view sponsor profiles" ON sponsor_profiles
  FOR SELECT USING (true);

-- Create RLS policies for student_profiles
CREATE POLICY "Students can manage own profiles" ON student_profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sponsors can view student profiles" ON student_profiles
  FOR SELECT USING (EXISTS (SELECT 1 FROM sponsors WHERE user_id = auth.uid()));

-- Create RLS policies for sponsor_matching_results
CREATE POLICY "Sponsors can view own matching results" ON sponsor_matching_results
  FOR SELECT USING (sponsor_id IN (SELECT id FROM sponsors WHERE user_id = auth.uid()));

CREATE POLICY "Students can view their matching results" ON sponsor_matching_results
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Sponsors can create matching results" ON sponsor_matching_results
  FOR INSERT WITH CHECK (sponsor_id IN (SELECT id FROM sponsors WHERE user_id = auth.uid()));

CREATE POLICY "Sponsors can update own matching results" ON sponsor_matching_results
  FOR UPDATE USING (sponsor_id IN (SELECT id FROM sponsors WHERE user_id = auth.uid()));

-- Add admin access policies
CREATE POLICY "Admins can manage all notification preferences" ON user_notification_preferences
  FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can manage all sponsor profiles" ON sponsor_profiles
  FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can manage all student profiles" ON student_profiles
  FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can manage all matching results" ON sponsor_matching_results
  FOR ALL USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));

-- Create updated_at triggers
CREATE TRIGGER update_user_notification_preferences_updated_at
  BEFORE UPDATE ON user_notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsor_profiles_updated_at
  BEFORE UPDATE ON sponsor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON student_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sponsor_matching_results_updated_at
  BEFORE UPDATE ON sponsor_matching_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();