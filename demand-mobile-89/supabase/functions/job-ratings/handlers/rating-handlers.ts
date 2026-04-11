import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { validateRating } from '../utils/validation.ts';
import { findJobData } from '../utils/job-finder.ts';

export async function createRating(supabaseClient: any, userId: string, body: any, corsHeaders: any) {
  // Handle both job_id and jobId for backward compatibility
  const jobId = body.jobId || body.job_id;
  const { rating, reviewText, review_text, providerId } = body;
  const finalReviewText = reviewText || review_text;

  console.log('Creating rating for job:', jobId, 'by user:', userId);
  console.log('Request body:', JSON.stringify(body, null, 2));

  // Validate required fields
  if (!jobId) {
    console.error('No job ID provided in request body');
    return new Response(
      JSON.stringify({ error: 'Job ID is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (!userId) {
    console.error('No user ID provided');
    return new Response(
      JSON.stringify({ error: 'User authentication required' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Validate rating
  const validationError = validateRating(rating);
  if (validationError) {
    console.error('Rating validation failed:', validationError);
    return new Response(
      JSON.stringify({ error: validationError }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Find job data and provider
  const jobResult = await findJobData(supabaseClient, jobId, userId);
  if (jobResult.error) {
    console.error('Job lookup failed:', jobResult.error);
    return new Response(
      JSON.stringify({ error: jobResult.error }),
      { status: jobResult.status || 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log('Job data found successfully:', jobResult.job);

  // Check if rating already exists
  const { data: existingRating, error: existingError } = await supabaseClient
    .from('job_ratings')
    .select('id')
    .eq('job_id', jobResult.job.actualJobId)
    .eq('customer_id', userId)
    .maybeSingle();

  if (existingError) {
    console.error('Error checking existing rating:', existingError);
    return new Response(
      JSON.stringify({ error: 'Failed to check existing rating' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (existingRating) {
    console.error('Rating already exists for this job');
    return new Response(
      JSON.stringify({ error: 'You have already rated this job' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Create the rating using the actual job ID and provider ID
  const { data, error } = await supabaseClient
    .from('job_ratings')
    .insert({
      job_id: jobResult.job.actualJobId, // Use the actual job ID for database storage
      customer_id: userId,
      provider_id: jobResult.job.assigned_to_user_id,
      rating: rating,
      review_text: finalReviewText || null
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating rating:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create rating: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log('Rating created successfully:', data);
  return new Response(
    JSON.stringify({ data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

export async function updateRating(supabaseClient: any, userId: string, body: any, corsHeaders: any) {
  const { ratingId, rating, reviewText } = body;

  console.log('Updating rating:', ratingId, 'by user:', userId);

  if (!ratingId) {
    return new Response(
      JSON.stringify({ error: 'Rating ID is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Validate rating
  const validationError = validateRating(rating);
  if (validationError) {
    return new Response(
      JSON.stringify({ error: validationError }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data, error } = await supabaseClient
    .from('job_ratings')
    .update({
      rating: rating,
      review_text: reviewText || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', ratingId)
    .eq('customer_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating rating:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update rating: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (!data) {
    return new Response(
      JSON.stringify({ error: 'Rating not found or you do not have permission to update it' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log('Rating updated successfully:', data);
  return new Response(
    JSON.stringify({ data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

export async function getJobRating(supabaseClient: any, userId: string, jobId: string, corsHeaders: any) {
  console.log('Getting job rating for jobId:', jobId, 'userId:', userId);

  // Validate required fields
  if (!jobId) {
    return new Response(
      JSON.stringify({ error: 'Job ID is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  if (!userId) {
    return new Response(
      JSON.stringify({ error: 'User authentication required' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let lookupJobId = jobId;
  
  // If it's a custom quote job, we need to find the corresponding job request or submission ID
  if (jobId.startsWith('quote-')) {
    const actualJobId = jobId.replace('quote-', '');
    console.log('Looking up custom quote rating for:', actualJobId);
    
    // First try to find a job request with this ID
    const { data: jobRequest, error: jobError } = await supabaseClient
      .from('job_requests')
      .select('id')
      .eq('id', actualJobId)
      .eq('customer_id', userId)
      .maybeSingle();
    
    if (jobError) {
      console.error('Error checking job request:', jobError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify job request' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (jobRequest) {
      lookupJobId = jobRequest.id;
      console.log('Using job request ID for rating lookup:', lookupJobId);
    } else {
      // If no job request, check if it's a quote request
      const { data: quoteRequest, error: quoteError } = await supabaseClient
        .from('custom_quote_requests')
        .select('id')
        .eq('id', actualJobId)
        .eq('customer_id', userId)
        .maybeSingle();
      
      if (quoteError) {
        console.error('Error verifying quote request ownership:', quoteError);
        return new Response(
          JSON.stringify({ error: 'Failed to verify quote request' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (!quoteRequest) {
        console.log('Quote request not found or not owned by user');
        return new Response(
          JSON.stringify({ data: null }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      const { data: quoteSubmission, error: submissionError } = await supabaseClient
        .from('quote_submissions')
        .select('id')
        .eq('quote_request_id', actualJobId)
        .eq('status', 'accepted')
        .maybeSingle();
      
      if (submissionError) {
        console.error('Error fetching quote submission:', submissionError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch quote data' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (quoteSubmission) {
        lookupJobId = quoteSubmission.id;
        console.log('Using quote submission ID for rating lookup:', lookupJobId);
      } else {
        console.log('No accepted quote submission found, returning null');
        return new Response(
          JSON.stringify({ data: null }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  const { data, error } = await supabaseClient
    .from('job_ratings')
    .select('*')
    .eq('job_id', lookupJobId)
    .eq('customer_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching job rating:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch rating: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log('Job rating retrieved:', data);
  return new Response(
    JSON.stringify({ data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

export async function getProviderRatings(supabaseClient: any, providerId: string, corsHeaders: any) {
  console.log('Getting provider ratings for providerId:', providerId);

  if (!providerId) {
    return new Response(
      JSON.stringify({ error: 'Provider ID is required' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { data, error } = await supabaseClient
    .from('job_ratings')
    .select(`
      *,
      profiles:customer_id (
        full_name
      ),
      job_requests:job_id (
        title
      )
    `)
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching provider ratings:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch ratings: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  console.log('Provider ratings retrieved:', data?.length || 0, 'ratings found');
  return new Response(
    JSON.stringify({ data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
