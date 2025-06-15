
-- Step 1: Create a table for groups to store different user groups.
CREATE TABLE public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.groups IS 'Stores user groups for permission management.';

-- Step 2: Create a trigger that automatically updates the `updated_at` timestamp whenever a group is modified.
CREATE TRIGGER handle_updated_at_groups
BEFORE UPDATE ON public.groups
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- Step 3: Create a junction table to link users to groups.
CREATE TABLE public.user_groups (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, group_id)
);
COMMENT ON TABLE public.user_groups IS 'Assigns users to groups.';

-- Step 4: Create a table for permissions. This will define what actions users can perform.
CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- e.g., 'users.create', 'reports.view'
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.permissions IS 'Defines granular permissions for application features.';

-- Step 5: Create a junction table to link permissions to groups.
CREATE TABLE public.group_permissions (
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (group_id, permission_id)
);
COMMENT ON TABLE public.group_permissions IS 'Assigns permissions to groups.';

-- Step 6: Enable Row-Level Security on the new tables to ensure data is secure.
-- Only supervisors and admins will be able to manage groups and permissions.
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin/supervisor to manage groups" ON public.groups
FOR ALL USING (public.is_user_supervisor_or_admin());

ALTER TABLE public.user_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin/supervisor to manage user_groups" ON public.user_groups
FOR ALL USING (public.is_user_supervisor_or_admin());
CREATE POLICY "Users can view their own groups" ON public.user_groups
FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin/supervisor to manage permissions" ON public.permissions
FOR ALL USING (public.is_user_supervisor_or_admin());

ALTER TABLE public.group_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin/supervisor to manage group_permissions" ON public.group_permissions
FOR ALL USING (public.is_user_supervisor_or_admin());

-- Step 7: Populate the permissions table with some initial, sensible permissions for the application.
INSERT INTO public.permissions (name, description) VALUES
('users:read', 'Can view user list and details'),
('users:create', 'Can create new users'),
('users:update', 'Can edit existing users'),
('users:delete', 'Can delete users'),
('settings:read', 'Can view system settings'),
('settings:update', 'Can update system settings'),
('integrations:read', 'Can view integration settings'),
('integrations:update', 'Can update integration settings'),
('reports:view', 'Can view all reports');

-- Step 8: Update the function that fetches user data to also include the new group information.
DROP FUNCTION IF EXISTS public.get_users_for_management();

CREATE OR REPLACE FUNCTION get_users_for_management()
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  roles app_role[],
  groups text[], -- New column for group names
  sip_number text,
  webrtc_number text,
  sip_password text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = auth, public
AS $$
  SELECT
      u.id,
      u.email,
      p.full_name,
      array_remove(array_agg(DISTINCT ur.role), NULL) as roles,
      array_remove(array_agg(DISTINCT g.name), NULL) as groups, -- Aggregate group names
      p.sip_number,
      p.webrtc_number,
      p.sip_password
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  LEFT JOIN public.user_roles ur ON u.id = ur.user_id
  LEFT JOIN public.user_groups ug ON u.id = ug.user_id -- Join user_groups
  LEFT JOIN public.groups g ON ug.group_id = g.id -- Join groups to get names
  WHERE public.is_user_supervisor_or_admin()
  GROUP BY u.id, p.full_name, p.sip_number, p.webrtc_number, p.sip_password;
$$;
