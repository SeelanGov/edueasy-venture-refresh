-- Step 1: Add missing columns to users table for tier gating and POPIA compliance
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS tier_level TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS consent_given BOOLEAN DEFAULT false;

-- Step 2: Create auto-user registration trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, tier_level, consent_given, current_plan)
  VALUES (NEW.id, NEW.email, 'free', false, 'free')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();