
-- Add additional columns to documents table
ALTER TABLE public.documents
ADD COLUMN IF NOT EXISTS extracted_text TEXT,
ADD COLUMN IF NOT EXISTS verification_confidence DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS verification_details JSONB,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE;

-- Create document verification logs table
CREATE TABLE IF NOT EXISTS public.document_verification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id UUID NOT NULL REFERENCES public.documents(id),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  document_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  verification_method TEXT,
  confidence_score DOUBLE PRECISION,
  verification_details JSONB,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add Row Level Security to verification logs
ALTER TABLE public.document_verification_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own verification logs
CREATE POLICY "Users can view their own document verification logs"
  ON public.document_verification_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow the service role (for edge functions) and users to insert logs
CREATE POLICY "Allow inserting document verification logs"
  ON public.document_verification_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Allow the service role to update logs
CREATE POLICY "Allow updating document verification logs"
  ON public.document_verification_logs
  FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() IS NULL);
