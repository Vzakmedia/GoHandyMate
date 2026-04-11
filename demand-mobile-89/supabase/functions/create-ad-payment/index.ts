
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdPaymentData {
  ad_title: string;
  ad_description: string;
  image_url?: string;
  plan_type: string;
  target_zip_codes: string[];
  target_audience: string;
  auto_renew: boolean;
  cost: number;
  duration_days: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error('Authentication error:', userError);
      throw new Error('User not authenticated');
    }

    const adData: AdPaymentData = await req.json();
    console.log('Creating ad payment for:', adData);

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Check if customer exists
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Store pending advertisement in database
    const { data: pendingAd, error: insertError } = await supabase
      .from('advertisements')
      .insert({
        user_id: user.id,
        ad_title: adData.ad_title,
        ad_description: adData.ad_description,
        content: adData.ad_description,
        image_url: adData.image_url,
        plan_type: adData.plan_type,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + adData.duration_days * 24 * 60 * 60 * 1000).toISOString(),
        target_zip_codes: adData.target_zip_codes,
        target_audience: adData.target_audience,
        auto_renew: adData.auto_renew,
        cost: adData.cost,
        status: 'payment_pending',
        schedule: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Failed to create pending advertisement: ${insertError.message}`);
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${adData.plan_type.charAt(0).toUpperCase() + adData.plan_type.slice(1)} Ad Plan`,
              description: `${adData.duration_days} days advertising for: ${adData.ad_title}`,
            },
            unit_amount: Math.round(adData.cost * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/advertising-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/business-advertising`,
      metadata: {
        user_id: user.id,
        ad_id: pendingAd.id.toString(),
        plan_type: adData.plan_type,
      },
    });

    // Update ad with payment session ID
    await supabase
      .from('advertisements')
      .update({ 
        schedule: session.id // Store session ID in schedule field temporarily
      })
      .eq('id', pendingAd.id);

    console.log('Payment session created:', session.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        checkout_url: session.url,
        ad_id: pendingAd.id,
        message: 'Payment session created successfully' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in create-ad-payment function:', error);
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
