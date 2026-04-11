
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
    console.log(`Notification cleanup triggered at: ${new Date().toISOString()}`);

    // Log the start of the operation
    await supabaseClient
      .from('cron_job_logs')
      .insert({
        job_name: 'notification-cleanup',
        status: 'started',
        details: { trigger_time: new Date().toISOString() }
      });

    // Delete read notifications older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabaseClient
      .from('notifications')
      .delete()
      .eq('is_read', true)
      .lt('created_at', thirtyDaysAgo.toISOString());

    if (error) {
      console.error('Error cleaning up notifications:', error);
      
      await supabaseClient
        .from('cron_job_logs')
        .insert({
          job_name: 'notification-cleanup',
          status: 'failed',
          details: { 
            error: error.message,
            timestamp: new Date().toISOString()
          }
        });
      
      throw error;
    }

    console.log(`Successfully cleaned up old notifications. Affected rows: ${data?.length || 'unknown'}`);

    await supabaseClient
      .from('cron_job_logs')
      .insert({
        job_name: 'notification-cleanup',
        status: 'completed',
        details: { 
          deleted_notifications: data?.length || 0,
          completion_time: new Date().toISOString()
        }
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification cleanup completed successfully',
        deleted_count: data?.length || 0,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Notification cleanup failed:', error);
    
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
