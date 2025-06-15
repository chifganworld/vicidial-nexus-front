
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // This is needed for CORS preflight requests.
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

    // Get the original content type and length to pass them along
    const contentType = recordingResponse.headers.get('Content-Type') || 'application/octet-stream';
    const contentLength = recordingResponse.headers.get('Content-Length');

    const headers: Record<string, string> = { ...corsHeaders, 'Content-Type': contentType };
    if (contentLength) {
        headers['Content-Length'] = contentLength;
    }

    // Pass the readable stream from the fetch response directly to the new response.
    // This avoids buffering the entire file in memory and streams it instead.
    return new Response(recordingResponse.body, {
      headers,
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})
