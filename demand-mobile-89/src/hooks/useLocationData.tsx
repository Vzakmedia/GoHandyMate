
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export const useLocationData = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async (): Promise<LocationData> => {
    setIsLoading(true);
    setError(null);

    try {
      // First try to get precise location if geolocation is available
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              {
                enableHighAccuracy: false, // Use less battery
                timeout: 3000, // Shorter timeout
                maximumAge: 600000 // 10 minutes cache
              }
            );
          });

          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          };

          setCurrentLocation(locationData);
          console.log('Precise location obtained:', locationData);
          return locationData;
        } catch (geoError) {
          console.log('Geolocation failed, trying IP-based location:', geoError);
        }
      }
      
      // Fallback to IP-based location
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.latitude && data.longitude) {
          const locationData: LocationData = {
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: 10000, // IP-based location is less accurate
            timestamp: Date.now()
          };

          setCurrentLocation(locationData);
          console.log('IP-based location obtained:', locationData);
          return locationData;
        }
        
        throw new Error('IP geolocation failed - no coordinates returned');
      } catch (ipError) {
        console.log('IP-based location failed, using default location:', ipError);
        
        // Final fallback to Washington DC area
        const defaultLocation: LocationData = {
          latitude: 38.9072,
          longitude: -77.0369,
          accuracy: 50000,
          timestamp: Date.now()
        };

        setCurrentLocation(defaultLocation);
        console.log('Using default location (Washington DC):', defaultLocation);
        return defaultLocation;
      }
    } catch (error) {
      console.error('All location methods failed:', error);
      
      // Absolute fallback
      const fallbackLocation: LocationData = {
        latitude: 38.9072,
        longitude: -77.0369,
        accuracy: 100000,
        timestamp: Date.now()
      };

      setCurrentLocation(fallbackLocation);
      setError('Unable to determine location');
      return fallbackLocation;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-detect location on mount
  useEffect(() => {
    let mounted = true;
    
    const detectLocation = async () => {
      try {
        if (mounted) {
          await getCurrentLocation();
        }
      } catch (error) {
        if (mounted) {
          console.log('Initial location detection completed with fallbacks:', error);
        }
      }
    };

    detectLocation();

    return () => {
      mounted = false;
    };
  }, [getCurrentLocation]);

  return {
    currentLocation,
    isLoading,
    error,
    getCurrentLocation
  };
};
