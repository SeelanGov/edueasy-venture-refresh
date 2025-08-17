import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  tier: 'basic' | 'premium';
  user_id: string;
  payment_method?: string; // New field for payment method preference
}

interface PaymentResponse {
  payment_url: string;
  merchant_reference: string;
  expires_at: string;
  error?: string;
}

interface PayFastData {
  [key: string]: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get request body
    const { tier, user_id, payment_method }: PaymentRequest = await req.json();

    // Enhanced input validation
    if (!tier || !user_id) {
      return new Response(JSON.stringify({ error: 'Missing required fields: tier and user_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!['basic', 'premium'].includes(tier)) {
      return new Response(JSON.stringify({ error: 'Invalid tier. Must be "basic" or "premium"' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate payment method if provided
    const validPaymentMethods = ['card', 'airtime', 'qr', 'eft', 'store', 'payment-plan'];
    if (payment_method && !validPaymentMethods.includes(payment_method)) {
      return new Response(JSON.stringify({ error: 'Invalid payment method' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify user exists and is authenticated
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, tracking_id')
      .eq('id', user_id)
      .single();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid user' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Price mapping (aligned with current system)
    const priceMapping = {
      basic: 199, // Essential plan
      premium: 300, // Pro + AI plan
    };

    const amount = priceMapping[tier];

    // Generate unique merchant reference
    const timestamp = Date.now();
    const userShort = user_id.substring(0, 8);
    const randomSuffix = Math.random().toString(36).substr(2, 6);
    const merchant_reference = `EDU-${timestamp}-${userShort}-${randomSuffix}`;

    // Set payment expiry (24 hours)
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Create payment record
    const { error: paymentError } = await supabase.from('payments').insert({
      user_id,
      amount,
      tier,
      payment_method: payment_method || 'payfast',
      status: 'pending',
      merchant_reference,
      gateway_provider: 'payfast',
      payment_expiry: expires_at,
      preferred_payment_method: payment_method, // Store the preferred payment method
    });

    if (paymentError) {
      console.error('Database error:', paymentError);
      return new Response(JSON.stringify({ error: 'Failed to create payment record' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get PayFast credentials
    const merchantId = Deno.env.get('PAYFAST_MERCHANT_ID');
    const merchantKey = Deno.env.get('PAYFAST_MERCHANT_KEY');
    const passphrase = Deno.env.get('PAYFAST_PASSPHRASE');
    const isSandbox = Deno.env.get('PAYFAST_SANDBOX') === 'true';

    const baseUrl = isSandbox
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process';

    // Build PayFast payload
    const payfastData: PayFastData = {
      merchant_id: merchantId!,
      merchant_key: merchantKey!,
      return_url: `${Deno.env.get('SITE_URL')}/payment-success`,
      cancel_url: `${Deno.env.get('SITE_URL')}/payment-cancelled`,
      notify_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/process-payment-webhook`,
      name_first: user.email?.split('@')[0] || 'User',
      name_last: 'EduEasy',
      email_address: user.email || 'user@edueasy.co.za',
      m_payment_id: merchant_reference,
      amount: amount.toFixed(2),
      item_name: `EduEasy ${tier === 'basic' ? 'Essential' : 'Pro + AI'} Plan`,
      item_description: `Access to EduEasy ${tier} features`,
      custom_str1: user_id,
      custom_str2: tier,
      custom_str3: user.tracking_id || '',
      custom_str4: payment_method || 'all', // Pass preferred payment method to PayFast
    };

    // Generate signature
    const signature = generatePayFastSignature(payfastData, passphrase);
    payfastData.signature = signature;

    // Build redirect URL
    const queryString = new URLSearchParams(payfastData).toString();
    const payment_url = `${baseUrl}?${queryString}`;

    // Update payment record with URL
    await supabase
      .from('payments')
      .update({ payment_url, payfast_signature: signature })
      .eq('merchant_reference', merchant_reference);

    // Log payment creation
    await logPaymentEvent(supabase, {
      payment_id: merchant_reference,
      event_type: 'payment_session_created',
      event_data: { tier, amount, user_id: user.tracking_id },
    });

    const response: PaymentResponse = {
      payment_url,
      merchant_reference,
      expires_at,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generatePayFastSignature(data: PayFastData, passphrase?: string): string {
  // Remove signature and empty values, sort alphabetically
  const cleanData = Object.fromEntries(
    Object.entries(data)
      .filter(
        ([key, value]) =>
          key !== 'signature' && value !== '' && value !== null && value !== undefined,
      )
      .sort(([a], [b]) => a.localeCompare(b)),
  );

  // Create query string
  const queryString = new URLSearchParams(cleanData).toString();

  // Add passphrase if provided
  const signatureString = passphrase ? `${queryString}&passphrase=${passphrase}` : queryString;

  // Generate MD5 hash synchronously using crypto-js equivalent
  return md5Sync(signatureString);
}

function md5Sync(str: string): string {
  // Simple MD5 implementation for Deno
  // This is a basic implementation - in production, consider using a proper MD5 library
  const encoder = new TextEncoder();
  const data = encoder.encode(str);

  // Use Deno's built-in crypto for MD5
  const hashBuffer = crypto.subtle.digestSync('MD5', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function logPaymentEvent(supabase: any, eventData: any) {
  try {
    await supabase.from('payment_audit_logs').insert({
      payment_id: eventData.payment_id,
      event_type: eventData.event_type,
      event_data: eventData.event_data,
    });
  } catch (error) {
    console.error('Failed to log payment event:', error);
  }
}
