
-- Create a table for tracking model training runs
CREATE TABLE IF NOT EXISTS public.thandi_model_training_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMPTZ,
  example_count INTEGER DEFAULT 0,
  success BOOLEAN DEFAULT false,
  performance_before JSONB,
  performance_after JSONB,
  error_message TEXT,
  examples JSONB
);

-- Add Row Level Security
ALTER TABLE public.thandi_model_training_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for selecting records
CREATE POLICY "Admins can view training logs" 
  ON public.thandi_model_training_logs 
  FOR SELECT 
  USING (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'));

-- Create policy for inserting records
CREATE POLICY "Admins can create training logs" 
  ON public.thandi_model_training_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'));

-- Create policy for updating records
CREATE POLICY "Admins can update training logs" 
  ON public.thandi_model_training_logs 
  FOR UPDATE 
  USING (auth.uid() IN (SELECT user_id FROM public.user_roles WHERE role = 'admin'));

-- Index on admin_id
CREATE INDEX IF NOT EXISTS idx_thandi_model_training_logs_admin_id ON public.thandi_model_training_logs(admin_id);

-- Index on created_at for chronological queries
CREATE INDEX IF NOT EXISTS idx_thandi_model_training_logs_created_at ON public.thandi_model_training_logs(created_at);

-- Index on success for filtering successful runs
CREATE INDEX IF NOT EXISTS idx_thandi_model_training_logs_success ON public.thandi_model_training_logs(success);
