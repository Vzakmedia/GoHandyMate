
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Professional } from '@/types/professional';

interface UseTopProfessionalsProps {
  userLocation?: { lat: number; lng: number } | null;
}

export const useTopProfessionals = ({ userLocation }: UseTopProfessionalsProps = {}) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTopProfessionals = async () => {
    try {
      setLoading(true);
      console.log('Fetching top professionals with location:', userLocation);

      const requestBody: any = {
        type: 'all',
        includeServicePricing: true
      };

      // Add location if available
      if (userLocation) {
        requestBody.lat = userLocation.lat.toString();
        requestBody.lng = userLocation.lng.toString();
        requestBody.radius = '50'; // 50-mile radius
      }

      console.log('Fetching top professionals with request:', requestBody);

      const { data, error } = await supabase.functions.invoke('get-professionals', {
        body: requestBody
      });

      if (error) {
        console.error('Error response from get-professionals:', error);
        throw error;
      }

      console.log('Raw response from get-professionals:', data);

      let result = data || [];
      
      // If we have location, prioritize professionals with distance data
      if (userLocation && Array.isArray(result)) {
        result = result.filter((prof: Professional) => {
          // Include professionals with distance data within 50 miles
          if (prof.distance !== undefined && prof.distance <= 50) {
            return true;
          }
          
          // Also include professionals with work areas
          if (prof.handyman_work_areas && prof.handyman_work_areas.length > 0) {
            return prof.handyman_work_areas.some(area => area.radius_miles <= 50);
          }
          
          // Include mock data or professionals without strict location filtering
          return prof.id.startsWith('mock-') || !userLocation;
        });
      }

      // Limit to top 6 professionals
      result = result.slice(0, 6);
      console.log(`Fetched ${result.length} top professionals`);
      setProfessionals(result);
    } catch (error) {
      console.error('Error fetching top professionals:', error);
      
      // Don't show error toast for development - just log it
      console.log('Top professionals fetch failed, this is normal during development');
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopProfessionals();
  }, [userLocation?.lat, userLocation?.lng]);

  return {
    professionals,
    loading,
    refetch: fetchTopProfessionals
  };
};
