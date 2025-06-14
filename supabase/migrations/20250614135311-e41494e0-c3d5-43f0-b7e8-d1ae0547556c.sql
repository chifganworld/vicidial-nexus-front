
-- Create the table to store SIP integration settings
CREATE TABLE public.sip_integration (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sip_server_domain TEXT NOT NULL,
  sip_protocol TEXT NOT NULL CHECK (sip_protocol IN ('wss', 'ws', 'sip', 'pjsip')),
  sip_server_port INTEGER NOT NULL,
  sip_username TEXT,
  sip_password TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.sip_integration IS 'Stores SIP server integration settings.';

-- Enable Row Level Security (RLS) on the new table
ALTER TABLE public.sip_integration ENABLE ROW LEVEL SECURITY;

-- Grant permissions to supervisors and admins
CREATE POLICY "Allow supervisors and admins to view SIP settings"
ON public.sip_integration FOR SELECT
USING (public.is_user_supervisor_or_admin());

CREATE POLICY "Allow supervisors and admins to insert SIP settings"
ON public.sip_integration FOR INSERT
WITH CHECK (public.is_user_supervisor_or_admin());

CREATE POLICY "Allow supervisors and admins to update SIP settings"
ON public.sip_integration FOR UPDATE
USING (public.is_user_supervisor_or_admin());

CREATE POLICY "Allow supervisors and admins to delete SIP settings"
ON public.sip_integration FOR DELETE
USING (public.is_user_supervisor_or_admin());

-- Create a trigger to automatically update the 'updated_at' timestamp
CREATE TRIGGER handle_sip_integration_updated_at
BEFORE UPDATE ON public.sip_integration
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
