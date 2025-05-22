
-- Function to log system errors
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

-- Function to count critical errors
CREATE OR REPLACE FUNCTION public.count_critical_errors()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO v_count
  FROM public.system_error_logs
  WHERE severity = 'critical'
  AND is_resolved = false;
  
  RETURN v_count;
END;
$$;

-- Function to get error logs
CREATE OR REPLACE FUNCTION public.get_error_logs(
  critical_only BOOLEAN DEFAULT false,
  limit_count INTEGER DEFAULT 20
)
RETURNS SETOF public.system_error_logs
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.system_error_logs
  WHERE (NOT critical_only OR severity = 'critical')
  AND is_resolved = false
  ORDER BY occurred_at DESC
  LIMIT limit_count;
END;
$$;

-- Function to resolve an error log
CREATE OR REPLACE FUNCTION public.resolve_error_log(
  error_id UUID,
  resolver_id UUID,
  resolution_notes TEXT DEFAULT 'Marked as resolved'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.system_error_logs
  SET 
    is_resolved = true,
    resolved_at = NOW(),
    resolved_by = resolver_id,
    resolution_notes = resolution_notes
  WHERE id = error_id;
  
  RETURN FOUND;
END;
$$;
