
-- Drop existing versions of the function to avoid conflicts.
DROP FUNCTION IF EXISTS public.update_user_details(uuid, text, text, text, text, app_role[]);
DROP FUNCTION IF EXISTS public.update_user_details(uuid, text, text, text, text);

-- Create the new version of the function that includes group management.
CREATE OR REPLACE FUNCTION public.update_user_details(
    p_user_id uuid,
    p_full_name text,
    p_sip_number text,
    p_webrtc_number text,
    p_sip_password text,
    p_roles app_role[],
    p_group_ids uuid[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  actor_email TEXT;
  target_user_email TEXT;
BEGIN
    IF NOT public.is_user_supervisor_or_admin() THEN
        RAISE EXCEPTION 'Only supervisors or admins can update user details.';
    END IF;

    -- Get emails for logging
    SELECT email INTO actor_email FROM auth.users WHERE id = auth.uid();
    SELECT email INTO target_user_email FROM auth.users WHERE id = p_user_id;

    UPDATE public.profiles
    SET
        full_name = p_full_name,
        sip_number = p_sip_number,
        webrtc_number = p_webrtc_number,
        sip_password = CASE WHEN p_sip_password IS NOT NULL AND p_sip_password <> '' THEN p_sip_password ELSE sip_password END,
        updated_at = now()
    WHERE id = p_user_id;

    -- Manage roles
    DELETE FROM public.user_roles WHERE user_id = p_user_id;
    IF array_length(p_roles, 1) > 0 THEN
        INSERT INTO public.user_roles (user_id, role)
        SELECT p_user_id, unnest(p_roles);
    END IF;

    -- Manage groups
    DELETE FROM public.user_groups WHERE user_id = p_user_id;
    IF array_length(p_group_ids, 1) > 0 THEN
        INSERT INTO public.user_groups (user_id, group_id)
        SELECT p_user_id, id FROM public.groups WHERE id = ANY(p_group_ids);
    END IF;

    -- Log the audit trail
    INSERT INTO public.audit_logs (user_id, user_email, action, details)
    VALUES (
        auth.uid(),
        actor_email,
        'update_user',
        jsonb_build_object(
            'updated_user_id', p_user_id,
            'updated_user_email', target_user_email,
            'changes', jsonb_build_object(
                'full_name', p_full_name,
                'sip_number', p_sip_number,
                'webrtc_number', p_webrtc_number,
                'roles', p_roles,
                'groups', (SELECT array_agg(name) FROM public.groups WHERE id = ANY(p_group_ids))
            )
        )
    );
END;
$function$;
