
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth';
import { CustomQuoteRequest, QuoteSubmission, CreateQuoteRequestData, SubmitQuoteData } from './useCustomQuotes/types';
import { useQuoteRealtimeSubscriptions } from './useCustomQuotes/realtimeSubscriptions';
import * as api from './useCustomQuotes/apiOperations';

export const useCustomQuotes = () => {
  const { user } = useAuth();
  const [quoteRequests, setQuoteRequests] = useState<CustomQuoteRequest[]>([]);
  const [myQuotes, setMyQuotes] = useState<QuoteSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Memoized API functions
  const handleCreateQuoteRequest = useCallback(async (requestData: CreateQuoteRequestData) => {
    return api.createQuoteRequest(user?.id || '', requestData);
  }, [user?.id]);

  const handleSubmitQuote = useCallback(async (quoteData: SubmitQuoteData) => {
    const result = await api.submitQuote(user?.id || '', quoteData);
    
    // Refresh data immediately after submitting quote
    await Promise.all([
      refreshMyQuotes(),
      refreshQuoteRequests()
    ]);
    
    return result;
  }, [user?.id]);

  const handleAcceptQuote = useCallback(async (requestId: string, quoteId: string) => {
    await api.acceptQuote(requestId, quoteId);
    await refreshMyQuoteRequests();
  }, []);

  // Data fetching functions
  const refreshQuoteRequests = useCallback(async () => {
    // Pass user ID to filter out requests where handyman already submitted quotes
    const data = await api.fetchQuoteRequests(user?.id);
    setQuoteRequests(data);
  }, [user?.id]);

  const refreshMyQuotes = useCallback(async () => {
    if (!user?.id) return;
    const data = await api.fetchMyQuotes(user.id);
    setMyQuotes(data);
  }, [user?.id]);

  const refreshMyQuoteRequests = useCallback(async () => {
    if (!user?.id) return;
    const data = await api.fetchMyQuoteRequests(user.id);
    setQuoteRequests(data);
  }, [user?.id]);

  const handleGetQuotesForRequest = useCallback(async (requestId: string) => {
    return api.getQuotesForRequest(requestId);
  }, []);

  // Real-time subscriptions
  useQuoteRealtimeSubscriptions(
    user?.id,
    refreshQuoteRequests,
    () => {
      refreshMyQuotes();
      refreshQuoteRequests();
    }
  );

  // Initial data fetch
  useEffect(() => {
    if (user) {
      console.log('Initial live data fetch for user:', user.id);
      setLoading(true);
      
      Promise.all([
        refreshQuoteRequests(),
        refreshMyQuotes(),
        refreshMyQuoteRequests()
      ]).catch(error => {
        console.error('Error during initial data fetch:', error);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user, refreshQuoteRequests, refreshMyQuotes, refreshMyQuoteRequests]);

  return {
    quoteRequests,
    myQuotes,
    loading,
    createQuoteRequest: handleCreateQuoteRequest,
    submitQuote: handleSubmitQuote,
    acceptQuote: handleAcceptQuote,
    fetchQuoteRequests: refreshQuoteRequests,
    fetchMyQuotes: refreshMyQuotes,
    fetchMyQuoteRequests: refreshMyQuoteRequests,
    getQuotesForRequest: handleGetQuotesForRequest
  };
};

// Re-export types for backward compatibility
export type { CustomQuoteRequest, QuoteSubmission } from './useCustomQuotes/types';
