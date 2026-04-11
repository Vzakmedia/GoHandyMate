
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, Navigation, Clock } from 'lucide-react';
import { useHandymanData } from '@/hooks/useHandymanData';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ServiceAreasProps {
  serviceAreas?: string[];
  profileData?: any;
}

interface ServiceAreaInfo {
  name: string;
  state: string;
}

export const ServiceAreas = ({ profileData }: ServiceAreasProps) => {
  const { data: handymanData, loading } = useHandymanData();
  const [serviceAreasDisplay, setServiceAreasDisplay] = useState<Array<{
    name: string;
    radius: number;
    travelFee?: number;
    travelTime?: number;
    isPrimary?: boolean;
  }>>([]);

  // Function to get location info from zip code
  const getLocationFromZipCode = async (zipCode: string): Promise<ServiceAreaInfo | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.address_components;

        let cityName = '';
        let stateName = '';
        let countyName = '';

        addressComponents.forEach((component: any) => {
          if (component.types.includes('locality')) {
            cityName = component.long_name;
          } else if (component.types.includes('administrative_area_level_1')) {
            stateName = component.short_name;
          } else if (component.types.includes('administrative_area_level_2')) {
            countyName = component.long_name.replace(' County', '');
          }
        });

        return {
          name: cityName || countyName || zipCode,
          state: stateName
        };
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
    return null;
  };

  useEffect(() => {
    const loadServiceAreas = async () => {
      if (!handymanData.workAreas || handymanData.workAreas.length === 0) {
        // Fallback to profile zip code with 50 mile radius
        if (profileData?.zip_code) {
          const locationInfo = await getLocationFromZipCode(profileData.zip_code);
          if (locationInfo) {
            setServiceAreasDisplay([{
              name: `${locationInfo.name}, ${locationInfo.state}`,
              radius: 50,
              isPrimary: true
            }]);
          } else {
            setServiceAreasDisplay([{
              name: `${profileData.zip_code} area`,
              radius: 50,
              isPrimary: true
            }]);
          }
        }
        return;
      }

      try {
        const areas = [];

        for (const workArea of handymanData.workAreas) {
          let displayName = workArea.area_name;

          if (workArea.zip_code) {
            const locationInfo = await getLocationFromZipCode(workArea.zip_code);
            if (locationInfo) {
              displayName = `${locationInfo.name}, ${locationInfo.state}`;
            } else {
              displayName = `${workArea.zip_code} area`;
            }
          }

          areas.push({
            name: displayName,
            radius: workArea.radius_miles,
            travelFee: workArea.additional_travel_fee > 0 ? workArea.additional_travel_fee : undefined,
            travelTime: workArea.travel_time_minutes > 0 ? workArea.travel_time_minutes : undefined,
            isPrimary: workArea.is_primary
          });
        }

        setServiceAreasDisplay(areas);
      } catch (error) {
        console.error('Error loading service areas:', error);
        // Fallback display
        setServiceAreasDisplay(handymanData.workAreas.map(area => ({
          name: area.area_name || 'Service Area',
          radius: area.radius_miles,
          travelFee: area.additional_travel_fee > 0 ? area.additional_travel_fee : undefined,
          travelTime: area.travel_time_minutes > 0 ? area.travel_time_minutes : undefined,
          isPrimary: area.is_primary
        })));
      }
    };

    if (!loading) {
      loadServiceAreas();
    }
  }, [handymanData.workAreas, loading, profileData?.zip_code]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-green-600" />
            Service Areas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-green-600" />
          Service Areas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {serviceAreasDisplay.map((area, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${area.isPrimary ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                  <span className="font-medium text-gray-800">{area.name}</span>
                  {area.isPrimary && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      Primary
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Navigation className="w-4 h-4" />
                  <span>{area.radius} mile radius</span>
                </div>

                {area.travelFee && (
                  <div className="flex items-center space-x-1">
                    <span className="text-orange-600 font-medium">
                      +${area.travelFee} travel fee
                    </span>
                  </div>
                )}

                {area.travelTime && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{area.travelTime} min travel</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {serviceAreasDisplay.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No service areas configured</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
