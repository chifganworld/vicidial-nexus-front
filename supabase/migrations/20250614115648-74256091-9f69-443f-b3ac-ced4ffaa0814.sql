
-- This function checks if the currently logged-in user has the 'supervisor' or 'admin' role.
-- We'll use this to grant special permissions. It's defined with `SECURITY DEFINER`
-- to prevent potential security loopholes.
CREATE OR REPLACE FUNCTION public.is_user_supervisor_or_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid() AND (role = 'supervisor' OR role = 'admin')
  );
$$;

-- We're removing the old, more restrictive security policies.
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own roles." ON public.user_roles;

-- This new policy allows supervisors/admins to see all user profiles,
-- while regular users can still only see their own.
CREATE POLICY "Allow read access to profiles based on role"
  ON public.profiles FOR SELECT
  USING (public.is_user_supervisor_or_admin() OR auth.uid() = id);

-- Similarly, this policy allows supervisors/admins to see all user roles.
CREATE POLICY "Allow read access to user_roles based on role"
  ON public.user_roles FOR SELECT
  USING (public.is_user_supervisor_or_admin() OR auth.uid() = user_id);
  
-- This function gathers all necessary user information (ID, email, name, roles)
-- for the management page. It's designed to be called from our app
-- and ensures only authorized users can run it.
CREATE OR REPLACE FUNCTION get_users_for_management()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  roles app_role[]
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = auth, public
AS $$
  SELECT
      u.id,
      u.email,
      p.full_name,
      array_remove(array_agg(ur.role), NULL) as roles
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  LEFT JOIN public.user_roles ur ON u.id = ur.user_id
  WHERE public.is_user_supervisor_or_admin()
  GROUP BY u.id, p.full_name;
$$;
