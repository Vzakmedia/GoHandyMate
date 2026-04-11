import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useRealtimeSubscriptions = (
  userId: string | undefined,
  refreshCallback: () => Promise<void>
) => {
  let channels: RealtimeChannel[] = [];
  let isSetup = false;

  const setupSubscriptions = () => {
    if (!userId || isSetup) {
      console.log('useRealtimeSubscriptions: Skipping setup - no user or already setup');
      return;
    }

    console.log('useRealtimeSubscriptions: Setting up subscriptions for user:', userId);

    try {
      // Clean up any existing channels first
      cleanupSubscriptions();

      // Skill rates subscription
      const skillRatesChannel = supabase
        .channel(`skill-rates-${userId}-${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'handyman_skill_rates',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('useRealtimeSubscriptions: Skill rates change:', payload);
            refreshCallback();
          }
        );

      // Service pricing subscription
      const servicePricingChannel = supabase
        .channel(`service-pricing-${userId}-${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'handyman_service_pricing',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('useRealtimeSubscriptions: Service pricing change:', payload);
            refreshCallback();
          }
        );

      // Work areas subscription
      const workAreasChannel = supabase
        .channel(`work-areas-${userId}-${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'handyman_work_areas',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('useRealtimeSubscriptions: Work areas change:', payload);
            refreshCallback();
          }
        );

      // Work settings subscription
      const workSettingsChannel = supabase
        .channel(`work-settings-${userId}-${Date.now()}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'handyman_work_settings',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            console.log('useRealtimeSubscriptions: Work settings change:', payload);
            refreshCallback();
          }
        );

      // Subscribe to all channels
      Promise.all([
        skillRatesChannel.subscribe(),
        servicePricingChannel.subscribe(),
        workAreasChannel.subscribe(),
        workSettingsChannel.subscribe()
      ]).then(() => {
        console.log('useRealtimeSubscriptions: All subscriptions active');
        channels = [skillRatesChannel, servicePricingChannel, workAreasChannel, workSettingsChannel];
        isSetup = true;
      }).catch((error) => {
        console.error('useRealtimeSubscriptions: Subscription error:', error);
      });

    } catch (error) {
      console.error('useRealtimeSubscriptions: Setup error:', error);
    }
  };

  const cleanupSubscriptions = () => {
    console.log('useRealtimeSubscriptions: Cleaning up', channels.length, 'channels');
    channels.forEach(channel => {
      try {
        supabase.removeChannel(channel);
      } catch (error) {
        console.error('useRealtimeSubscriptions: Error removing channel:', error);
      }
    });
    channels = [];
    isSetup = false;
  };

  return {
    setupSubscriptions,
    cleanupSubscriptions
  };
};