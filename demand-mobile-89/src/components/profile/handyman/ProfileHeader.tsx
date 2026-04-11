
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Phone, Mail, Star } from 'lucide-react';
import { useRealRatings } from '@/hooks/useRealRatings';
import { useHandymanData } from '@/hooks/useHandymanData';
import { useMetricsCalculator } from '@/hooks/useMetricsCalculator';
import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProfileHeaderProps {
  profileData: any;
  displayName: string;
  profileId: string;
}

interface ServiceAreaInfo {
  name: string;
  state: string;
}

export const ProfileHeader = ({
  profileData,
  displayName,
  profileId
}: ProfileHeaderProps) => {
  const { data: handymanData, loading: handymanLoading } = useHandymanData();
  const { averageRating, totalReviews, loading: ratingsLoading } = useRealRatings(profileId);

  // Calculate live metrics including real ratings
  const liveMetrics = useMetricsCalculator({
    handymanData,
    jobMetrics: {
      completedJobs: profileData.jobs_this_month || 0,
      activeJobs: 0,
      totalEarnings: 0,
      thisMonthCompletedJobs: profileData.jobs_this_month || 0,
      todayCompletedJobs: 0,
      todayEarnings: 0,
      monthlyEarnings: 0
    }
  });
  const [serviceAreaDisplay, setServiceAreaDisplay] = useState<string>('Loading service areas...');

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

  // Load and format service areas
  useEffect(() => {
    const loadServiceAreas = async () => {
      if (!handymanData.workAreas || handymanData.workAreas.length === 0) {
        if (profileData.zip_code) {
          const locationInfo = await getLocationFromZipCode(profileData.zip_code);
          if (locationInfo) {
            setServiceAreaDisplay(`${locationInfo.name}, ${locationInfo.state} (50 mile radius)`);
          } else {
            setServiceAreaDisplay(`${profileData.zip_code} area (50 mile radius)`);
          }
        } else {
          setServiceAreaDisplay('Service area not specified');
        }
        return;
      }

      try {
        const areas: string[] = [];

        for (const workArea of handymanData.workAreas.slice(0, 2)) { // Show first 2 areas
          if (workArea.zip_code) {
            const locationInfo = await getLocationFromZipCode(workArea.zip_code);
            if (locationInfo) {
              areas.push(`${locationInfo.name}, ${locationInfo.state} (${workArea.radius_miles}mi radius)`);
            } else {
              areas.push(`${workArea.zip_code} area (${workArea.radius_miles}mi radius)`);
            }
          } else if (workArea.area_name) {
            areas.push(`${workArea.area_name} (${workArea.radius_miles}mi radius)`);
          }
        }

        if (areas.length > 0) {
          let display = areas.join(' • ');
          if (handymanData.workAreas.length > 2) {
            display += ` • +${handymanData.workAreas.length - 2} more areas`;
          }
          setServiceAreaDisplay(display);
        } else {
          setServiceAreaDisplay('Service areas configured');
        }
      } catch (error) {
        console.error('Error loading service areas:', error);
        setServiceAreaDisplay(`${handymanData.workAreas.length} service areas`);
      }
    };

    if (!handymanLoading) {
      loadServiceAreas();
    }
  }, [handymanData.workAreas, handymanLoading, profileData.zip_code]);

  // Get active services from real data
  const getActiveServices = () => {
    if (!handymanData.servicePricing) return [];

    const activeServices = handymanData.servicePricing.filter(service => service.is_active);
    return activeServices.slice(0, 4).map(service => service.category_id);
  };

  const activeServices = getActiveServices();
  const isOnline = handymanData.workSettings?.instant_booking || false;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Avatar - centered on mobile */}
          <div className="flex-shrink-0">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
              <AvatarImage src={profileData.avatar_url} alt={displayName} />
              <AvatarFallback className="text-lg sm:text-2xl">
                {displayName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Main content - centered on mobile, left-aligned on desktop */}
          <div className="flex-1 space-y-4 w-full text-center sm:text-left">
            {/* Name and title */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words leading-tight">
                {displayName}
              </h1>
              <p className="text-base sm:text-lg text-blue-600 font-medium">
                Professional Handyman
              </p>
            </div>

            {/* Real rating display */}
            <div className="space-y-3">
              <div className="flex justify-center sm:justify-start">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {ratingsLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin inline" />
                    ) : totalReviews > 0 ? (
                      `${averageRating.toFixed(1)} (${totalReviews} review${totalReviews !== 1 ? 's' : ''})`
                    ) : (
                      `${liveMetrics.completedJobs} jobs completed`
                    )}
                  </span>
                </div>
              </div>

              {/* Status badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Badge className="bg-green-100 text-green-800 border-green-300 text-xs sm:text-sm">
                  ✓ Verified
                </Badge>
                {isOnline && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs sm:text-sm">
                    🟢 Available for Instant Booking
                  </Badge>
                )}
              </div>
            </div>

            {/* Active services from real data */}
            {activeServices.length > 0 && (
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                {activeServices.map((service, index) => (
                  <Badge key={index} variant="secondary" className="text-xs sm:text-sm px-2 py-1">
                    {service}
                  </Badge>
                ))}
              </div>
            )}

            {/* Contact info with real service areas */}
            <div className="space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-center sm:justify-start space-x-2 min-w-0">
                <MapPin className="w-4 h-4 flex-shrink-0 text-gray-500" />
                <span className="text-center sm:text-left truncate" title={serviceAreaDisplay}>
                  {handymanLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin inline" />
                  ) : (
                    serviceAreaDisplay.length > 50
                      ? `${serviceAreaDisplay.substring(0, 50)}...`
                      : serviceAreaDisplay
                  )}
                </span>
              </div>

              {profileData.phone && (
                <div className="flex items-center justify-center sm:justify-start space-x-2 min-w-0">
                  <Phone className="w-4 h-4 flex-shrink-0 text-gray-500" />
                  <span className="truncate">{profileData.phone}</span>
                </div>
              )}

              <div className="flex items-center justify-center sm:justify-start space-x-2 min-w-0">
                <Mail className="w-4 h-4 flex-shrink-0 text-gray-500" />
                <span className="break-all text-center sm:text-left">{profileData.email}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
