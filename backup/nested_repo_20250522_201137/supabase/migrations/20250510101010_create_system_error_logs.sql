
-- Create error logs table
CREATE TABLE IF NOT EXISTS public.system_error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  component VARCHAR(100),
  action VARCHAR(100),
  user_id UUID,
  details JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID,
  resolution_notes TEXT,
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL,
  CONSTRAINT fk_resolver FOREIGN KEY (resolved_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create index on severity for filtering
CREATE INDEX idx_error_logs_severity ON public.system_error_logs(severity);

-- Create index on is_resolved for filtering
CREATE INDEX idx_error_logs_resolved ON public.system_error_logs(is_resolved);

-- Create index on user_id for filtering
CREATE INDEX idx_error_logs_user_id ON public.system_error_logs(user_id);

-- Set up Row Level Security
ALTER TABLE public.system_error_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view error logs
CREATE POLICY "Admins can view all error logs" 
  ON public.system_error_logs 
  FOR SELECT 
  USING (auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  ));

-- Only admins can update error logs (for resolution)
CREATE POLICY "Admins can update error logs" 
  ON public.system_error_logs 
  FOR UPDATE 
  USING (auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  ));

-- Only admins can insert error logs directly
CREATE POLICY "Admins can insert error logs" 
  ON public.system_error_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  ));

-- Users can insert their own error logs
CREATE POLICY "Users can insert their own error logs" 
  ON public.system_error_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create real-time notifications for critical errors
CREATE OR REPLACE FUNCTION notify_admin_on_critical_error()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.severity = 'critical' AND NOT NEW.is_resolved THEN
    -- Insert notification for all admins
    INSERT INTO public.notifications (
      user_id,
      title,
      message,
      notification_type
    )
    SELECT 
      user_id,
      'Critical System Error',
      'A critical system error has occurred: ' || NEW.message,
      'system'
    FROM 
      public.user_roles
    WHERE 
      role = 'admin';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for admin notifications
CREATE TRIGGER trigger_critical_error_notification
AFTER INSERT ON public.system_error_logs
FOR EACH ROW
EXECUTE FUNCTION notify_admin_on_critical_error();

-- Add error logging functions
CREATE OR REPLACE FUNCTION public.log_system_error(
  p_message TEXT,
  p_category VARCHAR(50),
  p_severity VARCHAR(20),
  p_component VARCHAR(100) DEFAULT NULL,
  p_action VARCHAR(100) DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_error_id UUID;
BEGIN
  INSERT INTO public.system_error_logs (
    message,
    category,
    severity,
    component,
    action,
    user_id,
    details,
    occurred_at
  ) VALUES (
    p_message,
    p_category,
    p_severity,
    p_component,
    p_action,
    p_user_id,
    p_details,
    NOW()
  )
  RETURNING id INTO v_error_id;
  
  RETURN v_error_id;
END;
$$;
