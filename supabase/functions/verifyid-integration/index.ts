import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerifyIDRequest {
  user_id: string;
  national_id: string;
  api_key: string;
}

interface VerifyIDResponse {
  verified: boolean;
  data?: {
    first_name?: string;
    last_name?: string;
    date_of_birth?: string;
    gender?: string;
    citizenship?: string;
    status?: string;
  };
  error?: string;
  request_id?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, national_id, api_key }: VerifyIDRequest = await req.json();
    
    // Validate request
    if (!user_id || !national_id || !api_key) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: user_id, national_id, api_key" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate national ID format (13 digits)
    if (!/^\d{13}$/.test(national_id)) {
      return new Response(
        JSON.stringify({ error: "Invalid South African ID format. Must be 13 digits." }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Initialize Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !serviceKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ error: "Service temporarily unavailable" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey);

    // Get client IP for audit logging
    const clientIP = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    // Step 1: Verify consent exists and is valid
    const { data: consent, error: consentError } = await supabase
      .from('user_consents')
      .select('*')
      .eq('user_id', user_id)
      .eq('consent_type', 'ID_verification')
      .eq('accepted', true)
      .single();

    if (consentError || !consent) {
      // Log the consent check failure
      await supabase.rpc('log_verification_attempt', {
        p_user_id: user_id,
        p_verification_status: 'consent_missing',
        p_error_message: 'ID verification consent not found or not accepted',
        p_ip_address: clientIP
      });

      return new Response(
        JSON.stringify({ 
          error: "ID verification consent not found. Please provide consent before verification.",
          code: "CONSENT_REQUIRED"
        }),
        { status: 403, headers: corsHeaders }
      );
    }

    // Step 2: Check rate limiting
    const rateLimitCheck = await checkRateLimit(supabase, clientIP, user_id);
    if (rateLimitCheck.blocked) {
      await supabase.rpc('log_verification_attempt', {
        p_user_id: user_id,
        p_verification_status: 'rate_limited',
        p_error_message: 'Too many verification attempts',
        p_ip_address: clientIP
      });

      return new Response(
        JSON.stringify({ 
          error: "Too many verification attempts. Please try again later.",
          blocked_until: rateLimitCheck.blocked_until,
          attempts: rateLimitCheck.attempts
        }),
        { status: 429, headers: corsHeaders }
      );
    }

    // Step 3: Call VerifyID API
    console.log(`Calling VerifyID API for user ${user_id} with ID ending in ${national_id.slice(-4)}`);
    
    const verifyIDResponse = await fetch('https://api.verifyid.co.za/said_verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
      },
      body: JSON.stringify({
        id_number: national_id
      })
    });

    const verifyIDResult: VerifyIDResponse = await verifyIDResponse.json();
    const requestId = verifyIDResponse.headers.get('x-request-id') || verifyIDResult.request_id;

    // Step 4: Log the API call attempt
    await supabase.rpc('log_verification_attempt', {
      p_user_id: user_id,
      p_api_request_id: requestId,
      p_verification_status: verifyIDResponse.ok ? 'success' : 'failed',
      p_error_message: verifyIDResponse.ok ? null : verifyIDResult.error,
      p_ip_address: clientIP
    });

    if (!verifyIDResponse.ok) {
      console.error(`VerifyID API error for user ${user_id}:`, verifyIDResult.error);
      
      return new Response(
        JSON.stringify({ 
          error: "Identity verification failed. Please check your ID number and try again.",
          details: verifyIDResult.error || 'Unknown verification error'
        }),
        { status: 403, headers: corsHeaders }
      );
    }

    // Step 5: Update user record with verification data
    const verificationData = {
      verified: true,
      verification_date: new Date().toISOString(),
      verification_status: 'verified',
      // Store only non-sensitive data from VerifyID response
      ...(verifyIDResult.data && {
        first_name: verifyIDResult.data.first_name,
        last_name: verifyIDResult.data.last_name,
        date_of_birth: verifyIDResult.data.date_of_birth,
        gender: verifyIDResult.data.gender,
        citizenship: verifyIDResult.data.citizenship,
        status: verifyIDResult.data.status
      })
    };

    const { error: updateError } = await supabase
      .from('users')
      .update({
        verifyid_verified: true,
        verifyid_verification_date: new Date().toISOString(),
        verifyid_response_data: verificationData,
        id_verified: true // Update the existing verification flag
      })
      .eq('id', user_id);

    if (updateError) {
      console.error(`Failed to update user verification status for ${user_id}:`, updateError);
      
      // Log the update failure but don't fail the request
      await supabase.rpc('log_verification_attempt', {
        p_user_id: user_id,
        p_verification_status: 'update_failed',
        p_error_message: 'Failed to update user verification status',
        p_ip_address: clientIP
      });
    }

    console.log(`Successfully verified user ${user_id} with VerifyID`);

    return new Response(
      JSON.stringify({ 
        verified: true,
        message: "Identity verification successful",
        verification_date: new Date().toISOString(),
        request_id: requestId
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    console.error("VerifyID integration error:", err);
    
    return new Response(
      JSON.stringify({ error: "Verification service error. Please try again." }),
      { status: 500, headers: corsHeaders }
    );
  }
});

/**
 * Check rate limiting for verification attempts
 */
async function checkRateLimit(
  supabase: any,
  ipAddress: string,
  userIdentifier: string
): Promise<{ blocked: boolean; attempts: number; blocked_until?: string }> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
  // Check existing rate limit record
  const { data: existing } = await supabase
    .from('verification_rate_limits')
    .select('*')
    .or(`ip_address.eq.${ipAddress},user_identifier.eq.${userIdentifier}`)
    .single();
  
  if (existing) {
    // Check if still blocked
    if (existing.blocked_until && new Date(existing.blocked_until) > new Date()) {
      return {
        blocked: true,
        attempts: existing.attempt_count,
        blocked_until: existing.blocked_until
      };
    }
    
    // Check if within rate limit window
    if (existing.first_attempt_at > oneHourAgo && existing.attempt_count >= 5) {
      // Block for 1 hour
      const blockedUntil = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      
      await supabase
        .from('verification_rate_limits')
        .update({ 
          blocked_until: blockedUntil,
          last_attempt_at: new Date().toISOString()
        })
        .eq('id', existing.id);
      
      return {
        blocked: true,
        attempts: existing.attempt_count,
        blocked_until: blockedUntil
      };
    }
    
    // Update attempt count
    const newCount = existing.first_attempt_at > oneHourAgo ? existing.attempt_count + 1 : 1;
    const firstAttempt = existing.first_attempt_at > oneHourAgo ? existing.first_attempt_at : new Date().toISOString();
    
    await supabase
      .from('verification_rate_limits')
      .update({
        attempt_count: newCount,
        first_attempt_at: firstAttempt,
        last_attempt_at: new Date().toISOString()
      })
      .eq('id', existing.id);
    
    return { blocked: false, attempts: newCount };
  } else {
    // Create new rate limit record
    await supabase
      .from('verification_rate_limits')
      .insert({
        ip_address: ipAddress,
        user_identifier: userIdentifier,
        attempt_count: 1
      });
    
    return { blocked: false, attempts: 1 };
  }
} 