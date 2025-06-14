
-- Ensure realtime is fully enabled for the leads table for reliable updates.
ALTER TABLE public.leads REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;

-- Create a function to get key lead statistics for the logged-in agent.
CREATE OR REPLACE FUNCTION get_agent_lead_stats()
RETURNS TABLE(
    new_leads_today BIGINT,
    leads_in_progress BIGINT,
    leads_converted BIGINT,
    avg_handle_time_seconds NUMERIC
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    (SELECT COUNT(*) FROM public.leads WHERE agent_id = auth.uid() AND status = 'NEW' AND created_at::date = CURRENT_DATE) as new_leads_today,
    (SELECT COUNT(*) FROM public.leads WHERE agent_id = auth.uid() AND status = 'IN_PROGRESS') as leads_in_progress,
    (SELECT COUNT(*) FROM public.leads WHERE agent_id = auth.uid() AND status = 'CONVERTED') as leads_converted,
    (SELECT AVG(duration_seconds) FROM public.call_logs WHERE agent_id = auth.uid()) as avg_handle_time_seconds;
$$;

-- Create a function to get the logged-in agent's call count for each day of the current week.
CREATE OR REPLACE FUNCTION get_agent_weekly_call_stats()
RETURNS TABLE(
    day_of_week TEXT,
    calls_count BIGINT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
WITH week_days AS (
  SELECT generate_series(
    date_trunc('week', current_date),
    date_trunc('week', current_date) + interval '6 days',
    '1 day'
  )::date AS day
)
SELECT
  to_char(d.day, 'Dy') as day_of_week,
  COALESCE(count(cl.id), 0) as calls_count
FROM week_days d
LEFT JOIN public.call_logs cl ON cl.created_at::date = d.day AND cl.agent_id = auth.uid()
GROUP BY d.day
ORDER BY d.day;
$$;
