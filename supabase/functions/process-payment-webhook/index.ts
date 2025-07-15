import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// PayFast IPN verification URLs
const PAYFAST_VERIFY_URLS = {
  sandbox: 'https://sandbox.payfast.co.za/eng/query/validate',
  production: 'https://www.payfast.co.za/eng/query/validate'
}

// Known PayFast IP addresses for security validation
const PAYFAST_IPS = [
  '41.74.179.192', '41.74.179.193', '41.74.179.194', '41.74.179.195',
  '41.74.179.196', '41.74.179.197', '41.74.179.198', '41.74.179.199',
  '41.74.179.200', '41.74.179.201', '41.74.179.202', '41.74.179.203',
  '41.74.179.204', '41.74.179.205', '41.74.179.206', '41.74.179.207',
  '41.74.179.208', '41.74.179.209', '41.74.179.210', '41.74.179.211',
  '41.74.179.212', '41.74.179.213', '41.74.179.214', '41.74.179.215',
  '41.74.179.216', '41.74.179.217', '41.74.179.218', '41.74.179.219',
  '41.74.179.220', '41.74.179.221', '41.74.179.222', '41.74.179.223',
  '41.74.179.224', '41.74.179.225', '41.74.179.226', '41.74.179.227',
  '41.74.179.228', '41.74.179.229', '41.74.179.230', '41.74.179.231',
  '41.74.179.232', '41.74.179.233', '41.74.179.234', '41.74.179.235',
  '41.74.179.236', '41.74.179.237', '41.74.179.238', '41.74.179.239',
  '41.74.179.240', '41.74.179.241', '41.74.179.242', '41.74.179.243',
  '41.74.179.244', '41.74.179.245', '41.74.179.246', '41.74.179.247',
  '41.74.179.248', '41.74.179.249', '41.74.179.250', '41.74.179.251',
  '41.74.179.252', '41.74.179.253', '41.74.179.254', '41.74.179.255'
]

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get client IP for verification
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                    req.headers.get('x-real-ip') || 
                    'unknown'

    console.log('Webhook received from IP:', clientIP)

    // Validate IP address (commented out for testing, uncomment for production)
    // if (!PAYFAST_IPS.includes(clientIP)) {
    //   console.warn('Webhook from unknown IP:', clientIP)
    //   return new Response('Unauthorized IP', { status: 403 })
    // }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Parse form data from PayFast
    const formData = await req.formData()
    const webhookData: Record<string, string> = {}
    
    for (const [key, value] of formData.entries()) {
      webhookData[key] = value.toString()
    }

    console.log('Webhook data received:', webhookData)

    // Extract key fields
    const {
      m_payment_id: merchant_reference,
      payment_status,
      pf_payment_id: provider_transaction_id,
      custom_str1: user_id,
      custom_str2: tier
    } = webhookData

    if (!merchant_reference) {
      console.error('Missing merchant_reference in webhook')
      return new Response('Missing merchant_reference', { status: 400 })
    }

    // Verify the webhook with PayFast
    const isVerified = await verifyPayFastWebhook(formData)
    
    if (!isVerified) {
      console.error('PayFast webhook verification failed')
      await logWebhookEvent(supabase, {
        payment_id: merchant_reference,
        event_type: 'webhook_verification_failed',
        event_data: { webhook_data: webhookData }
      })
      return new Response('Verification failed', { status: 400 })
    }

    // Update payment record
    const updateData: any = {
      status: payment_status === 'COMPLETE' ? 'paid' : 'failed',
      webhook_data: webhookData,
      ipn_verified: true,
      last_webhook_attempt: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    if (provider_transaction_id) {
      updateData.payfast_payment_id = provider_transaction_id
    }

    const { error: updateError } = await supabase
      .from('payments')
      .update(updateData)
      .eq('merchant_reference', merchant_reference)

    if (updateError) {
      console.error('Failed to update payment:', updateError)
      return new Response('Database update failed', { status: 500 })
    }

    // If payment is successful, update user subscription
    if (payment_status === 'COMPLETE') {
      await updateUserSubscription(supabase, user_id, tier, merchant_reference)
    }

    // Log the webhook for audit
    await logWebhookEvent(supabase, {
      payment_id: merchant_reference,
      event_type: 'webhook_processed',
      event_data: {
        payment_status,
        provider_transaction_id,
        user_id,
        tier,
        client_ip: clientIP
      }
    })

    return new Response('OK', { status: 200 })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response('Internal server error', { status: 500 })
  }
})

async function verifyPayFastWebhook(formData: FormData): Promise<boolean> {
  try {
    const isSandbox = Deno.env.get('PAYFAST_SANDBOX') === 'true'
    const verifyUrl = isSandbox ? PAYFAST_VERIFY_URLS.sandbox : PAYFAST_VERIFY_URLS.production

    // Send the same data back to PayFast for verification
    const response = await fetch(verifyUrl, {
      method: 'POST',
      body: formData
    })

    const result = await response.text()
    console.log('PayFast verification result:', result)

    // PayFast returns "VALID" for successful verification
    return result.trim() === 'VALID'
  } catch (error) {
    console.error('PayFast verification error:', error)
    return false
  }
}

async function updateUserSubscription(
  supabase: any, 
  user_id: string, 
  tier: string, 
  merchant_reference: string
) {
  try {
    // Get the tier ID from subscription_tiers table
    const tierName = tier === 'basic' ? 'Essential' : 'Pro + AI'
    const { data: tierData } = await supabase
      .from('subscription_tiers')
      .select('id')
      .eq('name', tierName)
      .single()

    if (!tierData) {
      console.error('Tier not found:', tierName)
      return
    }

    // Deactivate any existing active subscriptions
    await supabase
      .from('user_subscriptions')
      .update({ is_active: false })
      .eq('user_id', user_id)
      .eq('is_active', true)

    // Create new subscription
    const { error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id,
        tier_id: tierData.id,
        purchase_date: new Date().toISOString(),
        is_active: true,
        payment_method: 'payfast'
      })

    if (subscriptionError) {
      console.error('Failed to create subscription:', subscriptionError)
    }

    // Create transaction record
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id,
        amount: tier === 'basic' ? 199 : 300,
        type: 'subscription',
        status: 'completed',
        payment_method: 'payfast',
        transaction_reference: merchant_reference
      })

    if (transactionError) {
      console.error('Failed to create transaction:', transactionError)
    }

    // Log subscription activation
    await logWebhookEvent(supabase, {
      payment_id: merchant_reference,
      event_type: 'subscription_activated',
      event_data: { tier, user_id }
    })

  } catch (error) {
    console.error('Error updating user subscription:', error)
  }
}

async function logWebhookEvent(supabase: any, eventData: any) {
  try {
    await supabase
      .from('payment_audit_logs')
      .insert({
        payment_id: eventData.payment_id,
        event_type: eventData.event_type,
        event_data: eventData.event_data
      })
  } catch (error) {
    console.error('Failed to log webhook event:', error)
  }
}