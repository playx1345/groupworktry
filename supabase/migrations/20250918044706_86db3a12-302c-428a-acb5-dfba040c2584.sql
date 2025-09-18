-- Create a function to handle admin authentication
CREATE OR REPLACE FUNCTION public.ensure_admin_auth(admin_email text, admin_password text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin exists in admins table
  SELECT user_id INTO admin_user_id 
  FROM public.admins 
  WHERE email = admin_email;
  
  -- If admin exists and has user_id, return it
  IF admin_user_id IS NOT NULL THEN
    RETURN admin_user_id;
  END IF;
  
  -- If no user_id, we need to handle this differently
  -- For now, return a special UUID to indicate admin auth needed
  RETURN '00000000-0000-0000-0000-000000000001'::uuid;
END;
$$;

-- Update the verify_admin_login function to be more robust
CREATE OR REPLACE FUNCTION public.verify_admin_login(admin_email text, admin_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check for hardcoded admin accounts
  IF (admin_email = 'admin@plasu.edu.ng' AND admin_password = '123456') OR
     (admin_email = 'silasplayx64@gmail.com' AND admin_password = '123456') THEN
    RETURN true;
  END IF;
  
  -- For other admins, check if they exist in the admins table
  RETURN EXISTS(
    SELECT 1 FROM public.admins WHERE email = admin_email
  );
END;
$$;