// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  try {
    const { user_id, message } = await req.json();

    // 1. Extract keywords (basic split, filter short words)
    const queryKeywords = message
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 2);
    console.log("Extracted keywords:", queryKeywords);

    // 2. Enforce 5-query/day rate limit per user
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: recentQueries, error: rateError } = await supabase
      .from("thandi_interactions")
      .select("id")
      .eq("user_id", user_id)
      .eq("is_user", true)
      .gte("created_at", since);

    if (rateError) {
      console.error("Rate limit check error:", rateError);
    }
    if ((recentQueries?.length || 0) >= 5) {
      console.log("Rate limit enforced for user:", user_id);
      return new Response(
        JSON.stringify({ error: "Daily limit reached (5 queries/24h)" }),
        { status: 429 }
      );
    }

    // 3. Query thandi_knowledge_index for matching modules
    const { data: modules, error: modErr } = await supabase
      .from("thandi_knowledge_index")
      .select("*")
      .filter("tags", "ov", `{${queryKeywords.join(",")}}`);

    if (modErr) {
      console.error("Knowledge index query error:", modErr);
      return new Response(
        JSON.stringify({ error: "Knowledge index query failed" }),
        { status: 500 }
      );
    }

    if (!modules || modules.length === 0) {
      console.log("No matching modules found for keywords:", queryKeywords);
      // 8. Log the query even if no match
      await supabase.from("thandi_interactions").insert({ user_id, message, is_user: true });
      return new Response(
        JSON.stringify({
          reply:
            "I couldn't find anything useful. Visit https://edueasy.co.za/resources for more help."
        })
      );
    }

    console.log("Matched modules:", modules.map((m) => m.module));

    // 4. For each match, fetch the .json file from storage
    const contentSnippets = [];
    for (const module of modules) {
      const path = `${module.module}/${module.json_path}`;
      const { data: fileRes, error: fileErr } = await supabase.storage
        .from("thandi-knowledge")
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
          (JSON.stringify(json).slice(0, 200) + "...");
        const bullets =
          Array.isArray(json.bullets) && json.bullets.length
            ? "\n- " + json.bullets.join("\n- ")
            : "";
        const snippet = `Module: ${module.title}\n${summary}${bullets}`;
        contentSnippets.push(snippet);
        console.log(`Fetched and parsed: ${path}`);
      } catch (e) {
        console.error(`Error parsing JSON from ${path}:`, e);
      }
    }

    // 6. Build system prompt
    const systemPrompt = `You are Thandi, EduEasy’s AI assistant. Use the following educational module content to answer the user's question.\n\n${contentSnippets.join("\n\n")}`;
    console.log("System prompt constructed:\n", systemPrompt);

    // 7. Log the query
    await supabase.from("thandi_interactions").insert({ user_id, message, is_user: true });

    // 6. Return a hardcoded GPT-style mock response
    const mockResponse = {
      data: {
        choices: [
          {
            message: {
              content:
                "This is a mocked Thandi response based on retrieved knowledge."
            }
          }
        ]
      }
    };

    return new Response(
      JSON.stringify({
        reply: mockResponse.data.choices[0].message.content,
        context: contentSnippets
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Unhandled error in edge function:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
});