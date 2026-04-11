
import { useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export const useLocationDatabaseSync = (user: any) => {
  const lastSuccessfulUpdate = useRef<number>(0);

  const updateLocationInDatabase = useCallback(async (location: any) => {
    if (!user || !location) {
      console.log('No user or location data available for update');
      return;
    }

    try {
      // Validate location data before sending
      const lat = parseFloat(location.latitude);
      const lng = parseFloat(location.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        console.error('Invalid location coordinates:', { lat, lng });
        return;
      }

      if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
        console.error('Location coordinates out of valid range:', { lat, lng });
        return;
      }

      // Limit precision to 6 decimal places to prevent database overflow
      const limitedLat = parseFloat(lat.toFixed(6));
      const limitedLng = parseFloat(lng.toFixed(6));

      logger.info('Updating location in database', { 
        userId: user.id, 
        lat: limitedLat, 
        lng: limitedLng,
        accuracy: location.accuracy || 100
      });

      const { data, error } = await supabase.functions.invoke('location-tracking', {
        body: {
          action: 'update-location',
          userId: user.id,
          location: {
            latitude: limitedLat,
            longitude: limitedLng,
            accuracy: location.accuracy || 100,
            timestamp: Date.now()
          }
        }
      });

      if (error) {
        console.error('Database location update failed:', error);
        logger.error('Database location update failed', error);
        return;
      }

      lastSuccessfulUpdate.current = Date.now();
      logger.info('Location updated successfully in database');
      console.log('Location update response:', data);

    } catch (error) {
      console.error('Location update error:', error);
      logger.error('Location update error', error);
    }
  }, [user]);

  return {
    updateLocationInDatabase,
    lastSuccessfulUpdate
  };
};
