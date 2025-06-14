
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { campaign_id, ...updates } = await req.json();
    if (!campaign_id) {
        throw new Error("campaign_id is required.");
    }
    if (Object.keys(updates).length === 0) {
        throw new Error("At least one field to update is required.");
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
      source: 'lovable-update-campaign',
      user: api_user,
      pass: api_password,
      function: 'update_campaign',
      campaign_id,
      ...updates
    });

    const vicidialUrl = `https://${vicidial_domain}/goautodial/non_agent_api.php?${params.toString()}`;

    const response = await fetch(vicidialUrl);
    const textResponse = await response.text();

    if (!response.ok || textResponse.includes("ERROR:")) {
      console.error("Vicidial API Error Response:", textResponse);
      throw new Error(`Vicidial API Error: ${textResponse}`);
    }

    return new Response(JSON.stringify({ message: 'Campaign updated successfully', details: textResponse }), {
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
