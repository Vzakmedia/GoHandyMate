
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
    const { job_request_id, amount_total, provider_id, commission_rate = 0.15 } = await req.json()

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !userData.user) {
      throw new Error('User not authenticated')
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Get provider's Connect account
    const { data: providerAccount } = await supabase
      .from('stripe_connect_accounts')
      .select('*')
      .eq('user_id', provider_id)
      .single()

    if (!providerAccount) {
      throw new Error('Provider does not have a Connect account')
    }

    // Calculate amounts
    const commission_amount = Math.round(amount_total * commission_rate)
    const amount_provider = amount_total - commission_amount

    // Create Payment Intent with escrow
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount_total,
      currency: 'usd',
      customer: userData.user.email,
      payment_method_types: ['card'],
      capture_method: 'manual', // Hold funds in escrow
      metadata: {
        job_request_id,
        provider_id,
        commission_amount: commission_amount.toString(),
        amount_provider: amount_provider.toString()
      }
    })

    // Record escrow payment
    const { data: escrowPayment } = await supabase
      .from('escrow_payments')
      .insert({
        job_request_id,
        customer_id: userData.user.id,
        provider_id,
        stripe_payment_intent_id: paymentIntent.id,
        amount_total,
        amount_provider,
        commission_amount,
        commission_rate,
        status: 'pending'
      })
      .select()
      .single()

    return new Response(JSON.stringify({
      client_secret: paymentIntent.client_secret,
      escrow_payment_id: escrowPayment.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Create escrow payment error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
