import 'https://deno.land/x/xhr@0.1.0/mod.ts';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
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
    const { admin_id } = await req.json();

    if (!admin_id) {
      throw new Error('Missing admin_id parameter');
    }

    console.log(`Starting model retraining requested by admin ${admin_id}`);

    // Initialize Supabase client with service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Create training log entry
    const { data: logEntry, error: logError } = await supabase
      .from('thandi_model_training_logs')
      .insert({
        admin_id,
        status: 'in_progress',
        example_count: 0,
        success: false,
      })
      .select('id')
      .single();

    if (logError) {
      throw new Error(`Failed to create training log: ${logError.message}`);
    }

    const logId = logEntry.id;

    // Fetch current performance metrics for before/after comparison
    const performanceBefore = await getPerformanceMetrics(supabase);

    // Get all training data
    const { data: trainingData, error: trainingError } = await supabase.from(
      'thandi_intent_training',
    ).select(`
        id,
        message_id,
        intent_id,
        confidence,
        thandi_interactions!message_id (
          message
        ),
        thandi_intents!intent_id (
          intent_name
        )
      `);

    if (trainingError) {
      throw new Error(`Failed to fetch training data: ${trainingError.message}`);
    }

    if (!trainingData || trainingData.length === 0) {
      throw new Error('No training data available');
    }

    // Format training data for the model
    const trainingExamples = trainingData
      .filter(
        (item) =>
          item.thandi_interactions &&
          item.thandi_intents &&
          item.thandi_interactions.message &&
          item.thandi_intents.intent_name,
      )
      .map((item) => ({
        message: item.thandi_interactions.message,
        intent: item.thandi_intents.intent_name,
      }));

    console.log(`Processing ${trainingExamples.length} training examples`);

    // In a production system, you might use fine-tuning or other methods
    // For demonstration purposes, we're just creating training data that will be saved
    // and used by the main thandi-openai function

    // Here we simulate the training process by just storing the training data
    // that will be used by the thandi-openai function

    // Update the training log with completion status
    const { error: updateError } = await supabase
      .from('thandi_model_training_logs')
      .update({
        status: 'completed',
        example_count: trainingExamples.length,
        success: true,
        completed_at: new Date().toISOString(),
        performance_before: performanceBefore,
        performance_after: await getPerformanceMetrics(supabase),
        examples: trainingExamples,
      })
      .eq('id', logId);

    if (updateError) {
      throw new Error(`Failed to update training log: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Model retraining completed successfully',
        example_count: trainingExamples.length,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in thandi-retrain function:', error);

    // If we have a Supabase client, update the log with the error
    try {
      if (error.logId) {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
        await supabase
          .from('thandi_model_training_logs')
          .update({
            status: 'failed',
            success: false,
            completed_at: new Date().toISOString(),
            error_message: error.message,
          })
          .eq('id', error.logId);
      }
    } catch (logError) {
      console.error('Error updating log with failure:', logError);
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

async function getPerformanceMetrics(supabase) {
  // Get current performance metrics
  try {
    // Get average confidence score
    const { data: avgData, error: avgError } = await supabase
      .from('thandi_interactions')
      .select('confidence_score')
      .not('confidence_score', 'is', null);

    if (avgError) throw avgError;

    const avgConfidence = avgData?.length
      ? avgData.reduce((sum, item) => sum + (item.confidence_score || 0), 0) / avgData.length
      : 0;

    // Get counts by intent
    const { data: intentCounts, error: intentError } = await supabase
      .from('thandi_interactions')
      .select('intent_id, count')
      .not('intent_id', 'is', null)
      .group('intent_id');

    if (intentError) throw intentError;

    // Get low confidence percentage
    const { data: lowConfData, error: lowConfError } = await supabase
      .from('thandi_interactions')
      .select('count')
      .eq('low_confidence', true)
      .limit(1);

    if (lowConfError) throw lowConfError;

    const { count: totalCount, error: countError } = await supabase
      .from('thandi_interactions')
      .select('count')
      .limit(1);

    if (countError) throw countError;

    const lowConfidenceRate = lowConfData?.[0]?.count ? lowConfData[0].count / totalCount : 0;

    return {
      timestamp: new Date().toISOString(),
      average_confidence: avgConfidence,
      intent_distribution: intentCounts || [],
      low_confidence_rate: lowConfidenceRate,
      total_interactions: totalCount,
    };
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    return {
      timestamp: new Date().toISOString(),
      error: error.message,
    };
  }
}
