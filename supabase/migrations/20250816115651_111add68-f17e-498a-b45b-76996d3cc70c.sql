-- Apply normalized permissions for all SECURITY DEFINER functions
revoke all on function public.handle_verification_success(p_user_id uuid, p_email text, p_full_name text, p_national_id text, p_phone_number text) from public; 
grant execute on function public.handle_verification_success(p_user_id uuid, p_email text, p_full_name text, p_national_id text, p_phone_number text) to authenticated;

revoke all on function public.test_rls_policies_with_role(p_role text, p_scenario text) from public; 
grant execute on function public.test_rls_policies_with_role(p_role text, p_scenario text) to authenticated;

revoke all on function public.analyze_rls_policies() from public; 
grant execute on function public.analyze_rls_policies() to authenticated;

revoke all on function public.get_payment_monitoring(limit_count integer) from public; 
grant execute on function public.get_payment_monitoring(limit_count integer) to authenticated;

revoke all on function public.get_payment_method_analytics() from public; 
grant execute on function public.get_payment_method_analytics() to authenticated;

revoke all on function public.handle_new_user() from public; 
grant execute on function public.handle_new_user() to authenticated;

revoke all on function public.decrypt_national_id(encrypted_id bytea, user_requesting uuid) from public; 
grant execute on function public.decrypt_national_id(encrypted_id bytea, user_requesting uuid) to authenticated;

revoke all on function public.activate_user_plan() from public; 
grant execute on function public.activate_user_plan() to authenticated;

revoke all on function public.assign_tracking_id_to_user(p_user_id uuid) from public; 
grant execute on function public.assign_tracking_id_to_user(p_user_id uuid) to authenticated;

revoke all on function public.get_tracking_id_stats() from public; 
grant execute on function public.get_tracking_id_stats() to authenticated;

revoke all on function public.peek_next_tracking_id() from public; 
grant execute on function public.peek_next_tracking_id() to authenticated;

revoke all on function public.generate_email_verification_token(p_user_id uuid) from public; 
grant execute on function public.generate_email_verification_token(p_user_id uuid) to authenticated;

revoke all on function public.verify_email_token(p_token text) from public; 
grant execute on function public.verify_email_token(p_token text) to authenticated;

revoke all on function public.assign_user_role(p_user_id uuid, p_user_type text, p_additional_data jsonb) from public; 
grant execute on function public.assign_user_role(p_user_id uuid, p_user_type text, p_additional_data jsonb) to authenticated;

revoke all on function public.is_admin(user_uuid uuid) from public; 
grant execute on function public.is_admin(user_uuid uuid) to authenticated;

revoke all on function public.track_policy_changes() from public; 
grant execute on function public.track_policy_changes() to authenticated;

revoke all on function public.audit_rls_policies(p_user_id uuid) from public; 
grant execute on function public.audit_rls_policies(p_user_id uuid) to authenticated;

revoke all on function public.belongs_to_user(table_name text, record_id uuid) from public; 
grant execute on function public.belongs_to_user(table_name text, record_id uuid) to authenticated;

revoke all on function public.register_rls_policy(p_table_name text, p_policy_name text, p_policy_type text, p_description text) from public; 
grant execute on function public.register_rls_policy(p_table_name text, p_policy_name text, p_policy_type text, p_description text) to authenticated;