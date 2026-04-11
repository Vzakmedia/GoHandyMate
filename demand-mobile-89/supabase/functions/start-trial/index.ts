import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[START-TRIAL] ${step}${detailsStr}`);
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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user?.email) {
      throw new Error("Authentication failed");
    }

    const user = userData.user;
    const { planId, userRole } = await req.json();
    
    logStep("User authenticated", { userId: user.id, email: user.email, planId, userRole });

    // Check if user has already used their trial
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('is_trial_used, user_role, subscription_status')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw new Error("Failed to fetch user profile");
    }

    if (profile.is_trial_used) {
      throw new Error("Trial already used. Please select a paid plan.");
    }

    if (profile.user_role !== userRole) {
      throw new Error("User role mismatch");
    }

    if (profile.user_role === 'customer') {
      throw new Error("Free trials are only available for handymen and contractors");
    }

    // Set trial start and end dates (30 days)
    const trialStartDate = new Date();
    const trialEndDate = new Date(trialStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    // Update profile with trial information
    const { error: updateError } = await supabaseClient
      .from("profiles")
      .update({
        trial_start_date: trialStartDate.toISOString(),
        trial_end_date: trialEndDate.toISOString(),
        is_trial_used: true,
        trial_plan: planId,
        subscription_status: 'trial',
        subscription_plan: planId,
        subscription_start_date: trialStartDate.toISOString(),
        subscription_end_date: trialEndDate.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      logStep("Profile update error", updateError);
      throw new Error("Failed to start trial");
    }

    logStep("Trial started successfully", { 
      userId: user.id, 
      plan: planId, 
      startDate: trialStartDate.toISOString(),
      endDate: trialEndDate.toISOString()
    });

    return new Response(JSON.stringify({
      success: true,
      trial_start_date: trialStartDate.toISOString(),
      trial_end_date: trialEndDate.toISOString(),
      plan: planId
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in start-trial", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});