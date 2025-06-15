
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { list_id, leads_counts, dialable_count, archived_lead } = await req.json()

    if (!list_id) {
        throw new Error("list_id is required.");
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
      function: 'list_info',
      header: 'YES',
      stage: 'pipe',
      list_id,
    });
    
    if (leads_counts) params.append('leads_counts', 'Y');
    if (dialable_count) params.append('dialable_count', 'Y');
    if (archived_lead) params.append('archived_lead', 'Y');

    const vicidialUrl = `https://${vicidial_domain}/vicidial/non_agent_api.php?${params.toString()}`;
    
    const response = await fetch(vicidialUrl);
    const textResponse = await response.text();

    if (!response.ok || (textResponse.includes("ERROR:") && !textResponse.includes("LIST DOES NOT EXIST"))) {
      console.error("Vicidial API Error Response:", textResponse);
      throw new Error(`Vicidial API Error: ${textResponse}`);
    }

    if (textResponse.includes("LIST DOES NOT EXIST")) {
      return new Response(JSON.stringify([]), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
      });
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
