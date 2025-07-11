-- PHASE 3: Policy Optimization & Index Hardening

-- ========================================
-- STEP 1: CREATE CRITICAL INDEXES
-- ========================================

-- User ID indexes for RLS performance
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_career_assessments_user_id ON public.career_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_career_guidance_user_id ON public.career_guidance(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON public.consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_document_verification_logs_user_id ON public.document_verification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON public.user_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);

-- Institution ID indexes for institutional queries
CREATE INDEX IF NOT EXISTS idx_applications_institution_id ON public.applications(institution_id);
CREATE INDEX IF NOT EXISTS idx_programs_institution_id ON public.programs(institution_id);

-- Created_at indexes for temporal queries
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON public.documents(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at);
CREATE INDEX IF NOT EXISTS idx_system_error_logs_occurred_at ON public.system_error_logs(occurred_at);

-- Role-based indexes for admin queries
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id_role ON public.user_roles(user_id, role);

-- ========================================
-- STEP 2: CONSOLIDATE REDUNDANT POLICIES
-- ========================================

-- 🔧 ADDRESSES TABLE - Consolidate to single policy
DROP POLICY IF EXISTS "Users can create their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can delete their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can update their own addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can view their own addresses" ON public.addresses;

CREATE POLICY "users_own_addresses_access" ON public.addresses
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 🔧 APPLICATIONS TABLE - Consolidate user policies, standardize admin
DROP POLICY IF EXISTS "Users can insert their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
DROP POLICY IF EXISTS "applications_access" ON public.applications;

CREATE POLICY "users_own_applications_access" ON public.applications
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Keep institutional and sponsor access policies as they serve different purposes

-- 🔧 DOCUMENTS TABLE - Consolidate user policies, standardize admin
DROP POLICY IF EXISTS "Authenticated users can delete their own documents" ON public.documents;
DROP POLICY IF EXISTS "Authenticated users can insert their own documents" ON public.documents;
DROP POLICY IF EXISTS "Authenticated users can update their own documents" ON public.documents;
DROP POLICY IF EXISTS "Authenticated users can view their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can insert documents for their applications" ON public.documents;
DROP POLICY IF EXISTS "Users can view documents for their applications" ON public.documents;
DROP POLICY IF EXISTS "document_access" ON public.documents;

-- Unified user access policy
CREATE POLICY "users_own_documents_access" ON public.documents
FOR ALL USING (
  user_id = auth.uid() OR 
  application_id IN (SELECT id FROM applications WHERE user_id = auth.uid())
)
WITH CHECK (
  user_id = auth.uid() OR 
  application_id IN (SELECT id FROM applications WHERE user_id = auth.uid())
);

-- Update admin policy to use is_admin()
DROP POLICY IF EXISTS "Admins can manage all documents" ON public.documents;
CREATE POLICY "admin_full_documents_access" ON public.documents
FOR ALL USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- 🔧 SPONSORS TABLE - Consolidate user policies, standardize admin
DROP POLICY IF EXISTS "Sponsors can create self" ON public.sponsors;
DROP POLICY IF EXISTS "Sponsors can update self" ON public.sponsors;
DROP POLICY IF EXISTS "Sponsors can update their own record" ON public.sponsors;
DROP POLICY IF EXISTS "Sponsors can view self" ON public.sponsors;
DROP POLICY IF EXISTS "Sponsors can view their own record" ON public.sponsors;

CREATE POLICY "sponsors_own_record_access" ON public.sponsors
FOR ALL USING (user_id = auth.uid() OR id = auth.uid())
WITH CHECK (user_id = auth.uid() OR id = auth.uid());

-- Update admin policy to use is_admin()
DROP POLICY IF EXISTS "Admins can manage all sponsors" ON public.sponsors;
CREATE POLICY "admin_full_sponsors_access" ON public.sponsors
FOR ALL USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- 🔧 CONSULTANTS TABLE - Standardize admin access
DROP POLICY IF EXISTS "Admins can manage all consultants" ON public.consultants;
CREATE POLICY "admin_full_consultants_access" ON public.consultants
FOR ALL USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- 🔧 INSTITUTIONS TABLE - Standardize admin access
DROP POLICY IF EXISTS "Admins can manage all institutions" ON public.institutions;
CREATE POLICY "admin_full_institutions_access" ON public.institutions
FOR ALL USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- ========================================
-- STEP 3: STANDARDIZE ADMIN POLICIES
-- ========================================

-- Replace direct user_roles checks with is_admin()

-- SYSTEM ERROR LOGS - Fix infinite recursion policy
DROP POLICY IF EXISTS "Admins can insert error logs" ON public.system_error_logs;
DROP POLICY IF EXISTS "Admins can manage error logs" ON public.system_error_logs;
DROP POLICY IF EXISTS "Admins can update error logs" ON public.system_error_logs;

-- Allow system to insert error logs (needed for is_admin() function)
CREATE POLICY "system_insert_error_logs" ON public.system_error_logs
FOR INSERT WITH CHECK (true);

-- Allow admins to manage error logs
CREATE POLICY "admin_manage_error_logs" ON public.system_error_logs
FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "admin_update_error_logs" ON public.system_error_logs
FOR UPDATE USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- SPONSOR ALLOCATIONS - Standardize admin access
DROP POLICY IF EXISTS "Admins can fully manage sponsor allocations" ON public.sponsor_allocations;
DROP POLICY IF EXISTS "Admins can manage all sponsor allocations" ON public.sponsor_allocations;

CREATE POLICY "admin_full_sponsor_allocations_access" ON public.sponsor_allocations
FOR ALL USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- PAYMENTS - Already using is_admin(), but standardize naming
DROP POLICY IF EXISTS "Admins can delete payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can update payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;

CREATE POLICY "admin_full_payments_access" ON public.payments
FOR ALL USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- PLANS - Consolidate admin policies
DROP POLICY IF EXISTS "Admins can delete plans" ON public.plans;
DROP POLICY IF EXISTS "Admins can insert plans" ON public.plans;
DROP POLICY IF EXISTS "Admins can update plans" ON public.plans;
DROP POLICY IF EXISTS "Admins can view all plans" ON public.plans;

CREATE POLICY "admin_full_plans_access" ON public.plans
FOR ALL USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- Keep public read access
-- "Anyone can view active plans" policy remains unchanged

-- LEADS, ADMIN_STATS, PARTNERS, etc. - Already using is_admin() properly

-- ========================================
-- STEP 4: PERFORMANCE VALIDATION PREPARATION
-- ========================================

-- Register consolidated policies in the registry
INSERT INTO public.rls_policy_registry (table_name, policy_name, policy_type, description) VALUES
('addresses', 'users_own_addresses_access', 'ALL', 'Users can manage their own addresses'),
('applications', 'users_own_applications_access', 'ALL', 'Users can manage their own applications'),
('documents', 'users_own_documents_access', 'ALL', 'Users can manage their own documents and application documents'),
('documents', 'admin_full_documents_access', 'ALL', 'Admins can manage all documents'),
('sponsors', 'sponsors_own_record_access', 'ALL', 'Sponsors can manage their own records'),
('sponsors', 'admin_full_sponsors_access', 'ALL', 'Admins can manage all sponsors'),
('consultants', 'admin_full_consultants_access', 'ALL', 'Admins can manage all consultants'),
('institutions', 'admin_full_institutions_access', 'ALL', 'Admins can manage all institutions'),
('system_error_logs', 'system_insert_error_logs', 'INSERT', 'System can insert error logs'),
('system_error_logs', 'admin_manage_error_logs', 'SELECT', 'Admins can view error logs'),
('system_error_logs', 'admin_update_error_logs', 'UPDATE', 'Admins can update error logs'),
('sponsor_allocations', 'admin_full_sponsor_allocations_access', 'ALL', 'Admins can manage all sponsor allocations'),
('payments', 'admin_full_payments_access', 'ALL', 'Admins can manage all payments'),
('plans', 'admin_full_plans_access', 'ALL', 'Admins can manage all plans')
ON CONFLICT (table_name, policy_name) DO UPDATE SET
  description = EXCLUDED.description,
  updated_at = now();