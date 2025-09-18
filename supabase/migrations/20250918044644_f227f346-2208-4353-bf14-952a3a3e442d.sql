-- First, create a proper auth user for the admin
-- Note: We'll insert directly into auth.users (this is for setup purposes only)

-- Create the admin auth user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'silasplayx64@gmail.com',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Update the admin record to link to the auth user
UPDATE public.admins 
SET user_id = (
  SELECT id FROM auth.users WHERE email = 'silasplayx64@gmail.com'
)
WHERE email = 'silasplayx64@gmail.com';

-- Create admin record if it doesn't exist
INSERT INTO public.admins (
  user_id,
  staff_id,
  first_name,
  last_name,
  email,
  role,
  department
) 
SELECT 
  au.id,
  'ADMIN001',
  'Admin',
  'User',
  'silasplayx64@gmail.com',
  'admin',
  'Computer Science'
FROM auth.users au 
WHERE au.email = 'silasplayx64@gmail.com'
AND NOT EXISTS (
  SELECT 1 FROM public.admins WHERE email = 'silasplayx64@gmail.com'
);

-- Also ensure the default admin exists
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@plasu.edu.ng',
  crypt('123456', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Create admin record for default admin
INSERT INTO public.admins (
  user_id,
  staff_id,
  first_name,
  last_name,
  email,
  role,
  department
) 
SELECT 
  au.id,
  'ADMIN000',
  'Default',
  'Admin',
  'admin@plasu.edu.ng',
  'admin',
  'Computer Science'
FROM auth.users au 
WHERE au.email = 'admin@plasu.edu.ng'
AND NOT EXISTS (
  SELECT 1 FROM public.admins WHERE email = 'admin@plasu.edu.ng'
);

-- Update existing admin record to link to auth user
UPDATE public.admins 
SET user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@plasu.edu.ng'
)
WHERE email = 'admin@plasu.edu.ng' AND user_id IS NULL;