import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authenticated user from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client with anon key for user auth
    const supabaseAuth = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    // Create service client for audit logging (bypasses RLS)
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Parse request body
    const { action, resource, details } = await req.json();

    // Create audit log entry
    const auditEntry = {
      message: `Admin action: ${action} on ${resource}`,
      category: 'ADMIN_ACTION',
      severity: 'INFO', 
      component: 'ADMIN_AUDIT',
      action: action,
      user_id: user.id,
      details: {
        resource,
        timestamp: new Date().toISOString(),
        user_email: user.email,
        ip_address: req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for'),
        user_agent: req.headers.get('user-agent'),
        ...details
      }
    };

    // Insert audit log using service key (bypasses RLS)
    const { error: logError } = await supabaseService
      .from('system_error_logs')
      .insert(auditEntry);

    if (logError) {
      console.error('Failed to create audit log:', logError);
      throw logError;
    }

    console.log(`Audit log created for user ${user.id}: ${action} on ${resource}`);

    return new Response(
      JSON.stringify({ success: true, audit_logged: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in admin-audit-log function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});