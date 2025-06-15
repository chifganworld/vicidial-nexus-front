
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { campaigns, query_date, ingroups, statuses } = await req.json()

    if (!campaigns) {
        throw new Error("Campaigns parameter is required.");
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
      function: 'call_status_stats',
      campaigns,
    });
    
    if (query_date) params.append('query_date', query_date);
    if (ingroups) params.append('ingroups', ingroups);
    if (statuses) params.append('statuses', statuses);

    const vicidialUrl = `https://${vicidial_domain}/vicidial/non_agent_api.php?${params.toString()}`;
    
    const response = await fetch(vicidialUrl);
    const textResponse = await response.text();

    if (!response.ok || textResponse.includes("ERROR:")) {
      console.error("Vicidial API Error Response:", textResponse);
      throw new Error(`Vicidial API Error: ${textResponse}`);
    }

    const lines = textResponse.trim().split('\n');
    if (lines.length === 0 || (lines.length === 1 && lines[0] === "") || textResponse.includes("ERROR:")) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const data = lines.map(line => {
      const parts = line.split('|');
      if (parts.length < 5) return null;
      const [campaign_ingroup, total_calls, human_answered_calls, hourly_breakdown, status_breakdown] = parts;
      
      const hourly = hourly_breakdown.split(',').reduce((acc, item) => {
        const [hour, count] = item.split('-');
        acc[`${hour.padStart(2,'0')}:00`] = parseInt(count, 10);
        return acc;
      }, {} as {[key: string]: number});

      const statuses_parsed = status_breakdown.split(',').reduce((acc, item) => {
        const [status, count] = item.split('-');
        if(status) acc[status] = parseInt(count, 10);
        return acc;
      }, {} as {[key: string]: number});
      
      return {
        campaign_ingroup,
        total_calls: parseInt(total_calls, 10),
        human_answered_calls: parseInt(human_answered_calls, 10),
        hourly_breakdown: hourly,
        status_breakdown: statuses_parsed,
      };
    }).filter(Boolean);

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
