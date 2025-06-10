
-- Create sponsor_allocations table
CREATE TABLE public.sponsor_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  allocated_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_on TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for sponsor_allocations
ALTER TABLE public.sponsor_allocations ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage all allocations
CREATE POLICY "Admins can manage all sponsor allocations"
  ON public.sponsor_allocations
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Create policy for sponsors to view their own allocations (for future sponsor dashboard)
CREATE POLICY "Sponsors can view their own allocations"
  ON public.sponsor_allocations
  FOR SELECT
  TO authenticated
  USING (
    sponsor_id IN (
      SELECT id FROM public.partners 
      WHERE type = 'sponsor' AND contact_email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

-- Add trigger for updated_at
CREATE TRIGGER update_sponsor_allocations_updated_at
  BEFORE UPDATE ON public.sponsor_allocations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_sponsor_allocations_sponsor_id ON public.sponsor_allocations(sponsor_id);
CREATE INDEX idx_sponsor_allocations_student_id ON public.sponsor_allocations(student_id);
CREATE INDEX idx_sponsor_allocations_status ON public.sponsor_allocations(status);
