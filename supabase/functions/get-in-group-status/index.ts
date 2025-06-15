import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { in_groups } = await req.json()
    if (!in_groups) {
      throw new Error('in_groups parameter is required.')
    }

    const { data: integrationData, error: integrationError } = await supabaseAdmin
      .from('vicidial_integration')
      .select('vicidial_domain, api_user, api_password')
      .limit(1)
      .single()

    if (integrationError || !integrationData) {
      throw new Error('Vicidial integration not configured.')
    }

    const { vicidial_domain, api_user, api_password } = integrationData

    let domain = vicidial_domain.trim();
    if (domain.startsWith('http//')) domain = domain.replace('http//', 'http://');
    if (domain.startsWith('https//')) domain = domain.replace('https//', 'https://');
    if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
      domain = `http://${domain}`;
    }
    const apiUrl = `${domain}/non_agent_api.php`

    const params = new URLSearchParams({
      source: 'lovable_supervisor',
      user: api_user,
      pass: api_password,
      function: 'in_group_status',
      in_groups: in_groups, // e.g., "SALESLINE|SUPPORT"
      stage: 'pipe',
      header: 'YES',
    })

    const vicidialResponse = await fetch(`${apiUrl}?${params.toString()}`)
    if (!vicidialResponse.ok) {
      const responseText = await vicidialResponse.text();
      console.error("Vicidial API Error Response:", responseText);
      throw new Error(`Vicidial API request failed: ${vicidialResponse.statusText} - ${responseText}`)
    }

    const responseText = await vicidialResponse.text()

    if (responseText.includes('ERROR:')) {
      throw new Error(`Vicidial API Error: ${responseText.trim()}`)
    }
    
    const lines = responseText.trim().split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const header = lines[0].split('|').map(h => h.trim().toLowerCase())
    const stats = lines.slice(1).map(line => {
      const values = line.split('|')
      const statsObject = header.reduce((obj, key, index) => {
        obj[key] = values[index] ? values[index].trim() : ''
        return obj
      }, {} as { [key: string]: string })
      return statsObject
    })

    return new Response(JSON.stringify(stats), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
