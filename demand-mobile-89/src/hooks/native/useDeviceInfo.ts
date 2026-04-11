import { useState, useEffect } from 'react';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';

interface DeviceInfo {
  platform: string;
  model: string;
  osVersion: string;
  isVirtual: boolean;
  batteryLevel?: number;
  networkStatus: {
    connected: boolean;
    connectionType: string;
  };
}

export const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    platform: 'web',
    model: 'Unknown',
    osVersion: 'Unknown',
    isVirtual: false,
    networkStatus: {
      connected: true,
      connectionType: 'wifi'
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDeviceInfo = async () => {
      try {
        const [deviceData, networkStatus, batteryInfo] = await Promise.all([
          Device.getInfo(),
          Network.getStatus(),
          Device.getBatteryInfo().catch(() => null)
        ]);

        setDeviceInfo({
          platform: deviceData.platform,
          model: deviceData.model,
          osVersion: deviceData.osVersion,
          isVirtual: deviceData.isVirtual,
          batteryLevel: batteryInfo?.batteryLevel,
          networkStatus: {
            connected: networkStatus.connected,
            connectionType: networkStatus.connectionType
          }
        });
      } catch (error) {
        console.error('Error getting device info:', error);
      } finally {
        setLoading(false);
      }
    };

    getDeviceInfo();

    // Listen to network changes
    const setupNetworkListener = async () => {
      const networkListener = await Network.addListener('networkStatusChange', (status) => {
        setDeviceInfo(prev => ({
          ...prev,
          networkStatus: {
            connected: status.connected,
            connectionType: status.connectionType
          }
        }));
      });

      return () => {
        networkListener.remove();
      };
    };

    let cleanup: (() => void) | undefined;
    setupNetworkListener().then(cleanupFn => {
      cleanup = cleanupFn;
    });

    return () => {
      cleanup?.();
    };
  }, []);

  return { deviceInfo, loading };
};