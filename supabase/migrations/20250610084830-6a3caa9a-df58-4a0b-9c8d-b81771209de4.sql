
-- First, extend the partner_type enum to include 'sponsor'
-- This needs to be in a separate transaction from other operations
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'sponsor' AND enumtypid = 'partner_type'::regtype) THEN
        ALTER TYPE partner_type ADD VALUE 'sponsor';
    END IF;
END $$;
