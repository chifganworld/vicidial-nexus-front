
-- Function to create a new group
CREATE OR REPLACE FUNCTION public.create_group(
    p_name text,
    p_description text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_group_id uuid;
  actor_email TEXT;
BEGIN
    IF NOT public.is_user_supervisor_or_admin() THEN
        RAISE EXCEPTION 'Only supervisors or admins can create groups.';
    END IF;

    SELECT email INTO actor_email FROM auth.users WHERE id = auth.uid();

    INSERT INTO public.groups (name, description)
    VALUES (p_name, p_description)
    RETURNING id INTO new_group_id;

    INSERT INTO public.audit_logs (user_id, user_email, action, details)
    VALUES (
        auth.uid(),
        actor_email,
        'create_group',
        jsonb_build_object(
            'group_id', new_group_id,
            'name', p_name,
            'description', p_description
        )
    );

    RETURN new_group_id;
END;
$$;

-- Function to update an existing group
CREATE OR REPLACE FUNCTION public.update_group(
    p_group_id uuid,
    p_name text,
    p_description text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  actor_email TEXT;
BEGIN
    IF NOT public.is_user_supervisor_or_admin() THEN
        RAISE EXCEPTION 'Only supervisors or admins can update groups.';
    END IF;

    SELECT email INTO actor_email FROM auth.users WHERE id = auth.uid();

    UPDATE public.groups
    SET
        name = p_name,
        description = p_description,
        updated_at = now()
    WHERE id = p_group_id;

    INSERT INTO public.audit_logs (user_id, user_email, action, details)
    VALUES (
        auth.uid(),
        actor_email,
        'update_group',
        jsonb_build_object(
            'group_id', p_group_id,
            'changes', jsonb_build_object(
                'name', p_name,
                'description', p_description
            )
        )
    );
END;
$$;

-- Function to delete a group
CREATE OR REPLACE FUNCTION public.delete_group(p_group_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  actor_email TEXT;
  deleted_group_name TEXT;
BEGIN
    IF NOT public.is_user_supervisor_or_admin() THEN
        RAISE EXCEPTION 'Only supervisors or admins can delete groups.';
    END IF;

    SELECT email INTO actor_email FROM auth.users WHERE id = auth.uid();
    SELECT name INTO deleted_group_name FROM public.groups WHERE id = p_group_id;

    DELETE FROM public.groups WHERE id = p_group_id;

    INSERT INTO public.audit_logs (user_id, user_email, action, details)
    VALUES (
        auth.uid(),
        actor_email,
        'delete_group',
        jsonb_build_object(
            'group_id', p_group_id,
            'name', deleted_group_name
        )
    );
END;
$$;
