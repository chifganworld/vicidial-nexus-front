
-- Add sip_number and webrtc_number columns to the profiles table if they don't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS sip_number TEXT,
ADD COLUMN IF NOT EXISTS webrtc_number TEXT;

-- Drop the existing function before recreating it with a new return signature
DROP FUNCTION IF EXISTS public.get_users_for_management();

-- Create the function again to include the new sip_number and webrtc_number fields
CREATE FUNCTION get_users_for_management()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  roles app_role[],
  sip_number text,
  webrtc_number text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = auth, public
AS $$
  SELECT
      u.id,
      u.email,
      p.full_name,
      array_remove(array_agg(ur.role), NULL) as roles,
      p.sip_number,
      p.webrtc_number
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  LEFT JOIN public.user_roles ur ON u.id = ur.user_id
  WHERE public.is_user_supervisor_or_admin()
  GROUP BY u.id, p.full_name, p.sip_number, p.webrtc_number;
$$;
