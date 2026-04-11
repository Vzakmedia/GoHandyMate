
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsData {
  ad_id: string;
  event_type: 'view' | 'click';
  ip_address?: string;
  user_agent?: string;
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

    const analyticsData: AnalyticsData = await req.json();
    console.log('Tracking ad interaction:', analyticsData);

    // Get user ID if authenticated (optional)
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Get client IP and user agent
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    '0.0.0.0';
    const userAgent = req.headers.get('user-agent') || '';

    // Update advertisement counters
    if (analyticsData.event_type === 'view') {
      await supabase
        .from('advertisements')
        .update({ 
          views_count: supabase.raw('views_count + 1') 
        })
        .eq('id', analyticsData.ad_id);
    } else if (analyticsData.event_type === 'click') {
      await supabase
        .from('advertisements')
        .update({ 
          clicks_count: supabase.raw('clicks_count + 1') 
        })
        .eq('id', analyticsData.ad_id);
    }

    console.log(`Ad ${analyticsData.event_type} tracked for ad:`, analyticsData.ad_id);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in track-ad-interaction function:', error);
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
