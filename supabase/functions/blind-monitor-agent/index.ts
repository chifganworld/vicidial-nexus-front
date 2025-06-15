
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { agent_user, stage } = await req.json()
    if (!agent_user || !stage) {
      throw new Error('agent_user and stage are required.')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data: { user: supervisor } } = await supabaseClient.auth.getUser()
    if (!supervisor) {
      throw new Error('Supervisor not authenticated.');
    }

    const { data: supervisorProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('sip_number')
      .eq('id', supervisor.id)
      .single();

    if (profileError || !supervisorProfile || !supervisorProfile.sip_number) {
      throw new Error('Supervisor sip_number (phone_login) not configured in their profile.');
    }
    const phone_login = supervisorProfile.sip_number;

    const { data: vicidialIntegration, error: vicidialError } = await supabaseClient
      .from('vicidial_integration')
      .select('vicidial_domain, api_user, api_password')
      .single();

    if (vicidialError || !vicidialIntegration) {
      throw new Error('Vicidial integration not configured.');
    }
    const { vicidial_domain, api_user, api_password } = vicidialIntegration;

    let domain = vicidial_domain.trim();
    if (domain.endsWith('/')) {
      domain = domain.slice(0, -1);
    }
    if (!domain.startsWith('http')) {
      domain = `https://${domain}`;
    }
    const apiUrl = `${domain}/vicidial/non_agent_api.php`;

    // 1. Get agent status to find session_id and server_ip
    const agentStatusParams = new URLSearchParams({
      source: 'lovable-blind-monitor',
      user: api_user,
      pass: api_password,
      function: 'agent_status',
      agent_user: agent_user,
      include_ip: 'YES',
      stage: 'csv',
      header: 'YES'
    });

    const agentStatusResponse = await fetch(`${apiUrl}?${agentStatusParams.toString()}`);
    const agentStatusText = await agentStatusResponse.text();

    if (!agentStatusResponse.ok || agentStatusText.includes("ERROR:")) {
      throw new Error(`Vicidial agent_status API Error: ${agentStatusText}`);
    }
    
    const lines = agentStatusText.trim().split('\n');
    if (lines.length < 2) {
        throw new Error(`Could not parse agent_status response: ${agentStatusText}`);
    }
    const header = lines[0].split(',');
    const values = lines[1].split(',');
    const agentData: { [key: string]: string } = {};
    header.forEach((h, i) => {
        agentData[h.trim()] = values[i] ? values[i].trim() : '';
    });

    const session_id = agentData['session_id'];
    const server_ip = agentData['computer_ip'];

    if (!session_id || !server_ip) {
        throw new Error('Could not parse session_id or server_ip from agent_status response.');
    }

    // 2. Call blind_monitor
    const blindMonitorParams = new URLSearchParams({
      source: 'lovable-blind-monitor',
      user: api_user,
      pass: api_password,
      function: 'blind_monitor',
      phone_login,
      session_id,
      server_ip,
      stage,
    });

    const blindMonitorResponse = await fetch(`${apiUrl}?${blindMonitorParams.toString()}`);
    const blindMonitorText = await blindMonitorResponse.text();

    if (!blindMonitorResponse.ok || blindMonitorText.includes("ERROR:")) {
      throw new Error(`Vicidial blind_monitor API Error: ${blindMonitorText}`);
    }

    return new Response(JSON.stringify({ message: blindMonitorText }), {
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
