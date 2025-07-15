-- Enhanced Payment Methods Migration
-- Adds payment method tracking and analytics capabilities

-- 1. Add payment method tracking columns
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS preferred_payment_method TEXT,
ADD COLUMN IF NOT EXISTS actual_payment_method TEXT;

-- 2. Add indexes for payment method analytics
CREATE INDEX IF NOT EXISTS idx_payments_preferred_method ON public.payments(preferred_payment_method);
CREATE INDEX IF NOT EXISTS idx_payments_actual_method ON public.payments(actual_payment_method);
CREATE INDEX IF NOT EXISTS idx_payments_methods_combined ON public.payments(preferred_payment_method, actual_payment_method);

-- 3. Create payment method analytics view
CREATE OR REPLACE VIEW public.payment_method_analytics AS
SELECT 
  preferred_payment_method,
  actual_payment_method,
  COUNT(*) as usage_count,
  AVG(amount) as avg_amount,
  SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as successful_payments,
  SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_revenue,
  ROUND(
    (SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 
    2
  ) as success_rate
FROM public.payments
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY preferred_payment_method, actual_payment_method
ORDER BY usage_count DESC;

-- 4. Create payment method summary view
CREATE OR REPLACE VIEW public.payment_method_summary AS
SELECT 
  COALESCE(actual_payment_method, preferred_payment_method, 'unknown') as payment_method,
  COUNT(*) as total_attempts,
  SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as successful_payments,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_payments,
  AVG(amount) as avg_amount,
  SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as total_revenue,
  ROUND(
    (SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 
    2
  ) as success_rate
FROM public.payments
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY COALESCE(actual_payment_method, preferred_payment_method, 'unknown')
ORDER BY total_attempts DESC;

-- 5. Add comments for documentation
COMMENT ON COLUMN public.payments.preferred_payment_method IS 'User-selected payment method preference';
COMMENT ON COLUMN public.payments.actual_payment_method IS 'Actual payment method used (from PayFast webhook)';
COMMENT ON VIEW public.payment_method_analytics IS 'Analytics view for payment method performance';
COMMENT ON VIEW public.payment_method_summary IS 'Summary view for payment method usage'; 