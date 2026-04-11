
import { supabase } from '@/integrations/supabase/client';

export const updateAdStatus = async (id: string, status: string) => {
  const { error } = await supabase
    .from('advertisements')
    .update({ status })
    .eq('id', parseInt(id));

  if (error) throw error;
};

export const createAdvertisement = async (adData: any, userId: string) => {
  try {
    console.log('Creating advertisement with payment for user:', userId);
    
    // Validate required fields
    if (!adData.ad_title || !adData.ad_description || !adData.plan_type) {
      throw new Error('Missing required fields: ad_title, ad_description, or plan_type');
    }

    // Calculate duration based on plan type
    const durationDays = adData.plan_type === 'basic' ? 7 : 
                        adData.plan_type === 'premium' ? 14 : 30;
    
    const paymentData = {
      ad_title: adData.ad_title,
      ad_description: adData.ad_description,
      image_url: adData.image_url,
      plan_type: adData.plan_type,
      target_zip_codes: adData.target_zip_codes || [],
      target_audience: adData.target_audience || 'all',
      auto_renew: adData.auto_renew || false,
      cost: adData.cost,
      duration_days: durationDays
    };

    console.log('Calling create-ad-payment function with data:', paymentData);

    // Call the payment edge function
    const { data, error } = await supabase.functions.invoke('create-ad-payment', {
      body: paymentData
    });

    if (error) {
      console.error('Payment function error:', error);
      throw new Error(`Payment function failed: ${error.message}`);
    }

    console.log('Payment function response:', data);

    if (data?.checkout_url) {
      // Open Stripe checkout in a new tab
      window.open(data.checkout_url, '_blank');
      return { success: true, message: 'Opening payment page...' };
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    throw new Error('No checkout URL received from payment service');
  } catch (error) {
    console.error('Error in createAdvertisement:', error);
    throw error;
  }
};

export const deleteAdvertisement = async (id: string) => {
  const { error } = await supabase
    .from('advertisements')
    .delete()
    .eq('id', parseInt(id));

  if (error) throw error;
};
