
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const now = new Date().toISOString();
    
    // Expire advertisements that have passed their end date
    const { data: expiredAds, error: expireError } = await supabase
      .from('advertisements')
      .update({ 
        status: 'expired',
        updated_at: now
      })
      .lt('end_date', now)
      .eq('status', 'active')
      .select('id, ad_title, auto_renew, cost, plan_type');

    if (expireError) {
      console.error('Error expiring ads:', expireError);
    } else {
      console.log(`Expired ${expiredAds?.length || 0} advertisements`);
    }

    // Handle auto-renewal for expired ads
    if (expiredAds && expiredAds.length > 0) {
      for (const ad of expiredAds) {
        if (ad.auto_renew) {
          // Calculate new end date based on plan type
          const planDurations = {
            'basic': 7,
            'premium': 14,
            'featured': 30
          };
          
          const duration = planDurations[ad.plan_type as keyof typeof planDurations] || 7;
          const newEndDate = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString();
          
          // Auto-renew the advertisement (in a real scenario, you'd charge the customer again)
          await supabase
            .from('advertisements')
            .update({
              status: 'active',
              start_date: now,
              end_date: newEndDate,
              updated_at: now
            })
            .eq('id', ad.id);
            
          console.log(`Auto-renewed advertisement: ${ad.id}`);
        }
      }
    }

    // Clean up failed payments older than 24 hours
    const yesterdayISO = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { error: cleanupError } = await supabase
      .from('advertisements')
      .delete()
      .eq('status', 'payment_pending')
      .lt('created_at', yesterdayISO);

    if (cleanupError) {
      console.error('Error cleaning up pending payments:', cleanupError);
    } else {
      console.log('Cleaned up old pending payment advertisements');
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Automation tasks completed successfully',
        expired_ads: expiredAds?.length || 0
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in ad-automation function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
