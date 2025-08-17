-- Apply search_path to all remaining SECURITY DEFINER functions
ALTER FUNCTION public.decrypt_national_id(encrypted_id bytea, user_requesting uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.activate_user_plan() SET search_path = public, pg_temp;
ALTER FUNCTION public.assign_tracking_id_to_user(p_user_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_tracking_id_stats() SET search_path = public, pg_temp;
ALTER FUNCTION public.peek_next_tracking_id() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_verification_success(p_user_id uuid, p_email text, p_full_name text, p_national_id text, p_phone_number text) SET search_path = public, pg_temp;
ALTER FUNCTION public.generate_email_verification_token(p_user_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.verify_email_token(p_token text) SET search_path = public, pg_temp;
ALTER FUNCTION public.test_rls_policies_with_role(p_role text, p_scenario text) SET search_path = public, pg_temp;
ALTER FUNCTION public.analyze_rls_policies() SET search_path = public, pg_temp;
ALTER FUNCTION public.handle_new_user() SET search_path = public, pg_temp;
ALTER FUNCTION public.assign_user_role(p_user_id uuid, p_user_type text, p_additional_data jsonb) SET search_path = public, pg_temp;
ALTER FUNCTION public.is_admin(user_uuid uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.belongs_to_user(table_name text, record_id uuid) SET search_path = public, pg_temp;
ALTER FUNCTION public.register_rls_policy(p_table_name text, p_policy_name text, p_policy_type text, p_description text) SET search_path = public, pg_temp;
ALTER FUNCTION public.track_policy_changes() SET search_path = public, pg_temp;
ALTER FUNCTION public.audit_rls_policies(p_user_id uuid) SET search_path = public, pg_temp;