
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

console.log(`Function "create-user" up and running!`);

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { email, password, full_name, roles, sip_number, webrtc_number } = await req.json();

        // Validation
        if (!email || !password || !full_name || !roles) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            });
        }

        if (password.length < 8) {
            return new Response(JSON.stringify({ error: 'Password must be at least 8 characters' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            });
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm user
            user_metadata: { full_name },
        });

        if (authError) {
            console.error('Error creating auth user:', authError.message);
            return new Response(JSON.stringify({ error: `Auth error: ${authError.message}` }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            });
        }

        if (!user) {
            console.error('No user returned after creation');
            return new Response(JSON.stringify({ error: 'User creation failed silently' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            });
        }

        // Create the user profile
        const { error: profileError } = await supabaseAdmin.from('profiles').insert({
            id: user.id,
            full_name: full_name,
            sip_number: sip_number,
            webrtc_number: webrtc_number,
        });

        if (profileError) {
            console.error('Error creating user profile:', profileError.message);
            // Clean up created auth user if profile creation fails
            await supabaseAdmin.auth.admin.deleteUser(user.id);
            return new Response(JSON.stringify({ error: `DB error creating profile: ${profileError.message}` }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            });
        }

        // Assign roles to the new user
        if (roles && roles.length > 0) {
          const rolesToInsert = roles.map((role: string) => ({
            user_id: user.id,
            role: role,
          }));

          const { error: rolesError } = await supabaseAdmin.from('user_roles').insert(rolesToInsert);

          if (rolesError) {
            console.error('Error assigning roles:', rolesError.message);
            // Clean up both auth user and profile if role assignment fails
            await supabaseAdmin.auth.admin.deleteUser(user.id);
            // The profile will be deleted via cascade.
            return new Response(JSON.stringify({ error: `DB error assigning roles: ${rolesError.message}` }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 500,
            });
          }
        }

        return new Response(JSON.stringify({ message: 'User created successfully', user }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 201,
        });
    } catch (error) {
        console.error('Main error:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
});
