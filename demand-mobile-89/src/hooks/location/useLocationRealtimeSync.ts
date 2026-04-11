
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export const useLocationRealtimeSync = (user: any) => {
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`location-updates-${user.id}`)
      .on('broadcast', { event: 'location-changed' }, (payload) => {
        logger.info('Received location broadcast', payload);
      })
      .on('broadcast', { event: 'service-areas-updated' }, (payload) => {
        logger.info('Service areas updated', payload);
        window.dispatchEvent(new CustomEvent('service-areas-changed', { detail: payload }));
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          logger.info('Location channel subscribed successfully');
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user]);

  return {
    channelRef
  };
};
