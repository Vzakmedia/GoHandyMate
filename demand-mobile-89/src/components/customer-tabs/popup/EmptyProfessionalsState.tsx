
import { AlertCircle, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LocationEnableButton } from '@/components/LocationEnableButton';

interface EmptyProfessionalsStateProps {
  serviceName: string;
  onRetry?: () => void;
  hasLocation?: boolean;
}

export const EmptyProfessionalsState = ({ 
  serviceName, 
  onRetry,
  hasLocation = false 
}: EmptyProfessionalsStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        {hasLocation ? (
          <AlertCircle className="w-8 h-8 text-gray-400" />
        ) : (
          <MapPin className="w-8 h-8 text-gray-400" />
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {hasLocation ? 'No professionals found nearby' : 'Enable location for better results'}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {hasLocation ? (
          `No professionals are currently available for ${serviceName} within 50 miles of your location.`
        ) : (
          `Enable location access to find professionals offering ${serviceName} services near you.`
        )}
      </p>
      
      <div className="space-y-4">
        {!hasLocation ? (
          <LocationEnableButton 
            onLocationEnabled={onRetry}
            size="lg"
            className="min-w-[200px]"
          />
        ) : (
          <div className="space-y-2 text-sm text-gray-500 mb-4">
            <p>• Try expanding your search to include general handymen</p>
            <p>• Check back later for new professionals</p>
            <p>• Consider posting a custom quote request</p>
          </div>
        )}
        
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="mt-4"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};
