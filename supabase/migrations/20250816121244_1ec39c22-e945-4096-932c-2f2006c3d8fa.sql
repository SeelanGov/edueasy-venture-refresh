-- Fix remaining SECURITY DEFINER functions missing search_path
ALTER FUNCTION public.create_document_notification() SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_tracking_id() SET search_path = public, pg_temp;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public, pg_temp;
ALTER FUNCTION public.validate_tracking_id_format(text) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_intents_with_stats() SET search_path = public, pg_temp;