
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CustomerReview {
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
}

export interface RatingsData {
  averageRating: number;
  totalReviews: number;
  reviews: CustomerReview[];
  loading: boolean;
}

export const useRealRatings = (providerId: string): RatingsData => {
  const [ratingsData, setRatingsData] = useState<RatingsData>({
    averageRating: 0,
    totalReviews: 0,
    reviews: [],
    loading: true
  });

  const fetchRatings = async () => {
    if (!providerId) {
      console.log('useRealRatings: No provider ID provided');
      setRatingsData(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      console.log('useRealRatings: Fetching ratings for provider:', providerId);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('useRealRatings: No active session, cannot fetch ratings');
        setRatingsData({
          averageRating: 0,
          totalReviews: 0,
          reviews: [],
          loading: false
        });
        return;
      }
      
      // Fetch ratings with proper join syntax - simplified to avoid relation errors
      const { data: ratings, error } = await supabase
        .from('job_ratings')
        .select('*')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useRealRatings: Error fetching ratings:', error);
        setRatingsData(prev => ({ ...prev, loading: false }));
        return;
      }

      console.log('useRealRatings: Ratings fetched:', ratings);

      if (!ratings || ratings.length === 0) {
        console.log('useRealRatings: No ratings found for provider');
        setRatingsData({
          averageRating: 0,
          totalReviews: 0,
          reviews: [],
          loading: false
        });
        return;
      }

      const totalReviews = ratings.length;
      const averageRating = totalReviews > 0 
        ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalReviews 
        : 0;

      // Fetch customer and job details separately to avoid relation errors
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
            }
          };
        })
      );

      console.log('useRealRatings: Final processed reviews:', reviewsWithDetails);

      setRatingsData({
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        reviews: reviewsWithDetails,
        loading: false
      });
    } catch (error) {
      console.error('useRealRatings: Error in fetchRatings:', error);
      setRatingsData(prev => ({ ...prev, loading: false }));
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchRatings();

    const channel = supabase
      .channel('ratings-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_ratings',
          filter: `provider_id=eq.${providerId}`
        },
        (payload) => {
          console.log('useRealRatings: Real-time rating update received:', payload);
          fetchRatings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [providerId]);

  return ratingsData;
};
