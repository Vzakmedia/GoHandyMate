
import { supabase } from '@/integrations/supabase/client';
import type { Advertisement } from './types';

export const fetchUserAdvertisements = async (userId: string): Promise<Advertisement[]> => {
  console.log('dataFetcher - fetchUserAdvertisements called for user:', userId);
  
  const { data, error } = await supabase
    .from('advertisements')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  console.log('dataFetcher - fetchUserAdvertisements result:', { data: data?.length, error });

  if (error) {
    console.error('dataFetcher - fetchUserAdvertisements error:', error);
    throw error;
  }

  const transformedData = (data || []).map(ad => ({
    ...ad,
    id: ad.id.toString(),
    user_id: ad.user_id || '',
    status: ad.status || 'pending',
    content: ad.content || '',
    ad_title: ad.ad_title || '',
    ad_description: ad.ad_description || '',
    image_url: ad.image_url || undefined,
    target_audience: ad.target_audience || 'all',
    target_zip_codes: ad.target_zip_codes || [],
    plan_type: ad.plan_type || 'basic',
    cost: ad.cost || 0,
    schedule: ad.schedule || '',
    start_date: ad.start_date || undefined,
    end_date: ad.end_date || '',
    auto_renew: ad.auto_renew || false,
    views_count: ad.views_count || 0,
    clicks_count: ad.clicks_count || 0,
    created_at: ad.created_at || undefined,
    updated_at: ad.updated_at || undefined
  }));

  console.log('dataFetcher - fetchUserAdvertisements transformed:', transformedData);
  return transformedData;
};

export const fetchActiveAdvertisements = async (zipCode?: string): Promise<Advertisement[]> => {
  console.log('dataFetcher - fetchActiveAdvertisements called with zipCode:', zipCode);
  
  let query = supabase
    .from('advertisements')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (zipCode) {
    query = query.contains('target_zip_codes', [zipCode]);
  }

  const { data, error } = await query;

  console.log('dataFetcher - fetchActiveAdvertisements result:', { data: data?.length, error });

  if (error) {
    console.error('dataFetcher - fetchActiveAdvertisements error:', error);
    throw error;
  }

  const transformedData = (data || []).map(ad => ({
    ...ad,
    id: ad.id.toString(),
    user_id: ad.user_id || '',
    status: ad.status || 'pending',
    content: ad.content || '',
    ad_title: ad.ad_title || '',
    ad_description: ad.ad_description || '',
    image_url: ad.image_url || undefined,
    target_audience: ad.target_audience || 'all',
    target_zip_codes: ad.target_zip_codes || [],
    plan_type: ad.plan_type || 'basic',
    cost: ad.cost || 0,
    schedule: ad.schedule || '',
    start_date: ad.start_date || undefined,
    end_date: ad.end_date || '',
    auto_renew: ad.auto_renew || false,
    views_count: ad.views_count || 0,
    clicks_count: ad.clicks_count || 0,
    created_at: ad.created_at || undefined,
    updated_at: ad.updated_at || undefined
  }));

  console.log('dataFetcher - fetchActiveAdvertisements transformed:', transformedData);
  return transformedData;
};
