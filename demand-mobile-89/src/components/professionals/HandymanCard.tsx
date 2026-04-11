
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, CheckCircle, MessageCircle, User, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HandymanProfileModal } from '@/components/real-time-service-sync/HandymanProfileModal';

interface Professional {
  id: string;
  full_name: string;
  user_role: 'handyman' | 'contractor';
  avatar_url?: string;
  subscription_plan?: string;
  account_status: string;
  created_at: string;
  handyman_data?: {
    hourly_rate?: number;
    skills?: string[];
    phone?: string;
    availability?: string;
  };
  skill_rates?: Array<{
    skill_name: string;
    hourly_rate: number;
    is_active: boolean;
  }>;
  service_pricing?: Array<{
    category_id: string;
    subcategory_id?: string;
    base_price: number;
    custom_price?: number;
    is_active: boolean;
  }>;
  distance?: number;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  isSponsored: boolean;
  isOnline: boolean;
  lastSeen?: string;
  hasRealtimePricing?: boolean;
  averageRate?: number;
  average_rating?: number;
  total_ratings?: number;
  jobs_this_month?: number;
}

interface HandymanCardProps {
  professional: Professional;
  showDistance?: boolean;
  isCarousel?: boolean;
}

export const HandymanCard = ({ professional, showDistance = true, isCarousel = false }: HandymanCardProps) => {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleViewProfile = () => {
    if (professional.user_role === 'handyman') {
      // Show popup modal for handymen
      setShowProfileModal(true);
    } else {
      // Keep current navigation for contractors
      navigate(`/handyman-profile/${professional.id}`);
    }
  };

  const handleMessage = () => {
    // For now, redirect to contact - can be enhanced to open messaging
    navigate(`/contact/${professional.id}`);
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

  // Remove all pricing displays - pricing will only be shown on individual profile pages

  // Get active services count
  const activeServicesCount = (professional.service_pricing?.filter(service => service.is_active) || []).length;
  const activeSkillsCount = (professional.skill_rates?.filter(skill => skill.is_active) || []).length;
  const totalActiveServices = activeServicesCount + activeSkillsCount;

  // Use real data from database instead of mock data
  const displayRating = professional.average_rating || professional.rating || 0;
  const displayReviewCount = professional.total_ratings || professional.reviewCount || 0;

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg border-gray-200 relative ${isCarousel ? 'w-full' : ''}`}>
      {professional.hasRealtimePricing && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-green-500 text-white text-xs animate-pulse">
            <Zap className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={professional.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${professional.id}`}
              alt={professional.full_name}
              className="w-16 h-16 rounded-full object-cover cursor-pointer border-2 border-gray-200"
              onClick={handleViewProfile}
            />
            {professional.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 
                className="font-bold text-lg text-gray-900 truncate cursor-pointer hover:text-green-600"
                onClick={handleViewProfile}
              >
                {professional.full_name}
              </h3>
              {professional.account_status === 'active' && (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              )}
            </div>
            
            <div className="flex items-center space-x-1 mb-2">
              {displayRating > 0 ? (
                <>
                  {renderStars(displayRating)}
                  <span className="text-sm font-medium text-gray-700 ml-1">
                    {displayRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({displayReviewCount} {displayReviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </>
              ) : (
                <span className="text-sm text-gray-500">
                  No reviews yet
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3 text-sm text-gray-600 mb-3">
              {showDistance && professional.distance && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{professional.distance.toFixed(1)} mi away</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{professional.experienceYears} years exp</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                Handyman
              </Badge>
              <Badge variant="outline" className="text-xs">
                {professional.jobs_this_month || professional.completedJobs || 0} jobs completed
              </Badge>
              {totalActiveServices > 0 && (
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                  {totalActiveServices} services offered
                </Badge>
              )}
              {professional.isSponsored && (
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                  Sponsored
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Pricing section removed - pricing only shown on profile pages */}

        <div className="flex">
          <Button
            onClick={handleViewProfile}
            size="sm"
            className="w-full bg-green-600 hover:bg-green-700 text-sm"
          >
            <User className="w-4 h-4 mr-1" />
            View Profile
          </Button>
        </div>
      </CardContent>
      
      {/* Handyman Profile Modal - only for handymen */}
      {professional.user_role === 'handyman' && (
        <HandymanProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          handymanId={professional.id}
        />
      )}
    </Card>
  );
};
