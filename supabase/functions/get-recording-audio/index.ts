
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Note: no need to create a Supabase client with JWT, this function is a proxy
    // and doesn't need to check for auth, it's public.

    const { url } = await req.json()
    if (!url || !URL.canParse(url)) {
      throw new Error('A valid recording URL is required.')
    }

    const recordingResponse = await fetch(url)

    if (!recordingResponse.ok) {
      throw new Error(`Failed to fetch recording: ${recordingResponse.statusText}`)
    }

    const audioData = await recordingResponse.arrayBuffer()
    
    const headers = { ...corsHeaders };
    const contentType = recordingResponse.headers.get('Content-Type');
    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    return new Response(audioData, {
      headers: headers,
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})
