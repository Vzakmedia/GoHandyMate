import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';

export interface ContractorMetrics {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  pendingQuotes: number;
  acceptedQuotes: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRating: number;
  responseRate: number;
  jobsByStatus: {
    pending: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
  recentActivity: any[];
  quotesData: any[]; // Add quotes data array
  projectsData: any[]; // Add projects data array
}

export const useContractorMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ContractorMetrics>({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    pendingQuotes: 0,
    acceptedQuotes: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    averageRating: 0,
    responseRate: 0,
    jobsByStatus: { pending: 0, in_progress: 0, completed: 0, cancelled: 0 },
    recentActivity: [],
    quotesData: [],
    projectsData: []
  });
  const [loading, setLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Fetch job metrics
      const { data: jobs } = await supabase
        .from('job_requests')
        .select('*')
        .eq('assigned_to_user_id', user.id);

      // Fetch quote submissions
      const { data: quotes } = await supabase
        .from('quote_submissions')
        .select('*')
        .eq('handyman_id', user.id);

      // Fetch contractor quote requests sent
      const { data: contractorQuotes } = await supabase
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
        .eq('contractor_id', user.id);

      // Fetch contractor quote submissions received
      const { data: contractorQuoteSubmissions } = await supabase
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
            contractor_id
          )
        `)
        .eq('customer_id', user.id);

      // Fetch ratings
      const { data: ratings } = await supabase
        .from('job_ratings')
        .select('rating')
        .eq('provider_id', user.id);

      // Calculate metrics
      const totalJobs = jobs?.length || 0;
      const activeJobs = jobs?.filter(job => job.status === 'in_progress').length || 0;
      const completedJobs = jobs?.filter(job => job.status === 'completed').length || 0;
      
      // Count pending quotes from contractor quote requests (requests TO contractor)
      const pendingContractorQuotes = contractorQuotes?.filter(quote => quote.status === 'pending').length || 0;
      // Count pending handyman quotes
      const pendingHandymanQuotes = quotes?.filter(quote => quote.status === 'pending').length || 0;
      const pendingQuotes = pendingContractorQuotes + pendingHandymanQuotes;
      
      // Count accepted quotes
      const acceptedContractorQuotes = contractorQuotes?.filter(quote => quote.status === 'accepted').length || 0;
      const acceptedHandymanQuotes = quotes?.filter(quote => quote.status === 'accepted').length || 0;
      const acceptedQuotes = acceptedContractorQuotes + acceptedHandymanQuotes;

      const totalRevenue = jobs?.reduce((sum, job) => sum + (job.budget || 0), 0) || 0;
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = jobs?.filter(job => {
        const jobDate = new Date(job.created_at);
        return jobDate.getMonth() === currentMonth && jobDate.getFullYear() === currentYear;
      }).reduce((sum, job) => sum + (job.budget || 0), 0) || 0;

      const averageRating = ratings?.length ? 
        ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;

      const jobsByStatus = {
        pending: jobs?.filter(job => job.status === 'pending').length || 0,
        in_progress: jobs?.filter(job => job.status === 'in_progress').length || 0,
        completed: jobs?.filter(job => job.status === 'completed').length || 0,
        cancelled: jobs?.filter(job => job.status === 'cancelled').length || 0
      };

      // Combine all quotes data for the quotes page
      const allQuotes = [
        ...(quotes?.map(q => ({ 
          ...q, 
          source: 'handyman_quotes',
          amount: q.quoted_price,
          clientName: 'Client', // Will be updated when handyman quotes get customer data
          projectTitle: q.description || 'Service Quote'
        })) || []),
        ...(contractorQuotes?.map(q => ({ 
          ...q, 
          source: 'contractor_requests',
          amount: 0,
          clientName: (q as any).profiles?.full_name || 'Customer',
          projectTitle: q.service_name || 'Project Quote'
        })) || []),
        ...(contractorQuoteSubmissions?.map(q => ({ 
          ...q, 
          source: 'contractor_submissions',
          amount: q.quoted_price,
          clientName: (q as any).profiles?.full_name || 'Contractor',
          projectTitle: q.description || 'Quote Submission'
        })) || [])
      ];

      // Recent activity (last 10 items)
      const recentActivity = [
        ...(jobs?.slice(-5).map(job => ({
          type: 'job',
          title: `Job ${job.status}`,
          description: `${job.title || 'Job'} - $${job.budget || 0}`,
          timestamp: job.updated_at,
          status: job.status
        })) || []),
        ...(quotes?.slice(-5).map(quote => ({
          type: 'quote',
          title: `Quote ${quote.status}`,
          description: `Quote submitted - $${quote.quoted_price || 0}`,
          timestamp: quote.created_at,
          status: quote.status
        })) || [])
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

      setMetrics({
        totalJobs,
        activeJobs,
        completedJobs,
        pendingQuotes,
        acceptedQuotes,
        totalRevenue,
        monthlyRevenue,
        averageRating,
        responseRate: quotes?.length ? (acceptedQuotes / quotes.length) * 100 : 0,
        jobsByStatus,
        recentActivity,
        quotesData: allQuotes,
        projectsData: jobs || []
      });
    } catch (error) {
      console.error('Error fetching contractor metrics:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`contractor-metrics-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_requests',
          filter: `assigned_to_user_id=eq.${user.id}`
        },
        fetchMetrics
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quote_submissions',
          filter: `handyman_id=eq.${user.id}`
        },
        fetchMetrics
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contractor_quote_requests',
          filter: `contractor_id=eq.${user.id}`
        },
        fetchMetrics
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_ratings',
          filter: `provider_id=eq.${user.id}`
        },
        fetchMetrics
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchMetrics]);

  // Initial fetch
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, refreshMetrics: fetchMetrics };
};