
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
    console.log(`Expired ads cleanup triggered at: ${new Date().toISOString()}`);

    await supabaseClient
      .from('cron_job_logs')
      .insert({
        job_name: 'expired-ads-cleanup',
        status: 'started',
        details: { trigger_time: new Date().toISOString() }
      });

    // Update expired ads to inactive status
    const now = new Date().toISOString();
    const { data, error } = await supabaseClient
      .from('advertisements')
      .update({ status: 'expired' })
      .eq('status', 'active')
      .lt('end_date', now);

    if (error) {
      console.error('Error updating expired ads:', error);
      
      await supabaseClient
        .from('cron_job_logs')
        .insert({
          job_name: 'expired-ads-cleanup',
          status: 'failed',
          details: { 
            error: error.message,
            timestamp: new Date().toISOString()
          }
        });
      
      throw error;
    }

    console.log(`Successfully updated expired ads. Affected rows: ${data?.length || 'unknown'}`);

    await supabaseClient
      .from('cron_job_logs')
      .insert({
        job_name: 'expired-ads-cleanup',
        status: 'completed',
        details: { 
          updated_ads: data?.length || 0,
          completion_time: new Date().toISOString()
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Expired ads cleanup completed successfully',
        updated_count: data?.length || 0,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Expired ads cleanup failed:', error);
    
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
