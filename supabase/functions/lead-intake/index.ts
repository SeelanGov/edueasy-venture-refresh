// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const schema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Phone number must be valid"),
  grade: z.string().optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
  utm: z.record(z.string()).optional(),
  source: z.string().default('landing'),
  ip: z.string().nullable().optional(),
  user_agent: z.string().nullable().optional()
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // service role stays on server only
);

function corsHeaders(origin?: string | null) {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400"
  };
}

function jsonResponse(data: unknown, req: Request, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 
      "Content-Type": "application/json", 
      ...corsHeaders(req.headers.get("origin")) 
    }
  });
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(req.headers.get("origin")) });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return jsonResponse(
      { ok: false, error: "Method not allowed" }, 
      req, 
      405
    );
  }

  try {
    const body = await req.json();
    console.log("Received lead submission:", { 
      full_name: body.full_name, 
      phone: body.phone?.substring(0, 3) + "***", // Log partial phone for debugging
      source: body.source 
    });

    // Validate input
    const validatedData = schema.parse(body);

    // Enrich with request metadata
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || 
               req.headers.get("x-real-ip") || 
               validatedData.ip || 
               null;
    
    const user_agent = req.headers.get("user-agent") || 
                       validatedData.user_agent || 
                       null;

    // Insert into marketing_leads table using service role (bypasses RLS)
    const { error: insertError } = await supabase
      .from("marketing_leads")
      .insert([{
        full_name: validatedData.full_name,
        phone: validatedData.phone,
        grade: validatedData.grade || null,
        consent: validatedData.consent,
        utm: validatedData.utm || {},
        source: validatedData.source,
        ip: ip,
        user_agent: user_agent,
        consent_timestamp: new Date().toISOString()
      }]);

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log("Lead successfully inserted for:", validatedData.full_name);

    // Optional: Send notification to Slack/email (implement if needed)
    // await notifyNewLead(validatedData);

    return jsonResponse({ ok: true, message: "Lead submitted successfully" }, req);

  } catch (error: any) {
    console.error("Lead intake error:", error);

    if (error instanceof z.ZodError) {
      return jsonResponse(
        { 
          ok: false, 
          error: "Validation failed", 
          details: error.errors 
        }, 
        req, 
        400
      );
    }

    return jsonResponse(
      { 
        ok: false, 
        error: error.message || "Internal server error" 
      }, 
      req, 
      500
    );
  }
});