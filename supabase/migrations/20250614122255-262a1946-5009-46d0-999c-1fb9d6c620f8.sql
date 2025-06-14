
-- This trigger and function are being replaced by logic inside the 'create-user' edge function.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
