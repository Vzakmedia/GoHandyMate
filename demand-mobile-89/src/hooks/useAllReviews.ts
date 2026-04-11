import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

export interface AllReviewsData {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  customer: {
    full_name: string;
  };
  job: {
    title: string;
  };
  provider: {
    full_name: string;
  };
}

export interface ReviewsStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
  reviews: AllReviewsData[];
  loading: boolean;
}

export const useAllReviews = (): ReviewsStats => {
  const [reviewsData, setReviewsData] = useState<ReviewsStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    reviews: [],
    loading: true
  });

  const fetchAllReviews = async () => {
    try {
      console.log('useAllReviews: Fetching all reviews');
      
      // Fetch all ratings - no authentication required for public reviews page
      const { data: ratings, error } = await supabase
        .from('job_ratings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50); // Limit to 50 most recent reviews

      if (error) {
        console.error('useAllReviews: Error fetching ratings:', error);
        setReviewsData(prev => ({ ...prev, loading: false }));
        return;
      }

      console.log('useAllReviews: Ratings fetched successfully:', ratings?.length, 'reviews found');

      if (!ratings || ratings.length === 0) {
        console.log('useAllReviews: No ratings found');
        setReviewsData({
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          reviews: [],
          loading: false
        });
        return;
      }

      // Calculate stats
      const totalReviews = ratings.length;
      const averageRating = totalReviews > 0 
        ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalReviews 
        : 0;

      // Calculate rating distribution
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      ratings.forEach(rating => {
        ratingDistribution[rating.rating as keyof typeof ratingDistribution]++;
      });

      // Fetch customer, job, and provider details
      const reviewsWithDetails = await Promise.all(
        ratings.map(async (rating) => {
          // Fetch customer details
          const { data: customer } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', rating.customer_id)
            .single();

          // Fetch job details
          const { data: job } = await supabase
            .from('job_requests')
            .select('title')
            .eq('id', rating.job_id)
            .single();

          // Fetch provider details
          const { data: provider } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', rating.provider_id)
            .single();

          return {
            id: rating.id,
            rating: rating.rating,
            review_text: rating.review_text,
            created_at: rating.created_at,
            customer: {
              full_name: customer?.full_name || 'Anonymous Customer'
            },
            job: {
              title: job?.title || 'Service'
            },
            provider: {
              full_name: provider?.full_name || 'Service Provider'
            }
          };
        })
      );

      console.log('useAllReviews: Final processed reviews:', reviewsWithDetails);

      setReviewsData({
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        ratingDistribution,
        reviews: reviewsWithDetails,
        loading: false
      });
    } catch (error) {
      console.error('useAllReviews: Error in fetchAllReviews:', error);
      setReviewsData(prev => ({ ...prev, loading: false }));
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchAllReviews();

    const channel = supabase
      .channel('all-ratings-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_ratings'
        },
        (payload) => {
          console.log('useAllReviews: Real-time rating update received:', payload);
          fetchAllReviews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return reviewsData;
};