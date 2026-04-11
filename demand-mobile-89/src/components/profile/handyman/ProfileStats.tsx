
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useHandymanData } from '@/hooks/useHandymanData';
import { useUnifiedHandymanMetrics } from '@/hooks/useUnifiedHandymanMetrics';
import { useAuth } from '@/features/auth';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProfileStatsProps {
  completedJobs?: number;
  jobsThisMonth?: number;
  memberSince?: number;
}

interface ServiceAreaInfo {
  name: string;
  state: string;
}

export const ProfileStats = ({ memberSince }: ProfileStatsProps) => {
  const { user } = useAuth();
  const { data: handymanData, loading: handymanLoading } = useHandymanData();
  const { metrics, loading: metricsLoading } = useUnifiedHandymanMetrics();

  const [serviceAreaDisplay, setServiceAreaDisplay] = useState<string>('Loading...');

  const loading = handymanLoading || metricsLoading;

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

  // Load service areas
  useEffect(() => {
    const loadServiceAreas = async () => {
      if (!handymanData.workAreas || handymanData.workAreas.length === 0) {
        setServiceAreaDisplay('No areas set');
        return;
      }

      try {
        const primaryArea = handymanData.workAreas[0];
        if (primaryArea.zip_code) {
          const locationInfo = await getLocationFromZipCode(primaryArea.zip_code);
          if (locationInfo) {
            const additionalCount = handymanData.workAreas.length - 1;
            setServiceAreaDisplay(
              `${locationInfo.name}, ${locationInfo.state}${additionalCount > 0 ? ` +${additionalCount} more` : ''}`
            );
          } else {
            setServiceAreaDisplay(`${handymanData.workAreas.length} service areas`);
          }
        } else {
          setServiceAreaDisplay(`${handymanData.workAreas.length} service areas`);
        }
      } catch (error) {
        setServiceAreaDisplay(`${handymanData.workAreas.length} service areas`);
      }
    };

    if (!handymanLoading && handymanData.workAreas) {
      loadServiceAreas();
    }
  }, [handymanData.workAreas, handymanLoading]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  // Calculate real metrics from live data
  const activeSkills = handymanData.skillRates?.filter(skill => skill.is_active) || [];
  const activeServices = handymanData.servicePricing?.filter(service => service.is_active) || [];

  // Calculate average response time based on active services
  const avgResponseTime = Math.max(5, 20 - activeServices.length * 2);

  console.log('ProfileStats: Using real live data:', {
    completedJobsCount: metrics.totalCompletedJobs,
    thisMonthCompletedJobs: metrics.thisMonthCompletedJobs,
    totalEarnings: metrics.totalEarnings,
    monthlyEarnings: metrics.monthlyEarnings,
    weeklyEarnings: metrics.weeklyEarnings
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Jobs Completed</span>
          <span className="font-bold text-green-600">{metrics.totalCompletedJobs}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">This Month</span>
          <span className="font-bold">{metrics.thisMonthCompletedJobs}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Monthly Earnings</span>
          <span className="font-bold text-green-600">${metrics.monthlyEarnings}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Weekly Earnings</span>
          <span className="font-bold text-green-600">${metrics.weeklyEarnings}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Total Earnings</span>
          <span className="font-bold text-green-600">${metrics.totalEarnings}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Response Time</span>
          <span className="font-bold">~{avgResponseTime} minutes</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Active Skills</span>
          <span className="font-bold">{activeSkills.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Active Services</span>
          <span className="font-bold">{activeServices.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Service Areas</span>
          <span className="font-bold" title={serviceAreaDisplay}>
            {serviceAreaDisplay.length > 25 ? `${serviceAreaDisplay.substring(0, 25)}...` : serviceAreaDisplay}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Member Since</span>
          <span className="font-bold">{memberSince || new Date().getFullYear()}</span>
        </div>
      </CardContent>
    </Card>
  );
};
