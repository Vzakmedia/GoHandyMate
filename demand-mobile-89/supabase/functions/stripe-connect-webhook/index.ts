
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
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const signature = req.headers.get('stripe-signature')
    const body = await req.text()

    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature!,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    console.log(`Processing webhook event: ${event.type}`)

    switch (event.type) {
      case 'account.updated':
        const account = event.data.object as Stripe.Account
        await supabase
          .from('stripe_connect_accounts')
          .update({
            charges_enabled: account.charges_enabled,
            payouts_enabled: account.payouts_enabled,
            details_submitted: account.details_submitted,
            onboarding_completed: account.details_submitted && account.charges_enabled,
            requirements: account.requirements,
            updated_at: new Date().toISOString()
          })
          .eq('stripe_account_id', account.id)
        break

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await supabase
          .from('escrow_payments')
          .update({ status: 'succeeded' })
          .eq('stripe_payment_intent_id', paymentIntent.id)
        break

      case 'transfer.created':
        const transfer = event.data.object as Stripe.Transfer
        if (transfer.metadata?.escrow_payment_id) {
          await supabase
            .from('provider_payouts')
            .insert({
              provider_id: transfer.metadata.provider_id,
              stripe_account_id: transfer.destination as string,
              stripe_payout_id: transfer.id,
              amount: transfer.amount,
              status: 'pending',
              description: `Payment for job ${transfer.metadata.job_request_id}`
            })
        }
        break

      case 'payout.paid':
      case 'payout.failed':
        const payout = event.data.object as Stripe.Payout
        await supabase
          .from('provider_payouts')
          .update({
            status: payout.status,
            arrival_date: new Date(payout.arrival_date * 1000).toISOString().split('T')[0]
          })
          .eq('stripe_payout_id', payout.id)
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
