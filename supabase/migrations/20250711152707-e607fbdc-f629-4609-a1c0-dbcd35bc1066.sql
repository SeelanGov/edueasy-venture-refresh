-- CORRECTIVE PATCH: Fix Phase 3 Failures

-- ========================================
-- FIX 1: CREATE MISSING CRITICAL INDEXES
-- ========================================

-- Core performance indexes for RLS and queries
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_created_at ON public.addresses(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_stats_created_at ON public.admin_stats(created_at);
CREATE INDEX IF NOT EXISTS idx_application_fee_sponsorships_created_at ON public.application_fee_sponsorships(created_at);
CREATE INDEX IF NOT EXISTS idx_career_assessments_created_at ON public.career_assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_career_guidance_created_at ON public.career_guidance(created_at);
CREATE INDEX IF NOT EXISTS idx_consultants_created_at ON public.consultants(created_at);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON public.consultations(created_at);
CREATE INDEX IF NOT EXISTS idx_document_verification_logs_created_at ON public.document_verification_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_education_records_created_at ON public.education_records(created_at);
CREATE INDEX IF NOT EXISTS idx_email_verification_logs_created_at ON public.email_verification_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_institutions_created_at ON public.institutions(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS idx_partner_inquiries_created_at ON public.partner_inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_partner_notes_created_at ON public.partner_notes(created_at);
CREATE INDEX IF NOT EXISTS idx_partner_payments_created_at ON public.partner_payments(created_at);
CREATE INDEX IF NOT EXISTS idx_partner_tier_config_created_at ON public.partner_tier_config(created_at);
CREATE INDEX IF NOT EXISTS idx_partners_created_at ON public.partners(created_at);
CREATE INDEX IF NOT EXISTS idx_plans_created_at ON public.plans(created_at);
CREATE INDEX IF NOT EXISTS idx_programs_created_at ON public.programs(created_at);
CREATE INDEX IF NOT EXISTS idx_rls_policy_registry_created_at ON public.rls_policy_registry(created_at);
CREATE INDEX IF NOT EXISTS idx_rls_policy_test_results_created_at ON public.rls_policy_test_results(created_at);
CREATE INDEX IF NOT EXISTS idx_sponsor_allocations_created_at ON public.sponsor_allocations(created_at);
CREATE INDEX IF NOT EXISTS idx_sponsor_applications_created_at ON public.sponsor_applications(created_at);
CREATE INDEX IF NOT EXISTS idx_sponsors_created_at ON public.sponsors(created_at);
CREATE INDEX IF NOT EXISTS idx_sponsorships_created_at ON public.sponsorships(created_at);
CREATE INDEX IF NOT EXISTS idx_subject_marks_created_at ON public.subject_marks(created_at);
CREATE INDEX IF NOT EXISTS idx_subscription_tiers_created_at ON public.subscription_tiers(created_at);
CREATE INDEX IF NOT EXISTS idx_thandi_intent_training_created_at ON public.thandi_intent_training(created_at);
CREATE INDEX IF NOT EXISTS idx_thandi_intents_created_at ON public.thandi_intents(created_at);
CREATE INDEX IF NOT EXISTS idx_thandi_interactions_created_at ON public.thandi_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_thandi_interactions_user_id ON public.thandi_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_thandi_knowledge_index_created_at ON public.thandi_knowledge_index(created_at);
CREATE INDEX IF NOT EXISTS idx_thandi_message_feedback_created_at ON public.thandi_message_feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_plans_created_at ON public.user_plans(created_at);
CREATE INDEX IF NOT EXISTS idx_user_preferences_created_at ON public.user_preferences(created_at);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_user_roles_created_at ON public.user_roles(created_at);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_created_at ON public.user_subscriptions(created_at);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_sponsor_id ON public.users(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_verification_logs_created_at ON public.verification_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_verification_rate_limits_created_at ON public.verification_rate_limits(created_at);

-- ========================================
-- FIX 2: CONSOLIDATE USERS TABLE POLICIES
-- ========================================

-- Drop all redundant policies on users table
DROP POLICY IF EXISTS "Authenticated users can delete their own records" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can insert new records" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can select their own records" ON public.users;
DROP POLICY IF EXISTS "User_access" ON public.users;
DROP POLICY IF EXISTS "Users can access their own records" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can update their own records" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can view encrypted national_id" ON public.users;

-- Create consolidated user policies
CREATE POLICY "users_own_record_access" ON public.users
FOR ALL USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Keep necessary specialized policies
-- "Allow Read Access" - for public information
-- "Admins only can view encrypted national_id" - already uses is_admin()

-- ========================================
-- FIX 3: REPLACE RAW user_roles WITH is_admin()
-- ========================================

-- Fix system_error_logs policies
DROP POLICY IF EXISTS "Admins can view all error logs" ON public.system_error_logs;
DROP POLICY IF EXISTS "Admins can view error logs" ON public.system_error_logs;

-- Note: system_insert_error_logs and admin_manage_error_logs already exist and use is_admin()

-- Fix thandi_intent_training
DROP POLICY IF EXISTS "Admin full access for intent training" ON public.thandi_intent_training;
CREATE POLICY "admin_full_intent_training_access" ON public.thandi_intent_training
FOR ALL USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Fix thandi_intents
DROP POLICY IF EXISTS "Admin full access for intents" ON public.thandi_intents;
CREATE POLICY "admin_full_intents_access" ON public.thandi_intents
FOR ALL USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Fix thandi_message_feedback
DROP POLICY IF EXISTS "Admins can modify feedback" ON public.thandi_message_feedback;
CREATE POLICY "admin_modify_feedback" ON public.thandi_message_feedback
FOR ALL USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Fix user_roles table
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "admin_manage_user_roles" ON public.user_roles
FOR ALL USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Fix verification_logs
DROP POLICY IF EXISTS "Admins can view verification logs" ON public.verification_logs;
CREATE POLICY "admin_view_verification_logs" ON public.verification_logs
FOR SELECT USING (is_admin(auth.uid()));

-- ========================================
-- FIX 4: STANDARDIZE POLICY NAMING
-- ========================================

-- Note: Most policies have descriptive names which are acceptable
-- The main issue is consolidation, not naming format
-- Focus on functionality over cosmetic naming changes to avoid breaking existing code

-- ========================================
-- VERIFICATION: Update policy registry
-- ========================================

INSERT INTO public.rls_policy_registry (table_name, policy_name, policy_type, description) VALUES
('users', 'users_own_record_access', 'ALL', 'Users can manage their own records'),
('thandi_intent_training', 'admin_full_intent_training_access', 'ALL', 'Admins can manage intent training'),
('thandi_intents', 'admin_full_intents_access', 'ALL', 'Admins can manage intents'),
('thandi_message_feedback', 'admin_modify_feedback', 'ALL', 'Admins can modify message feedback'),
('user_roles', 'admin_manage_user_roles', 'ALL', 'Admins can manage user roles'),
('verification_logs', 'admin_view_verification_logs', 'SELECT', 'Admins can view verification logs')
ON CONFLICT (table_name, policy_name) DO UPDATE SET
  description = EXCLUDED.description,
  updated_at = now();