import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') as string;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Get authorization header for user authentication
    const authHeader = req.headers.get('Authorization')?.split(' ')[1];
    if (!authHeader) {
      return new Response('Unauthorized', { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Verify user authentication
    const { data: user, error: authError } = await supabase.auth.getUser(authHeader);
    if (authError || !user?.user) {
      return new Response('Invalid token', { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get user's current usage and rate limits
    const { data: usage, error: usageError } = await supabase
      .from('users')
      .select('query_count_today, query_limit, last_query_date')
      .eq('id', user.user.id)
      .single();
      
    if (usageError) {
      console.error('Database error:', usageError);
      return new Response('Database error', { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if we need to reset daily count
    const today = new Date().toISOString().split('T')[0];
    let currentCount = usage.query_count_today || 0;
    
    if (usage.last_query_date !== today) {
      // Reset count for new day
      await supabase
        .from('users')
        .update({ 
          query_count_today: 0, 
          last_query_date: today 
        })
        .eq('id', user.user.id);
      currentCount = 0;
    }
    
    // Check rate limit
    const queryLimit = usage.query_limit || 5;
    if (currentCount >= queryLimit) {
      return new Response('Rate limit exceeded', { 
        status: 429, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get the user's message
    const { message } = await req.json();
    if (!message) {
      return new Response('Message is required', { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Call OpenAI API
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are Thandi, a helpful AI assistant for EduEasy, specializing in South African university applications. You help students with application guidance, document requirements, and general education advice. Keep responses concise and helpful.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!completion.ok) {
      const error = await completion.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const completionData = await completion.json();
    const responseText = completionData.choices[0].message.content;

    // Update user's query count
    await supabase
      .from('users')
      .update({ 
        query_count_today: currentCount + 1, 
        last_query_date: today 
      })
      .eq('id', user.user.id);

    // Log the interaction
    await supabase.from('thandi_interactions').insert({
      user_id: user.user.id,
      message: message,
      is_user: true,
      response_type: 'ai'
    });

    await supabase.from('thandi_interactions').insert({
      user_id: user.user.id,
      message: responseText,
      is_user: false,
      response_type: 'ai'
    });

    console.log(`Processed query for user ${user.user.id}, count: ${currentCount + 1}/${queryLimit}`);

    return new Response(JSON.stringify({ 
      content: responseText,
      queries_remaining: queryLimit - (currentCount + 1)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in thandi-openai function:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Server error', 
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});