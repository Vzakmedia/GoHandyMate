
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    // Get user's payment statistics
    const { data: escrowPayments, error: escrowError } = await supabase
      .from('escrow_payments')
      .select('*')
      .eq('provider_id', userData.user.id)

    if (escrowError) throw escrowError

    // Get user's connect account status
    const { data: connectAccount, error: connectError } = await supabase
      .from('stripe_connect_accounts')
      .select('*')
      .eq('user_id', userData.user.id)
      .single()

    // Calculate stats
    const totalEarnings = escrowPayments
      ?.filter(p => p.status === 'released')
      .reduce((sum, p) => sum + p.amount_provider, 0) || 0

    const pendingPayments = escrowPayments
      ?.filter(p => p.status === 'pending' || p.status === 'escrowed')
      .reduce((sum, p) => sum + p.amount_provider, 0) || 0

    const completedJobs = escrowPayments
      ?.filter(p => p.status === 'released').length || 0

    return new Response(JSON.stringify({
      totalEarnings,
      pendingPayments,
      completedJobs,
      connectAccount: connectAccount || null,
      recentPayments: escrowPayments?.slice(0, 5) || []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Get payment status error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
