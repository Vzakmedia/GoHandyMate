/**
 * GoHandyMate – Supabase Migration Runner
 * Executes all migration SQL files directly via the Supabase Management API
 * Run: node run-migrations.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://iexcqvcuzmmiruqcssdz.supabase.co';
// Service role key (safe for server-side only!)
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleGNxdmN1em1taXJ1cWNzc2R6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDYwNTk2NywiZXhwIjoyMDY2MTgxOTY3fQ.placeholder_replace_with_real_service_role_key';

const MIGRATIONS = [
  'supabase/migrations/20240101000000_create_schema.sql',
  'supabase/migrations/20240101000001_rls_policies.sql',
  'supabase/migrations/20240101000002_triggers.sql',
  'supabase/migrations/20240101000003_storage.sql',
  'supabase/migrations/20240101000004_seed.sql',
  'supabase/migrations/20240101000005_helpers.sql',
];

async function runSQL(sql, label) {
  console.log(`\n▶ Running: ${label}`);

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ sql }),
  });

  if (!response.ok) {
    const text = await response.text();
    // Try direct SQL via pg-meta endpoint  
    return await runSQLViaMgmt(sql, label);
  }

  console.log(`  ✅ ${label} — complete`);
  return true;
}

async function runSQLViaMgmt(sql, label) {
  // Use the Supabase Management API via pg-meta
  const response = await fetch(
    `https://api.supabase.com/v1/projects/iexcqvcuzmmiruqcssdz/database/query`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  const text = await response.text();
  if (!response.ok) {
    console.error(`  ❌ ${label} failed:`, text.slice(0, 500));
    return false;
  }
  console.log(`  ✅ ${label} — complete`);
  return true;
}

async function main() {
  console.log('🚀 GoHandyMate – Running Supabase Migrations\n');
  let success = 0;

  for (const migFile of MIGRATIONS) {
    const filePath = join(__dirname, migFile);
    let sql;
    try {
      sql = readFileSync(filePath, 'utf-8');
    } catch (e) {
      console.error(`  ⚠ Could not read ${migFile}:`, e.message);
      continue;
    }
    const ok = await runSQL(sql, migFile.split('/').pop());
    if (ok) success++;
  }

  console.log(`\n✅ Migrations complete: ${success}/${MIGRATIONS.length} applied`);
}

main().catch(console.error);
