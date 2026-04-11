import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useQuoteRealtimeSubscriptions = (
  userId: string | undefined,
  onQuoteRequestsChange: () => void,
  onQuoteSubmissionsChange: () => void
) => {
  const channelsRef = useRef<RealtimeChannel[]>([]);

  useEffect(() => {
    if (!userId) return;

    // Clean up any existing channels
    channelsRef.current.forEach(channel => {
      try {
        supabase.removeChannel(channel);
      } catch (error) {
        console.log('Error removing channel:', error);
      }
    });
    channelsRef.current = [];

    console.log('Setting up real-time subscriptions for live quote updates');

    // Subscribe to quote requests changes with unique channel name
    const quoteRequestsChannel = supabase
      .channel(`quote-requests-${userId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'custom_quote_requests',
          filter: 'status=eq.pending'
        },
        (payload) => {
          console.log('Live quote request change detected:', payload);
          onQuoteRequestsChange();
        }
      )
      .subscribe((status) => {
        console.log('Live quote requests subscription status:', status);
        if (status === 'CHANNEL_ERROR') {
          console.log('Retrying quote requests subscription...');
          setTimeout(() => {
            quoteRequestsChannel.unsubscribe();
          }, 1000);
        }
      });

    // Subscribe to quote submissions changes with unique channel name
    const quoteSubmissionsChannel = supabase
      .channel(`quote-submissions-${userId}-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_submissions',
          filter: `handyman_id=eq.${userId}`
        },
        (payload) => {
          console.log('Live quote submission change detected:', payload);
          onQuoteSubmissionsChange();
        }
      )
      .subscribe((status) => {
        console.log('Live quote submissions subscription status:', status);
        if (status === 'CHANNEL_ERROR') {
          console.log('Retrying quote submissions subscription...');
          setTimeout(() => {
            quoteSubmissionsChannel.unsubscribe();
          }, 1000);
        }
      });

    channelsRef.current = [quoteRequestsChannel, quoteSubmissionsChannel];

    return () => {
      console.log('Cleaning up live real-time subscriptions');
      channelsRef.current.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.log('Error removing channel during cleanup:', error);
        }
      });
      channelsRef.current = [];
    };
  }, [userId, onQuoteRequestsChange, onQuoteSubmissionsChange]);
};