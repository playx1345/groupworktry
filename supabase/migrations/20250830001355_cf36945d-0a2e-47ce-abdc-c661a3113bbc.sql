-- Create default admin user
-- First, create the admin user in auth.users
-- Note: This will create a user with email 'admin@plasu.edu.ng' and password '123456'

-- Insert admin record into public.admins table
INSERT INTO public.admins (
  user_id,
  email,
  first_name,
  last_name,
  staff_id,
  department
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin@plasu.edu.ng',
  'System',
  'Administrator',
  'ADMIN001',
  'Computer Science'
) ON CONFLICT (email) DO NOTHING;

-- Create a function to handle admin authentication
CREATE OR REPLACE FUNCTION public.create_admin_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This function can be called to create the admin account
  -- The actual user creation should be done through the Auth API
  -- This is just a placeholder for the admin record
  
  INSERT INTO public.admins (
    user_id,
    email,
    first_name,
    last_name,
    staff_id,
    department
  ) VALUES (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'admin@plasu.edu.ng',
    'System',
    'Administrator',
    'ADMIN001',
    'Computer Science'
  ) ON CONFLICT (email) DO NOTHING;
END;
$$;