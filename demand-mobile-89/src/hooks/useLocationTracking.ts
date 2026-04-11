
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
  address?: string;
}

interface LocationSettings {
  trackingEnabled: boolean;
  sharingEnabled: boolean;
  updateInterval: number;
  accuracyThreshold: number;
}

export const useLocationTracking = () => {
  const { user } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationPermissionState, setLocationPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [settings, setSettings] = useState<LocationSettings>({
    trackingEnabled: false,
    sharingEnabled: false,
    updateInterval: 5000,
    accuracyThreshold: 50
  });

  const watchIdRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check location permission state
  const checkPermissionState = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationPermissionState('denied');
      return;
    }

    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setLocationPermissionState(result.state as 'prompt' | 'granted' | 'denied');
      } catch (error) {
        console.log('Permission query not supported');
      }
    }
  }, []);

  // Load settings from localStorage or database
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const saved = localStorage.getItem('locationSettings');
        if (saved) {
          setSettings(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading location settings:', error);
      }
    };
    loadSettings();
    checkPermissionState();
  }, [checkPermissionState]);

  // Get current location once
  const getCurrentLocation = useCallback((): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setLocationPermissionState('denied');
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          };
          setCurrentLocation(location);
          setLocationPermissionState('granted');
          resolve(location);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError(error.message);
          if (error.code === 1) {
            setLocationPermissionState('denied');
          }
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }, []);

  // Start location tracking
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      setLocationPermissionState('denied');
      return;
    }

    if (isTracking) return;

    setIsTracking(true);
    setError(null);

    // Get initial location
    getCurrentLocation().catch((err) => {
      console.error('Failed to get initial location:', err);
    });

    // Start watching position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const location: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        };
        setCurrentLocation(location);
        setLocationPermissionState('granted');

        // Update location in database if sharing is enabled
        if (settings.sharingEnabled && user) {
          updateLocationInDatabase(location);
        }
      },
      (error) => {
        console.error('Location tracking error:', error);
        setError(error.message);
        if (error.code === 1) {
          setLocationPermissionState('denied');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: settings.updateInterval
      }
    );
  }, [isTracking, settings, user, getCurrentLocation]);

  // Stop location tracking
  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsTracking(false);
  }, []);

  // Update location in database
  const updateLocationInDatabase = async (location: LocationData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('handyman_locations')
        .upsert({
          user_id: user.id,
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy || null,
          is_active: true,
          is_real_time: true,
          last_updated: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating location:', error);
      }
    } catch (error) {
      console.error('Database update error:', error);
    }
  };

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<LocationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('locationSettings', JSON.stringify(updatedSettings));
  }, [settings]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    currentLocation,
    isTracking,
    error,
    settings,
    locationPermissionState,
    startTracking,
    stopTracking,
    getCurrentLocation,
    updateSettings
  };
};
