
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { authenticateUser } from './utils/auth.ts';
import { 
  createRating, 
  updateRating, 
  getJobRating, 
  getProviderRatings 
} from './handlers/rating-handlers.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Authenticate user
    const { user, error: authError } = await authenticateUser(supabaseClient, req);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, ...body } = await req.json();

    switch (action) {
      case 'create_rating':
        return await createRating(supabaseClient, user.id, body, corsHeaders);
      case 'update_rating':
        return await updateRating(supabaseClient, user.id, body, corsHeaders);
      case 'get_job_rating':
        return await getJobRating(supabaseClient, user.id, body.jobId, corsHeaders);
      case 'get_provider_ratings':
        return await getProviderRatings(supabaseClient, body.providerId, corsHeaders);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Error in job-ratings function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
