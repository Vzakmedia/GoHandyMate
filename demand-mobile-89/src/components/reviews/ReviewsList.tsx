import { Star, MessageSquare, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  customer: { full_name: string };
  provider: { full_name: string };
  job: { title: string };
}

interface ReviewsListProps {
  reviews: Review[];
  loading: boolean;
  totalReviews: number;
}

export const ReviewsList = ({ reviews, loading, totalReviews }: ReviewsListProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <MessageSquare className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No Reviews Yet</h3>
        <p className="text-muted-foreground">Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-foreground">{review.customer.full_name}</h3>
                  <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                    Verified Customer
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Service: <span className="font-medium">{review.job.title}</span> by {review.provider.full_name}
                </p>
              </div>
              <div className="text-right">
                <div className="flex text-yellow-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < review.rating ? "fill-current" : ""} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            
            {review.review_text && (
              <p className="text-foreground leading-relaxed mb-4">{review.review_text}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{review.rating} out of 5</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <span className="text-sm">#{review.id.slice(-8)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Show count */}
      {reviews.length > 0 && (
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Showing {reviews.length} of {totalReviews} reviews
          </p>
        </div>
      )}
    </>
  );
};