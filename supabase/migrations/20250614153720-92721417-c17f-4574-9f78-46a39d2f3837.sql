
-- Add columns for Asterisk Manager Interface (AMI) to sip_integration table
ALTER TABLE public.sip_integration
ADD COLUMN ami_host TEXT,
ADD COLUMN ami_port INTEGER,
ADD COLUMN ami_user TEXT,
ADD COLUMN ami_secret TEXT;

-- Add comments to the new columns for clarity
COMMENT ON COLUMN public.sip_integration.ami_host IS 'Optional: Asterisk Manager Interface (AMI) host. If not provided, the SIP server domain will be used.';
COMMENT ON COLUMN public.sip_integration.ami_port IS 'Optional: Asterisk Manager Interface (AMI) port, e.g., 5038.';
COMMENT ON COLUMN public.sip_integration.ami_user IS 'Optional: Asterisk Manager Interface (AMI) username.';
COMMENT ON COLUMN public.sip_integration.ami_secret IS 'Optional: Asterisk Manager Interface (AMI) secret/password.';
