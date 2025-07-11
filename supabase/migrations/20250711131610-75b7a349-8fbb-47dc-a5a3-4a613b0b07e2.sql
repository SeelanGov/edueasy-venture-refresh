-- Bootstrap first admin user
-- Use existing user: postman@edueasy.co (b80dc246-570f-42f5-934e-5c9765d7ecd3)

-- Insert admin role into user_roles table
INSERT INTO public.user_roles (user_id, role)
VALUES ('b80dc246-570f-42f5-934e-5c9765d7ecd3', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Update users table to set user_type = 'admin'
UPDATE public.users 
SET user_type = 'admin' 
WHERE id = 'b80dc246-570f-42f5-934e-5c9765d7ecd3';

-- Verify the admin setup
SELECT 
    u.id,
    u.email,
    users.user_type,
    ur.role
FROM auth.users u
LEFT JOIN public.users users ON u.id = users.id
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'postman@edueasy.co';