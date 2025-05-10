
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
    const { userId, userMessage, chatHistory, userData, applicationsData } = await req.json();
    
    if (!userId || !userMessage) {
      throw new Error('Missing required parameters: userId or userMessage');
    }

    console.log(`Processing request for user ${userId}`);
    
    // Get the user's last 10 chat messages for context
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get training data to improve intent detection
    const { data: trainingData, error: trainingError } = await supabase
      .from('thandi_intent_training')
      .select(`
        message_id,
        intent_id,
        thandi_interactions!message_id (
          message
        ),
        thandi_intents!intent_id (
          intent_name
        )
      `)
      .limit(100);
    
    if (trainingError) {
      console.error('Error fetching training data:', trainingError);
    }

    // Format training examples for the prompt
    let trainingExamples = "";
    if (trainingData && trainingData.length > 0) {
      trainingExamples = "Here are some examples of classified messages:\n";
      trainingData.slice(0, 20).forEach((item: any) => {
        if (item.thandi_interactions && item.thandi_intents) {
          trainingExamples += `Message: "${item.thandi_interactions.message}"\nIntent: ${item.thandi_intents.intent_name}\n\n`;
        }
      });
    }
    
    const intentPrompt = `
      ${trainingExamples}
      
      Analyze the following user message and identify which of these intents it matches best:
      1. document_status: User asking about document verification status
      2. program_selection: User asking about program selection or details
      3. application_deadline: User asking about application deadlines
      4. financial_aid: User asking about financial aid, scholarships, or funding
      5. general_greeting: User is greeting or starting a conversation
      6. general_question: Any other type of question
      
      User message: "${userMessage}"
      
      Respond with just the intent name, e.g. "document_status", "program_selection", etc.
    `;
    
    // First, detect the user's intent
    const intentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: intentPrompt }],
        temperature: 0.3,
        max_tokens: 20,
      }),
    });
    
    const intentData = await intentResponse.json();
    const detectedIntent = intentData.choices[0].message.content.trim().toLowerCase();
    console.log(`Detected intent: ${detectedIntent}`);
    
    // Get the matching intent from the database if available
    const { data: intents } = await supabase
      .from('thandi_intents')
      .select('*')
      .ilike('intent_name', detectedIntent)
      .limit(1);
    
    const matchedIntent = intents && intents.length > 0 ? intents[0] : null;
    let intentId = matchedIntent?.id || null;
    
    // Calculate confidence score based on intent classification
    const confidenceScore = matchedIntent ? 0.9 : 0.5;  // Simplified confidence scoring
    
    // Build system prompt with application context
    let systemPrompt = `
      You are Thandi, an educational application assistant for university/college applications in South Africa.
      You are friendly, helpful, concise, and accurate. 
      Your primary role is to help students with their applications, document verification, and answering questions about programs and deadlines.
      
      Important facts about the user:
      - Name: ${userData?.full_name || 'Not provided'}
      - Email: ${userData?.email || 'Not provided'}
      - Profile Status: ${userData?.profile_status || 'incomplete'}
      
      ${applicationsData && applicationsData.length > 0 ? `
        The user has ${applicationsData.length} application(s):
        ${applicationsData.map((app: any) => `
          - Institution: ${app.institutions?.name || 'Unknown'}
          - Program: ${app.programs?.name || 'Unknown'}
          - Status: ${app.status || 'Unknown'}
          - Documents: ${app.documents ? app.documents.length : 0} uploaded
        `).join('\n')}
      ` : 'The user has no active applications yet.'}
      
      Use the above information to provide personalized responses.
      Keep your responses concise (ideally under 150 words) unless the user asks for detailed information.
      Never make up information about specific programs, universities or documents that was not provided in the context.
      If you don't know something, suggest that the user check the specific program or institution website.
    `;
    
    // Add intent-specific instructions to the prompt
    if (matchedIntent) {
      systemPrompt += `\nThe user's question is related to: ${matchedIntent.description}`;
      if (matchedIntent.response_template) {
        systemPrompt += `\nYou can use this template for guidance: ${matchedIntent.response_template}`;
      }
    }
    
    // Format chat history for the AI context
    const formattedChatHistory = chatHistory.map((msg: any) => ({
      role: msg.is_user ? 'user' : 'assistant',
      content: msg.message,
    }));
    
    // Get AI response
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...formattedChatHistory.slice(-5), // Include last 5 messages for context
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    console.log(`Generated response of ${aiResponse.length} characters`);
    
    // Check if confidence is low
    const lowConfidence = confidenceScore < 0.7;
    
    // Insert user message to database
    const { data: userMessageRecord, error: userMsgError } = await supabase
      .from('thandi_interactions')
      .insert([{
        user_id: userId,
        message: userMessage,
        is_user: true,
        intent_id: intentId,
        confidence_score: confidenceScore,
        low_confidence: lowConfidence,
        response_type: 'ai'
      }])
      .select('id')
      .single();
    
    if (userMsgError) {
      throw new Error(`Error saving user message: ${userMsgError.message}`);
    }
    
    // Insert AI response to database
    const { error: aiMsgError } = await supabase
      .from('thandi_interactions')
      .insert([{
        user_id: userId,
        message: aiResponse,
        is_user: false,
        intent_id: intentId,
        confidence_score: confidenceScore,
        low_confidence: lowConfidence,
        response_type: 'ai'
      }]);
    
    if (aiMsgError) {
      throw new Error(`Error saving AI response: ${aiMsgError.message}`);
    }
    
    return new Response(JSON.stringify({ 
      response: aiResponse,
      intent: detectedIntent,
      confidence_score: confidenceScore,
      low_confidence: lowConfidence
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Error in thandi-openai function:', error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
