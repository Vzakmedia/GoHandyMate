
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
    console.log(`Monthly job reset triggered at: ${new Date().toISOString()}`);

    // Log the start of the operation
    await supabaseClient
      .from('cron_job_logs')
      .insert({
        job_name: 'monthly-job-reset',
        status: 'started',
        details: { trigger_time: new Date().toISOString() }
      });

    // Reset job counters for all handymen and contractors
    const { data, error } = await supabaseClient
      .from('profiles')
      .update({ jobs_this_month: 0 })
      .in('user_role', ['handyman', 'contractor']);

    if (error) {
      console.error('Error resetting job counters:', error);
      
      // Log the failure
      await supabaseClient
        .from('cron_job_logs')
        .insert({
          job_name: 'monthly-job-reset',
          status: 'failed',
          details: { 
            error: error.message,
            timestamp: new Date().toISOString()
          }
        });
      
      throw error;
    }

    console.log(`Successfully reset job counters for users. Affected rows: ${data?.length || 'unknown'}`);

    // Log the successful completion
    await supabaseClient
      .from('cron_job_logs')
      .insert({
        job_name: 'monthly-job-reset',
        status: 'completed',
        details: { 
          affected_users: data?.length || 0,
          completion_time: new Date().toISOString()
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Monthly job counters reset successfully',
        affected_users: data?.length || 0,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Monthly job reset failed:', error);
    
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
