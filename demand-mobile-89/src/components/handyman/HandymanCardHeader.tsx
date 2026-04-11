
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, CheckCircle, Star, Shield } from 'lucide-react';
import { expandedServiceCategories } from '@/data/expandedServiceCategories';

interface HandymanCardHeaderProps {
  handyman: {
    id: string;
    full_name: string;
    avatar_url?: string;
    subscription_plan?: string;
    service_pricing?: Array<{
      category_id: string;
      subcategory_id?: string;
      base_price: number;
      custom_price?: number;
      is_active: boolean;
    }>;
  };
  stats: {
    rating: number;
    reviewCount: number;
    completedTasks: number;
    responseTime: string;
    distance: string;
  };
  availability?: string;
}

export const HandymanCardHeader = ({ handyman, stats, availability }: HandymanCardHeaderProps) => {
  const isPremium = handyman.subscription_plan && 
    handyman.subscription_plan !== 'free' && 
    handyman.subscription_plan !== 'basic';

  // Get active services from service pricing
  const getActiveServices = () => {
    if (!handyman.service_pricing) return [];
    
    const activeServices = handyman.service_pricing.filter(service => service.is_active);
    
    return activeServices.slice(0, 3).map(service => {
      const category = expandedServiceCategories.find(cat => cat.id === service.category_id);
      if (!category) return service.category_id;
      
      if (service.subcategory_id) {
        const subcategory = category.subcategories.find(sub => sub.id === service.subcategory_id);
        return subcategory ? subcategory.name : category.name;
      }
      
      return category.name;
    });
  };

  const activeServices = getActiveServices();
  const totalActiveServices = handyman.service_pricing?.filter(service => service.is_active).length || 0;

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-t-lg">
      <div className="flex items-start space-x-4">
        {/* Avatar with verification badge */}
        <div className="relative flex-shrink-0">
          <div className="w-18 h-18 rounded-full overflow-hidden border-3 border-white">
            <img 
              src={handyman.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${handyman.id}`}
              alt={handyman.full_name || 'Professional'}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-white">
            <Shield className="w-3 h-3 text-white" />
          </div>
        </div>
        
        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-bold text-xl text-gray-800 truncate">
              {handyman.full_name || 'Professional'}
            </h3>
            {isPremium && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold border-0">
                PRO
              </Badge>
            )}
          </div>
          
          {/* Simple rating display without real-time data */}
          <div className="mb-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(stats.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {stats.rating.toFixed(1)} ({stats.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Location and Response Time */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{stats.distance}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>Responds in {stats.responseTime}</span>
            </div>
          </div>

          {/* Active Services */}
          {activeServices.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {activeServices.map((serviceName, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    {serviceName}
                  </Badge>
                ))}
                {totalActiveServices > 3 && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                    +{totalActiveServices - 3} more services
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Completion Stats */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-green-600">{stats.completedTasks}</span> jobs completed
            </div>
            
            <Badge 
              variant="outline" 
              className="text-green-600 border-green-300 bg-green-50 font-medium"
            >
              {availability || 'Available Today'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
