// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, message } = await req.json();

    // 1. Extract keywords (basic split, filter short words)
    const queryKeywords = message
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 2);
    console.log('Extracted keywords:', queryKeywords);

    // 2. Enforce 5-query/day rate limit per user
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recentQueries, error: rateError } = await supabase
      .from('thandi_interactions')
      .select('id')
      .eq('user_id', user_id)
      .eq('is_user', true)
      .gte('created_at', since);

    if (rateError) {
      console.error('Rate limit check error:', rateError);
    }
    if ((recentQueries?.length || 0) >= 5) {
      console.log('Rate limit enforced for user:', user_id);
      return new Response(
        JSON.stringify({ error: 'Daily limit reached (5 queries/24h)' }), 
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Query thandi_knowledge_index for matching modules
    const { data: modules, error: modErr } = await supabase
      .from('thandi_knowledge_index')
      .select('*')
      .filter('tags', 'ov', `{${queryKeywords.join(',')}}`);

    if (modErr) {
      console.error('Knowledge index query error:', modErr);
      return new Response(
        JSON.stringify({ error: 'Knowledge index query failed' }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!modules || modules.length === 0) {
      console.log('No matching modules found for keywords:', queryKeywords);
      // Log the query even if no match
      await supabase.from('thandi_interactions').insert({ user_id, message, is_user: true });
      return new Response(
        JSON.stringify({
          reply: "I couldn't find anything useful. Visit https://edueasy.co.za/resources for more help.",
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(
      'Matched modules:',
      modules.map((m) => m.module),
    );

    // 4. For each match, fetch the .json file from storage
    const contentSnippets = [];
    for (const module of modules) {
      const path = `${module.module}/${module.json_path}`;
      const { data: fileRes, error: fileErr } = await supabase.storage
        .from('thandi-knowledge')
        .download(path);

      if (fileErr) {
        console.error(`Error fetching file ${path}:`, fileErr);
        continue;
      }
      if (!fileRes) {
        console.warn(`File not found in storage: ${path}`);
        continue;
      }

      const text = await fileRes.text();
      try {
        const json = JSON.parse(text);
        // 5. Parse summaries or key info (intro, bullets, etc.)
        const summary =
          json.summary ||
          json.intro ||
          json.description ||
          JSON.stringify(json).slice(0, 200) + '...';
        const bullets =
          Array.isArray(json.bullets) && json.bullets.length
            ? '\n- ' + json.bullets.join('\n- ')
            : '';
        const snippet = `Module: ${module.title}\n${summary}${bullets}`;
        contentSnippets.push(snippet);
        console.log(`Fetched and parsed: ${path}`);
      } catch (e) {
        console.error(`Error parsing JSON from ${path}:`, e);
      }
    }

    // 6. Build enhanced system prompt with PRD personality
    const systemPrompt = `You are Thandi, EduEasy's AI assistant, guiding South African students through education, funding, and career pathways.

**Your personality:**
- Warm, empathetic, and supportive
- Clear and direct communication
- Culturally aware of South African education system

**Your knowledge base:**
${contentSnippets.join('\n\n')}

**Response guidelines:**
1. Pull answers from the verified modules above
2. Always include CTAs to https://edueasy.co.za when relevant
3. Support multilingual responses (English, Zulu, Xhosa)
4. If you can't find info, say: "Please visit https://edueasy.co.za/resources for more help."
5. Keep responses concise and actionable (under 200 words)

**Important:** Prioritize EduEasy services like quizzes, alerts, and tracking tools.`;

    console.log('System prompt constructed with', contentSnippets.length, 'knowledge modules');

    // 7. Log the user query
    await supabase.from('thandi_interactions').insert({ user_id, message, is_user: true });

    // 8. Call Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Lovable AI error:', aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit reached. Please try again in a few moments.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const reply = aiData.choices[0].message.content;

    // 9. Log the AI response
    await supabase.from('thandi_interactions').insert({
      user_id,
      message: reply,
      is_user: false,
    });

    const queriesRemaining = 5 - (recentQueries?.length || 0) - 1;

    return new Response(
      JSON.stringify({
        reply,
        context: contentSnippets,
        model: 'google/gemini-2.5-flash',
        queries_remaining: queriesRemaining
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Unhandled error in edge function:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
