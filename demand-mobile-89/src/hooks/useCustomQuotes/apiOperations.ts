
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CreateQuoteRequestData, SubmitQuoteData } from './types';
import { transformQuoteRequests } from './dataTransformers';

export const createQuoteRequest = async (userId: string, requestData: CreateQuoteRequestData) => {
  if (!userId) throw new Error('User not authenticated');

  try {
    const { data, error } = await supabase.functions.invoke('quote-operations', {
      body: {
        action: 'create_quote_request',
        customer_id: userId,
        ...requestData
      }
    });

    if (error) throw error;
    
    toast.success('Quote request created successfully!');
    return data.data;
  } catch (error: any) {
    console.error('Error creating quote request:', error);
    toast.error('Failed to create quote request');
    throw error;
  }
};

export const submitQuote = async (userId: string, quoteData: SubmitQuoteData) => {
  if (!userId) throw new Error('User not authenticated');

  try {
    console.log('Submitting quote:', quoteData);
    
    const { data, error } = await supabase.functions.invoke('quote-operations', {
      body: {
        action: 'submit_quote',
        handyman_id: userId,
        ...quoteData
      }
    });

    if (error) throw error;
    
    toast.success('Quote submitted successfully!');
    return data.data;
  } catch (error: any) {
    console.error('Error submitting quote:', error);
    toast.error('Failed to submit quote');
    throw error;
  }
};

export const acceptQuote = async (requestId: string, quoteId: string) => {
  try {
    const { error } = await supabase.functions.invoke('quote-operations', {
      body: {
        action: 'accept_quote',
        request_id: requestId,
        quote_id: quoteId
      }
    });

    if (error) throw error;
    
    toast.success('Quote accepted! Job has been created.');
  } catch (error: any) {
    console.error('Error accepting quote:', error);
    toast.error('Failed to accept quote');
    throw error;
  }
};

export const fetchQuoteRequests = async (userId?: string) => {
  try {
    console.log('Fetching live quote requests for handyman...', userId);
    
    // Base query for pending quote requests
    let query = supabase
      .from('custom_quote_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    const { data: requests, error: requestsError } = await query;

    if (requestsError) {
      console.error('Supabase error:', requestsError);
      throw requestsError;
    }

    // If userId is provided, filter out requests where this handyman already submitted a quote
    let filteredRequests = requests || [];
    
    if (userId) {
      // Get quote submissions for this handyman
      const { data: handymanQuotes } = await supabase
        .from('quote_submissions')
        .select('quote_request_id')
        .eq('handyman_id', userId);

      const submittedRequestIds = new Set(
        handymanQuotes?.map(quote => quote.quote_request_id) || []
      );

      // Filter out requests where handyman already submitted a quote
      filteredRequests = filteredRequests.filter(
        request => !submittedRequestIds.has(request.id)
      );
    }

    // Get profile information for each customer
    const requestsWithProfiles = await Promise.all(
      filteredRequests.map(async (request) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', request.customer_id)
          .single();

        return {
          ...request,
          profiles: profile
        };
      })
    );
    
    console.log('Live quote requests fetched:', requestsWithProfiles);
    return transformQuoteRequests(requestsWithProfiles);
  } catch (error: any) {
    console.error('Error fetching quote requests:', error);
    toast.error('Failed to load quote requests');
    return [];
  }
};

export const fetchMyQuotes = async (userId: string) => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase.functions.invoke('quote-operations', {
      body: { 
        action: 'get_my_quotes',
        userId: userId
      }
    });

    if (error) throw error;
    return data.data || [];
  } catch (error: any) {
    console.error('Error fetching my quotes:', error);
    return [];
  }
};

export const fetchMyQuoteRequests = async (userId: string) => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('custom_quote_requests')
      .select('*')
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching quote requests:', error);
    return [];
  }
};

export const getQuotesForRequest = async (requestId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('quote-operations', {
      body: { 
        action: 'get_received_quotes',
        requestId: requestId
      }
    });

    if (error) throw error;
    return data.data || [];
  } catch (error: any) {
    console.error('Error fetching quotes for request:', error);
    return [];
  }
};
