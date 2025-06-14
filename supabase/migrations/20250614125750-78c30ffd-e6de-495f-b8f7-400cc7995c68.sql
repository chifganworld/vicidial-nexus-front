
-- Creates a function that the currently authenticated user can call to grant themselves the 'admin' role.
-- This is a secure way to bootstrap the first administrator.
CREATE OR REPLACE FUNCTION public.grant_admin_to_self()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Grant the 'admin' role to the currently logged-in user.
  -- The ON CONFLICT clause prevents errors if the role is already assigned.
  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;
