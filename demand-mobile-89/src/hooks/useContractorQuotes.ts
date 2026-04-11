import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ContractorQuoteRequest {
  id: string;
  customer_id: string;
  contractor_id: string;
  service_name: string;
  service_description: string;
  location: string;
  preferred_date?: string;
  budget_range?: string;
  urgency: string;
  status: string;
  created_at: string;
  updated_at: string;
  accepted_quote_id?: string;
  profiles?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
  } | null;
}

export interface ContractorQuoteSubmission {
  id: string;
  quote_request_id: string;
  customer_id: string;
  quoted_price: number;
  quote_number?: string;
  description: string;
  estimated_hours?: number;
  availability_note?: string;
  materials_included?: boolean;
  materials_cost?: number;
  travel_fee?: number;
  valid_until?: string;
  status: string;
  terms_conditions?: string;
  payment_terms?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
  } | null;
  contractor_quote_requests?: {
    id: string;
    contractor_id: string;
    service_name: string;
    service_description: string;
    location: string;
    profiles?: {
      id: string;
      full_name: string;
      email: string;
    } | null;
  } | null;
}

export const useContractorQuotes = () => {
  const { user } = useAuth();
  const [sentRequests, setSentRequests] = useState<ContractorQuoteRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<ContractorQuoteRequest[]>([]);
  const [mySubmissions, setMySubmissions] = useState<ContractorQuoteSubmission[]>([]);
  const [receivedSubmissions, setReceivedSubmissions] = useState<ContractorQuoteSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSentRequests = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('contractor_quote_requests')
        .select(`
          *,
          profiles:customer_id (
            id,
            full_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('contractor_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setSentRequests((data as any) || []);
    } catch (error) {
      console.error('Error fetching sent requests:', error);
      toast.error('Failed to load sent requests');
    }
  }, [user]);

  const fetchReceivedRequests = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('contractor_quote_requests')
        .select(`
          *,
          profiles:contractor_id (
            id,
            full_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setReceivedRequests((data as any) || []);
    } catch (error) {
      console.error('Error fetching received requests:', error);
      toast.error('Failed to load received requests');
    }
  }, [user]);

  const fetchMySubmissions = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('contractor_quote_submissions')
        .select(`
          *,
          profiles:customer_id (
            id,
            full_name,
            email,
            phone,
            avatar_url
          ),
          contractor_quote_requests:quote_request_id (
            id,
            service_name,
            service_description,
            location,
            contractor_id,
            profiles:contractor_id (
              id,
              full_name,
              email
            )
          )
        `)
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setMySubmissions((data as any) || []);
    } catch (error) {
      console.error('Error fetching my submissions:', error);
      toast.error('Failed to load my submissions');
    }
  }, [user]);

  const fetchReceivedSubmissions = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('contractor_quote_submissions')
        .select(`
          *,
          profiles:customer_id (
            id,
            full_name,
            email,
            phone,
            avatar_url
          ),
          contractor_quote_requests:quote_request_id (
            id,
            service_name,
            service_description,
            location,
            contractor_id,
            profiles:contractor_id (
              id,
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setReceivedSubmissions((data as any) || []);
    } catch (error) {
      console.error('Error fetching received submissions:', error);
      toast.error('Failed to load received submissions');
    }
  }, [user]);

  const generateQuoteNumber = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 3);
    return `Q-${timestamp}-${random}`.toUpperCase();
  };

  const createQuoteRequest = useCallback(async (requestData: any) => {
    // Placeholder for create quote request functionality
    return { success: true };
  }, []);

  const submitQuote = useCallback(async (quoteData: {
    quote_request_id: string;
    customer_id: string;
    quoted_price: number;
    description: string;
    estimated_hours?: number;
    materials_cost?: number;
    materials_included?: boolean;
    availability_note?: string;
    travel_fee?: number;
    notes?: string;
  }) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('contractor_quote_submissions')
        .insert({
          ...quoteData,
          quote_number: generateQuoteNumber(),
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        });

      if (error) throw error;

      toast.success('Quote submitted successfully');
      await fetchMySubmissions();
      return true;
    } catch (error) {
      console.error('Error submitting quote:', error);
      toast.error('Failed to submit quote');
      return false;
    }
  }, [user, fetchMySubmissions]);

  const acceptQuote = useCallback(async (requestId: string, submissionId: string) => {
    try {
      const { error } = await supabase
        .from('contractor_quote_requests')
        .update({ 
          accepted_quote_id: submissionId,
          status: 'accepted' 
        })
        .eq('id', requestId);

      if (error) throw error;

      toast.success('Quote accepted successfully');
      await Promise.all([
        fetchSentRequests(),
        fetchReceivedRequests(),
        fetchReceivedSubmissions()
      ]);
    } catch (error) {
      console.error('Error accepting quote:', error);
      toast.error('Failed to accept quote');
    }
  }, [fetchSentRequests, fetchReceivedRequests, fetchReceivedSubmissions]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const requestsChannel = supabase
      .channel('contractor-quote-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contractor_quote_requests',
          filter: `contractor_id=eq.${user.id}`,
        },
        () => {
          fetchSentRequests();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contractor_quote_requests',
          filter: `customer_id=eq.${user.id}`,
        },
        () => {
          fetchReceivedRequests();
        }
      )
      .subscribe();

    const submissionsChannel = supabase
      .channel('contractor-quote-submissions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contractor_quote_submissions',
        },
        () => {
          fetchMySubmissions();
          fetchReceivedSubmissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(requestsChannel);
      supabase.removeChannel(submissionsChannel);
    };
  }, [user, fetchSentRequests, fetchReceivedRequests, fetchMySubmissions, fetchReceivedSubmissions]);

  // Initial data fetch
  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        fetchSentRequests(),
        fetchReceivedRequests(),
        fetchMySubmissions(),
        fetchReceivedSubmissions()
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [user, fetchSentRequests, fetchReceivedRequests, fetchMySubmissions, fetchReceivedSubmissions]);

  return {
    sentRequests,
    receivedRequests,
    mySubmissions,
    receivedSubmissions,
    loading,
    createQuoteRequest,
    submitQuote,
    acceptQuote,
    refreshData: () => {
      fetchSentRequests();
      fetchReceivedRequests();
      fetchMySubmissions();
      fetchReceivedSubmissions();
    }
  };
};