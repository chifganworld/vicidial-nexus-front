
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
    const { errorMessage, stackTrace, component, userId } = await req.json()

    const { error } = await supabaseAdmin.from('error_logs').insert({
      error_message: errorMessage,
      stack_trace: stackTrace,
      component: component,
      user_agent: req.headers.get('user-agent'),
      user_id: userId, // This can be null if the user is not logged in
    })

    if (error) {
      // Log DB insert errors to the function console for debugging
      console.error('Error inserting to error_logs:', error)
      throw error
    }

    return new Response(JSON.stringify({ message: 'Error logged successfully.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    // Log internal function errors to the function console,
    // but avoid sending detailed errors back to the client to prevent potential infinite logging loops.
    console.error('Error in log-error function:', error.message)
    return new Response(JSON.stringify({ error: 'Internal server error while logging.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
