-- Ensure the admin user has user_type set properly
UPDATE public.users 
SET user_type = 'admin'
WHERE id = 'b80dc246-570f-42f5-934e-5c9765d7ecd3';

-- Also ensure the other user has a default user_type
UPDATE public.users 
SET user_type = 'student'
WHERE id = 'a913ace3-e4cc-4da7-9b95-42347464b41a' AND user_type IS NULL;