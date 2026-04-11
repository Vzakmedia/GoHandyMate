
import { useAuth } from '@/features/auth';
import { RealReviewsDisplay } from './RealReviewsDisplay';

export const ReviewsTab = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please log in to view reviews</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RealReviewsDisplay providerId={user.id} />
    </div>
  );
};
