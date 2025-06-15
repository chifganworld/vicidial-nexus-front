
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import mysql from 'npm:mysql2/promise'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { host, port, db_name, db_user, db_password } = await req.json()

    // Basic validation
    if (!host || !port || !db_name || !db_user || !db_password) {
      return new Response(JSON.stringify({ error: 'Missing required connection details.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const connection = await mysql.createConnection({
      host: host,
      port: parseInt(port, 10),
      user: db_user,
      password: db_password,
      database: db_name,
      connectTimeout: 10000, // 10 seconds timeout
    });

    await connection.ping();
    await connection.end();

    return new Response(JSON.stringify({ message: 'Connection successful!' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Connection test failed:', error.message);
    return new Response(JSON.stringify({ error: `Connection failed: ${error.message}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
