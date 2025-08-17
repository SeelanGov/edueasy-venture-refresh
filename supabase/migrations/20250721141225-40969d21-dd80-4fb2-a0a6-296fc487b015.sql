-- Create test users in auth.users with password 'TestPass123!' for all accounts
-- This creates proper auth credentials and syncs with public.users and user_roles

-- Admin user
INSERT INTO auth.users (
  id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  created_at, 
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'admin@edueasy.co',
  crypt('TestPass123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"email": "admin@edueasy.co", "full_name": "Admin User"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (id) DO UPDATE SET
  encrypted_password = crypt('TestPass123!', gen_salt('bf')),
  email_confirmed_at = now(),
  updated_at = now();

-- Update admin user in public.users
UPDATE public.users SET
  user_type = 'admin',
  id_verified = true,
  profile_status = 'verified',
  current_plan = 'enterprise'
WHERE id = 'a0000000-0000-0000-0000-000000000001'::uuid;

-- Ensure admin role exists
INSERT INTO public.user_roles (user_id, role)
VALUES ('a0000000-0000-0000-0000-000000000001'::uuid, 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Student user
INSERT INTO auth.users (
  id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  created_at, 
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  'd0000000-0000-0000-0000-000000000004'::uuid,
  'student@edueasy.co',
  crypt('TestPass123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"email": "student@edueasy.co", "full_name": "Student User"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (id) DO UPDATE SET
  encrypted_password = crypt('TestPass123!', gen_salt('bf')),
  email_confirmed_at = now(),
  updated_at = now();

-- Update student user in public.users
UPDATE public.users SET
  user_type = 'student',
  id_verified = true,
  profile_status = 'verified',
  current_plan = 'basic'
WHERE id = 'd0000000-0000-0000-0000-000000000004'::uuid;

-- Sponsor user
INSERT INTO auth.users (
  id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  created_at, 
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  'b0000000-0000-0000-0000-000000000002'::uuid,
  'sponsor@edueasy.co',
  crypt('TestPass123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"email": "sponsor@edueasy.co", "full_name": "Sponsor User"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (id) DO UPDATE SET
  encrypted_password = crypt('TestPass123!', gen_salt('bf')),
  email_confirmed_at = now(),
  updated_at = now();

-- Update sponsor user in public.users
UPDATE public.users SET
  user_type = 'sponsor',
  id_verified = true,
  profile_status = 'verified',
  current_plan = 'premium'
WHERE id = 'b0000000-0000-0000-0000-000000000002'::uuid;

-- Institution user
INSERT INTO auth.users (
  id, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  created_at, 
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  'c0000000-0000-0000-0000-000000000003'::uuid,
  'institution@edueasy.co',
  crypt('TestPass123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"email": "institution@edueasy.co", "full_name": "Institution User"}',
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (id) DO UPDATE SET
  encrypted_password = crypt('TestPass123!', gen_salt('bf')),
  email_confirmed_at = now(),
  updated_at = now();

-- Update institution user in public.users
UPDATE public.users SET
  user_type = 'institution',
  id_verified = true,
  profile_status = 'verified',
  current_plan = 'premium'
WHERE id = 'c0000000-0000-0000-0000-000000000003'::uuid;