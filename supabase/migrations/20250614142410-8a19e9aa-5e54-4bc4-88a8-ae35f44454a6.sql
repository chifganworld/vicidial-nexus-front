
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT,
    phone_number VARCHAR(50) NOT NULL,
    email TEXT,
    status TEXT NOT NULL DEFAULT 'NEW',
    notes TEXT,
    agent_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Trigger to automatically update the 'updated_at' column on change
CREATE TRIGGER handle_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Agents can view leads assigned to them or unassigned leads
CREATE POLICY "Agents can view their own or unassigned leads"
ON public.leads
FOR SELECT
TO authenticated
USING (agent_id = auth.uid() OR agent_id IS NULL);

-- Agents can create new leads
CREATE POLICY "Agents can insert new leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Agents can update leads that are assigned to them
CREATE POLICY "Agents can update their own leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (agent_id = auth.uid())
WITH CHECK (agent_id = auth.uid());

-- Supervisors and Admins can manage all leads
CREATE POLICY "Supervisors and admins can manage all leads"
ON public.leads
FOR ALL
TO authenticated
USING (public.is_user_supervisor_or_admin())
WITH CHECK (public.is_user_supervisor_or_admin());
