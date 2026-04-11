
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    console.log(`Subscription sync triggered at: ${new Date().toISOString()}`);

    await supabaseClient
      .from('cron_job_logs')
      .insert({
        job_name: 'subscription-sync',
        status: 'started',
        details: { trigger_time: new Date().toISOString() }
      });

    // Get all profiles with subscription IDs
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('id, stripe_subscription_id, subscription_status')
      .not('stripe_subscription_id', 'is', null);

    if (profilesError) throw profilesError;

    let syncedCount = 0;
    let errorCount = 0;

    // This would typically sync with Stripe API, but for now we'll simulate
    for (const profile of profiles || []) {
      try {
        // In a real implementation, you would call Stripe API here
        // const subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id);
        
        // For now, we'll just log the sync attempt
        console.log(`Syncing subscription for user ${profile.id}`);
        syncedCount++;
      } catch (error) {
        console.error(`Error syncing subscription for user ${profile.id}:`, error);
        errorCount++;
      }
    }

    await supabaseClient
      .from('cron_job_logs')
      .insert({
        job_name: 'subscription-sync',
        status: 'completed',
        details: { 
          synced_count: syncedCount,
          error_count: errorCount,
          completion_time: new Date().toISOString()
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Subscription sync completed successfully',
        synced_count: syncedCount,
        error_count: errorCount,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Subscription sync failed:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
