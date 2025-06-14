
CREATE OR REPLACE FUNCTION public.update_user_details(p_user_id uuid, p_full_name text, p_sip_number text, p_webrtc_number text, p_sip_password text, p_roles app_role[])
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
        sip_password = CASE WHEN p_sip_password IS NOT NULL AND p_sip_password <> '' THEN p_sip_password ELSE sip_password END,
        updated_at = now()
    WHERE id = p_user_id;

    -- Manage roles
    -- First, delete existing roles for the user
    DELETE FROM public.user_roles WHERE user_id = p_user_id;

    -- Then, insert the new roles from the provided array
    IF array_length(p_roles, 1) > 0 THEN
        INSERT INTO public.user_roles (user_id, role)
        SELECT p_user_id, unnest(p_roles);
    END IF;
END;
$function$
