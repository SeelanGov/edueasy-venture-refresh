-- Insert missing users from auth into public.users table
INSERT INTO public.users (id, email, user_type, tier_level, current_plan)
SELECT 
    au.id,
    au.email,
    CASE 
        WHEN ur.role = 'admin' THEN 'admin'
        ELSE 'student'
    END as user_type,
    'free' as tier_level,
    'free' as current_plan
FROM auth.users au
LEFT JOIN public.user_roles ur ON au.id = ur.user_id
WHERE au.id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO UPDATE SET
    user_type = EXCLUDED.user_type;