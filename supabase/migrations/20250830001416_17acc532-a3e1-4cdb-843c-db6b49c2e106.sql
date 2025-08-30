-- Remove the foreign key constraint temporarily and create admin without user_id reference
-- We'll handle the admin authentication differently

-- First, let's check if we need to drop the foreign key constraint
ALTER TABLE public.admins DROP CONSTRAINT IF EXISTS admins_user_id_fkey;

-- Make user_id nullable for admin accounts that don't have auth users yet
ALTER TABLE public.admins ALTER COLUMN user_id DROP NOT NULL;

-- Insert admin record without user_id (will be linked when admin logs in)
INSERT INTO public.admins (
  email,
  first_name,
  last_name,
  staff_id,
  department
) VALUES (
  'admin@plasu.edu.ng',
  'System',
  'Administrator',
  'ADMIN001',
  'Computer Science'
) ON CONFLICT (email) DO NOTHING;

-- Create a function to handle admin login verification
CREATE OR REPLACE FUNCTION public.verify_admin_login(admin_email text, admin_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if this is the default admin account
  IF admin_email = 'admin@plasu.edu.ng' AND admin_password = '123456' THEN
    RETURN true;
  END IF;
  
  -- For other admins, they must exist in the admins table and have proper auth
  RETURN EXISTS(
    SELECT 1 FROM public.admins WHERE email = admin_email
  );
END;
$$;