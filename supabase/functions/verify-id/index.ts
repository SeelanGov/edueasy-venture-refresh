
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get API key from secret if you want to lock down (optional)
// const VERIFY_ID_API_KEY = Deno.env.get("VERIFY_ID_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function isValidSouthAfricanId(id: string) {
  return /^[0-9]{13}$/.test(id);
}

// XOR encrypt for demo -- use pgcrypto in SQL for real encryption
function maskId(id: string): string {
  // Not secure: just an obfuscation for DRY run; proper encryption handled in DB with pgcrypto.
  return btoa(id.split('').reverse().join(''));
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, national_id } = await req.json();

    // Check presence
    if (!user_id || !national_id) {
      return new Response(
        JSON.stringify({ error: "Missing user_id or national_id" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Simple South African ID check (13 digits)
    if (!isValidSouthAfricanId(national_id)) {
      return new Response(
        JSON.stringify({ error: "Invalid SA ID format. Must be 13 digits." }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Simulate 3rd-party verification ("pass" any number ending in even digit)
    const isValid = parseInt(national_id[national_id.length - 1], 10) % 2 === 0;

    // Compose last 4 digits for audit log
    const last4 = national_id.slice(-4);

    // Prepare result audit
    const logResult = isValid ? "verified" : "rejected";

    // Connect to Supabase via RESTful call
    const url = Deno.env.get("SUPABASE_DB_URL") || "";
    const adminKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !adminKey) {
      return new Response(
        JSON.stringify({ error: "Server misconfigured. Missing SUPABASE DB URL or KEY." }),
        { status: 500, headers: corsHeaders }
      );
    }

    if (!isValid) {
      // Log failure to verification_logs
      await fetch(`${url}/rest/v1/verification_logs`, {
        method: "POST",
        headers: {
          "apikey": adminKey,
          "Authorization": `Bearer ${adminKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation",
        },
        body: JSON.stringify({
          user_id,
          national_id_last4: last4,
          result: logResult,
        }),
      });
      return new Response(
        JSON.stringify({ error: "Identity verification failed." }),
        { status: 403, headers: corsHeaders }
      );
    }

    // 1. Encrypt the National ID with pgcrypto (here: mask, then let front-end upsert securely)
    // 2. Set id_verified = true; call generate_tracking_id()
    // 3. Log success to verification_logs
    // 4. Return success; tracking_id will be queried after registration

    // Store encrypted national ID, set verified, assign tracking id
    // Use upsert to avoid double entry
    const { error: upsertError } = await fetch(`${url}/rest/v1/users?id=eq.${user_id}`, {
      method: "PATCH",
      headers: {
        "apikey": adminKey,
        "Authorization": `Bearer ${adminKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        national_id_encrypted: maskId(national_id),
        id_verified: true,
        tracking_id: null, // Will trigger new generation of tracking_id via DB
      }),
    }).then(r => r.json());

    // Log verification attempt
    await fetch(`${url}/rest/v1/verification_logs`, {
      method: "POST",
      headers: {
        "apikey": adminKey,
        "Authorization": `Bearer ${adminKey}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({
        user_id,
        national_id_last4: last4,
        result: logResult,
      }),
    });

    if (upsertError) {
      return new Response(JSON.stringify({ error: "Upsert error" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
