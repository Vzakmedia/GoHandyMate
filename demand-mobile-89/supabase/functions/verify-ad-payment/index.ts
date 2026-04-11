
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
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
    const { session_id } = await req.json();
    
    if (!session_id) {
      throw new Error('Session ID is required');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    if (session.payment_status === 'paid') {
      const adId = session.metadata?.ad_id;
      
      if (!adId) {
        throw new Error('Advertisement ID not found in session metadata');
      }

      // Activate the advertisement
      const { error: updateError } = await supabase
        .from('advertisements')
        .update({
          status: 'active',
          schedule: new Date().toISOString(), // Reset schedule to activation time
          updated_at: new Date().toISOString()
        })
        .eq('id', adId);

      if (updateError) {
        console.error('Failed to activate advertisement:', updateError);
        throw new Error('Failed to activate advertisement');
      }

      console.log(`Advertisement ${adId} activated successfully`);

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Advertisement activated successfully',
          ad_id: adId
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Payment not completed yet',
          payment_status: session.payment_status
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

  } catch (error: any) {
    console.error('Error in verify-ad-payment function:', error);
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
