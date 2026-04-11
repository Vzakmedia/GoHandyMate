
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdData {
  ad_title: string;
  ad_description: string;
  image_url?: string;
  plan_type: string;
  end_date: string;
  target_zip_codes: string[];
  target_audience: string;
  auto_renew: boolean;
  cost: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error('Authentication error:', userError);
      throw new Error('User not authenticated');
    }

    const adData: AdData = await req.json();
    console.log('Received ad data:', adData);

    // Validate required fields
    if (!adData.ad_title || !adData.ad_description || !adData.plan_type) {
      throw new Error('Missing required fields: ad_title, ad_description, or plan_type');
    }

    // Calculate end date based on plan type if not provided
    let endDate = adData.end_date;
    if (!endDate) {
      const startDate = new Date();
      const duration = adData.plan_type === 'basic' ? 7 : 
                      adData.plan_type === 'premium' ? 30 : 60;
      endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000).toISOString();
    }

    // Insert advertisement with content field (using ad_description as content)
    const { data: advertisement, error: insertError } = await supabase
      .from('advertisements')
      .insert({
        user_id: user.id,
        ad_title: adData.ad_title,
        ad_description: adData.ad_description,
        content: adData.ad_description, // Use description as content to satisfy NOT NULL constraint
        image_url: adData.image_url,
        plan_type: adData.plan_type,
        start_date: new Date().toISOString(),
        end_date: endDate,
        target_zip_codes: adData.target_zip_codes || [],
        target_audience: adData.target_audience || 'all',
        auto_renew: adData.auto_renew || false,
        cost: adData.cost,
        status: 'active', // Auto-approve for now
        schedule: new Date().toISOString() // Required field
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Failed to create advertisement: ${insertError.message}`);
    }

    console.log('Advertisement created successfully:', advertisement.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        advertisement,
        message: 'Advertisement created successfully' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in create-advertisement function:', error);
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
