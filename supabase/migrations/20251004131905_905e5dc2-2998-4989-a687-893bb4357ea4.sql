-- Rollback: Remove all Thandi AI feature tables and dependencies

-- Drop tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS thandi_message_feedback CASCADE;
DROP TABLE IF EXISTS thandi_intent_training CASCADE;
DROP TABLE IF EXISTS thandi_interactions CASCADE;
DROP TABLE IF EXISTS thandi_intents CASCADE;
DROP TABLE IF EXISTS thandi_knowledge_index CASCADE;

-- Drop any Thandi-related storage buckets (if not needed elsewhere)
-- Note: Storage bucket removal requires manual admin action in Supabase dashboard
-- DELETE FROM storage.buckets WHERE id = 'thandi-knowledge';

-- Log the rollback
INSERT INTO system_error_logs (
  message,
  category,
  severity,
  component,
  action,
  details
) VALUES (
  'Thandi AI feature completely rolled back',
  'SYSTEM',
  'INFO',
  'ROLLBACK',
  'THANDI_REMOVAL',
  jsonb_build_object(
    'tables_dropped', ARRAY['thandi_message_feedback', 'thandi_intent_training', 'thandi_interactions', 'thandi_intents', 'thandi_knowledge_index'],
    'timestamp', now()
  )
);