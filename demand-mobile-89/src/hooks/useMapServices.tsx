
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface GeocodingResult {
  latitude: number;
  longitude: number;
  formatted_address: string;
}

interface HandymanMarker {
  id: string;
  full_name: string;
  email: string;
  subscription_plan: string;
  distance: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  last_seen?: string;
  is_online?: boolean;
}

interface ServiceAreaData {
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  coverage: {
    square_miles: number;
    estimated_customers: number;
    avg_job_distance: number;
  };
}

interface PlaceResult {
  place_id: string;
  name: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating?: number;
  types: string[];
}

export const useMapServices = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocodeAddress = async (address: string): Promise<GeocodingResult | null> => {
    if (!address.trim()) return null;

    setLoading(true);
    setError(null);
    try {
      console.log('Geocoding address:', address);
      
      const { data, error: functionError } = await supabase.functions.invoke('map-services/geocode', {
        body: { address }
      });

      if (functionError) {
        console.error('Geocoding function error:', functionError);
        setError('Failed to geocode address');
        return null;
      }
      
      return data as GeocodingResult;
    } catch (error) {
      console.error('Geocoding error:', error);
      setError('Failed to geocode address');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number): Promise<GeocodingResult | null> => {
    setLoading(true);
    setError(null);
    try {
      console.log('Reverse geocoding:', latitude, longitude);
      
      const { data, error: functionError } = await supabase.functions.invoke('map-services/reverse-geocode', {
        body: { latitude, longitude }
      });

      if (functionError) {
        console.error('Reverse geocoding function error:', functionError);
        setError('Failed to reverse geocode coordinates');
        return null;
      }
      
      return data as GeocodingResult;
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setError('Failed to reverse geocode coordinates');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const findNearbyHandymen = async (
    latitude: number, 
    longitude: number, 
    radius: number
  ): Promise<HandymanMarker[]> => {
    setLoading(true);
    setError(null);
    try {
      console.log('Finding nearby handymen:', { latitude, longitude, radius });
      
      const { data, error: functionError } = await supabase.functions.invoke('location-tracking', {
        body: { 
          action: 'get-nearby-handymen',
          location: { latitude, longitude, radius }
        }
      });

      if (functionError) {
        console.error('Find nearby handymen error:', functionError);
        setError('Failed to find nearby handymen');
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error finding nearby handymen:', error);
      setError('Failed to find nearby handymen');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const findNearbyPlaces = async (
    latitude: number,
    longitude: number,
    radius: number,
    type?: string
  ): Promise<PlaceResult[]> => {
    setLoading(true);
    setError(null);
    try {
      console.log('Finding nearby places:', { latitude, longitude, radius, type });
      
      const { data, error: functionError } = await supabase.functions.invoke('map-services/places-nearby', {
        body: { latitude, longitude, radius, type }
      });

      if (functionError) {
        console.error('Find nearby places error:', functionError);
        setError('Failed to find nearby places');
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error finding nearby places:', error);
      setError('Failed to find nearby places');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updateLocation = async (
    userId: string,
    location: { latitude: number; longitude: number; accuracy?: number }
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      console.log('Updating location for user:', userId);
      
      const { data, error: functionError } = await supabase.functions.invoke('location-tracking', {
        body: { 
          action: 'update-location',
          userId,
          location
        }
      });

      if (functionError) {
        console.error('Update location error:', functionError);
        setError('Failed to update location');
        return false;
      }
      
      return data?.success || false;
    } catch (error) {
      console.error('Error updating location:', error);
      setError('Failed to update location');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getServiceArea = async (userId: string): Promise<ServiceAreaData | null> => {
    setLoading(true);
    setError(null);
    try {
      console.log('Getting service area for user:', userId);
      
      // Mock service area data for now - can be enhanced with real data
      const mockServiceArea: ServiceAreaData = {
        center: { latitude: 40.7128, longitude: -74.0060 },
        radius: 25,
        coverage: {
          square_miles: 1963,
          estimated_customers: 125000,
          avg_job_distance: 12
        }
      };
      
      return mockServiceArea;
    } catch (error) {
      console.error('Error getting service area:', error);
      setError('Failed to get service area');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = async (
    origins: { latitude: number; longitude: number }[],
    destinations: { latitude: number; longitude: number }[]
  ) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Calculating distance matrix');
      
      const { data, error: functionError } = await supabase.functions.invoke('map-services/distance-matrix', {
        body: { origins, destinations }
      });

      if (functionError) {
        console.error('Distance matrix error:', functionError);
        setError('Failed to calculate distances');
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error calculating distances:', error);
      setError('Failed to calculate distances');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    geocodeAddress,
    reverseGeocode,
    findNearbyHandymen,
    findNearbyPlaces,
    updateLocation,
    getServiceArea,
    calculateDistance,
    loading,
    error
  };
};
