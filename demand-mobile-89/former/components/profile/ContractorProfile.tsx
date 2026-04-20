
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, MapPin, Phone, Mail, Calendar, CheckCircle, Award, Clock } from 'lucide-react';
import { useRealRatings, CustomerReview } from '@/hooks/useRealRatings';
import { useAuth } from '@/features/auth';
import { useUnifiedHandymanMetrics } from '@/hooks/useUnifiedHandymanMetrics';

interface Professional {
  id: string;
  full_name: string;
  user_role: 'handyman';
  avatar_url?: string;
  subscription_plan?: string;
  account_status: string;
  created_at: string;
  business_name?: string;
  company_name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface ContractorProfileProps {
  profileId: string;
  profileData: Professional;
}

export const ContractorProfile = ({ profileId, profileData }: ContractorProfileProps) => {
  const { user } = useAuth();
  const { metrics } = useUnifiedHandymanMetrics();
  const { averageRating, totalReviews, reviews, loading } = useRealRatings(profileId);

  const getDisplayName = () => {
    return profileData.business_name || profileData.company_name || profileData.full_name;
  };

  const getInitials = () => {
    const displayName = getDisplayName();
    return displayName.split(' ').map(n => n[0]).join('');
  };

  const yearsInBusiness = profileData.created_at ? 
    Math.max(1, new Date().getFullYear() - new Date(profileData.created_at).getFullYear()) : 1;

  const memberSince = new Date(profileData.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  const handleBookNow = () => {
    // Navigate to booking flow
    console.log('Book contractor:', profileId);
  };

  const handleContact = () => {
    // Open contact modal or navigate to contact page
    console.log('Contact contractor:', profileId);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage 
                  src={profileData.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileId}`}
                  alt={getDisplayName()}
                />
                <AvatarFallback className="text-xl font-bold bg-blue-500 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{getDisplayName()}</h1>
                {profileData.business_name && profileData.full_name && (
                  <p className="text-lg text-gray-600">Owner: {profileData.full_name}</p>
                )}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                  <Badge variant="outline">Contractor</Badge>
                  {profileData.account_status === 'active' && (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-1">
                  {renderStars(averageRating)}
                  <span className="font-semibold ml-1">{averageRating.toFixed(1)}</span>
                  <span className="text-gray-500">({totalReviews} reviews)</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">{metrics.totalCompletedJobs}</span>
                  <span className="text-gray-500">projects completed</span>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start space-x-1 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Member since {memberSince}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <Button onClick={handleContact} variant="outline" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Contact
                </Button>
                <Button onClick={handleBookNow} className="flex-1 bg-green-600 hover:bg-green-700">
                  Get Quote
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Details */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>{profileData.email}</span>
            </div>
            {profileData.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{profileData.phone}</span>
              </div>
            )}
            {profileData.address && (
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{profileData.address}</span>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span>{yearsInBusiness} years in business</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Customer Reviews</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {renderStars(averageRating)}
              </div>
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-gray-500">({totalReviews} reviews)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No reviews yet</p>
            </div>
          ) : (
            reviews.map((review: CustomerReview) => (
              <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{review.customer.full_name}</span>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.job.title}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.review_text && (
                  <p className="text-gray-700">{review.review_text}</p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
