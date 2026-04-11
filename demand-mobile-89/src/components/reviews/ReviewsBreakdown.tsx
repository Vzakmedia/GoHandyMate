import { Star, Loader2 } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  job: { title: string };
  provider: { full_name: string };
}

interface ReviewsBreakdownProps {
  reviews: Review[];
  loading: boolean;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

export const ReviewsBreakdown = ({ reviews, loading, totalReviews, ratingDistribution }: ReviewsBreakdownProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Rating Distribution */}
      <div className="bg-white p-6 rounded-lg border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-6">Rating Distribution</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingDistribution[stars] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={stars} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm">{stars}</span>
                  <Star size={12} className="text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-700 ease-out" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-muted-foreground w-16 text-right">
                  {count.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Categories - Generate from real data */}
      <div className="bg-white p-6 rounded-lg border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-6">Recent Services</h3>
        <div className="space-y-4">
          {reviews.slice(0, 5).map((review, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{review.job.title}</p>
                <p className="text-sm text-muted-foreground">by {review.provider.full_name}</p>
              </div>
              <div className="flex items-center space-x-1">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="font-medium">{review.rating}</span>
              </div>
            </div>
          ))}
          {reviews.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No services reviewed yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};