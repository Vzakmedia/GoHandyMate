
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { escrow_payment_id } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Get escrow payment details
    const { data: escrowPayment } = await supabase
      .from('escrow_payments')
      .select('*, stripe_connect_accounts!inner(stripe_account_id)')
      .eq('id', escrow_payment_id)
      .single()

    if (!escrowPayment) {
      throw new Error('Escrow payment not found')
    }

    // Capture the payment intent
    const paymentIntent = await stripe.paymentIntents.capture(
      escrowPayment.stripe_payment_intent_id
    )

    // Create transfer to provider
    const transfer = await stripe.transfers.create({
      amount: escrowPayment.amount_provider,
      currency: 'usd',
      destination: escrowPayment.stripe_connect_accounts.stripe_account_id,
      metadata: {
        escrow_payment_id,
        job_request_id: escrowPayment.job_request_id
      }
    })

    // Record commission
    await supabase
      .from('commission_records')
      .insert({
        escrow_payment_id,
        provider_id: escrowPayment.provider_id,
        job_request_id: escrowPayment.job_request_id,
        commission_amount: escrowPayment.commission_amount,
        commission_rate: escrowPayment.commission_rate
      })

    // Update escrow payment status
    await supabase
      .from('escrow_payments')
      .update({
        status: 'released',
        escrow_released_at: new Date().toISOString()
      })
      .eq('id', escrow_payment_id)

    return new Response(JSON.stringify({
      success: true,
      transfer_id: transfer.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Release escrow payment error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
