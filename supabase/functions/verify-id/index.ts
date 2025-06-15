
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Simulated encryption for demo—replace with pgcrypto/encryption in real DB.
 */
function simpleXOREncrypt(id: string): string {
  // This is NOT secure. Replace with pgcrypto/real encryption on DB.
  return btoa(id.split('').reverse().join(''));
}

/**
 * SA National ID validation: 13 digits, all numbers.
 */
function isValidSouthAfricanId(id: string): boolean {
  return /^[0-9]{13}$/.test(id);
}

serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, national_id } = await req.json();

    // 1. Validate request body
    if (!user_id || !national_id) {
      return new Response(
        JSON.stringify({ error: "Missing user_id or national_id" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 2. Validate ID format
    if (!isValidSouthAfricanId(national_id)) {
      return new Response(
        JSON.stringify({ error: "Invalid South African ID (must be 13 digits)" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // For demo: "Verify" any ID ending in an even digit
    const isEvenLastDigit = parseInt(national_id[national_id.length - 1], 10) % 2 === 0;

    // 3. Supabase config
    const supabaseUrl = Deno.env.get("SUPABASE_DB_URL") || "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) {
      return new Response(
        JSON.stringify({ error: "Edge function misconfigured." }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Log function call for debugging
    console.log(`verify-id called for user: ${user_id} - isEven: ${isEvenLastDigit}`);

    // Compose last 4 digits for logging (no PI leakage)
    const last4 = national_id.slice(-4);
    const logResult = isEvenLastDigit ? "verified" : "rejected";

    // 4. Log attempt before outcome
    await fetch(`${supabaseUrl}/rest/v1/verification_logs`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        user_id,
        national_id_last4: last4,
        result: logResult,
      }),
    });

    if (!isEvenLastDigit) {
      return new Response(
        JSON.stringify({ error: "Identity verification failed." }),
        { status: 403, headers: corsHeaders }
      );
    }

    // 5. On success, upsert user with verified=true, encrypted id, tracking_id null (DB will assign via trigger)
    const upsertRes = await fetch(`${supabaseUrl}/rest/v1/users?id=eq.${user_id}`, {
      method: "PATCH",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        national_id_encrypted: simpleXOREncrypt(national_id),
        id_verified: true,
        tracking_id: null, // triggers DB function
      }),
    });
    const upsertData = await upsertRes.json();

    // 6. Success
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Function verify-id error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message ?? "Edge function error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});
