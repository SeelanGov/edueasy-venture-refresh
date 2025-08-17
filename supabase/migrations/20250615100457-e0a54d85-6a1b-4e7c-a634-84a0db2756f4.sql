
-- Create partner_inquiries table
CREATE TABLE IF NOT EXISTS public.partner_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_name text NOT NULL,
  institution_type text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  website text,
  student_count text,
  interested_tier text,
  message text,
  status text DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add RLS policies
ALTER TABLE public.partner_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow admins to see all inquiries
CREATE POLICY "Allow admins to view all partner inquiries" ON public.partner_inquiries
  FOR SELECT USING (is_admin());

-- Allow admins to update inquiries
CREATE POLICY "Allow admins to update partner inquiries" ON public.partner_inquiries
  FOR UPDATE USING (is_admin());

-- Allow anyone to insert inquiries (for the public form)
CREATE POLICY "Allow anyone to submit partner inquiries" ON public.partner_inquiries
  FOR INSERT WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_partner_inquiries_updated_at
  BEFORE UPDATE ON public.partner_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
