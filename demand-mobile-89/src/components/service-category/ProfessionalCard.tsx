
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, Phone, CheckCircle2 } from 'lucide-react';
import { ProfessionalLocationInfo } from '@/components/professionals/ProfessionalLocationInfo';
import { expandedServiceCategories } from '@/data/expandedServiceCategories';
import { useRealRatings } from '@/hooks/useRealRatings';

interface Professional {
  id: string;
  full_name: string;
  user_role: 'handyman' | 'contractor';
  avatar_url?: string;
  handyman?: {
    hourly_rate?: number;
    availability?: string;
    years_experience?: number;
  };
  skill_rates?: Array<{
    skill_name: string;
    hourly_rate: number;
  }>;
  // Updated to use service pricing instead of skills
  service_pricing?: Array<{
    category_id: string;
    subcategory_id?: string;
    base_price: number;
    custom_price?: number;
    is_active: boolean;
  }>;
  distance?: number;
  rating: number;
  reviewCount: number;
  isSponsored: boolean;
  isOnline: boolean;
  completedJobs: number;
  experienceYears: number;
  lastSeen?: string;
  created_at: string;
  // Location data
  handyman_work_areas?: Array<{
    area_name: string;
    center_latitude: number;
    center_longitude: number;
    radius_miles: number;
  }>;
  handyman_locations?: {
    latitude: number;
    longitude: number;
    last_updated: string;
    is_active: boolean;
  };
}

interface ProfessionalCardProps {
  professional: Professional;
  serviceName: string;
  onBook: (professional: Professional, serviceName: string) => void;
}

export const ProfessionalCard = ({ professional, serviceName, onBook }: ProfessionalCardProps) => {
  // Use real ratings from the database
  const { averageRating, totalReviews, loading: ratingsLoading } = useRealRatings(professional.id);
  const getServiceSpecificPrice = (professional: Professional, serviceName: string) => {
    // First check service pricing data for specific service rates
    if (professional.service_pricing) {
      const activeServices = professional.service_pricing.filter(service => service.is_active);
      
      // Try to find a service that matches the requested service name
      const matchingService = activeServices.find(service => {
        const category = expandedServiceCategories.find(cat => cat.id === service.category_id);
        if (!category) return false;
        
        if (service.subcategory_id) {
          const subcategory = category.subcategories.find(sub => sub.id === service.subcategory_id);
          const serviceName_lower = serviceName.toLowerCase();
          const categoryName = subcategory ? subcategory.name.toLowerCase() : category.name.toLowerCase();
          return categoryName.includes(serviceName_lower) || serviceName_lower.includes(categoryName);
        }
        
        const serviceName_lower = serviceName.toLowerCase();
        const categoryName = category.name.toLowerCase();
        return categoryName.includes(serviceName_lower) || serviceName_lower.includes(categoryName);
      });

      if (matchingService) {
        const price = matchingService.custom_price || matchingService.base_price;
        return `$${price}/hr`;
      }
    }

    // Fallback to skill rates if service pricing not available
    const specificSkillRate = professional.skill_rates?.find(rate => 
      rate.skill_name.toLowerCase().includes(serviceName.toLowerCase()) ||
      serviceName.toLowerCase().includes(rate.skill_name.toLowerCase())
    );

    if (specificSkillRate) {
      return `$${specificSkillRate.hourly_rate}/hr`;
    }

    if (professional.handyman?.hourly_rate) {
      return `$${professional.handyman.hourly_rate}/hr`;
    }

    return 'Quote on request';
  };

  const getAvailability = () => {
    return professional.handyman?.availability || 'Available';
  };

  const isOnline = () => {
    // Check if professional was seen recently (within 15 minutes)
    if (professional.lastSeen) {
      const lastSeenTime = new Date(professional.lastSeen).getTime();
      const now = new Date().getTime();
      const fifteenMinutes = 15 * 60 * 1000;
      return (now - lastSeenTime) < fifteenMinutes;
    }
    return professional.isOnline;
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

  // Get active services count
  const activeServicesCount = professional.service_pricing?.filter(service => service.is_active).length || 0;

  return (
    <div className="flex items-start space-x-3 w-full">
      <div className="relative">
        <img 
          src={professional.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${professional.id}`}
          alt={professional.full_name}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />
        {isOnline() && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h5 className="font-medium text-gray-900 truncate">{professional.full_name}</h5>
            <div className="flex items-center space-x-1 mt-1">
              {renderStars(averageRating)}
              <span className="text-sm font-medium text-gray-700 ml-1">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-500">
                ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <div className="text-sm font-semibold text-green-600">
              {getServiceSpecificPrice(professional, serviceName)}
            </div>
            {professional.isSponsored && (
              <Badge variant="secondary" className="text-xs mt-1">
                Sponsored
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-2">
          <Badge variant="secondary" className="text-xs">
            {professional.user_role === 'handyman' ? 'Handyman' : 'Contractor'}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {professional.experienceYears} years exp
          </Badge>
          <Badge variant="secondary" className="text-xs flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {professional.completedJobs} jobs completed
          </Badge>
          {activeServicesCount > 0 && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              {activeServicesCount} services offered
            </Badge>
          )}
        </div>
        
        {/* Location Information */}
        <div className="mb-2">
          <ProfessionalLocationInfo 
            professional={professional}
            showDistance={true}
          />
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-600 mb-3">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{isOnline() ? 'Online' : getAvailability()}</span>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-3">
          <Button size="sm" variant="outline" className="flex-1 text-xs">
            <Phone className="w-3 h-3 mr-1" />
            Call
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-green-600 hover:bg-green-700 text-xs"
            onClick={() => onBook(professional, serviceName)}
          >
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};
