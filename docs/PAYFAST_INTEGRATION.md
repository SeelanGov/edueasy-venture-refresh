# PayFast Integration Documentation

## Overview

This document outlines the complete PayFast payment integration for EduEasy, enabling secure
one-time payments for subscription plans.

## Architecture

### Components

1. **Database Schema** - Enhanced payments table with PayFast-specific fields
2. **Edge Functions** - Three Supabase Edge Functions for payment processing
3. **Frontend Components** - Updated UI components for PayFast integration
4. **Webhook Handling** - Secure payment confirmation processing

### Payment Flow

```
User → Select Plan → Checkout → PayFast → Payment Success/Failure → Subscription Activation
```

## Database Schema

### Enhanced Payments Table

```sql
-- PayFast-specific fields added to payments table
ALTER TABLE public.payments
ADD COLUMN merchant_reference TEXT UNIQUE,
ADD COLUMN tier TEXT CHECK (tier IN ('basic', 'premium')),
ADD COLUMN gateway_provider TEXT DEFAULT 'payfast',
ADD COLUMN payment_url TEXT,
ADD COLUMN payfast_payment_id TEXT,
ADD COLUMN payfast_signature TEXT,
ADD COLUMN payment_expiry TIMESTAMP WITH TIME ZONE,
ADD COLUMN ipn_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN webhook_data JSONB,
ADD COLUMN retry_count INTEGER DEFAULT 0,
ADD COLUMN last_webhook_attempt TIMESTAMP WITH TIME ZONE;
```

### Payment Audit Logs

```sql
CREATE TABLE public.payment_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Edge Functions

### 1. create-payment-session

**Purpose**: Creates PayFast payment sessions and generates redirect URLs

**Endpoint**: `POST /functions/v1/create-payment-session`

**Input**:

```json
{
  "tier": "basic" | "premium",
  "user_id": "uuid"
}
```

**Output**:

```json
{
  "payment_url": "https://sandbox.payfast.co.za/eng/process?...",
  "merchant_reference": "EDU-1234567890-abc123",
  "expires_at": "2025-01-16T12:00:00Z"
}
```

### 2. process-payment-webhook

**Purpose**: Handles PayFast IPN (Instant Payment Notification) webhooks

**Endpoint**: `POST /functions/v1/process-payment-webhook`

**Features**:

- IP address validation
- PayFast signature verification
- Payment status updates
- Subscription activation
- Audit logging

### 3. verify-payment-status

**Purpose**: Allows checking payment status for polling and admin purposes

**Endpoint**: `POST /functions/v1/verify-payment-status`

**Input**:

```json
{
  "merchant_reference": "EDU-1234567890-abc123"
}
```

## Frontend Components

### CheckoutPage

Enhanced checkout page that integrates with PayFast:

```typescript
// Key features
- PayFast payment button
- Order summary display
- Payment status handling
- Error handling and retry logic
```

### Payment Success/Cancelled Pages

- **PaymentSuccess.tsx**: Handles PayFast return URLs and payment verification
- **PaymentCancelled.tsx**: Handles cancelled payments

### Updated useSubscription Hook

Enhanced subscription hook with PayFast integration:

```typescript
const subscribeToPlan = async (tierId: string, paymentMethod: string) => {
  // Creates PayFast payment session
  // Redirects to PayFast
  // Stores payment reference for verification
};
```

## Security Features

### 1. IP Validation

- Validates webhook IP addresses against PayFast's known IP ranges
- Rejects unauthorized webhook requests

### 2. Signature Verification

- Verifies PayFast webhook signatures using MD5 hashing
- Ensures webhook authenticity

### 3. Audit Logging

- Comprehensive logging of all payment events
- Tracks webhook attempts and failures
- Enables payment monitoring and debugging

### 4. RLS Policies

- Users can only access their own payments
- Admins have full access to payment monitoring
- Secure audit log access

## Configuration

### Environment Variables

```bash
# PayFast Configuration
PAYFAST_MERCHANT_ID=30987005
PAYFAST_MERCHANT_KEY=r4oukwctltbzv
PAYFAST_PASSPHRASE=eduSecure2025
PAYFAST_SANDBOX=true

# Site Configuration
SITE_URL=https://edueasy.co.za
```

### PayFast Account Setup

1. **Merchant Account**: Configured with EduEasy business details
2. **Webhook URL**: Set to `https://your-project.supabase.co/functions/v1/process-payment-webhook`
3. **Return URLs**:
   - Success: `https://edueasy.co.za/payment-success`
   - Cancel: `https://edueasy.co.za/payment-cancelled`

## Deployment

### Automated Deployment

Use the provided deployment script:

```bash
chmod +x scripts/deploy-payfast.sh
./scripts/deploy-payfast.sh
```

### Manual Deployment

1. **Set Secrets**:

```bash
supabase secrets set PAYFAST_MERCHANT_ID=30987005
supabase secrets set PAYFAST_MERCHANT_KEY=r4oukwctltbzv
supabase secrets set PAYFAST_PASSPHRASE=eduSecure2025
supabase secrets set PAYFAST_SANDBOX=true
supabase secrets set SITE_URL=https://edueasy.co.za
```

2. **Deploy Database**:

```bash
supabase db reset
```

3. **Deploy Functions**:

```bash
supabase functions deploy create-payment-session
supabase functions deploy process-payment-webhook
supabase functions deploy verify-payment-status
```

## Testing

### Sandbox Testing

1. **PayFast Sandbox**: Use PayFast's sandbox environment for testing
2. **Test Cards**: Use PayFast's test card numbers
3. **Webhook Testing**: Test webhook delivery and processing

### Test Scenarios

1. **Successful Payment**: Complete payment flow and verify subscription activation
2. **Failed Payment**: Test payment failure handling
3. **Cancelled Payment**: Test payment cancellation flow
4. **Webhook Failures**: Test webhook retry mechanisms
5. **Security**: Test IP validation and signature verification

## Monitoring

### Payment Monitoring View

```sql
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
```

### Audit Logs

Monitor payment events through the `payment_audit_logs` table:

```sql
SELECT * FROM payment_audit_logs
WHERE event_type IN ('payment_session_created', 'webhook_processed', 'subscription_activated')
ORDER BY created_at DESC;
```

## Troubleshooting

### Common Issues

1. **Webhook Not Received**
   - Check PayFast webhook URL configuration
   - Verify IP address validation
   - Check function deployment status

2. **Payment Not Processing**
   - Verify PayFast credentials
   - Check signature generation
   - Review audit logs for errors

3. **Subscription Not Activated**
   - Check webhook verification
   - Verify tier mapping
   - Review subscription creation logic

### Debug Commands

```bash
# Check function logs
supabase functions logs create-payment-session
supabase functions logs process-payment-webhook

# Test function locally
supabase functions serve

# Check payment status
curl -X POST http://localhost:54321/functions/v1/verify-payment-status \
  -H "Content-Type: application/json" \
  -d '{"merchant_reference":"EDU-1234567890-abc123"}'
```

## Production Checklist

- [ ] Switch PayFast to production mode
- [ ] Update webhook URLs to production
- [ ] Test end-to-end payment flow
- [ ] Verify security measures
- [ ] Set up monitoring and alerting
- [ ] Document support procedures

## Support

For technical support:

- **Email**: support@edueasy.co.za
- **Documentation**: This document and inline code comments
- **Logs**: Supabase function logs and audit trails
