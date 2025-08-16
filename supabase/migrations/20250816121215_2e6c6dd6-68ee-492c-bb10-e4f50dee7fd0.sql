-- Add statement timeout to payment monitoring functions for defense-in-depth
ALTER FUNCTION public.get_payment_monitoring(limit_count integer) 
  SET statement_timeout = '5s';

ALTER FUNCTION public.get_payment_method_analytics() 
  SET statement_timeout = '5s';