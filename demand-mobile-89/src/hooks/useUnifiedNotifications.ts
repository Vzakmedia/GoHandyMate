import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useAudioNotifications } from './useAudioNotifications';
import { useNotificationPreferences } from './useNotificationPreferences';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useUnifiedNotifications = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { playJobRequestTone, playQuoteNotificationTone, playMessageTone } = useAudioNotifications();
  const { shouldPlayNotification } = useNotificationPreferences();

  useEffect(() => {
    if (!user || !profile) return;

    console.log('🔔 Setting up unified notifications for:', profile.user_role);

    const subscriptions: any[] = [];

    // Universal message notifications
    const messagesChannel = supabase
      .channel('universal-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'job_messages',
          filter: `receiver_id=eq.${user.id}`
        },
          (payload) => {
            console.log('📨 New message:', payload);
            
            if (shouldPlayNotification('message')) {
              console.log('🔔 Playing message tone');
              playMessageTone();
            }
          
          toast.info('New Message', {
            description: 'You have a new message',
            duration: 3000,
            action: {
              label: 'View',
              onClick: () => {
                if (payload.new.job_id) {
                  if (profile.user_role === 'customer') {
                    navigate('/', { state: { activeTab: 'bookings' } });
                  } else {
                    navigate(`/jobs?openJob=${payload.new.job_id}`);
                  }
                } else {
                  navigate('/jobs');
                }
              },
            },
          });
        }
      )
      .subscribe();
    subscriptions.push(messagesChannel);

    // Universal system notifications
    const systemChannel = supabase
      .channel('universal-system')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_role=in.(${profile.user_role},all)`
        },
        (payload) => {
          console.log('🔔 System notification:', payload);
          
          toast.info('System Notification', {
            description: payload.new.message || 'You have a new notification',
            duration: 5000,
            action: payload.new.job_id ? {
              label: 'View',
              onClick: () => {
                if (profile.user_role === 'customer') {
                  navigate('/', { state: { activeTab: 'bookings' } });
                } else {
                  navigate(`/jobs?openJob=${payload.new.job_id}`);
                }
              },
            } : undefined,
          });
        }
      )
      .subscribe();
    subscriptions.push(systemChannel);

    // Role-specific notifications
    switch (profile.user_role) {
      case 'handyman':
        setupHandymanNotifications();
        break;
      case 'contractor':
        setupContractorNotifications();
        break;
      case 'customer':
        setupCustomerNotifications();
        break;
      case 'property_manager':
        setupPropertyManagerNotifications();
        break;
    }

    function setupHandymanNotifications() {
      // Job requests
      const jobsChannel = supabase
        .channel('handyman-jobs')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'job_requests',
            filter: `status=eq.pending`
          },
          (payload) => {
            console.log('🔨 New job for handyman:', payload);
            
            if (shouldPlayNotification('job_request')) {
              console.log('🔔 Playing job request tone for handyman');
              playJobRequestTone();
            }
            toast.info('New Job Available!', {
              description: `${payload.new.job_type || 'Service'} job posted`,
              duration: 5000,
              action: {
                label: 'View Jobs',
                onClick: () => navigate('/jobs'),
              },
            });
          }
        )
        .subscribe();
      subscriptions.push(jobsChannel);

      // Quote requests
      const quotesChannel = supabase
        .channel('handyman-quotes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'custom_quote_requests',
            filter: `status=eq.pending`
          },
          (payload) => {
            console.log('💰 New quote request for handyman:', payload);
            
            if (shouldPlayNotification('quote_request')) {
              console.log('🔔 Playing quote notification tone for handyman');
              playQuoteNotificationTone();
            }
            toast.info('New Quote Request!', {
              description: `${payload.new.service_name || 'Service'} - ${payload.new.location || 'Location'}`,
              duration: 5000,
              action: {
                label: 'View Quotes',
                onClick: () => navigate('/', { state: { activeTab: 'quotes' } }),
              },
            });
          }
        )
        .subscribe();
      subscriptions.push(quotesChannel);

      // Job assignments
      const assignmentsChannel = supabase
        .channel('handyman-assignments')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'job_requests',
            filter: `assigned_to_user_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.new.status === 'assigned' && payload.old.status !== 'assigned') {
              console.log('✅ Job assigned to handyman:', payload);
              
              if (shouldPlayNotification('job_assignment')) {
                console.log('🔔 Playing job assignment tone for handyman');
                playJobRequestTone();
              }
              toast.success('Job Assigned!', {
                description: `You've been assigned: ${payload.new.title || 'New job'}`,
                duration: 5000,
                action: {
                  label: 'View Job',
                  onClick: () => navigate(`/jobs?openJob=${payload.new.id}`),
                },
              });
            }
          }
        )
        .subscribe();
      subscriptions.push(assignmentsChannel);
    }

    function setupContractorNotifications() {
      // Contractor jobs
      const contractorJobsChannel = supabase
        .channel('contractor-jobs')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'job_requests',
            filter: `job_type=eq.contractor_service`
          },
          (payload) => {
            console.log('🏗️ New project for contractor:', payload);
            
            if (shouldPlayNotification('job_request')) {
              playJobRequestTone();
            }
            toast.info('New Project Available!', {
              description: `${payload.new.title || 'New project'} posted`,
              duration: 5000,
              action: {
                label: 'View Projects',
                onClick: () => navigate('/jobs'),
              },
            });
          }
        )
        .subscribe();
      subscriptions.push(contractorJobsChannel);

      // Contractor quote requests
      const contractorQuotesChannel = supabase
        .channel('contractor-quotes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'contractor_quote_requests',
            filter: `status=eq.pending`
          },
          (payload) => {
            console.log('💰 New contractor quote request:', payload);
            
            if (shouldPlayNotification('quote_request')) {
              playQuoteNotificationTone();
            }
            toast.info('New Quote Request!', {
              description: `${payload.new.service_name || 'Service'} request`,
              duration: 5000,
              action: {
                label: 'View Quotes',
                onClick: () => navigate('/', { state: { activeTab: 'quotes' } }),
              },
            });
          }
        )
        .subscribe();
      subscriptions.push(contractorQuotesChannel);
    }

    function setupCustomerNotifications() {
      // Quote submissions
      const quotesChannel = supabase
        .channel('customer-quotes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'quote_submissions'
          },
          async (payload) => {
            console.log('💰 New quote submission for customer:', payload);
            
            try {
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
                if (shouldPlayNotification('quote')) {
                  console.log('🔔 Playing quote notification tone for customer');
                  playQuoteNotificationTone();
                }
                toast.success('New Quote Received!', {
                  description: `You received a quote for ${quoteRequest.service_name || 'your request'}`,
                  duration: 5000,
                  action: {
                    label: 'View Quote',
                    onClick: () => navigate('/', { state: { activeTab: 'bookings', section: 'quotes' } }),
                  },
                });
              }
            } catch (error) {
              console.error('Error processing quote submission:', error);
            }
          }
        )
        .subscribe();
      subscriptions.push(quotesChannel);

      // Job status updates
      const jobUpdatesChannel = supabase
        .channel('customer-job-updates')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'job_requests',
            filter: `customer_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.new.status !== payload.old.status) {
              console.log('📋 Job status updated for customer:', payload);
              
              const statusMessages = {
                'assigned': 'Your job has been assigned to a professional',
                'in_progress': 'Work has started on your job',
                'completed': 'Your job has been completed',
                'cancelled': 'Your job has been cancelled'
              };
              
              const message = statusMessages[payload.new.status as keyof typeof statusMessages] || 'Job status updated';
              
              toast.info('Job Update', {
                description: message,
                duration: 5000,
                action: {
                  label: 'View Job',
                  onClick: () => navigate('/', { state: { activeTab: 'bookings' } }),
                },
              });
            }
          }
        )
        .subscribe();
      subscriptions.push(jobUpdatesChannel);
    }

    function setupPropertyManagerNotifications() {
      // Maintenance requests
      const maintenanceChannel = supabase
        .channel('property-maintenance')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'job_requests',
            filter: `job_type=eq.maintenance`
          },
          (payload) => {
            console.log('🔧 New maintenance request for property manager:', payload);
            
            if (shouldPlayNotification('maintenance')) {
              playJobRequestTone();
            }
            toast.info('New Maintenance Request!', {
              description: `${payload.new.title || 'Maintenance'} request submitted`,
              duration: 5000,
              action: {
                label: 'View Request',
                onClick: () => navigate('/', { state: { activeTab: 'maintenance' } }),
              },
            });
          }
        )
        .subscribe();
      subscriptions.push(maintenanceChannel);

      // Emergency requests
      const emergencyChannel = supabase
        .channel('property-emergency')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'emergency_requests'
          },
          (payload) => {
            console.log('🚨 Emergency request for property manager:', payload);
            
            if (shouldPlayNotification('emergency')) {
              playJobRequestTone();
            }
            toast.error('Emergency Request!', {
              description: `Urgent: ${payload.new.description || 'Emergency situation'}`,
              duration: 10000,
              action: {
                label: 'View Emergency',
                onClick: () => navigate('/', { state: { activeTab: 'emergency' } }),
              },
            });
          }
        )
        .subscribe();
      subscriptions.push(emergencyChannel);
    }

    return () => {
      console.log('🔔 Cleaning up unified notification subscriptions');
      subscriptions.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.error('Error removing channel:', error);
        }
      });
    };
  }, [user, profile, navigate, playJobRequestTone, playQuoteNotificationTone, playMessageTone]);
};