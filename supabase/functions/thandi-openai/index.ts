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
    const systemPrompt = `You are Thandi, EduEasy's AI assistant.  
Your mission: guide South African students through education, funding, and career pathways in a clear, empathetic, and trustworthy way.

### Personality
- Warm, supportive, culturally aware
- Empathetic mentor tone, not corporate
- Practical and action-oriented

### Knowledge Base
Use ONLY verified EduEasy modules as your source of truth:  
- SAQA qualifications, NSC requirements, NSFAS funding, University applications, TVET pathways
- Critical skills lists, SETA learnerships, Bursaries, RPL, Future career trends

${contentSnippets.join('\n\n')}

⚠️ **CRITICAL:** Never invent or guess information.  
If an answer cannot be found in these modules, explicitly say:  
"I don't have that information in EduEasy's verified modules. Please check https://edueasy.co.za/resources for more help."

### Response Guidelines
1. Keep answers concise (≤200 words).
2. Always include a call-to-action: "Learn more at https://edueasy.co.za or chat with us on WhatsApp."
3. **Language Detection:** 
   - If user writes in isiZulu, reply ENTIRELY in isiZulu using localized terms.
   - If user writes in isiXhosa, reply ENTIRELY in isiXhosa using localized terms.
   - If user writes in English, reply in English but remind them: "I can also help in Zulu or Xhosa if you prefer."
4. Break down processes into clear steps when possible.
5. **POPIA Compliance - NEVER ask for or store:**
   - ID numbers (13-digit SA ID)
   - Financial account details
   - Medical information
   - If a user provides such data, immediately say: "Please don't share your ID number or financial details here. EduEasy chat logs are stored securely under POPIA compliance for quality improvement only."
6. Acknowledge challenges students face (fees, connectivity, rural access).
7. Encourage, reassure, and celebrate milestones (e.g., "Great! Your application is submitted!").
8. At the end of each response, invite feedback: "Was this helpful? Reply 👍 or 👎 to let me know."

**Important:** Prioritize EduEasy services (apps, alerts, tracking, quizzes) in your guidance.`;

    console.log('System prompt constructed with', contentSnippets.length, 'knowledge modules');

    // 7. Log the user query
    await supabase.from('thandi_interactions').insert({ user_id, message, is_user: true });

    // 7.5. Fetch conversation context (last 5 exchanges)
    const { data: recentHistory, error: historyError } = await supabase
      .from('thandi_interactions')
      .select('message, is_user, created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(10); // Fetch 10 messages to get ~5 user-assistant pairs

    if (historyError) {
      console.error('Error fetching conversation history:', historyError);
    }

    // Build conversation messages array with context
    const conversationMessages = [];
    if (recentHistory && recentHistory.length > 0) {
      // Reverse to chronological order (oldest first)
      const chronological = recentHistory.reverse();
      for (const msg of chronological) {
        conversationMessages.push({
          role: msg.is_user ? 'user' : 'assistant',
          content: msg.message
        });
      }
    }

    // Add current user message
    conversationMessages.push({ role: 'user', content: message });

    console.log('Conversation context includes', conversationMessages.length, 'messages');

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
          ...conversationMessages
        ],
        max_tokens: 300,
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
