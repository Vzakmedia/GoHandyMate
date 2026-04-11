
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

    // Check if user already has a Connect account
    const { data: existingAccount } = await supabase
      .from('stripe_connect_accounts')
      .select('*')
      .eq('user_id', userData.user.id)
      .single()

    if (existingAccount) {
      return new Response(JSON.stringify({
        account_id: existingAccount.stripe_account_id,
        onboarding_completed: existingAccount.onboarding_completed
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create Express account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: userData.user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })

    // Store account in database
    await supabase
      .from('stripe_connect_accounts')
      .insert({
        user_id: userData.user.id,
        stripe_account_id: account.id,
        account_type: 'express',
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        details_submitted: account.details_submitted
      })

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${req.headers.get('origin')}/connect/refresh`,
      return_url: `${req.headers.get('origin')}/connect/return`,
      type: 'account_onboarding',
    })

    return new Response(JSON.stringify({
      account_id: account.id,
      onboarding_url: accountLink.url,
      onboarding_completed: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Create Connect account error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
