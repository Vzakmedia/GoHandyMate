import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Plan-based optimization features
const PLAN_FEATURES = {
  basic: {
    auto_optimization: false,
    ab_testing: false,
    smart_targeting: false,
    budget_optimization: false,
  },
  premium: {
    auto_optimization: true,
    ab_testing: true,
    smart_targeting: true,
    budget_optimization: false,
  },
  featured: {
    auto_optimization: true,
    ab_testing: true,
    smart_targeting: true,
    budget_optimization: true,
  },
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

    console.log('Starting ad performance optimization...');

    // Get all active advertisements with premium/featured plans
    const { data: ads, error: adsError } = await supabase
      .from('advertisements')
      .select('*')
      .eq('status', 'active')
      .in('plan_type', ['premium', 'featured'])
      .gte('end_date', new Date().toISOString());

    if (adsError) {
      console.error('Error fetching ads:', adsError);
      throw new Error('Failed to fetch advertisements');
    }

    console.log(`Found ${ads?.length || 0} ads eligible for optimization`);

    const optimizationResults = [];

    for (const ad of ads || []) {
      const planFeatures = PLAN_FEATURES[ad.plan_type as keyof typeof PLAN_FEATURES];
      
      if (!planFeatures.auto_optimization) {
        continue;
      }

      console.log(`Optimizing ad ${ad.id} (${ad.plan_type} plan)`);

      // Get recent interactions for this ad
      const { data: interactions, error: interactionsError } = await supabase
        .from('advertisement_interactions')
        .select('*')
        .eq('advertisement_id', ad.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (interactionsError) {
        console.error('Error fetching interactions:', interactionsError);
        continue;
      }

      const views = interactions?.filter(i => i.interaction_type === 'view').length || 0;
      const clicks = interactions?.filter(i => i.interaction_type === 'click').length || 0;
      const conversions = interactions?.filter(i => i.interaction_type === 'booking').length || 0;

      const ctr = views > 0 ? (clicks / views) * 100 : 0;
      const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

      let optimizationActions = [];

      // 1. Performance-based auto-pause (for underperforming ads)
      if (views > 100 && ctr < 0.5) { // Less than 0.5% CTR after 100+ views
        optimizationActions.push('low_ctr_alert');
        
        // For featured plan, auto-pause very poor performers
        if (ad.plan_type === 'featured' && ctr < 0.2) {
          await supabase
            .from('advertisements')
            .update({ 
              status: 'paused',
              updated_at: new Date().toISOString()
            })
            .eq('id', ad.id);
          
          optimizationActions.push('auto_paused_poor_performance');
          
          // Create notification for user
          await supabase
            .from('notifications')
            .insert({
              recipient_role: 'all',
              message: `Your ad "${ad.ad_title}" was automatically paused due to low performance. CTR: ${ctr.toFixed(2)}%`,
              created_at: new Date().toISOString(),
              job_id: null
            });
        }
      }

      // 2. Smart targeting optimization (for premium/featured)
      if (planFeatures.smart_targeting && views > 50) {
        // Analyze successful interactions by location/audience
        const successfulInteractions = interactions?.filter(i => 
          i.interaction_type === 'click' || i.interaction_type === 'booking'
        ) || [];

        if (successfulInteractions.length > 5) {
          // Extract audience insights
          const audienceData = successfulInteractions.reduce((acc: any, interaction) => {
            const data = interaction.interaction_data || {};
            if (data.location) {
              acc.locations[data.location] = (acc.locations[data.location] || 0) + 1;
            }
            if (data.user_type) {
              acc.user_types[data.user_type] = (acc.user_types[data.user_type] || 0) + 1;
            }
            return acc;
          }, { locations: {}, user_types: {} });

          // Store optimization insights
          await supabase
            .from('advertisement_interactions')
            .insert({
              advertisement_id: ad.id,
              user_id: null,
              interaction_type: 'optimization_insight',
              interaction_data: {
                event_type: 'audience_analysis',
                insights: audienceData,
                ctr: ctr,
                conversion_rate: conversionRate,
                timestamp: new Date().toISOString()
              },
              created_at: new Date().toISOString()
            });

          optimizationActions.push('audience_insights_generated');
        }
      }

      // 3. A/B Testing for featured plans
      if (planFeatures.ab_testing && ad.plan_type === 'featured') {
        // Check if we should create A/B test variants
        if (views > 200 && !ad.ad_description.includes('[A/B Test]')) {
          // Create A/B test variant with optimized copy
          const optimizedDescription = generateOptimizedAdCopy(ad.ad_description, ctr, conversionRate);
          
          if (optimizedDescription !== ad.ad_description) {
            await supabase
              .from('advertisements')
              .insert({
                user_id: ad.user_id,
                ad_title: ad.ad_title + ' [A/B Test]',
                ad_description: optimizedDescription,
                content: optimizedDescription,
                image_url: ad.image_url,
                plan_type: ad.plan_type,
                start_date: new Date().toISOString(),
                end_date: ad.end_date,
                target_zip_codes: ad.target_zip_codes,
                target_audience: ad.target_audience,
                auto_renew: ad.auto_renew,
                cost: 0, // A/B test variant runs for free
                status: 'active',
                schedule: new Date().toISOString()
              });

            optimizationActions.push('ab_test_variant_created');
          }
        }
      }

      // 4. Budget optimization for featured plans
      if (planFeatures.budget_optimization && ad.plan_type === 'featured') {
        const costPerConversion = conversions > 0 ? ad.cost / conversions : Infinity;
        const targetCostPerConversion = 50; // $50 target cost per conversion

        if (costPerConversion < targetCostPerConversion * 0.5) {
          // Performance is excellent, suggest budget increase
          optimizationActions.push('suggest_budget_increase');
          
          await supabase
            .from('notifications')
            .insert({
              recipient_role: 'all',
              message: `Your ad "${ad.ad_title}" is performing excellently! Cost per conversion: $${costPerConversion.toFixed(2)}. Consider increasing budget for more reach.`,
              created_at: new Date().toISOString(),
              job_id: null
            });
        }
      }

      optimizationResults.push({
        ad_id: ad.id,
        ad_title: ad.ad_title,
        plan_type: ad.plan_type,
        performance: {
          views,
          clicks,
          conversions,
          ctr: Math.round(ctr * 100) / 100,
          conversion_rate: Math.round(conversionRate * 100) / 100
        },
        actions: optimizationActions
      });
    }

    console.log(`Optimization completed. Processed ${optimizationResults.length} ads`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Ad optimization completed',
        results: optimizationResults,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in optimize-ad-performance function:', error);
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

// Helper function to generate optimized ad copy
function generateOptimizedAdCopy(originalDescription: string, ctr: number, conversionRate: number): string {
  let optimizedDescription = originalDescription;

  // If CTR is low, make the copy more engaging
  if (ctr < 1) {
    if (!optimizedDescription.includes('!')) {
      optimizedDescription = optimizedDescription.replace(/\.$/, '!');
    }
    if (!optimizedDescription.toLowerCase().includes('free')) {
      optimizedDescription = 'FREE Estimate! ' + optimizedDescription;
    }
  }

  // If conversion rate is low, add urgency
  if (conversionRate < 5) {
    if (!optimizedDescription.toLowerCase().includes('today')) {
      optimizedDescription += ' Book today for priority service!';
    }
  }

  // Add social proof elements
  if (!optimizedDescription.toLowerCase().includes('rated') && !optimizedDescription.includes('★')) {
    optimizedDescription = '⭐ Top-Rated Service! ' + optimizedDescription;
  }

  return optimizedDescription;
}

serve(handler);