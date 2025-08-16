-- Security hotfix: Lock down payment & analytics data
-- Track A1 & A2: Enable RLS + admin-only policies

-- 1) Enable RLS on exposed payment tables
ALTER TABLE public.payment_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_method_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_method_summary ENABLE ROW LEVEL SECURITY;

-- 2) Drop existing policies if they exist (safe approach)
DROP POLICY IF EXISTS pm_read ON public.payment_monitoring;
DROP POLICY IF EXISTS pma_read ON public.payment_method_analytics;
DROP POLICY IF EXISTS pms_read ON public.payment_method_summary;
DROP POLICY IF EXISTS pm_service_all ON public.payment_monitoring;
DROP POLICY IF EXISTS pma_service_all ON public.payment_method_analytics;
DROP POLICY IF EXISTS pms_service_all ON public.payment_method_summary;

-- 3) Create admin-only read policies
CREATE POLICY pm_read ON public.payment_monitoring
FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY pma_read ON public.payment_method_analytics
FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY pms_read ON public.payment_method_summary
FOR SELECT USING (is_admin(auth.uid()));

-- 4) Service role bypass for server tasks
CREATE POLICY pm_service_all ON public.payment_monitoring
AS PERMISSIVE FOR ALL TO authenticated
USING ((auth.jwt()->>'role') = 'service_role') 
WITH CHECK ((auth.jwt()->>'role') = 'service_role');

CREATE POLICY pma_service_all ON public.payment_method_analytics
AS PERMISSIVE FOR ALL TO authenticated
USING ((auth.jwt()->>'role') = 'service_role') 
WITH CHECK ((auth.jwt()->>'role') = 'service_role');

CREATE POLICY pms_service_all ON public.payment_method_summary
AS PERMISSIVE FOR ALL TO authenticated
USING ((auth.jwt()->>'role') = 'service_role') 
WITH CHECK ((auth.jwt()->>'role') = 'service_role');