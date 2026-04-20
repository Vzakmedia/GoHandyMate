
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, RefreshCw, AlertTriangle, Users, Clock, Star } from 'lucide-react';
import { LocationEnableButton } from '@/components/LocationEnableButton';

interface EmptyProfessionalsStateEnhancedProps {
  serviceCategory?: string;
  showLocationMessage?: boolean;
  onRetry?: () => void;
  hasLocation?: boolean;
}

export const EmptyProfessionalsStateEnhanced = ({ 
  serviceCategory,
  showLocationMessage = false,
  onRetry,
  hasLocation = false 
}: EmptyProfessionalsStateEnhancedProps) => {
  const handleLocationEnabled = () => {
    setTimeout(() => {
      onRetry?.();
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
        {showLocationMessage || !hasLocation ? (
          <MapPin className="w-10 h-10 text-gray-400" />
        ) : (
          <Search className="w-10 h-10 text-gray-400" />
        )}
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">
        {showLocationMessage || !hasLocation ? (
          'Enable Location Access'
        ) : hasLocation ? (
          `No ${serviceCategory || 'professionals'} found nearby`
        ) : (
          'No professionals available'
        )}
      </h3>
      
      <p className="text-gray-600 mb-8 leading-relaxed">
        {showLocationMessage || !hasLocation ? (
          'Allow location access to see professionals in your area and get accurate distance information.'
        ) : hasLocation ? (
          serviceCategory 
            ? `We couldn't find any professionals specializing in ${serviceCategory} within 50 miles of your location. Try expanding your search or check back later.`
            : 'No professionals are currently available within 50 miles of your location.'
        ) : (
          'No professionals match your current search criteria. Try adjusting your filters or search terms.'
        )}
      </p>
      
      <div className="space-y-4">
        {(showLocationMessage || !hasLocation) ? (
          <LocationEnableButton 
            onLocationEnabled={handleLocationEnabled}
            size="lg"
            className="w-full"
          />
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Suggestions</h4>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• Try searching for a specific service like "plumbing" or "electrical"</li>
                <li>• Check back later for new professionals</li>
                <li>• Consider expanding your search area</li>
                {serviceCategory && <li>• Try related services like "electrical" or "installation"</li>}
              </ul>
            </div>
          </div>
        )}
        
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="w-full"
            size="lg"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Search Again
          </Button>
        )}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <Users className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">2,500+</span>
            <span className="text-xs text-gray-500">Professionals</span>
          </div>
          <div className="flex flex-col items-center">
            <Clock className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">8min</span>
            <span className="text-xs text-gray-500">Avg Response</span>
          </div>
          <div className="flex flex-col items-center">
            <Star className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs text-gray-500">4.9★</span>
            <span className="text-xs text-gray-500">Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
};
