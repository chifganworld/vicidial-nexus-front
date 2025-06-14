
-- Add sip_password to profiles table
ALTER TABLE public.profiles ADD COLUMN sip_password TEXT;

-- Drop existing functions before recreating them
DROP FUNCTION IF EXISTS public.get_users_for_management();
DROP FUNCTION IF EXISTS public.update_user_details(uuid, text, text, text);

-- Create function to get users for management, now including sip_password
CREATE FUNCTION public.get_users_for_management()
 RETURNS TABLE(id uuid, email text, full_name text, roles app_role[], sip_number text, webrtc_number text, sip_password text)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'auth', 'public'
AS $function$
  SELECT
      u.id,
      u.email,
      p.full_name,
      array_remove(array_agg(ur.role), NULL) as roles,
      p.sip_number,
      p.webrtc_number,
      p.sip_password
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  LEFT JOIN public.user_roles ur ON u.id = ur.user_id
  WHERE public.is_user_supervisor_or_admin()
  GROUP BY u.id, p.full_name, p.sip_number, p.webrtc_number, p.sip_password;
$function$;

-- Create function to update user details, now including sip_password
CREATE FUNCTION public.update_user_details(p_user_id uuid, p_full_name text, p_sip_number text, p_webrtc_number text, p_sip_password text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    IF NOT public.is_user_supervisor_or_admin() THEN
        RAISE EXCEPTION 'Only supervisors or admins can update user details.';
    END IF;

    UPDATE public.profiles
    SET
        full_name = p_full_name,
        sip_number = p_sip_number,
        webrtc_number = p_webrtc_number,
        sip_password = p_sip_password,
        updated_at = now()
    WHERE id = p_user_id;
END;
$function$;
