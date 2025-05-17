// index.js
// Lambda handler for Thandi with robust logging and error handling
const { prompts } = require('./promptTemplates');
const { supabase } = require('./supabaseClient');

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event));
  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { type, user, question } = body;
    console.log('Request type:', type);
    let prompt;
    if (type === 'documentHelp') {
      prompt = prompts.documentHelp(user);
    } else if (type === 'applicationStatus') {
      prompt = prompts.applicationStatus(user);
    } else if (type === 'general') {
      prompt = prompts.general(question);
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'INVALID_TYPE', message: 'Unknown prompt type' })
      };
    }
    // Example: fetch user data from Supabase
    let userData = null;
    if (user && user.id) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) {
        console.error('Supabase fetch error:', error);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'SUPABASE_FETCH_ERROR', message: error.message })
        };
      }
      userData = data;
      console.log('Fetched user data:', userData);
    }
    // TODO: Call OpenAI or other LLM here with the prompt
    // const aiResponse = await callOpenAI(prompt);
    // For now, just echo the prompt
    return {
      statusCode: 200,
      body: JSON.stringify({ prompt, userData })
    };
  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'LAMBDA_ERROR', message: error.message })
    };
  }
};
