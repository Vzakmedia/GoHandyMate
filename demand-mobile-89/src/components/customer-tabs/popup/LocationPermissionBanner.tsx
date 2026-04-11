
import { MapPin, AlertTriangle, Loader2 } from 'lucide-react';
import { LocationEnableButton } from '@/components/LocationEnableButton';
import { useState } from 'react';
import { useLocationTracking } from '@/hooks/useLocationTracking';

interface LocationPermissionBannerProps {
  onLocationEnabled?: () => void;
}

export const LocationPermissionBanner = ({ onLocationEnabled }: LocationPermissionBannerProps) => {
  const [isEnabling, setIsEnabling] = useState(false);
  const { startTracking, currentLocation, locationPermissionState } = useLocationTracking();

  const handleEnableLocation = async () => {
    setIsEnabling(true);
    try {
      await startTracking();
      // Trigger a refresh of professionals after location is enabled
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('refetch-professionals'));
        onLocationEnabled?.();
      }, 1000);
    } catch (error) {
      console.error('Failed to enable location:', error);
    } finally {
      setIsEnabling(false);
    }
  };

  // If location is already enabled, show success state
  if (locationPermissionState === 'granted' && currentLocation) {
    return null; // Don't show banner if location is already working
  }

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-blue-900 mb-1">
            Enable Location for Better Results
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            Allow location access to see professionals near you with accurate distances and faster response times.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleEnableLocation}
              disabled={isEnabling}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isEnabling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enabling Location...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-2" />
                  Enable Location
                </>
              )}
            </button>
            
            <div className="flex items-center text-xs text-blue-600">
              <AlertTriangle className="w-3 h-3 mr-1" />
              <span>Your location data is only used to find nearby services</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
