
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Parse request body
    const { hours = 24, severity = 'critical' } = await req.json();
    
    // Calculate time threshold
    const hoursAgo = new Date();
    hoursAgo.setHours(hoursAgo.getHours() - hours);
    
    // Query for unresolved errors in the given time period
    const { data: errors, error } = await supabase
      .from('system_error_logs')
      .select('id, message, severity, component, occurred_at')
      .eq('severity', severity)
      .eq('is_resolved', false)
      .gte('occurred_at', hoursAgo.toISOString())
      .order('occurred_at', { ascending: false });
    
    if (error) throw error;
    
    // Get count of errors by component
    const errorsByComponent: Record<string, number> = {};
    errors?.forEach(error => {
      const component = error.component || 'Unknown';
      errorsByComponent[component] = (errorsByComponent[component] || 0) + 1;
    });
    
    return new Response(
      JSON.stringify({
        count: errors?.length || 0,
        byComponent: errorsByComponent,
        latestErrors: errors?.slice(0, 5) || []
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  } catch (error) {
    console.error("Error checking system errors:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error',
        details: JSON.stringify(error)
      }),
      { 
        status: 500, 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }
});
