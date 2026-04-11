import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { user_id } = await req.json();
    console.log('Fetching analytics for user:', user_id);

    // Get user's advertisements
    const { data: ads, error: adsError } = await supabase
      .from('advertisements')
      .select('*')
      .eq('user_id', user_id);

    if (adsError) {
      console.error('Error fetching ads:', adsError);
      throw new Error('Failed to fetch advertisements');
    }

    // Calculate analytics
    const totalImpressions = ads?.reduce((sum, ad) => sum + (ad.views_count || 0), 0) || 0;
    const totalClicks = ads?.reduce((sum, ad) => sum + (ad.clicks_count || 0), 0) || 0;
    const totalConversions = ads?.reduce((sum, ad) => sum + (ad.bookings_count || 0), 0) || 0;
    const totalCost = ads?.reduce((sum, ad) => sum + (ad.cost || 0), 0) || 0;

    const clickThroughRate = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const costPerClick = totalClicks > 0 ? totalCost / totalClicks : 0;
    const costPerConversion = totalConversions > 0 ? totalCost / totalConversions : 0;
    
    // Calculate ROI (assuming average booking value of $150)
    const averageBookingValue = 150;
    const totalRevenue = totalConversions * averageBookingValue;
    const roiPercentage = totalCost > 0 ? ((totalRevenue - totalCost) / totalCost) * 100 : 0;

    // Get daily performance for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dailyPerformance = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      // Get interactions for this date
      const { data: interactions } = await supabase
        .from('advertisement_interactions')
        .select('*')
        .gte('created_at', `${dateStr}T00:00:00Z`)
        .lt('created_at', `${dateStr}T23:59:59Z`)
        .in('advertisement_id', ads?.map(ad => ad.id) || []);

      const dayImpressions = interactions?.filter(i => i.interaction_type === 'view').length || 0;
      const dayClicks = interactions?.filter(i => i.interaction_type === 'click').length || 0;
      const dayConversions = interactions?.filter(i => i.interaction_type === 'booking').length || 0;

      // Calculate daily cost (proportional to active ads)
      const activeAdsOnDate = ads?.filter(ad => {
        const startDate = new Date(ad.start_date);
        const endDate = new Date(ad.end_date);
        const currentDate = new Date(dateStr);
        return currentDate >= startDate && currentDate <= endDate;
      }) || [];

      const dayCost = activeAdsOnDate.reduce((sum, ad) => {
        const adDuration = Math.ceil((new Date(ad.end_date).getTime() - new Date(ad.start_date).getTime()) / (1000 * 60 * 60 * 24));
        return sum + (ad.cost / adDuration);
      }, 0);

      dailyPerformance.push({
        date: dateStr,
        impressions: dayImpressions,
        clicks: dayClicks,
        conversions: dayConversions,
        cost: Math.round(dayCost * 100) / 100,
      });
    }

    const analytics = {
      total_impressions: totalImpressions,
      total_clicks: totalClicks,
      total_conversions: totalConversions,
      click_through_rate: Math.round(clickThroughRate * 100) / 100,
      conversion_rate: Math.round(conversionRate * 100) / 100,
      cost_per_click: Math.round(costPerClick * 100) / 100,
      cost_per_conversion: Math.round(costPerConversion * 100) / 100,
      roi_percentage: Math.round(roiPercentage * 100) / 100,
      daily_performance: dailyPerformance,
    };

    console.log('Analytics calculated:', analytics);

    return new Response(
      JSON.stringify(analytics),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in get-ad-analytics function:', error);
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