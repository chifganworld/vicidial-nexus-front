
-- Create table for remote database integration settings
CREATE TABLE public.remote_db_integration (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  host TEXT NOT NULL,
  port INTEGER NOT NULL,
  db_name TEXT NOT NULL,
  db_user TEXT NOT NULL,
  db_password TEXT NOT NULL
);

-- Enable Row Level Security to protect the credentials
ALTER TABLE public.remote_db_integration ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can manage remote_db_integration settings
CREATE POLICY "Allow admins to manage remote_db_integration"
ON public.remote_db_integration
FOR ALL
TO authenticated
USING ( EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role) )
WITH CHECK ( EXISTS(SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'::app_role) );
