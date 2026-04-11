
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Star, Camera, ThumbsUp, Flag, MessageSquare, Calendar, MapPin, Clock } from "lucide-react";

interface Review {
  id: string;
  jobId: string;
  jobTitle: string;
  providerName: string;
  providerAvatar: string;
  providerType: 'handyman' | 'contractor';
  rating: number;
  review: string;
  images?: string[];
  completedDate: string;
  location: string;
  category: string;
  cost: number;
  reviewDate: string;
  helpful: number;
  isHelpful?: boolean;
}

interface PendingReview {
  id: string;
  jobId: string;
  jobTitle: string;
  providerName: string;
  providerAvatar: string;
  providerType: 'handyman' | 'contractor';
  completedDate: string;
  location: string;
  category: string;
  cost: number;
}

interface ReviewSystemProps {
  userType: 'customer' | 'property_manager';
}

export const ReviewSystem = ({ userType }: ReviewSystemProps) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [selectedReview, setSelectedReview] = useState<PendingReview | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingReviews: PendingReview[] = [
    {
      id: "1",
      jobId: "job-001",
      jobTitle: "Kitchen Faucet Repair",
      providerName: "Mike Rodriguez",
      providerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      providerType: "handyman",
      completedDate: "2024-06-15",
      location: "Downtown Apartment",
      category: "Plumbing",
      cost: 125
    },
    {
      id: "2",
      jobId: "job-002",
      jobTitle: "Bathroom Renovation",
      providerName: "Elite Construction Co.",
      providerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      providerType: "contractor",
      completedDate: "2024-06-18",
      location: "Midtown House",
      category: "Construction",
      cost: 3500
    }
  ];

  const completedReviews: Review[] = [
    {
      id: "1",
      jobId: "job-003",
      jobTitle: "Living Room Paint Touch-up",
      providerName: "Emily Chen",
      providerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
      providerType: "handyman",
      rating: 5,
      review: "Emily did an outstanding job with the paint touch-up. She was professional, punctual, and paid great attention to detail. The color matching was perfect and the finish looks seamless. Highly recommend her services!",
      completedDate: "2024-06-10",
      location: "Uptown Condo",
      category: "Painting",
      cost: 85,
      reviewDate: "2024-06-11",
      helpful: 12
    },
    {
      id: "2",
      jobId: "job-004",
      jobTitle: "Deck Construction",
      providerName: "BuildRight Contractors",
      providerAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=50&h=50&fit=crop&crop=face",
      providerType: "contractor",
      rating: 4,
      review: "Great work on the deck construction. The team was professional and completed the project on time. Quality is excellent and the design exceeded our expectations. Only minor issue was some cleanup that needed follow-up.",
      images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop"],
      completedDate: "2024-06-05",
      location: "Suburban Home",
      category: "Construction",
      cost: 4200,
      reviewDate: "2024-06-08",
      helpful: 8
    }
  ];

  const handleSubmitReview = async () => {
    if (!selectedReview || rating === 0) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Review submitted:', {
      jobId: selectedReview.jobId,
      rating,
      review: reviewText,
      providerName: selectedReview.providerName
    });
    
    setSelectedReview(null);
    setRating(0);
    setReviewText('');
    setIsSubmitting(false);
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 cursor-pointer transition-colors ${
          index < currentRating 
            ? "text-yellow-400 fill-current" 
            : "text-gray-300 hover:text-yellow-300"
        }`}
        onClick={interactive ? () => setRating(index + 1) : undefined}
      />
    ));
  };

  const getProviderTypeColor = (type: 'handyman' | 'contractor') => {
    return type === 'handyman' 
      ? 'bg-blue-100 text-blue-700' 
      : 'bg-purple-100 text-purple-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Review System</h2>
          <p className="text-gray-600">
            {userType === 'customer' 
              ? 'Rate and review your service providers' 
              : 'Manage property service reviews'}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pending'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending Reviews ({pendingReviews.length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'completed'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Reviews ({completedReviews.length})
        </button>
      </div>

      {/* Pending Reviews */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingReviews.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={job.providerAvatar}
                      alt={job.providerName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{job.jobTitle}</h3>
                      <p className="text-gray-600 mb-2">{job.providerName}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Completed {job.completedDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{job.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge className={getProviderTypeColor(job.providerType)}>
                          {job.providerType}
                        </Badge>
                        <Badge variant="outline">{job.category}</Badge>
                        <span className="text-lg font-semibold text-green-600">
                          ${job.cost}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setSelectedReview(job)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Write Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Completed Reviews */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {completedReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={review.providerAvatar}
                    alt={review.providerName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{review.jobTitle}</h3>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{review.providerName}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Completed {review.completedDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Reviewed {review.reviewDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-4">
                      <Badge className={getProviderTypeColor(review.providerType)}>
                        {review.providerType}
                      </Badge>
                      <Badge variant="outline">{review.category}</Badge>
                      <span className="text-lg font-semibold text-green-600">
                        ${review.cost}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4">{review.review}</p>

                    {review.images && (
                      <div className="flex space-x-2 mb-4">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Review image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpful} people found this helpful</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Edit Review
                        </Button>
                        <Button variant="outline" size="sm">
                          <Flag className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Write Review</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>

              <div className="flex items-start space-x-4 mb-6">
                <img
                  src={selectedReview.providerAvatar}
                  alt={selectedReview.providerName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-lg">{selectedReview.jobTitle}</h4>
                  <p className="text-gray-600">{selectedReview.providerName}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getProviderTypeColor(selectedReview.providerType)}>
                      {selectedReview.providerType}
                    </Badge>
                    <Badge variant="outline">{selectedReview.category}</Badge>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rate your experience
                </label>
                <div className="flex items-center space-x-1">
                  {renderStars(rating, true)}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Write your review
                </label>
                <Textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this service provider..."
                  rows={4}
                  className="w-full"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add photos (optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    Click to upload photos of the completed work
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setSelectedReview(null)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReview}
                  disabled={rating === 0 || isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
