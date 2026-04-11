
import { supabase } from '@/integrations/supabase/client';
import type { JobData } from './types';

export const fetchJobsData = async (userId: string): Promise<JobData[]> => {
  console.log('jobDataFetcher: Starting to fetch jobs for user:', userId);

  if (!userId) {
    console.error('jobDataFetcher: No userId provided');
    throw new Error('User ID is required');
  }

  try {
    // Check if user is authenticated first
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('jobDataFetcher: Session error:', sessionError);
      throw new Error('Authentication session error');
    }

    if (!session) {
      console.error('jobDataFetcher: No active session');
      throw new Error('No active authentication session');
    }

    console.log('jobDataFetcher: Session verified, fetching regular jobs...');

    // Fetch regular jobs with better error handling
    let regularJobs = [];
    try {
      const { data: regularJobsResponse, error: regularJobsError } = await supabase.functions.invoke('handyman-jobs', {
        body: { 
          userId: userId,
          jobType: 'my_jobs' 
        }
      });

      if (regularJobsError) {
        console.error('jobDataFetcher: Regular jobs error:', regularJobsError);
        throw new Error(`Failed to fetch regular jobs: ${regularJobsError.message}`);
      }

      regularJobs = regularJobsResponse || [];
      console.log('jobDataFetcher: Regular jobs fetched:', regularJobs.length);
    } catch (error) {
      console.error('jobDataFetcher: Exception fetching regular jobs:', error);
      throw new Error(`Regular jobs fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Fetch quote jobs with better error handling
    let quoteJobs = [];
    try {
      console.log('jobDataFetcher: Fetching quote jobs...');
      const { data: quoteJobsResponse, error: quoteJobsError } = await supabase.functions.invoke('quote-operations', {
        body: { 
          action: 'get_my_quotes',
          userId: userId
        }
      });

      if (quoteJobsError) {
        console.warn('jobDataFetcher: Quote jobs error (continuing with regular jobs only):', quoteJobsError);
        quoteJobs = [];
      } else {
        quoteJobs = quoteJobsResponse?.data || [];
        console.log('jobDataFetcher: Quote jobs fetched:', quoteJobs.length);
      }
    } catch (error) {
      console.warn('jobDataFetcher: Exception fetching quote jobs (continuing with regular jobs only):', error);
      quoteJobs = [];
    }
    
    console.log('jobDataFetcher: Processing regular jobs...');
    
    // Transform regular jobs to JobData format, excluding custom_quote jobs that are handled separately
    const transformedRegularJobs: JobData[] = (regularJobs || [])
      .filter((job: any) => {
        if (!job) {
          console.warn('jobDataFetcher: Skipping null/undefined job');
          return false;
        }
        if (job.job_type === 'custom_quote') {
          console.log('jobDataFetcher: Excluding custom_quote job from regular jobs:', job.id);
          return false;
        }
        return true;
      })
      .map((job: any) => {
        try {
          return {
            id: job.id,
            title: job.title || 'Untitled Job',
            description: job.description || '',
            status: job.status,
            budget: job.budget || 0,
            created_at: job.created_at,
            updated_at: job.updated_at,
            preferred_schedule: job.preferred_schedule,
            customer_id: job.customer_id,
            assigned_to_user_id: job.assigned_to_user_id,
            job_type: job.job_type || 'regular',
            priority: job.priority || 'medium',
            location: job.units?.property_address || job.location || 'Location not specified',
            units: job.units
          };
        } catch (error) {
          console.error('jobDataFetcher: Error transforming regular job:', job, error);
          return null;
        }
      })
      .filter(Boolean); // Remove null entries

    console.log('jobDataFetcher: Processing quote jobs...');

    // Transform quote jobs to JobData format
    const transformedQuoteJobs: JobData[] = quoteJobs
      .map((quote: any) => {
        try {
          if (!quote || !quote.custom_quote_requests) {
            console.warn('jobDataFetcher: Skipping invalid quote job:', quote);
            return null;
          }

          let jobStatus = quote.status;
          let jobTitle = '';

          // Determine job status and title based on quote status and request status
          if (quote.status === 'pending' && quote.custom_quote_requests?.status === 'pending') {
            jobStatus = 'pending';
            jobTitle = `Pending Quote: ${quote.custom_quote_requests?.service_name || 'Service'}`;
          } else if (quote.status === 'accepted' || quote.custom_quote_requests?.status === 'accepted') {
            jobStatus = 'assigned';
            jobTitle = `Quote Job: ${quote.custom_quote_requests?.service_name || 'Service'}`;
          } else if (quote.status === 'completed') {
            jobStatus = 'completed';
            jobTitle = `Completed Quote Job: ${quote.custom_quote_requests?.service_name || 'Service'}`;
          } else if (quote.status === 'in_progress') {
            jobStatus = 'in_progress';
            jobTitle = `Quote Job: ${quote.custom_quote_requests?.service_name || 'Service'}`;
          } else if (quote.status === 'cancelled' || quote.status === 'rejected') {
            jobStatus = 'cancelled';
            jobTitle = `Cancelled Quote: ${quote.custom_quote_requests?.service_name || 'Service'}`;
          } else {
            console.warn('jobDataFetcher: Skipping quote with unknown status:', quote.status);
            return null;
          }

          return {
            id: `quote-${quote.id}`,
            title: jobTitle,
            description: quote.description || '',
            status: jobStatus,
            budget: quote.quoted_price || 0,
            created_at: quote.created_at,
            updated_at: quote.updated_at || quote.created_at,
            preferred_schedule: quote.custom_quote_requests?.preferred_date || quote.created_at,
            customer_id: quote.custom_quote_requests?.customer_id || '',
            assigned_to_user_id: quote.handyman_id,
            job_type: 'custom_quote',
            priority: 'medium',
            location: quote.custom_quote_requests?.location || 'Location not specified',
            units: null
          };
        } catch (error) {
          console.error('jobDataFetcher: Error transforming quote job:', quote, error);
          return null;
        }
      })
      .filter(Boolean); // Remove null entries

    // Combine all jobs
    const allJobs = [...transformedRegularJobs, ...transformedQuoteJobs];
    
    console.log('jobDataFetcher: Final job counts:', {
      regularJobs: transformedRegularJobs.length,
      quoteJobs: transformedQuoteJobs.length,
      totalJobs: allJobs.length,
      pendingJobs: allJobs.filter(job => job.status === 'pending').length,
      assignedJobs: allJobs.filter(job => job.status === 'assigned').length,
      completedJobs: allJobs.filter(job => job.status === 'completed').length
    });
    
    return allJobs;
  } catch (error: any) {
    console.error('jobDataFetcher: Critical error in fetchJobsData:', error);
    throw new Error(`Failed to fetch job data: ${error.message || 'Unknown error occurred'}`);
  }
};
