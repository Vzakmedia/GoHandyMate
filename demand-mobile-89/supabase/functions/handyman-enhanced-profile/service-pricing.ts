
import { syncServiceCategoryWithSkill } from './skill-service-sync.ts';

export const getServicePricing = async (supabaseClient: any, userId: string) => {
  try {
    console.log('getServicePricing: Fetching for user:', userId);
    
    const { data, error } = await supabaseClient
      .from('handyman_service_pricing')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    console.log('getServicePricing: Query result:', { data, error });

    if (error) {
      console.error('getServicePricing: Database error:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        servicePricing: data || [] 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('getServicePricing: Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        servicePricing: [] 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
};

export const updateServicePricing = async (
  supabaseClient: any, 
  serviceRoleClient: any, 
  userId: string, 
  servicePricing: any[]
) => {
  try {
    console.log('updateServicePricing: Starting update for user:', userId);
    console.log('updateServicePricing: Service pricing to update:', servicePricing);

    // Get existing service pricing to compare changes
    const { data: existingPricing } = await supabaseClient
      .from('handyman_service_pricing')
      .select('category_id, subcategory_id, is_active')
      .eq('user_id', userId);

    const existingPricingMap = new Map(
      (existingPricing || []).map(pricing => [
        `${pricing.category_id}-${pricing.subcategory_id || 'null'}`, 
        pricing.is_active
      ])
    );

    // Delete all existing service pricing for this user
    const { error: deleteError } = await serviceRoleClient
      .from('handyman_service_pricing')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('updateServicePricing: Error deleting existing records:', deleteError);
      throw deleteError;
    }

    if (servicePricing && servicePricing.length > 0) {
      // Prepare service pricing data with proper user_id
      const servicePricingWithUserId = servicePricing.map(pricing => ({
        ...pricing,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      console.log('updateServicePricing: Inserting service pricing:', servicePricingWithUserId);

      // Insert new service pricing
      const { data: insertedData, error: insertError } = await serviceRoleClient
        .from('handyman_service_pricing')
        .insert(servicePricingWithUserId)
        .select();

      if (insertError) {
        console.error('updateServicePricing: Error inserting service pricing:', insertError);
        throw insertError;
      }

      console.log('updateServicePricing: Successfully inserted service pricing:', insertedData);

      // Sync with skills for category-level pricing (not subcategories)
      for (const pricing of servicePricing) {
        // Only sync category-level pricing (no subcategory)
        if (!pricing.subcategory_id) {
          const key = `${pricing.category_id}-null`;
          const wasActive = existingPricingMap.get(key) || false;
          const isNowActive = pricing.is_active;

          // Only sync if the active status changed
          if (wasActive !== isNowActive) {
            try {
              await syncServiceCategoryWithSkill(
                supabaseClient,
                serviceRoleClient,
                userId,
                pricing.category_id,
                isNowActive
              );
            } catch (syncError) {
              console.error('updateServicePricing: Sync error for category:', pricing.category_id, syncError);
              // Don't throw - we want to continue with other syncs
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Service pricing updated successfully'
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('updateServicePricing: Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
};
