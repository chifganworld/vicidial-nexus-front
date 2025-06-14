
CREATE OR REPLACE FUNCTION public.get_agent_calls_by_status(p_status public.call_status)
RETURNS TABLE(
    id UUID,
    created_at TIMESTAMPTZ,
    phone_number VARCHAR(50),
    duration_seconds INT,
    notes TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    cl.id,
    cl.created_at,
    cl.phone_number,
    cl.duration_seconds,
    cl.notes
  FROM public.call_logs cl
  WHERE cl.agent_id = auth.uid() AND cl.status = p_status
  ORDER BY cl.created_at DESC
  LIMIT 20;
$$;
