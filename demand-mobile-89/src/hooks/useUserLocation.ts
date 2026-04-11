
import { useState, useEffect } from 'react';
import { getUserLocation, LocationData } from '@/utils/locationUtils';

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    const initializeLocation = async () => {
      const location = await getUserLocation();
      setUserLocation(location);
    };

    initializeLocation();
  }, []);

  return userLocation;
};
