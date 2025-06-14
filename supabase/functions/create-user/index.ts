
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, full_name, roles } = await req.json()

    if (!email || !password || !full_name || !roles) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: full_name }
    })

    if (authError) {
      console.error('Error creating auth user:', authError.message)
      return new Response(JSON.stringify({ error: `Auth error: ${authError.message}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    if (!user) {
        return new Response(JSON.stringify({ error: 'User could not be created.' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }

    // The `handle_new_user` trigger should create the profile.
    // We will assign roles now.
    if (roles && roles.length > 0) {
      const rolesToInsert = roles.map((role: string) => ({
        user_id: user.id,
        role: role,
      }))

      const { error: rolesError } = await supabaseAdmin.from('user_roles').insert(rolesToInsert)

      if (rolesError) {
        console.error('Error inserting user roles:', rolesError.message)
        // Clean up created user if role assignment fails
        await supabaseAdmin.auth.admin.deleteUser(user.id);
        return new Response(JSON.stringify({ error: `DB error: ${rolesError.message}` }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        })
      }
    }

    return new Response(JSON.stringify({ user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Unexpected error in create-user function:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
