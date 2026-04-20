
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Booking {
  id: string;
  customer_id: string;
  handyman_id: string | null;
  service_type: string;
  scheduled_date: string;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  customer_rating?: number;
  customer_review?: string;
  customer?: {
    full_name: string;
    email: string;
    phone?: string;
  };
  handyman?: {
    full_name: string;
    email: string;
    phone?: string;
  };
  // contractor field removed — contractor role archived
}

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch job requests for the customer
      const { data: jobRequests, error: jobError } = await supabase
        .from('job_requests')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (jobError) {
        console.error('Error fetching job requests:', jobError);
        throw jobError;
      }

      // For each job request, fetch the assigned provider's profile
      const bookingsData = await Promise.all(
        (jobRequests || []).map(async (job) => {
          let providerProfile = null;
          let actualStatus = job.status;
          
          // Fetch provider profile if job is assigned
          if (job.assigned_to_user_id) {
            console.log('Fetching profile for user:', job.assigned_to_user_id);
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('full_name, email, phone')
              .eq('id', job.assigned_to_user_id)
              .maybeSingle();
            
            if (profileError) {
              console.error('Error fetching profile for user', job.assigned_to_user_id, ':', profileError);
            } else if (profile) {
              providerProfile = profile;
              console.log('Successfully fetched profile:', profile);
            }
          }

          // For custom quote jobs, check the actual status from quote submissions
          if (job.job_type === 'custom_quote') {
            console.log('Checking custom quote job status for job:', job.id);
            
            // Find the accepted quote submission for this job
            const { data: quoteSubmissions } = await supabase
              .from('quote_submissions')
              .select('status')
              .eq('handyman_id', job.assigned_to_user_id)
              .in('status', ['accepted', 'completed', 'in_progress']);

            if (quoteSubmissions && quoteSubmissions.length > 0) {
              // Get the most recent status from quote submissions
              const quoteStatus = quoteSubmissions[0].status;
              console.log('Quote status found:', quoteStatus);
              
              // Map quote submission status to job status
              if (quoteStatus === 'completed') {
                actualStatus = 'completed';
              } else if (quoteStatus === 'in_progress') {
                actualStatus = 'in_progress';
              } else if (quoteStatus === 'accepted') {
                actualStatus = 'in_progress';
              }
            }
          }
          
          const bookingData: Booking = {
            id: job.id,
            customer_id: job.customer_id,
            handyman_id: job.assigned_to_user_id || null,
            service_type: job.title || job.category || 'Service Request',
            scheduled_date: job.preferred_schedule || job.created_at,
            status: actualStatus,
            total_amount: job.budget || 0,
            created_at: job.created_at,
            updated_at: job.updated_at,
            handyman: providerProfile ? {
              full_name: providerProfile.full_name,
              email: providerProfile.email,
              phone: providerProfile.phone
            } : null
          };

          console.log('Final booking data:', bookingData.id, {
            handyman_id: bookingData.handyman_id,
            handyman: bookingData.handyman,
            status: bookingData.status
          });

          return bookingData;
        })
      );

      console.log('All bookings processed:', bookingsData);
      setBookings(bookingsData);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscription for job updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('customer-bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_requests',
          filter: `customer_id=eq.${user.id}`
        },
        () => {
          console.log('Job request updated, refreshing bookings');
          fetchBookings();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_submissions'
        },
        () => {
          console.log('Quote submission updated, refreshing bookings');
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings
  };
};
