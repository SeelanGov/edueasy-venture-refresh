
-- 1. Add 'sponsor' to the partner_type enum if not present
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'partner_type') THEN
    CREATE TYPE partner_type AS ENUM ('institution', 'sponsor');
  ELSIF NOT EXISTS (SELECT 1 FROM unnest(enum_range(NULL::partner_type)) WHERE unnest = 'sponsor') THEN
    ALTER TYPE partner_type ADD VALUE 'sponsor';
  END IF;
END$$;

-- 2. Create sponsor_allocations table (if not exists)
CREATE TABLE IF NOT EXISTS public.sponsor_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id uuid NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  student_id uuid NOT NULL,
  allocated_on timestamp with time zone NOT NULL DEFAULT now(),
  expires_on timestamp with time zone,
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  plan text,
  notes text,
  CONSTRAINT fk_student UNIQUE (student_id, sponsor_id) -- Each sponsor can only allocate a student once
);

-- 3. Add RLS (Row-Level Security)
ALTER TABLE public.sponsor_allocations ENABLE ROW LEVEL SECURITY;

-- Allow admin users full access
CREATE POLICY "Admins can fully manage sponsor allocations"
  ON public.sponsor_allocations
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Allow sponsors to read their allocations
CREATE POLICY "Sponsors can view their allocations"
  ON public.sponsor_allocations
  FOR SELECT
  USING (
    sponsor_id IN (
      SELECT id FROM partners WHERE created_by = auth.uid() AND type = 'sponsor'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sponsor_allocations_sponsor_id ON sponsor_allocations(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_sponsor_allocations_student_id ON sponsor_allocations(student_id);

-- 4. Make sure partners table has a 'type' column set to 'sponsor' for sponsors (handled in UI/process)
-- (No action here, as migration is for schema)
