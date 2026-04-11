import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useToast } from '@/hooks/use-toast';

export interface UserReview {
  id: string;
  reviewer_id: string;
  reviewed_user_id: string;
  rating: number;
  review_text?: string;
  created_at: string;
  updated_at: string;
  reviewer_profile?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export const useUserReviews = (userId?: string) => {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchReviews = async (targetUserId?: string) => {
    const reviewUserId = targetUserId || user?.id;
    if (!reviewUserId) return;

    try {
      setLoading(true);
      
      const { data: reviewsData, error } = await supabase
        .from('user_reviews')
        .select('*')
        .eq('reviewed_user_id', reviewUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get reviewer profiles separately
      const reviewerIds = [...new Set(reviewsData?.map(r => r.reviewer_id) || [])];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', reviewerIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      const formattedReviews = reviewsData?.map(review => ({
        ...review,
        reviewer_profile: profilesMap.get(review.reviewer_id)
      })) || [];

      setReviews(formattedReviews);
      setTotalReviews(formattedReviews.length);

      // Calculate average rating
      if (formattedReviews.length > 0) {
        const sum = formattedReviews.reduce((acc, review) => acc + review.rating, 0);
        setAverageRating(Number((sum / formattedReviews.length).toFixed(1)));
      } else {
        setAverageRating(0);
      }

    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewedUserId: string, rating: number, reviewText?: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_reviews')
        .insert({
          reviewer_id: user.id,
          reviewed_user_id: reviewedUserId,
          rating,
          review_text: reviewText
        });

      if (error) throw error;

      toast({
        title: "Review Submitted",
        description: "Your review has been posted successfully!",
      });

      await fetchReviews(reviewedUserId);
      return true;
    } catch (error) {
      console.error('Error creating review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateReview = async (reviewId: string, rating: number, reviewText?: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_reviews')
        .update({
          rating,
          review_text: reviewText
        })
        .eq('id', reviewId)
        .eq('reviewer_id', user.id);

      if (error) throw error;

      toast({
        title: "Review Updated",
        description: "Your review has been updated successfully!",
      });

      await fetchReviews();
      return true;
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_reviews')
        .delete()
        .eq('id', reviewId)
        .eq('reviewer_id', user.id);

      if (error) throw error;

      toast({
        title: "Review Deleted",
        description: "Your review has been deleted",
      });

      await fetchReviews();
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchReviews(userId);
  }, [user, userId]);

  return {
    reviews,
    averageRating,
    totalReviews,
    loading,
    createReview,
    updateReview,
    deleteReview,
    refetch: () => fetchReviews(userId)
  };
};