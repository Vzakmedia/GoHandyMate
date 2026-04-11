
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HandymanReview } from "@/types/handyman";
import { Star, User, Calendar } from "lucide-react";

interface ReviewsDisplayProps {
  reviews: HandymanReview[];
}

export const ReviewsDisplay = ({ reviews }: ReviewsDisplayProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <span>Customer Reviews</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No reviews yet</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 truncate">{review.customer}</h4>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500 flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                  <span>{review.date}</span>
                </div>
              </div>
              
              <div className="mb-3">
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {review.job}
                </Badge>
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
