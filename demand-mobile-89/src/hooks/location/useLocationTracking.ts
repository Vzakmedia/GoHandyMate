
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/features/auth';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { useLocationData } from '@/hooks/useLocationData';
import { useLocationSettings } from '@/hooks/location/useLocationSettings';
import { useLocationDatabaseSync } from '@/hooks/location/useLocationDatabaseSync';
import { useLocationRealtimeSync } from '@/hooks/location/useLocationRealtimeSync';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';

export const useLocationTracking = () => {
  const { user } = useAuth();
  const { permissionState, requestPermission } = useLocationPermission();
  const { currentLocation, isLoading, getCurrentLocation } = useLocationData();
  const { settings, updateSettings } = useLocationSettings();
  const { updateLocationInDatabase, lastSuccessfulUpdate } = useLocationDatabaseSync(user);
  const [isTracking, setIsTracking] = useState(false);

  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const watchId = useRef<number | null>(null);

  // Setup real-time sync
  useLocationRealtimeSync(user);

  // Auto-start location tracking for customers
  useEffect(() => {
    if (user?.user_metadata?.user_role === 'customer') {
      startTrackingAutomatically();
    }
  }, [user]);

  // Automatic location tracking without user prompts
  const startTrackingAutomatically = useCallback(async () => {
    try {
      logger.info('Starting automatic location tracking for customer...');
      
      // Get initial location
      const location = await getCurrentLocation();
      setIsTracking(true);
      
      console.log('Customer location detected:', location);
      
      // Update in database if user is signed in
      if (user && location) {
        await updateLocationInDatabase(location);
      }

      // Clear any existing intervals to prevent duplicates
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }

      // Set up periodic updates with better error handling and longer intervals
      if (location && user) {
        intervalId.current = setInterval(async () => {
          try {
            const now = Date.now();
            const timeSinceLastSuccess = now - lastSuccessfulUpdate.current;
            
            // Skip if last update was very recent (within 30 seconds)
            if (timeSinceLastSuccess < 30000) {
              console.log('Skipping location update - too recent');
              return;
            }

            const freshLocation = await getCurrentLocation();
            if (freshLocation) {
              await updateLocationInDatabase(freshLocation);
            } else {
              console.log('No fresh location data available');
            }
          } catch (error) {
            // Log errors but don't spam the user
            console.log('Periodic location update failed:', error);
            logger.info('Periodic location update failed', { error: error.message });
          }
        }, settings.updateInterval);
      }

      return location;
    } catch (error) {
      logger.info('Location tracking not available, using fallback');
      console.log('Location tracking fallback to IP detection:', error);
    }
  }, [getCurrentLocation, updateLocationInDatabase, user, settings.updateInterval, lastSuccessfulUpdate]);

  // Start continuous location tracking (for all users including customers)
  const startTracking = useCallback(async () => {
    try {
      logger.info('Starting location tracking...');
      
      // Request permission first
      const permission = await requestPermission();
      if (permission === 'denied') {
        toast.error('Location access denied. Please enable location permissions in your browser.');
        return;
      }

      // Get initial location
      const location = await getCurrentLocation();
      setIsTracking(true);
      
      // Update in database immediately if user is signed in
      if (user && location) {
        await updateLocationInDatabase(location);
      }

      // Clear any existing intervals
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }

      // Set up periodic updates with better error handling
      if (location && user && settings.sharingEnabled) {
        intervalId.current = setInterval(async () => {
          try {
            const freshLocation = await getCurrentLocation();
            if (freshLocation) {
              await updateLocationInDatabase(freshLocation);
            }
          } catch (error) {
            logger.error('Periodic location update failed', error);
          }
        }, settings.updateInterval);
      }
      
      toast.success('Location tracking enabled! Finding nearby professionals...');
      
      // Trigger refresh of professionals list
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('refetch-professionals'));
      }, 500);
      
      return location;
    } catch (error) {
      logger.error('Error starting location tracking', error);
      toast.error('Location access denied. Please enable location permissions in your browser.');
      throw error;
    }
  }, [getCurrentLocation, updateLocationInDatabase, user, settings, requestPermission]);

  // Stop location tracking
  const stopTracking = useCallback(() => {
    setIsTracking(false);
    
    // Clear watch position
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    
    // Clear interval
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
    
    toast.success('Location tracking stopped');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, []);

  return {
    currentLocation,
    isTracking: isTracking || (user?.user_metadata?.user_role === 'customer'),
    isLoading,
    settings,
    locationPermissionState: permissionState,
    startTracking,
    stopTracking: () => {
      setIsTracking(false);
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    },
    updateSettings,
    getCurrentLocation
  };
};
