-- Create test users for all roles
-- First, create admin test user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'admin@edueasy.co',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"email": "admin@edueasy.co"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Create admin user in public.users
INSERT INTO public.users (id, email, full_name, user_type, id_verified, current_plan, profile_status)
VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'admin@edueasy.co',
  'Admin User',
  'admin',
  true,
  'enterprise',
  'verified'
) ON CONFLICT (id) DO UPDATE SET
  user_type = 'admin',
  id_verified = true,
  profile_status = 'verified';

-- Create admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('a0000000-0000-0000-0000-000000000001'::uuid, 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Create sponsor test user  
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
VALUES (
  'b0000000-0000-0000-0000-000000000002'::uuid,
  'sponsor@edueasy.co',
  crypt('sponsor123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"email": "sponsor@edueasy.co"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Create sponsor user in public.users
INSERT INTO public.users (id, email, full_name, user_type, id_verified, current_plan, profile_status)
VALUES (
  'b0000000-0000-0000-0000-000000000002'::uuid,
  'sponsor@edueasy.co',
  'Sponsor User',
  'sponsor',
  true,
  'premium',
  'verified'
) ON CONFLICT (id) DO UPDATE SET
  user_type = 'sponsor',
  id_verified = true,
  profile_status = 'verified';

-- Create sponsor record
INSERT INTO public.sponsors (id, user_id, email, name, organization_type, verified_status)
VALUES (
  'b0000000-0000-0000-0000-000000000002'::uuid,
  'b0000000-0000-0000-0000-000000000002'::uuid,
  'sponsor@edueasy.co',
  'Test Sponsor Organization',
  'corporate',
  'verified'
) ON CONFLICT (id) DO NOTHING;

-- Create institution test user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
VALUES (
  'c0000000-0000-0000-0000-000000000003'::uuid,
  'institution@edueasy.co',
  crypt('institution123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"email": "institution@edueasy.co"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Create institution user in public.users
INSERT INTO public.users (id, email, full_name, user_type, id_verified, current_plan, profile_status)
VALUES (
  'c0000000-0000-0000-0000-000000000003'::uuid,
  'institution@edueasy.co',
  'Institution User',
  'institution',
  true,
  'premium',
  'verified'
) ON CONFLICT (id) DO UPDATE SET
  user_type = 'institution',
  id_verified = true,
  profile_status = 'verified';

-- Create institution record
INSERT INTO public.institutions (id, user_id, name, type, email, active)
VALUES (
  'c0000000-0000-0000-0000-000000000003'::uuid,
  'c0000000-0000-0000-0000-000000000003'::uuid,
  'Test University',
  'university',
  'institution@edueasy.co',
  true
) ON CONFLICT (id) DO NOTHING;

-- Create student test user (update existing if exists)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
VALUES (
  'd0000000-0000-0000-0000-000000000004'::uuid,
  'student@edueasy.co',
  crypt('student123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"email": "student@edueasy.co"}',
  false,
  'authenticated'
) ON CONFLICT (id) DO NOTHING;

-- Create student user in public.users
INSERT INTO public.users (id, email, full_name, user_type, id_verified, current_plan, profile_status)
VALUES (
  'd0000000-0000-0000-0000-000000000004'::uuid,
  'student@edueasy.co',
  'Student User',
  'student',
  true,
  'basic',
  'verified'
) ON CONFLICT (id) DO UPDATE SET
  user_type = 'student',
  id_verified = true,
  profile_status = 'verified';