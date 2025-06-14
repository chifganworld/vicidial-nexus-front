
-- Create a new ENUM type for call statuses
CREATE TYPE public.call_status AS ENUM (
    'ANSWERED',
    'ABANDONED',
    'MISSED',
    'FAILED',
    'IN_QUEUE'
);

-- Create the table to store call logs
CREATE TABLE public.call_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    agent_id UUID REFERENCES public.profiles(id),
    lead_id INT,
    phone_number VARCHAR(50),
    status public.call_status NOT NULL,
    duration_seconds INT,
    notes TEXT
);

-- Enable Row Level Security for the new table
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;

-- Policy for agents to view their own logs
CREATE POLICY "Agents can view their own call logs"
ON public.call_logs
FOR SELECT
TO authenticated
USING (auth.uid() = agent_id);

-- Policy for supervisors and admins to view all logs
CREATE POLICY "Supervisors and admins can view all call logs"
ON public.call_logs
FOR SELECT
TO authenticated
USING (public.is_user_supervisor_or_admin());

-- Policy for agents to insert their own logs
CREATE POLICY "Agents can insert their own call logs"
ON public.call_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = agent_id);

-- Policy for supervisors and admins to manage all logs
CREATE POLICY "Supervisors and admins can manage all call logs"
ON public.call_logs
FOR ALL
TO authenticated
USING (public.is_user_supervisor_or_admin())
WITH CHECK (public.is_user_supervisor_or_admin());

