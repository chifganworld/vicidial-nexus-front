
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { datetime_start, datetime_end, agent_user, campaign_id, time_format, group_by_campaign } = await req.json()

    if (!datetime_start || !datetime_end) {
        throw new Error("Start and end datetimes are required.");
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: vicidialIntegration, error: vicidialError } = await supabaseClient
      .from('vicidial_integration')
      .select('vicidial_domain, api_user, api_password')
      .single();

    if (vicidialError || !vicidialIntegration) {
      throw new Error('Vicidial integration not configured.');
    }

    const { vicidial_domain, api_user, api_password } = vicidialIntegration;

    const params = new URLSearchParams({
      source: 'lovable',
      user: api_user,
      pass: api_password,
      function: 'agent_stats_export',
      datetime_start: datetime_start.replace('T', ' ').substring(0, 19),
      datetime_end: datetime_end.replace('T', ' ').substring(0, 19),
      header: 'YES',
      stage: 'pipe',
    });

    if (agent_user) params.append('agent_user', agent_user);
    if (campaign_id) params.append('campaign_id', campaign_id);
    if (time_format) params.append('time_format', time_format);
    if (group_by_campaign) params.append('group_by_campaign', group_by_campaign);

    const vicidialUrl = `https://${vicidial_domain}/vicidial/non_agent_api.php?${params.toString()}`;
    
    const response = await fetch(vicidialUrl);
    const textResponse = await response.text();

    if (!response.ok || textResponse.includes("ERROR:")) {
      console.error("Vicidial API Error Response:", textResponse);
      throw new Error(`Vicidial API Error: ${textResponse}`);
    }

    const lines = textResponse.trim().split('\n');
    if (lines.length < 2) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const header = lines[0].split('|');
    const data = lines.slice(1).map(line => {
      const values = line.split('|');
      const row: { [key: string]: string } = {};
      header.forEach((h, i) => {
        row[h.trim()] = values[i] ? values[i].trim() : '';
      });
      return row;
    });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
