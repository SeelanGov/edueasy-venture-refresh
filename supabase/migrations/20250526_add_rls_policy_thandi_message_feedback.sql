-- Enable Row Level Security (RLS) for the thandi_message_feedback table
ALTER TABLE public.thandi_message_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to view their own feedback
CREATE POLICY "Users can view their own feedback"
  ON public.thandi_message_feedback
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Allow users to insert feedback for their own messages
CREATE POLICY "Users can insert feedback for their own messages"
  ON public.thandi_message_feedback
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Restrict updates and deletes to admins only
CREATE POLICY "Admins can modify feedback"
  ON public.thandi_message_feedback
  FOR ALL
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- Test the policies
COMMENT ON POLICY "Users can view their own feedback" ON public.thandi_message_feedback IS 'Allows users to view their own feedback';
COMMENT ON POLICY "Users can insert feedback for their own messages" ON public.thandi_message_feedback IS 'Allows users to insert feedback for their own messages';
COMMENT ON POLICY "Admins can modify feedback" ON public.thandi_message_feedback IS 'Restricts updates and deletes to admins only';
