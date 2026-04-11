import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';
import { QuoteWithSubmissions } from './types';
import { toast } from 'sonner';
import { isValidProfileData } from '@/utils/profileValidation';

export const useQuoteRequests = () => {
  const { user } = useAuth();
  const [quoteRequests, setQuoteRequests] = useState<QuoteWithSubmissions[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuoteRequests = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Fetching quote requests for customer:', user.id);
      
      // Fetch quote requests
      const { data: requests, error: requestsError } = await supabase
        .from('custom_quote_requests')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      // Fetch submissions for each request
      const requestsWithSubmissions = await Promise.all(
        (requests || []).map(async (request) => {
          const { data: submissions, error: submissionsError } = await supabase
            .from('quote_submissions')
            .select(`
              *,
              profiles:handyman_id (
                full_name,
                email
              )
            `)
            .eq('quote_request_id', request.id)
            .order('created_at', { ascending: false });

          if (submissionsError) {
            console.error('Error fetching submissions:', submissionsError);
            return {
              ...request,
              submissions: []
            };
          }

          // Transform submissions to match expected type
          const transformedSubmissions = (submissions || []).map(submission => {
            // Extract profiles data safely
            const profilesData = submission.profiles;
            
            return {
              id: submission.id,
              handyman_id: submission.handyman_id,
              quoted_price: submission.quoted_price,
              description: submission.description,
              status: submission.status,
              created_at: submission.created_at,
              estimated_hours: submission.estimated_hours,
              availability_note: submission.availability_note,
              materials_included: submission.materials_included,
              materials_cost: submission.materials_cost,
              travel_fee: submission.travel_fee,
              profiles: isValidProfileData(profilesData) ? {
                full_name: profilesData.full_name,
                email: profilesData.email
              } : null
            };
          });

          return {
            ...request,
            submissions: transformedSubmissions
          };
        })
      );

      setQuoteRequests(requestsWithSubmissions);
    } catch (error) {
      console.error('Error fetching quote requests:', error);
      toast.error('Failed to load quote requests');
    } finally {
      setLoading(false);
    }
  };

  const acceptQuote = async (requestId: string, quoteId: string) => {
    try {
      console.log('Accepting quote:', { requestId, quoteId });
      
      const { error } = await supabase.functions.invoke('quote-operations', {
        body: {
          action: 'accept_quote',
          request_id: requestId,
          quote_id: quoteId
        }
      });

      if (error) throw error;
      
      toast.success('Quote accepted successfully!');
      await fetchQuoteRequests(); // Refresh data
    } catch (error) {
      console.error('Error accepting quote:', error);
      toast.error('Failed to accept quote');
      throw error;
    }
  };

  useEffect(() => {
    fetchQuoteRequests();
  }, [user]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscription for quote updates');

    const channel = supabase
      .channel('customer-quote-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'custom_quote_requests',
          filter: `customer_id=eq.${user.id}`
        },
        () => fetchQuoteRequests()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_submissions'
        },
        () => fetchQuoteRequests()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    quoteRequests,
    loading,
    acceptQuote,
    refetch: fetchQuoteRequests
  };
};
