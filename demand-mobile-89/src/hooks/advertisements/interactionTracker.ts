
import { supabase } from '@/integrations/supabase/client';
import type { Advertisement } from './types';

export const trackInteraction = async (
  adId: string, 
  type: 'view' | 'click', 
  advertisements: Advertisement[]
) => {
  const ad = advertisements.find(a => a.id === adId);
  if (!ad) return;

  const updateField = type === 'view' ? 'views_count' : 'clicks_count';
  const currentCount = type === 'view' ? ad.views_count : ad.clicks_count;

  const { error } = await supabase
    .from('advertisements')
    .update({ [updateField]: currentCount + 1 })
    .eq('id', parseInt(adId));

  if (error) throw error;
};
