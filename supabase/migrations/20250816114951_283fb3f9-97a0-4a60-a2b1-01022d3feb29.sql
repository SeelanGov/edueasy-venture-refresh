-- Harden admin functions: lock search_path and restrict execute permissions

-- Make get_payment_monitoring safe
CREATE OR REPLACE FUNCTION public.get_payment_monitoring(
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE(
  id UUID,
  merchant_reference TEXT,
  tier TEXT,
  amount NUMERIC,
  status TEXT,
  gateway_provider TEXT,
  payment_expiry TIMESTAMP WITH TIME ZONE,
  retry_count INTEGER,
  last_webhook_attempt TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  user_email TEXT,
  user_tracking_id TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Strict admin guard - fail if not admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'permission denied' USING errcode = '42501';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id,
    p.merchant_reference,
    p.tier,
    p.amount,
    p.status,
    p.gateway_provider,
    p.payment_expiry,
    p.retry_count,
    p.last_webhook_attempt,
    p.created_at,
    u.email AS user_email,
    u.tracking_id AS user_tracking_id
  FROM payments p
  JOIN users u ON p.user_id = u.id
  ORDER BY p.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Make get_payment_method_analytics safe
CREATE OR REPLACE FUNCTION public.get_payment_method_analytics()
RETURNS TABLE(
  preferred_payment_method TEXT,
  actual_payment_method TEXT,
  usage_count BIGINT,
  avg_amount NUMERIC,
  successful_payments BIGINT,
  total_revenue NUMERIC,
  success_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Strict admin guard - fail if not admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'permission denied' USING errcode = '42501';
  END IF;
  
  RETURN QUERY
  SELECT 
    p.preferred_payment_method,
    p.actual_payment_method,
    COUNT(*) AS usage_count,
    AVG(p.amount) AS avg_amount,
    SUM(CASE WHEN p.status = 'paid' THEN 1 ELSE 0 END) AS successful_payments,
    SUM(CASE WHEN p.status = 'paid' THEN p.amount ELSE 0 END) AS total_revenue,
    ROUND(
      (SUM(CASE WHEN p.status = 'paid' THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 
      2
    ) AS success_rate
  FROM payments p
  WHERE p.created_at >= (NOW() - INTERVAL '30 days')
  GROUP BY p.preferred_payment_method, p.actual_payment_method
  ORDER BY COUNT(*) DESC;
END;
$$;

-- Secure function permissions
REVOKE ALL ON FUNCTION public.get_payment_monitoring(INTEGER) FROM public;
REVOKE ALL ON FUNCTION public.get_payment_method_analytics() FROM public;

-- Allow authenticated to call them; internal check enforces admin-only results
GRANT EXECUTE ON FUNCTION public.get_payment_monitoring(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_payment_method_analytics() TO authenticated;