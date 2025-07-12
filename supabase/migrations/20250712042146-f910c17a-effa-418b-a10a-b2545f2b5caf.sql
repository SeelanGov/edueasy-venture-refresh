-- Update admin user's verification status and profile status
UPDATE public.users 
SET id_verified = TRUE, profile_status = 'complete'
WHERE email = 'postman@edueasy.co';