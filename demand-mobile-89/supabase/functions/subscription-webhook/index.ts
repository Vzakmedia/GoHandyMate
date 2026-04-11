
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, data } = await req.json()
    
    console.log(`[SUBSCRIPTION-WEBHOOK] Processing ${type} event for customer:`, data.customer)

    switch (type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        // Update user subscription status
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            subscription_status: data.status,
            subscription_plan: data.items.data[0]?.price?.nickname || 'unknown',
            stripe_subscription_id: data.id,
            subscription_start_date: new Date(data.current_period_start * 1000).toISOString(),
            subscription_end_date: new Date(data.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('stripe_customer_id', data.customer)

        if (updateError) throw updateError

        // Log subscription change
        await supabase
          .from('subscription_logs')
          .insert({
            user_id: null, // Will be updated with proper user_id lookup
            plan_name: data.items.data[0]?.price?.nickname || 'unknown',
            amount: data.items.data[0]?.price?.unit_amount || 0,
            status: data.status,
            stripe_subscription_id: data.id
          })

        break

      case 'customer.subscription.deleted':
        // Cancel subscription
        const { error: cancelError } = await supabase
          .from('profiles')
          .update({
            subscription_status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('stripe_customer_id', data.customer)

        if (cancelError) throw cancelError
        break

      case 'invoice.payment_succeeded':
        // Log successful payment
        await supabase
          .from('subscription_logs')
          .insert({
            user_id: null, // Will be updated with proper user_id lookup
            plan_name: 'payment',
            amount: data.amount_paid,
            status: 'paid',
            stripe_invoice_id: data.id
          })
        break
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: `Processed ${type} event successfully`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[SUBSCRIPTION-WEBHOOK] Error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
