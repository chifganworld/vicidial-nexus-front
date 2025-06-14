
-- 1. Create an ENUM type for user roles
CREATE TYPE public.app_role AS ENUM ('agent', 'supervisor', 'admin'); -- Added admin for future flexibility

-- 2. Create the profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  full_name TEXT, -- Added based on common profile needs
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile."
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Create the user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (user_id, role) -- A user should not have the same role multiple times
);

-- Enable RLS for user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view their own roles."
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Note: Inserting/Updating roles would typically be an admin/supervisor task.
-- For now, we are not adding policies for insert/update/delete on user_roles by regular users.
-- These would be managed by privileged users or specific backend logic.

-- 4. Create a function to handle new user sign-ups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public -- Important for security definer functions
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username', -- Assumes 'username' might be passed in metadata
    NEW.raw_user_meta_data->>'full_name', -- Assumes 'full_name' might be passed in metadata
    NEW.raw_user_meta_data->>'avatar_url' -- Assumes 'avatar_url' might be passed in metadata
  );
  -- Optionally, assign a default role here if needed, e.g., 'agent'
  -- For example:
  -- INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'agent');
  -- For now, role assignment will be a separate process.
  RETURN NEW;
END;
$$;

-- 5. Create a trigger to execute the function after a new user is inserted into auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Allow authenticated users to read from the profiles table (required for the handle_new_user trigger with RLS on profiles)
-- This is generally safe as RLS policies on 'profiles' will restrict actual data access.
GRANT SELECT ON public.profiles TO authenticated;
GRANT INSERT ON public.profiles TO authenticated; -- Allow trigger to insert

-- Allow authenticated users to select from user_roles (if default role assignment is added to trigger)
GRANT SELECT ON public.user_roles TO authenticated;
-- GRANT INSERT ON public.user_roles TO authenticated; -- Only if trigger inserts default roles

