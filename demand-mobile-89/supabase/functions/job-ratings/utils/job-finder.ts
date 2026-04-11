
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export async function findJobData(supabaseClient: any, jobId: string, userId: string) {
  console.log('Finding job data for jobId:', jobId, 'userId:', userId);

  // Handle different job ID formats
  let actualJobId = jobId;
  let lookupJobId = jobId;
  
  // If it's a custom quote job (starts with 'quote-'), handle it specially
  if (jobId.startsWith('quote-')) {
    actualJobId = jobId.replace('quote-', '');
    console.log('Processing custom quote job, actualJobId:', actualJobId);
    
    // For custom quote jobs, we need to check if this is a completed job request
    // that was created from an accepted quote
    const { data: jobRequest, error: jobError } = await supabaseClient
      .from('job_requests')
      .select('*')
      .eq('id', actualJobId)
      .eq('customer_id', userId)
      .maybeSingle();
    
    if (jobError) {
      console.error('Error fetching job request:', jobError);
      return { error: 'Failed to fetch job request', status: 500 };
    }
    
    if (jobRequest) {
      console.log('Found job request for custom quote:', jobRequest);
      
      // This is a regular job request that can be rated
      return {
        job: {
          id: jobRequest.id,
          actualJobId: jobRequest.id,
          assigned_to_user_id: jobRequest.assigned_to_user_id,
          customer_id: jobRequest.customer_id,
          title: jobRequest.title,
          status: jobRequest.status
        }
      };
    }
    
    // If no job request found, check if it's a quote request ID
    const { data: quoteRequest, error: quoteError } = await supabaseClient
      .from('custom_quote_requests')
      .select('*')
      .eq('id', actualJobId)
      .eq('customer_id', userId)
      .maybeSingle();
    
    if (quoteError) {
      console.error('Error fetching quote request:', quoteError);
      return { error: 'Failed to fetch quote request', status: 500 };
    }
    
    if (!quoteRequest) {
      console.log('Quote request not found or not owned by user, checking if it exists at all');
      
      // Check if the quote request exists but doesn't belong to this user
      const { data: anyQuoteRequest, error: anyQuoteError } = await supabaseClient
        .from('custom_quote_requests')
        .select('id, customer_id')
        .eq('id', actualJobId)
        .maybeSingle();
      
      if (anyQuoteError) {
        console.error('Error checking quote request existence:', anyQuoteError);
        return { error: 'Failed to verify quote request', status: 500 };
      }
      
      if (!anyQuoteRequest) {
        console.error('Quote request does not exist for ID:', actualJobId);
        return { error: 'This job does not exist or cannot be rated', status: 404 };
      } else {
        console.error('Quote request exists but user does not have permission');
        return { error: 'You do not have permission to rate this job', status: 403 };
      }
    }
    
    console.log('Quote request found successfully:', quoteRequest);
    
    // Check if there's an accepted quote submission for this request
    const { data: quoteSubmission, error: submissionError } = await supabaseClient
      .from('quote_submissions')
      .select('id, handyman_id')
      .eq('quote_request_id', actualJobId)
      .eq('status', 'accepted')
      .maybeSingle();
    
    if (submissionError) {
      console.error('Error fetching quote submission:', submissionError);
      return { error: 'Failed to fetch quote data', status: 500 };
    }
    
    if (!quoteSubmission) {
      console.log('No accepted quote submission found for request:', actualJobId);
      return { error: 'This quote has not been accepted yet and cannot be rated', status: 400 };
    }
    
    console.log('Accepted quote submission found:', quoteSubmission);
    
    // For ratings, we use the quote submission ID as the job ID
    // But we return the quote request info for verification
    return {
      job: {
        id: quoteRequest.id,
        actualJobId: quoteSubmission.id, // This is what gets stored in job_ratings
        assigned_to_user_id: quoteSubmission.handyman_id,
        customer_id: quoteRequest.customer_id,
        title: `Custom Quote: ${quoteRequest.service_name}`,
        status: quoteRequest.status
      }
    };
  }
  
  // Handle regular job requests
  console.log('Processing regular job request, jobId:', jobId);
  
  const { data: jobRequest, error: jobError } = await supabaseClient
    .from('job_requests')
    .select('*')
    .eq('id', jobId)
    .maybeSingle();
  
  if (jobError) {
    console.error('Error fetching job request:', jobError);
    return { error: 'Failed to fetch job request', status: 500 };
  }
  
  if (!jobRequest) {
    console.error('Job request not found for ID:', jobId);
    return { error: 'Job request not found', status: 404 };
  }
  
  // Verify the user is either the customer or the assigned provider
  if (jobRequest.customer_id !== userId && jobRequest.assigned_to_user_id !== userId) {
    console.error('User does not have permission to access this job');
    return { error: 'You do not have permission to access this job', status: 403 };
  }
  
  // Only customers can rate jobs
  if (jobRequest.customer_id !== userId) {
    console.error('Only customers can rate jobs');
    return { error: 'Only customers can rate jobs', status: 403 };
  }
  
  // Check if job is completed (optional - you might want to be more restrictive here)
  if (jobRequest.status !== 'completed' && jobRequest.status !== 'assigned') {
    console.log('Job is not completed, status:', jobRequest.status);
    // Note: You might want to be more restrictive here
  }
  
  console.log('Regular job request found successfully:', jobRequest);
  
  return {
    job: {
      id: jobRequest.id,
      actualJobId: jobRequest.id,
      assigned_to_user_id: jobRequest.assigned_to_user_id,
      customer_id: jobRequest.customer_id,
      title: jobRequest.title,
      status: jobRequest.status
    }
  };
}
