
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { campaigns, ingroups, dids, query_date, end_date, statuses, categories, users, status_breakdown, show_percentages } = await req.json()

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
      function: 'call_dispo_report',
      status_breakdown: status_breakdown || '1',
      show_percentages: show_percentages || '0',
      file_download: '0'
    });

    if (campaigns) params.append('campaigns', campaigns);
    if (ingroups) params.append('ingroups', ingroups);
    if (dids) params.append('dids', dids);
    if (query_date) params.append('query_date', query_date);
    if (end_date) params.append('end_date', end_date);
    if (statuses) params.append('statuses', statuses);
    if (categories) params.append('categories', categories);
    if (users) params.append('users', users);

    const vicidialUrl = `https://${vicidial_domain}/vicidial/non_agent_api.php?${params.toString()}`;

    const response = await fetch(vicidialUrl);
    const textResponse = await response.text();

    if (!response.ok || textResponse.includes("ERROR:")) {
      throw new Error(`Vicidial API Error: ${textResponse}`);
    }

    const lines = textResponse.trim().split('\n');
    if (lines.length < 2) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    const header = lines[0].split(',');
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      const row: { [key: string]: string } = {};
      header.forEach((h, i) => {
        row[h] = values[i];
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
