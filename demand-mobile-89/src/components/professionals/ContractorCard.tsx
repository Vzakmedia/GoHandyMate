
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, CheckCircle, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRealRatings } from '@/hooks/useRealRatings';

interface Professional {
  id: string;
  full_name: string;
  user_role: 'handyman' | 'contractor';
  avatar_url?: string;
  subscription_plan?: string;
  account_status: string;
  created_at: string;
  business_name?: string;
  company_name?: string;
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
  distance?: number;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  isSponsored: boolean;
  isOnline: boolean;
  lastSeen?: string;
}

interface ContractorCardProps {
  professional: Professional;
  showDistance?: boolean;
  isCarousel?: boolean;
}

export const ContractorCard = ({ professional, showDistance = true, isCarousel = false }: ContractorCardProps) => {
  const navigate = useNavigate();
  const { averageRating, totalReviews } = useRealRatings(professional.id);

  const handleViewProfile = () => {
    navigate(`/profile/${professional.id}`);
  };

  const handleGetQuote = () => {
    navigate(`/quote-request/${professional.id}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  // Get display name - prioritize business name for contractors
  const getDisplayName = () => {
    if (professional.user_role === 'contractor') {
      return professional.business_name || professional.company_name || professional.full_name;
    }
    return professional.full_name;
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg border-gray-200 ${isCarousel ? 'w-full' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3 mb-3">
          <div className="relative">
            <img
              src={professional.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${professional.id}`}
              alt={getDisplayName()}
              className="w-12 h-12 rounded-full object-cover cursor-pointer"
              onClick={handleViewProfile}
            />
            {professional.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 
                className="font-semibold text-gray-900 truncate cursor-pointer hover:text-green-600"
                onClick={handleViewProfile}
              >
                {getDisplayName()}
              </h3>
              {professional.account_status === 'active' && (
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              )}
            </div>
            
            {/* Show owner name for contractors only if business name is displayed */}
            {professional.user_role === 'contractor' && (professional.business_name || professional.company_name) && professional.full_name && (
              <p className="text-xs text-gray-600 mb-1">Owner: {professional.full_name}</p>
            )}
            
            <div className="flex items-center space-x-1 mb-1">
              <Building className="w-3 h-3 text-blue-600" />
              <Badge variant="outline" className="text-xs">
                Contractor
              </Badge>
            </div>

            <div className="flex items-center space-x-1 mb-1">
              {renderStars(averageRating)}
              <span className="text-sm font-medium text-gray-700 ml-1">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({totalReviews})
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
              {showDistance && professional.distance && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{professional.distance.toFixed(1)} mi</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{professional.experienceYears} years</span>
              </div>
            </div>

            {professional.subscription_plan && (
              <Badge variant="secondary" className="text-xs mb-2">
                {professional.subscription_plan}
              </Badge>
            )}
          </div>
        </div>

        <div className="text-center mb-3">
          <div className="text-sm font-medium text-gray-600">
            {professional.completedJobs} Projects Completed
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handleViewProfile}
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
          >
            View Profile
          </Button>
          <Button
            onClick={handleGetQuote}
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-xs"
          >
            Get Quote
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
