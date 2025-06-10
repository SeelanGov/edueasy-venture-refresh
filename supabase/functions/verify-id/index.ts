
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerificationRequest {
  nationalId: string;
  userId: string;
}

interface VerificationResponse {
  success: boolean;
  trackingId?: string;
  error?: string;
  message?: string;
}

// Mock South African ID validation
function validateSouthAfricanId(idNumber: string): boolean {
  // Remove any spaces or hyphens
  const cleanId = idNumber.replace(/[\s-]/g, '');
  
  // Must be exactly 13 digits
  if (!/^\d{13}$/.test(cleanId)) {
    return false;
  }

  // Basic date validation (YYMMDD)
  const year = parseInt(cleanId.substring(0, 2));
  const month = parseInt(cleanId.substring(2, 4));
  const day = parseInt(cleanId.substring(4, 6));
  
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }

  // Luhn algorithm check for the last digit
  const digits = cleanId.split('').map(Number);
  let sum = 0;
  
  for (let i = 0; i < 12; i++) {
    if (i % 2 === 0) {
      sum += digits[i];
    } else {
      const doubled = digits[i] * 2;
      sum += doubled > 9 ? doubled - 9 : doubled;
    }
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === digits[12];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { nationalId, userId }: VerificationRequest = await req.json();

    console.log(`Starting ID verification for user: ${userId}`);

    // Validate input
    if (!nationalId || !userId) {
      return new Response(
        JSON.stringify({ success: false, error: 'National ID and User ID are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Perform ID validation
    const isValid = validateSouthAfricanId(nationalId);
    const last4Digits = nationalId.slice(-4);
    
    let result: VerificationResponse;

    if (isValid) {
      // Encrypt the national ID
      const { data: encryptedData, error: encryptError } = await supabaseClient.rpc(
        'pgp_sym_encrypt',
        {
          data: nationalId,
          psw: Deno.env.get('ENCRYPTION_KEY') || 'default-key-change-in-production'
        }
      );

      if (encryptError) {
        console.error('Encryption error:', encryptError);
        throw new Error('Failed to encrypt national ID');
      }

      // Generate tracking ID and update user
      const { data: trackingData, error: trackingError } = await supabaseClient.rpc('generate_tracking_id');
      
      if (trackingError) {
        console.error('Tracking ID generation error:', trackingError);
        throw new Error('Failed to generate tracking ID');
      }

      // Update user with verification data
      const { error: updateError } = await supabaseClient
        .from('users')
        .update({
          national_id_encrypted: encryptedData,
          id_verified: true,
          tracking_id: trackingData
        })
        .eq('id', userId);

      if (updateError) {
        console.error('User update error:', updateError);
        throw new Error('Failed to update user verification status');
      }

      // Log successful verification
      await supabaseClient
        .from('verification_logs')
        .insert({
          user_id: userId,
          national_id_last4: last4Digits,
          result: 'success',
          verification_method: 'api'
        });

      result = {
        success: true,
        trackingId: trackingData,
        message: 'ID verification successful'
      };

      console.log(`ID verification successful for user: ${userId}, tracking ID: ${trackingData}`);
    } else {
      // Log failed verification
      await supabaseClient
        .from('verification_logs')
        .insert({
          user_id: userId,
          national_id_last4: last4Digits,
          result: 'failed',
          error_message: 'Invalid South African ID number format',
          verification_method: 'api'
        });

      result = {
        success: false,
        error: 'Invalid South African ID number. Please check the format and try again.'
      };

      console.log(`ID verification failed for user: ${userId} - invalid format`);
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400
      }
    );

  } catch (error) {
    console.error('Verification error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error during verification' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
