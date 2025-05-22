
-- Create a table to store user feedback on messages
CREATE TABLE IF NOT EXISTS public.thandi_message_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.thandi_interactions(id),
  user_id UUID NOT NULL,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('helpful', 'unhelpful')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_thandi_message_feedback_message_id ON public.thandi_message_feedback(message_id);
CREATE INDEX IF NOT EXISTS idx_thandi_message_feedback_user_id ON public.thandi_message_feedback(user_id);

-- Create a SQL function to get intents with statistics
CREATE OR REPLACE FUNCTION public.get_intents_with_stats()
RETURNS TABLE (
  id UUID,
  intent_name TEXT,
  description TEXT,
  response_template TEXT,
  sample_queries JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  message_count BIGINT,
  avg_confidence FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.intent_name,
    i.description,
    i.response_template,
    i.sample_queries,
    i.created_at,
    i.updated_at,
    COUNT(m.id)::BIGINT as message_count,
    AVG(m.confidence_score)::FLOAT as avg_confidence
  FROM 
    thandi_intents i
  LEFT JOIN 
    thandi_interactions m ON i.id = m.intent_id
  GROUP BY 
    i.id
  ORDER BY 
    i.intent_name ASC;
END;
$$ LANGUAGE plpgsql;
