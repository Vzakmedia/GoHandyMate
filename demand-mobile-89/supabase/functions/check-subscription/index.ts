
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
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
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("STRIPE_SECRET_KEY not found");
      return new Response(JSON.stringify({ 
        subscribed: false, 
        error: "Stripe configuration missing" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("No authorization header");
      return new Response(JSON.stringify({ 
        subscribed: false, 
        error: "No authorization header" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    
    // Use service role key for user verification
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user?.email) {
      logStep("Authentication failed", userError);
      return new Response(JSON.stringify({ 
        subscribed: false, 
        error: "Authentication failed" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get user profile to determine user role
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('user_role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      logStep("Profile fetch error", profileError);
      return new Response(JSON.stringify({ 
        subscribed: false, 
        error: "Failed to fetch user profile" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    let customers;
    try {
      customers = await stripe.customers.list({ email: user.email, limit: 1 });
    } catch (stripeError) {
      logStep("Stripe API error", stripeError);
      return new Response(JSON.stringify({ 
        subscribed: false, 
        error: "Stripe API error" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      
      // Check if user is in trial period before marking as inactive
      const { data: trialProfile } = await supabaseClient
        .from("profiles")
        .select('trial_end_date, subscription_status, trial_plan')
        .eq('id', user.id)
        .single();

      let status = 'inactive';
      let plan = null;
      let endDate = null;

      if (trialProfile?.trial_end_date && trialProfile.subscription_status === 'trial') {
        const trialEndDate = new Date(trialProfile.trial_end_date);
        const now = new Date();
        
        if (now <= trialEndDate) {
          status = 'trial';
          plan = trialProfile.trial_plan;
          endDate = trialProfile.trial_end_date;
        }
      }

      // Use service role to update profile
      const { error: updateError } = await supabaseClient
        .from("profiles")
        .update({
          stripe_customer_id: null,
          subscription_status: status,
          subscription_plan: plan,
          subscription_end_date: endDate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (updateError) {
        logStep("Profile update error", updateError);
      }
      
      return new Response(JSON.stringify({ 
        subscribed: status === 'trial',
        subscription_plan: plan,
        subscription_end: endDate,
        subscription_status: status
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionPlan = null;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      
      // Determine subscription plan from price based on user role
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      
      // Map amounts to plans based on user role and pricing structure
      if (profile.user_role === 'handyman') {
        if (amount === 5900) subscriptionPlan = "starter";
        else if (amount === 9900) subscriptionPlan = "pro";
        else if (amount === 19900) subscriptionPlan = "elite";
      } else if (profile.user_role === 'contractor') {
        if (amount === 19900) subscriptionPlan = "basic";
        else if (amount === 29900) subscriptionPlan = "business";
        else if (amount === 49900) subscriptionPlan = "enterprise";
      }
      
      logStep("Active subscription found", { subscriptionId: subscription.id, plan: subscriptionPlan, endDate: subscriptionEnd, userRole: profile.user_role });
    } else {
      logStep("No active subscription found");
    }

    // Check for trial status first
    const { data: currentProfile } = await supabaseClient
      .from("profiles")
      .select('trial_end_date, subscription_status')
      .eq('id', user.id)
      .single();

    let finalStatus = hasActiveSub ? 'active' : 'inactive';
    let finalPlan = subscriptionPlan;
    let finalEndDate = subscriptionEnd;

    // If no active subscription, check if user is in trial period
    if (!hasActiveSub && currentProfile?.trial_end_date) {
      const trialEndDate = new Date(currentProfile.trial_end_date);
      const now = new Date();
      
      if (now <= trialEndDate && currentProfile.subscription_status === 'trial') {
        finalStatus = 'trial';
        finalEndDate = currentProfile.trial_end_date;
        // Get trial plan from profile
        const { data: trialData } = await supabaseClient
          .from("profiles")
          .select('trial_plan')
          .eq('id', user.id)
          .single();
        finalPlan = trialData?.trial_plan || null;
      }
    }

    // Use service role to update profile
    const { error: updateError } = await supabaseClient
      .from("profiles")
      .update({
        stripe_customer_id: customerId,
        subscription_status: finalStatus,
        subscription_plan: finalPlan,
        subscription_end_date: finalEndDate,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      logStep("Profile update error", updateError);
    }

    logStep("Updated database with subscription info", { 
      subscribed: hasActiveSub || finalStatus === 'trial', 
      subscriptionPlan: finalPlan, 
      userRole: profile.user_role,
      status: finalStatus
    });
    
    return new Response(JSON.stringify({
      subscribed: hasActiveSub || finalStatus === 'trial',
      subscription_plan: finalPlan,
      subscription_end: finalEndDate,
      subscription_status: finalStatus,
      user_role: profile.user_role
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ 
      subscribed: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  }
});
