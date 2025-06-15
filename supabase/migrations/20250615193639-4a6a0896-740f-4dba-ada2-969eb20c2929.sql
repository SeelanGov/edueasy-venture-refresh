
-- 1. Table for individual or org sponsors (not partners)
CREATE TABLE public.sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  organization_type TEXT, -- e.g. 'individual', 'company', 'ngo', 'government'
  verified_status TEXT NOT NULL DEFAULT 'pending', -- pending, verified, rejected
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  password_hash TEXT -- for auth (for PoC/email login only)
);

-- 2. Sponsorship applications: student requests to be sponsored for their application fee
CREATE TABLE public.sponsor_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id),
  application_id UUID NOT NULL, -- link to actual application
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sponsored, rejected
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  requested_amount NUMERIC NOT NULL,
  purpose TEXT DEFAULT 'application_fee'
);

-- 3. Table to record actual connections between sponsors and students
CREATE TABLE public.application_fee_sponsorships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID NOT NULL REFERENCES sponsors(id),
  sponsor_application_id UUID NOT NULL REFERENCES sponsor_applications(id),
  sponsored_amount NUMERIC NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed
  payment_reference TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Row Level Security (RLS) Policies

-- Sponsors can view their own record
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sponsors can view self" ON public.sponsors
  FOR SELECT USING (id = auth.uid());

-- Sponsors can INSERT and UPDATE their own record (for registration/edit)
CREATE POLICY "Sponsors can create self" ON public.sponsors
  FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Sponsors can update self" ON public.sponsors
  FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Students can create/view their own sponsor applications
ALTER TABLE public.sponsor_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can create sponsorship applications" ON public.sponsor_applications
  FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students can view their own sponsorship applications" ON public.sponsor_applications
  FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can update their own sponsorship applications" ON public.sponsor_applications
  FOR UPDATE USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());
CREATE POLICY "Students can delete their own sponsorship applications" ON public.sponsor_applications
  FOR DELETE USING (student_id = auth.uid());

-- Sponsors can only view sponsorships they are part of; students see sponsorships for their applications
ALTER TABLE public.application_fee_sponsorships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sponsors can view their sponsorships" ON public.application_fee_sponsorships
  FOR SELECT USING (
    sponsor_id = auth.uid()
    OR sponsor_application_id IN (
      SELECT id FROM sponsor_applications WHERE student_id = auth.uid()
    )
  );
-- Only sponsors can insert/modify sponsorships for themselves
CREATE POLICY "Sponsor can insert their own sponsorships" ON public.application_fee_sponsorships
  FOR INSERT WITH CHECK (sponsor_id = auth.uid());
CREATE POLICY "Sponsor can update their own sponsorships" ON public.application_fee_sponsorships
  FOR UPDATE USING (sponsor_id = auth.uid()) WITH CHECK (sponsor_id = auth.uid());

-- 5. Indexes for performance
CREATE INDEX idx_sponsor_applications_student_id ON sponsor_applications(student_id);
CREATE INDEX idx_sponsorships_sponsor_id ON application_fee_sponsorships(sponsor_id);

