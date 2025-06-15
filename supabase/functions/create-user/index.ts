
import { createClient, PostgrestError } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get the user performing the action from the authorization header
    const authHeader = req.headers.get('Authorization')!;
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user: actor } } = await supabase.auth.getUser(jwt);

    if (!actor) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { email, password, fullName, roles, sipNumber, webrtcNumber, sipPassword, group_ids } = await req.json();

    // 1. Create the user in auth.users
    const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (createError) throw createError;
    if (!user) throw new Error("User creation failed");

    // 2. Create the user's profile
    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: fullName,
      sip_number: sipNumber,
      webrtc_number: webrtcNumber,
      sip_password: sipPassword,
    });
    if (profileError) throw profileError;

    // 3. Assign roles
    if (roles && roles.length > 0) {
      const roleInserts = roles.map((role: string) => ({ user_id: user.id, role }));
      const { error: roleError } = await supabase.from('user_roles').insert(roleInserts);
      if (roleError) throw roleError;
    }

    // 4. Assign groups
    if (group_ids && group_ids.length > 0) {
      const groupInserts = group_ids.map((group_id: string) => ({ user_id: user.id, group_id }));
      const { error: groupError } = await supabase.from('user_groups').insert(groupInserts);
      if (groupError) throw groupError;
    }
    
    // 5. Log the audit event
    const { error: auditError } = await supabase.from('audit_logs').insert({
        user_id: actor.id,
        user_email: actor.email,
        action: 'create_user',
        details: {
            created_user_id: user.id,
            created_user_email: user.email,
            details: { fullName, email, roles, sipNumber, webrtcNumber, group_ids }
        }
    });
    if (auditError) console.error("Failed to log user creation:", auditError.message);


    return new Response(JSON.stringify({ user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof PostgrestError) {
        errorMessage = error.message;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
