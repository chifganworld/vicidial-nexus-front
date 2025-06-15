
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import mysql from 'npm:mysql2/promise'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// IMPORTANT: This is a placeholder schema.
// The remote database is assumed to be MySQL, while the main application database is PostgreSQL.
// The SQL syntax is NOT compatible. You need to provide a valid MySQL schema script.
const MYSQL_SCHEMA_SCRIPT = `
/*
-- =================================================================
-- PLACE YOUR MYSQL DATABASE INITIALIZATION SCRIPT HERE.
-- The following is an example and NOT a complete or correct schema for this application.
-- =================================================================

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ... add other tables, types, and constraints as needed for your application.

*/

-- For now, this will just create a simple version table to prove connection and execution worked.
CREATE TABLE IF NOT EXISTS app_schema_version (
  version VARCHAR(20) PRIMARY KEY,
  installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO app_schema_version (version) VALUES ('1.0.0') ON DUPLICATE KEY UPDATE installed_at = NOW();
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { host, port, db_name, db_user, db_password } = await req.json()

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
      connectTimeout: 20000, // 20 seconds timeout for potentially long operation
      multipleStatements: true // Important for running a script
    });

    await connection.query(MYSQL_SCHEMA_SCRIPT);
    await connection.end();

    return new Response(JSON.stringify({ message: 'Database initialized successfully! A placeholder schema was applied.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    return new Response(JSON.stringify({ error: `Initialization failed: ${error.message}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
