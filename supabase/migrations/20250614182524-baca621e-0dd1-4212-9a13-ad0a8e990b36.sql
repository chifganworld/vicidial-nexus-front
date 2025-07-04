
-- Helper function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(p_user_id uuid, p_role public.app_role)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = p_user_id AND role = p_role
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Create a table for storing SIP Trunk configurations
CREATE TABLE public.sip_trunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trunk_name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  host TEXT NOT NULL,
  port INTEGER NOT NULL DEFAULT 5060,
  protocol TEXT NOT NULL DEFAULT 'udp',
  registration TEXT NOT NULL DEFAULT 'none',
  username TEXT,
  secret TEXT,
  dtmf_mode TEXT NOT NULL DEFAULT 'rfc2833',
  nat TEXT NOT NULL DEFAULT 'yes',
  qualify BOOLEAN NOT NULL DEFAULT TRUE,
  insecure TEXT[],
  allow_codecs TEXT[] DEFAULT ARRAY['ulaw', 'alaw']::TEXT[],
  from_user TEXT,
  from_domain TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Comments for clarity
COMMENT ON COLUMN public.sip_trunks.protocol IS 'e.g., ''udp'', ''tcp'', ''tls''';
COMMENT ON COLUMN public.sip_trunks.registration IS 'e.g., ''none'' for IP auth, ''user_pass'' for user/pass auth';
COMMENT ON COLUMN public.sip_trunks.dtmf_mode IS 'e.g., ''rfc2833'', ''inband'', ''info'', ''auto''';
COMMENT ON COLUMN public.sip_trunks.nat IS 'e.g., ''no'', ''force_rport,comedia'', ''yes''';
COMMENT ON COLUMN public.sip_trunks.insecure IS 'Can contain ''port'', ''invite''';


-- Enable Row Level Security for sip_trunks
ALTER TABLE public.sip_trunks ENABLE ROW LEVEL SECURITY;

-- Policies for sip_trunks
CREATE POLICY "Authenticated users can view sip_trunks"
  ON public.sip_trunks FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin and supervisors can manage sip_trunks"
  ON public.sip_trunks FOR ALL USING (
    (public.has_role(auth.uid(), 'admin')) OR (public.has_role(auth.uid(), 'supervisor'))
  );

-- Create a trigger to update 'updated_at' timestamp on sip_trunks
CREATE TRIGGER update_sip_trunks_updated_at
BEFORE UPDATE ON public.sip_trunks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for Audit Logs
CREATE TABLE public.audit_logs (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL,
    details JSONB
);

COMMENT ON COLUMN public.audit_logs.user_email IS 'Denormalized for easy display';

-- Enable RLS for Audit Logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies for audit_logs
CREATE POLICY "Admin and supervisors can view audit logs"
    ON public.audit_logs FOR SELECT 
    USING (
        (public.has_role(auth.uid(), 'admin')) OR
        (public.has_role(auth.uid(), 'supervisor'))
    );
