
CREATE OR REPLACE FUNCTION public.update_user_details(p_user_id uuid, p_full_name text, p_sip_number text, p_webrtc_number text)
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
        updated_at = now()
    WHERE id = p_user_id;
END;
$function$
