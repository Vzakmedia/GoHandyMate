// Native app optimizations and utilities
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Device } from '@capacitor/device';

// Optimized haptic feedback
export const hapticFeedback = {
  light: async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      // Silently fail on web or unsupported devices
    }
  },
  medium: async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      // Silently fail on web or unsupported devices
    }
  },
  heavy: async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      // Silently fail on web or unsupported devices
    }
  },
  success: async () => {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (error) {
      // Silently fail on web or unsupported devices
    }
  },
  warning: async () => {
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch (error) {
      // Silently fail on web or unsupported devices
    }
  },
  error: async () => {
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (error) {
      // Silently fail on web or unsupported devices
    }
  }
};

// Platform detection utilities
export const platform = {
  isNative: async () => {
    try {
      const info = await Device.getInfo();
      return info.platform !== 'web';
    } catch {
      return false;
    }
  },
  isIOS: async () => {
    try {
      const info = await Device.getInfo();
      return info.platform === 'ios';
    } catch {
      return false;
    }
  },
  isAndroid: async () => {
    try {
      const info = await Device.getInfo();
      return info.platform === 'android';
    } catch {
      return false;
    }
  },
  isWeb: async () => {
    try {
      const info = await Device.getInfo();
      return info.platform === 'web';
    } catch {
      return true;
    }
  }
};

// Memory and performance optimization
export const optimizePerformance = {
  // Force garbage collection (Chrome only)
  forceGC: () => {
    if (typeof window !== 'undefined' && window.performance && (window as any).gc) {
      try {
        (window as any).gc();
      } catch (error) {
        // GC not available
      }
    }
  },
  
  // Clear unused image cache
  clearImageCache: () => {
    // Remove blob URLs that are no longer needed
    if (typeof window !== 'undefined' && window.URL) {
      const images = document.querySelectorAll('img[src^="blob:"]');
      images.forEach(img => {
        const src = (img as HTMLImageElement).src;
        if (src.startsWith('blob:')) {
          window.URL.revokeObjectURL(src);
        }
      });
    }
  },
  
  // Optimize images for mobile
  optimizeImageForMobile: (canvas: HTMLCanvasElement, maxSize: number = 1024): string => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    const { width, height } = canvas;
    let newWidth = width;
    let newHeight = height;
    
    // Calculate new dimensions while maintaining aspect ratio
    if (width > height) {
      if (width > maxSize) {
        newWidth = maxSize;
        newHeight = (height * maxSize) / width;
      }
    } else {
      if (height > maxSize) {
        newHeight = maxSize;
        newWidth = (width * maxSize) / height;
      }
    }
    
    // Create new canvas with optimized size
    const optimizedCanvas = document.createElement('canvas');
    optimizedCanvas.width = newWidth;
    optimizedCanvas.height = newHeight;
    
    const optimizedCtx = optimizedCanvas.getContext('2d');
    if (!optimizedCtx) return '';
    
    // Draw and compress
    optimizedCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
    return optimizedCanvas.toDataURL('image/jpeg', 0.8);
  }
};

// Native-specific UI enhancements
export const nativeUI = {
  // Safe area utilities
  getSafeAreaInsets: () => {
    if (typeof window !== 'undefined') {
      const style = getComputedStyle(document.documentElement);
      return {
        top: parseInt(style.getPropertyValue('--safe-area-inset-top') || '0'),
        right: parseInt(style.getPropertyValue('--safe-area-inset-right') || '0'),
        bottom: parseInt(style.getPropertyValue('--safe-area-inset-bottom') || '0'),
        left: parseInt(style.getPropertyValue('--safe-area-inset-left') || '0')
      };
    }
    return { top: 0, right: 0, bottom: 0, left: 0 };
  },
  
  // Check if device has notch or dynamic island
  hasNotch: () => {
    const safeAreaTop = nativeUI.getSafeAreaInsets().top;
    return safeAreaTop > 20; // Standard status bar height
  }
};