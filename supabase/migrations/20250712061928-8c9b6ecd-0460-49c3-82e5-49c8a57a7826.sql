-- Fix RLS policies for application_fee_sponsorships to use proper sponsor relationship

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Sponsor can insert their own sponsorships" ON application_fee_sponsorships;
DROP POLICY IF EXISTS "Sponsor can update their own sponsorships" ON application_fee_sponsorships;
DROP POLICY IF EXISTS "Sponsors can view their sponsorships" ON application_fee_sponsorships;

-- Create correct policies that reference sponsors table properly
CREATE POLICY "Sponsors can insert their own sponsorships" 
ON application_fee_sponsorships 
FOR INSERT 
WITH CHECK (
  sponsor_id IN (
    SELECT id FROM sponsors WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Sponsors can update their own sponsorships" 
ON application_fee_sponsorships 
FOR UPDATE 
USING (
  sponsor_id IN (
    SELECT id FROM sponsors WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Sponsors can view their sponsorships" 
ON application_fee_sponsorships 
FOR SELECT 
USING (
  sponsor_id IN (
    SELECT id FROM sponsors WHERE user_id = auth.uid()
  ) OR 
  sponsor_application_id IN (
    SELECT id FROM sponsor_applications WHERE student_id = auth.uid()
  )
);