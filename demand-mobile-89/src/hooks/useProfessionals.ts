
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Professional } from '@/types/professional';

interface UseProfessionalsProps {
  serviceCategory?: string;
  maxResults?: number;
  userLocation?: { lat: number; lng: number } | null;
  includeServicePricing?: boolean;
}

export const useProfessionals = ({ 
  serviceCategory, 
  maxResults = 6,
  userLocation,
  includeServicePricing = false
}: UseProfessionalsProps) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLocation, setHasLocation] = useState(false);

  const fetchProfessionals = useCallback(async () => {
    try {
      setLoading(true);
      
      const requestBody: any = {
        type: 'handyman',
        includeServicePricing: includeServicePricing
      };

      // Add service filtering if provided
      if (serviceCategory && serviceCategory.trim()) {
        requestBody.serviceName = serviceCategory;
        console.log('useProfessionals - filtering by service:', serviceCategory);
      }

      // Add location if available
      if (userLocation && userLocation.lat && userLocation.lng) {
        requestBody.lat = userLocation.lat.toString();
        requestBody.lng = userLocation.lng.toString();
        requestBody.radius = '50'; // Always use 50-mile radius
        setHasLocation(true);
        console.log('useProfessionals - using location:', userLocation);
      } else {
        setHasLocation(false);
        console.log('useProfessionals - no location available');
      }

      console.log('useProfessionals - request body:', requestBody);

      const { data, error } = await supabase.functions.invoke('get-professionals', {
        body: requestBody
      });

      if (error) {
        console.error('Error fetching professionals:', error);
        setProfessionals([]);
        return;
      }

      console.log('useProfessionals - received data:', data?.length || 0, 'professionals');
      
      // Limit results if maxResults is specified
      const limitedData = maxResults ? (data || []).slice(0, maxResults) : (data || []);
      setProfessionals(limitedData);

    } catch (error) {
      console.error('Error in useProfessionals:', error);
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  }, [serviceCategory, maxResults, userLocation?.lat, userLocation?.lng, includeServicePricing]);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  return {
    professionals,
    loading,
    hasLocation,
    refetch: fetchProfessionals
  };
};
