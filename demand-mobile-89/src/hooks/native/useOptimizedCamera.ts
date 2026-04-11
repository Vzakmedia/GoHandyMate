import { useState, useCallback } from 'react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

interface CameraOptions {
  quality?: number;
  allowEditing?: boolean;
  resultType?: CameraResultType;
  source?: CameraSource;
  maxWidth?: number;
  maxHeight?: number;
}

export const useOptimizedCamera = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const takePicture = useCallback(async (options: CameraOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      const {
        quality = 80,
        allowEditing = false,
        resultType = CameraResultType.DataUrl,
        source = CameraSource.Camera,
        maxWidth = 1920,
        maxHeight = 1920
      } = options;

      // Request permissions
      const permissions = await Camera.requestPermissions();
      if (permissions.camera !== 'granted') {
        throw new Error('Camera permission denied');
      }

      const photo: Photo = await Camera.getPhoto({
        quality,
        allowEditing,
        resultType,
        source,
        width: maxWidth,
        height: maxHeight,
        correctOrientation: true
      });

      return photo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to take picture';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const pickFromGallery = useCallback(async (options: CameraOptions = {}) => {
    return takePicture({
      ...options,
      source: CameraSource.Photos
    });
  }, [takePicture]);

  return {
    loading,
    error,
    takePicture,
    pickFromGallery
  };
};