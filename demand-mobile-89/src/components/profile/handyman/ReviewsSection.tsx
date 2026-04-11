
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Star, User, Calendar } from 'lucide-react';
import { useRealRatings } from '@/hooks/useRealRatings';
import { formatDistanceToNow } from 'date-fns';

interface ReviewsSectionProps {
  providerId: string;
  providerName?: string;
}

export const ReviewsSection = ({ providerId, providerName }: ReviewsSectionProps) => {
  const { reviews, loading, averageRating, totalReviews } = useRealRatings(providerId);

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return {
      rating,
      count,
      percentage
    };
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>Customer Reviews</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span>Customer Reviews</span>
          {totalReviews > 0 && (
            <div className="ml-auto flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold">{averageRating.toFixed(1)}</span>
              </div>
              <span className="text-gray-500">({totalReviews} reviews)</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {totalReviews > 0 && (
          <div className="space-y-4">
            {/* Slide Graph Rating Distribution */}
            <div>
              <h4 className="font-medium text-gray-800 mb-4">Rating Distribution</h4>
              <div className="space-y-3">
                {ratingDistribution.map((item) => (
                  <div key={item.rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-medium">{item.rating}</span>
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    </div>
                    
                    <div className="flex-1 relative">
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-16 text-right">
                      <span className="text-sm text-gray-600">{item.count}</span>
                      <span className="text-xs text-gray-500">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reviews */}
            <div>
              <h4 className="font-medium text-gray-800 mb-3">Recent Reviews</h4>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="font-medium text-gray-900 truncate">{review.customer.full_name}</h5>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                            ))}
                            {[...Array(5 - review.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-gray-300" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 flex-shrink-0">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
                        {review.job.title}
                      </span>
                    </div>
                    
                    {review.review_text && (
                      <p className="text-gray-700 text-sm leading-relaxed">{review.review_text}</p>
                    )}
                  </div>
                ))}
                
                {reviews.length > 5 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Showing 5 of {reviews.length} reviews
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {totalReviews === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-base mb-2">No reviews yet</p>
            <p className="text-sm text-gray-400">
              This {providerName ? 'handyman' : 'provider'} hasn't received any reviews yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
