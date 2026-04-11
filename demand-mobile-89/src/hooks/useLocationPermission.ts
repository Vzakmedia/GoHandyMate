
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export const useLocationPermission = () => {
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isChecking, setIsChecking] = useState(false);

  // Check current permission state
  const checkPermissionState = useCallback(async () => {
    if (!navigator.geolocation) {
      setPermissionState('denied');
      return 'denied';
    }

    if (navigator.permissions) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionState(result.state as 'prompt' | 'granted' | 'denied');
        return result.state as 'prompt' | 'granted' | 'denied';
      } catch (error) {
        console.log('Permission query not supported, checking with getCurrentPosition');
      }
    }

    // Fallback: try to get position to check permission
    return new Promise<'prompt' | 'granted' | 'denied'>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => {
          setPermissionState('granted');
          resolve('granted');
        },
        (error) => {
          if (error.code === 1) {
            setPermissionState('denied');
            resolve('denied');
          } else {
            setPermissionState('prompt');
            resolve('prompt');
          }
        },
        { timeout: 1000 }
      );
    });
  }, []);

  // Request location permission with user-friendly messages
  const requestPermission = useCallback(async (): Promise<'granted' | 'denied'> => {
    if (!navigator.geolocation) {
      toast.error('Location services are not supported by this browser');
      setPermissionState('denied');
      return 'denied';
    }

    setIsChecking(true);

    return new Promise((resolve) => {
      // Show informative toast before requesting
      toast.info('Please allow location access to find nearby professionals', {
        duration: 3000
      });

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPermissionState('granted');
          setIsChecking(false);
          toast.success('Location access granted! Finding professionals near you...');
          resolve('granted');
        },
        (error) => {
          setIsChecking(false);
          
          switch (error.code) {
            case 1: // PERMISSION_DENIED
              setPermissionState('denied');
              toast.error('Location access denied. You can still browse all professionals, but distances won\'t be shown.');
              resolve('denied');
              break;
            case 2: // POSITION_UNAVAILABLE
              toast.error('Location temporarily unavailable. Please try again.');
              setPermissionState('denied');
              resolve('denied');
              break;
            case 3: // TIMEOUT
              toast.error('Location request timed out. Please try again.');
              setPermissionState('denied');
              resolve('denied');
              break;
            default:
              toast.error('Unable to access location. Please check your browser settings.');
              setPermissionState('denied');
              resolve('denied');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  }, []);

  // Prompt user to enable location manually if denied
  const showLocationInstructions = useCallback(() => {
    toast.info(
      'To enable location: Click the location icon in your browser\'s address bar and select "Allow"',
      { duration: 6000 }
    );
  }, []);

  useEffect(() => {
    checkPermissionState();
  }, [checkPermissionState]);

  return {
    permissionState,
    isChecking,
    requestPermission,
    checkPermissionState,
    showLocationInstructions
  };
};
