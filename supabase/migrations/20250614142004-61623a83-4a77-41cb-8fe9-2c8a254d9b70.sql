
CREATE OR REPLACE FUNCTION public.get_agent_call_stats()
RETURNS TABLE(status_name public.call_status, status_count BIGINT)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH all_statuses AS (
    SELECT unnest(enum_range(NULL::public.call_status)) as status
  ),
  agent_logs_counts AS (
    SELECT
      status,
      count(*) as counted
    FROM public.call_logs
    WHERE agent_id = auth.uid()
    GROUP BY status
  )
  SELECT
    s.status,
    COALESCE(alc.counted, 0) as count
  FROM all_statuses s
  LEFT JOIN agent_logs_counts alc ON s.status = alc.status;
$$;
