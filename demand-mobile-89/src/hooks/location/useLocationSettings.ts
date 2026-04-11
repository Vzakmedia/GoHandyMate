
import { useState, useCallback } from 'react';
import { logger } from '@/utils/logger';

interface LocationSettings {
  trackingEnabled: boolean;
  sharingEnabled: boolean;
  updateInterval: number;
  accuracyThreshold: number;
}

export const useLocationSettings = () => {
  const [settings, setSettings] = useState<LocationSettings>({
    trackingEnabled: true,
    sharingEnabled: true,
    updateInterval: 60000, // 60 seconds to reduce server load
    accuracyThreshold: 50
  });

  const updateSettings = useCallback(async (newSettings: Partial<LocationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    logger.info('Location settings updated', updatedSettings);
  }, [settings]);

  return {
    settings,
    updateSettings
  };
};
