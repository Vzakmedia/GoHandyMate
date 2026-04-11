
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuoteData {
  quote: {
    laborCost: number;
    materialCosts: number;
    surcharges: number;
    platformFee: number;
    subtotal: number;
    total: number;
  };
  formData: {
    serviceCategory: string;
    jobDescription: string;
    estimatedHours: number;
    rateType: string;
    rateValue: number;
    materialCosts: number;
    units: number;
    zipCode: string;
    isAfterHours: boolean;
    isUrgent: boolean;
  };
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  jobId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { quote, formData, customerInfo, jobId }: QuoteData = await req.json();

    console.log('Processing quote request:', { customerInfo, total: quote.total });

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Get contractor profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    if (profileError) {
      throw new Error('Failed to get contractor profile');
    }

    // Save quote to database
    const { data: savedQuote, error: saveError } = await supabase
      .from('quotes')
      .insert({
        contractor_id: user.id,
        job_id: jobId,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        service_category: formData.serviceCategory,
        job_description: formData.jobDescription,
        estimated_hours: formData.estimatedHours,
        rate_type: formData.rateType,
        rate_value: formData.rateValue,
        material_costs: formData.materialCosts,
        units: formData.units,
        zip_code: formData.zipCode,
        is_after_hours: formData.isAfterHours,
        is_urgent: formData.isUrgent,
        labor_cost: quote.laborCost,
        surcharges: quote.surcharges,
        platform_fee: quote.platformFee,
        total_amount: quote.total,
        status: 'sent',
        valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single();

    if (saveError) {
      console.error('Error saving quote:', saveError);
      throw new Error('Failed to save quote');
    }

    // Here you would typically send an email notification to the customer
    // For now, we'll just log the action
    console.log('Quote sent successfully:', {
      quoteId: savedQuote.id,
      customerEmail: customerInfo.email,
      amount: quote.total
    });

    // Create notification for the customer (if they have an account)
    await supabase
      .from('notifications')
      .insert({
        recipient_role: 'customer',
        message: `New quote received from ${profile.full_name} for ${formData.serviceCategory} - $${quote.total.toFixed(2)}`,
        job_id: jobId,
        created_at: new Date().toISOString()
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        quoteId: savedQuote.id,
        message: 'Quote sent successfully' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-quote function:', error);
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
