
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

// Supabase client for admin access
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Fetch Vicidial integration details
    const { data: integrationData, error: integrationError } = await supabaseAdmin
      .from('vicidial_integration')
      .select('vicidial_domain, api_user, api_password')
      .limit(1)
      .single()

    if (integrationError || !integrationData) {
      throw new Error('Vicidial integration not configured.')
    }

    const { vicidial_domain, api_user, api_password } = integrationData

    // 2. Construct and call Vicidial API
    const apiUrl = `http://${vicidial_domain}/vicidial/non_agent_api.php`
    const params = new URLSearchParams({
      source: 'lovable_supervisor',
      user: api_user,
      pass: api_password,
      function: 'logged_in_agents',
      stage: 'csv', // Use CSV for comma-separated values
      header: 'YES',
      show_sub_status: 'YES', // for more detailed status
    })

    const vicidialResponse = await fetch(`${apiUrl}?${params.toString()}`)
    if (!vicidialResponse.ok) {
      const responseText = await vicidialResponse.text();
      console.error("Vicidial API Error Response:", responseText);
      throw new Error(`Vicidial API request failed: ${vicidialResponse.statusText} - ${responseText}`)
    }

    const responseText = await vicidialResponse.text()

    // 3. Parse the pipe-delimited response
    if (responseText.includes('ERROR:')) {
      throw new Error(`Vicidial API Error: ${responseText.trim()}`)
    }
    
    const lines = responseText.trim().split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
      // Only header or no data
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const header = lines[0].split(',').map(h => h.trim().toLowerCase())
    const agents = lines.slice(1).map(line => {
      const values = line.split(',')
      const agentObject = header.reduce((obj, key, index) => {
        obj[key] = values[index] ? values[index].trim() : ''
        return obj
      }, {} as { [key: string]: string })
      return agentObject
    })

    return new Response(JSON.stringify(agents), {
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
