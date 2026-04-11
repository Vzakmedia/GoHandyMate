import { useState, useEffect } from 'react';
import { MOCK_REVIEWS, CustomerReview } from '@/mocks/mockReviews';

export const useCustomerReviews = (limit: number = 6) => {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // Using mock data instead of Supabase
        const limitedReviews = MOCK_REVIEWS.slice(0, limit);
        setReviews(limitedReviews);
        console.log('useCustomerReviews - mock data loaded:', limitedReviews.length);
      } catch (err) {
        console.error('Error in useCustomerReviews (Mock Mode):', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [limit]);

  return { reviews, loading, error };
};
