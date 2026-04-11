
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useAudioNotifications } from './useAudioNotifications';
import { toast } from 'sonner';

export const useRealtimeNotifications = () => {
  const { user } = useAuth();
  const {
    playJobRequestTone,
    playQuoteNotificationTone,
    playMessageTone
  } = useAudioNotifications();

  useEffect(() => {
    if (!user) {
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Setting up real-time notifications for user:', user.id);
    }

    try {
      // Subscribe to new job requests for handymen/contractors/property managers
      const jobRequestsChannel = supabase
        .channel('job-requests-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'job_requests',
            filter: `status=eq.pending`
          },
          (payload) => {
            try {
              if (payload?.new) {
                playJobRequestTone();
                toast.info('New Job Request Available!', {
                  description: `${payload.new.job_type || 'Service'} job posted`,
                  duration: 5000,
                });
              }
            } catch (error) {
              console.error('Error handling job request notification:', error);
            }
          }
        )
        .subscribe();

      // Subscribe to new custom quote requests for handymen/contractors (public quotes)
      const customQuoteRequestsChannel = supabase
        .channel('custom-quote-requests-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'custom_quote_requests',
            filter: `status=eq.pending`
          },
          (payload) => {
            try {
              if (payload?.new) {
                playQuoteNotificationTone();
                toast.info('New Quote Request Available!', {
                  description: `${payload.new.service_name || 'Service'} - ${payload.new.location || 'Location'}`,
                  duration: 5000,
                });
              }
            } catch (error) {
              console.error('Error handling custom quote request notification:', error);
            }
          }
        )
        .subscribe();

      // Subscribe to quote submissions for customers
      const quoteSubmissionsChannel = supabase
        .channel('quote-submissions-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'quote_submissions'
          },
          async (payload) => {
            try {
              if (!payload?.new?.quote_request_id) {
                return;
              }

              // Check if this quote is for the current user's request
              const { data: quoteRequest, error } = await supabase
                .from('custom_quote_requests')
                .select('customer_id, service_name')
                .eq('id', payload.new.quote_request_id)
                .maybeSingle();

              if (error) {
                console.error('Error fetching quote request:', error);
                return;
              }

              if (quoteRequest?.customer_id === user.id) {
                playQuoteNotificationTone();
                toast.success('New Quote Received!', {
                  description: `You received a quote for ${quoteRequest.service_name || 'your request'}`,
                  duration: 5000,
                });
              }
            } catch (error) {
              console.error('Error processing quote submission:', error);
            }
          }
        )
        .subscribe();

      // Subscribe to new messages
      const messagesChannel = supabase
        .channel('messages-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'job_messages',
            filter: `receiver_id=eq.${user.id}`
          },
          (payload) => {
            try {
              if (payload?.new) {
                playMessageTone();
                toast.info('New Message', {
                  description: 'You have a new message',
                  duration: 3000,
                });
              }
            } catch (error) {
              console.error('Error handling message notification:', error);
            }
          }
        )
        .subscribe();

      return () => {
        if (process.env.NODE_ENV === 'development') {
          console.log('Cleaning up real-time subscriptions');
        }
        try {
          supabase.removeChannel(jobRequestsChannel);
          supabase.removeChannel(customQuoteRequestsChannel);
          supabase.removeChannel(quoteSubmissionsChannel);
          supabase.removeChannel(messagesChannel);
        } catch (error) {
          console.error('Error cleaning up subscriptions:', error);
        }
      };
    } catch (error) {
      console.error('Error setting up real-time notifications:', error);
    }
  }, [user, playJobRequestTone, playQuoteNotificationTone, playMessageTone]);
};
