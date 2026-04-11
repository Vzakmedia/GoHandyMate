
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export async function authenticateUser(req: Request) {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    console.error('Enhanced Profile Function: No authorization header');
    throw new Error('No authorization header provided')
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

  if (authError || !user) {
    console.error('Enhanced Profile Function: Auth error:', authError);
    throw new Error('Unauthorized - invalid token')
  }

  console.log('Enhanced Profile Function: User authenticated:', user.id);
  return { user, supabaseClient }
}
