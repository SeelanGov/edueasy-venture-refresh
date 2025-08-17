-- Drop the exposed payment analytics views to secure them
-- Replace with admin-only function access

DROP VIEW IF EXISTS public.payment_monitoring;
DROP VIEW IF EXISTS public.payment_method_analytics; 
DROP VIEW IF EXISTS public.payment_method_summary;

-- Fix search_path on recently created functions
ALTER FUNCTION public.get_payment_monitoring(INTEGER) SET search_path = public, auth;
ALTER FUNCTION public.get_payment_method_analytics() SET search_path = public, auth;