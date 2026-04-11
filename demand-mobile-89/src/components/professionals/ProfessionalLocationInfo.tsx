
import { MapPin, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProfessionalLocationInfoProps {
  professional: {
    id: string;
    distance?: number;
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
  };
  showDistance?: boolean;
}

export const ProfessionalLocationInfo = ({ 
  professional, 
  showDistance = true 
}: ProfessionalLocationInfoProps) => {
  const getLocationDisplay = () => {
    // Use real-time location if available and active
    if (professional.handyman_locations?.is_active) {
      return {
        type: 'live',
        location: 'Live Location',
        isActive: true,
        lastUpdated: professional.handyman_locations.last_updated
      };
    }

    // Use primary work area as fallback
    const primaryArea = professional.handyman_work_areas?.find(area => area.area_name) || 
                       professional.handyman_work_areas?.[0];
    
    if (primaryArea) {
      return {
        type: 'area',
        location: primaryArea.area_name,
        isActive: false,
        radius: primaryArea.radius_miles
      };
    }

    return {
      type: 'unknown',
      location: 'Location not specified',
      isActive: false
    };
  };

  const locationInfo = getLocationDisplay();

  return (
    <div className="flex items-center space-x-3 text-sm text-gray-600">
      <div className="flex items-center space-x-1">
        <MapPin className="w-4 h-4" />
        <span>{locationInfo.location}</span>
        {locationInfo.type === 'live' && (
          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
            Live
          </Badge>
        )}
      </div>
      
      {showDistance && professional.distance && (
        <div className="flex items-center space-x-1">
          <Navigation className="w-4 h-4" />
          <span className="font-medium text-blue-600">
            {professional.distance.toFixed(1)} mi away
          </span>
        </div>
      )}
      
      {locationInfo.type === 'area' && locationInfo.radius && (
        <span className="text-xs text-gray-500">
          {locationInfo.radius} mi radius
        </span>
      )}
    </div>
  );
};
