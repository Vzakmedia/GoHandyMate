
import { supabase } from '@/integrations/supabase/client';

export const setupJobRealtimeSubscriptions = (userId: string, onUpdate: () => void) => {
  console.log('jobRealtimeSubscriptions: Setting up real-time subscription for user:', userId);

  const channel = supabase
    .channel('handyman-job-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'job_requests',
        filter: `assigned_to_user_id=eq.${userId}`
      },
      (payload) => {
        console.log('jobRealtimeSubscriptions: Real-time job update received:', payload);
        onUpdate();
      }
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'quote_submissions',
        filter: `handyman_id=eq.${userId}`
      },
      (payload) => {
        console.log('jobRealtimeSubscriptions: Real-time quote update received:', payload);
        onUpdate();
      }
    )
    .subscribe((status) => {
      console.log('jobRealtimeSubscriptions: Real-time subscription status:', status);
    });

  return channel;
};
