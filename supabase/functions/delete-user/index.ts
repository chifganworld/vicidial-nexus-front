
import { createClient, PostgrestError } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
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

        const { userIdToDelete } = await req.json();
        
        if (!userIdToDelete) {
            return new Response(JSON.stringify({ error: 'User ID to delete is required.' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            });
        }

        // Fetch user details for logging BEFORE deleting
        const { data: userToDelete, error: fetchError } = await supabase.auth.admin.getUserById(userIdToDelete);
        if (fetchError || !userToDelete) {
             console.error("Failed to fetch user for logging, but proceeding with deletion:", fetchError?.message);
        }

        // Log the audit event
        const { error: auditError } = await supabase.from('audit_logs').insert({
            user_id: actor.id,
            user_email: actor.email,
            action: 'delete_user',
            details: {
                deleted_user_id: userIdToDelete,
                deleted_user_email: userToDelete?.user?.email || 'N/A'
            }
        });
        if (auditError) {
             console.error("Failed to log user deletion:", auditError.message);
        }

        // Delete the user from auth.users
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userIdToDelete);
        if (deleteError) throw deleteError;

        return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
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
