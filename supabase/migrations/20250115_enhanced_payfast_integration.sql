-- Enhanced PayFast Integration Migration
-- Addresses all identified schema gaps and optimizations

-- 1. Update payments table with PayFast-specific fields
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS merchant_reference TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS tier TEXT CHECK (tier IN ('basic', 'premium')),
ADD COLUMN IF NOT EXISTS gateway_provider TEXT DEFAULT 'payfast',
ADD COLUMN IF NOT EXISTS payment_url TEXT,
ADD COLUMN IF NOT EXISTS payfast_payment_id TEXT,
ADD COLUMN IF NOT EXISTS payfast_signature TEXT,
ADD COLUMN IF NOT EXISTS payment_expiry TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS ipn_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS webhook_data JSONB,
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_webhook_attempt TIMESTAMP WITH TIME ZONE;

-- 2. Change amount from INTEGER to NUMERIC for precision
ALTER TABLE public.payments 
ALTER COLUMN amount TYPE NUMERIC(10,2);

-- 3. Update status constraints
ALTER TABLE public.payments 
DROP CONSTRAINT IF EXISTS check_payment_status;

ALTER TABLE public.payments 
ADD CONSTRAINT check_payment_status 
CHECK (status IN ('pending', 'paid', 'failed', 'expired', 'cancelled', 'refunded'));

-- 4. Add performance indexes
CREATE INDEX IF NOT EXISTS idx_payments_merchant_reference ON public.payments(merchant_reference);
CREATE INDEX IF NOT EXISTS idx_payments_tier ON public.payments(tier);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_expiry ON public.payments(payment_expiry);
CREATE INDEX IF NOT EXISTS idx_payments_webhook_retry ON public.payments(retry_count, last_webhook_attempt);

-- 5. Create payment audit log table
CREATE TABLE IF NOT EXISTS public.payment_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. Enhanced RLS policies
DROP POLICY IF EXISTS "users_own_payments_access" ON public.payments;
DROP POLICY IF EXISTS "admin_full_payments_access" ON public.payments;

CREATE POLICY "users_own_payments_access" ON public.payments
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_full_payments_access" ON public.payments
FOR ALL USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- 7. Create payment monitoring view for admins
CREATE OR REPLACE VIEW public.payment_monitoring AS
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
  u.email as user_email,
  u.tracking_id as user_tracking_id
FROM public.payments p
JOIN public.users u ON p.user_id = u.id
ORDER BY p.created_at DESC;

-- 8. Add RLS to audit logs
ALTER TABLE public.payment_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_audit_access" ON public.payment_audit_logs
FOR ALL USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid())); 