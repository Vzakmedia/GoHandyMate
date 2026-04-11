import { useState, useEffect, useCallback } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { useThrottle } from '@/utils/performance';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

interface LocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  throttleMs?: number;
}

export const useOptimizedLocation = (options: LocationOptions = {}) => {
  const {
    enableHighAccuracy = false,
    timeout = 10000,
    maximumAge = 300000, // 5 minutes
    throttleMs = 1000
  } = options;

  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Throttled location update to prevent excessive API calls
  const throttledSetLocation = useThrottle((newLocation: LocationData) => {
    setLocation(newLocation);
  }, throttleMs);

  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Request permissions first
      const permissions = await Geolocation.requestPermissions();
      if (permissions.location !== 'granted') {
        throw new Error('Location permission denied');
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy,
        timeout,
        maximumAge
      });

      const locationData: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      };

      throttledSetLocation(locationData);
      return locationData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [enableHighAccuracy, timeout, maximumAge, throttledSetLocation]);

  const watchLocation = useCallback(() => {
    let watchId: string | null = null;

    const startWatching = async () => {
      try {
        const permissions = await Geolocation.requestPermissions();
        if (permissions.location !== 'granted') {
          throw new Error('Location permission denied');
        }

        watchId = await Geolocation.watchPosition(
          {
            enableHighAccuracy,
            timeout,
            maximumAge
          },
          (position) => {
            if (position) {
              const locationData: LocationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp
              };
              throttledSetLocation(locationData);
            }
          }
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to watch location';
        setError(errorMessage);
      }
    };

    startWatching();

    return () => {
      if (watchId) {
        Geolocation.clearWatch({ id: watchId });
      }
    };
  }, [enableHighAccuracy, timeout, maximumAge, throttledSetLocation]);

  return {
    location,
    loading,
    error,
    getCurrentLocation,
    watchLocation
  };
};