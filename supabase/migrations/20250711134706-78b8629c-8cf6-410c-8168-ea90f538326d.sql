-- PHASE 1: Enable RLS Protection on Sensitive Tables

-- ✅ Protect email_verification_logs
ALTER TABLE public.email_verification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users access their own email verification logs"
ON public.email_verification_logs
FOR SELECT USING (user_id = auth.uid());

-- ✅ Protect thandi_message_feedback (applying missing migration)
ALTER TABLE public.thandi_message_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own feedback"
ON public.thandi_message_feedback
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert feedback for their own messages"
ON public.thandi_message_feedback
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can modify feedback"
ON public.thandi_message_feedback
FOR ALL USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));