// ============================================================
// GoHandyMate Edge Function: initiate-payout
// Triggers a payout from platform wallet to handyman bank account
// via Stripe Connect transfers
// ============================================================
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { amount } = await req.json();
    if (!amount || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Valid amount is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get handyman's Stripe Connect account
    const { data: handyman, error: handymanError } = await supabaseAdmin
      .from("handymen")
      .select("id, stripe_account_id")
      .eq("user_id", user.id)
      .single();

    if (handymanError || !handyman) {
      return new Response(
        JSON.stringify({ error: "Handyman profile not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!handyman.stripe_account_id) {
      return new Response(
        JSON.stringify({ error: "No Stripe Connect account linked. Please complete payout setup." }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate available balance (sum of cleared transactions minus paid payouts)
    const { data: balanceData } = await supabaseAdmin
      .rpc("get_handyman_available_balance", { p_handyman_id: handyman.id });

    const availableBalance = balanceData ?? 0;

    if (amount > availableBalance) {
      return new Response(
        JSON.stringify({
          error: `Insufficient balance. Available: $${availableBalance.toFixed(2)}`,
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Stripe transfer to connected account
    const amountInCents = Math.round(amount * 100);
    const transfer = await stripe.transfers.create({
      amount: amountInCents,
      currency: "usd",
      destination: handyman.stripe_account_id,
      metadata: {
        handyman_id: handyman.id,
        initiated_by: user.id,
      },
    });

    // Create payout record
    const { data: payout, error: payoutError } = await supabaseAdmin
      .from("payouts")
      .insert({
        handyman_id: handyman.id,
        amount,
        stripe_transfer_id: transfer.id,
        status: "processing",
        initiated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (payoutError) {
      throw payoutError;
    }

    // Notify handyman
    await supabaseAdmin
      .from("notifications")
      .insert({
        user_id: user.id,
        title: "Payout Initiated 💸",
        body: `$${amount.toFixed(2)} transfer has been initiated and will arrive in 1-3 business days.`,
        type: "payment",
        reference_id: payout.id,
        reference_table: "payouts",
      });

    return new Response(
      JSON.stringify({ success: true, payout }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
