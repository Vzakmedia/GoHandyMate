import { Capacitor } from '@capacitor/core';

/**
 * Platform detection utilities
 */
export const Platform = {
  /**
   * Check if the app is running as a native mobile app
   */
  isNative: () => {
    return Capacitor.isNativePlatform();
  },

  /**
   * Check if the app is running in a web browser
   */
  isWeb: () => {
    return Capacitor.getPlatform() === 'web';
  },

  /**
   * Check if running on iOS
   */
  isIOS: () => {
    return Capacitor.getPlatform() === 'ios';
  },

  /**
   * Check if running on Android
   */
  isAndroid: () => {
    return Capacitor.getPlatform() === 'android';
  },

  /**
   * Get the current platform
   */
  getPlatform: () => {
    return Capacitor.getPlatform();
  },

  /**
   * Check if device has notch (safe area)
   */
  hasNotch: () => {
    // Check for iPhone X and newer models or Android devices with notches
    const userAgent = navigator.userAgent;
    const hasNotchKeywords = /iPhone.*X|iPhone.*11|iPhone.*12|iPhone.*13|iPhone.*14|iPhone.*15/.test(userAgent);
    
    // Also check for CSS env support
    const supportsEnv = CSS.supports('padding-top: env(safe-area-inset-top)');
    
    return Platform.isNative() && (hasNotchKeywords || supportsEnv);
  }
};

/**
 * Detect if running as a web app (PWA)
 */
const isWebApp = () => {
  // Check if it's installed as a PWA
  const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const isFullscreen = window.matchMedia && window.matchMedia('(display-mode: fullscreen)').matches;
  
  // Check for iOS PWA
  const isIOSPWA = (window.navigator as any).standalone === true;
  
  return isStandalone || isFullscreen || isIOSPWA;
};

/**
 * Get view type: 'native', 'web-app', or 'web-view'
 */
const getViewType = () => {
  if (Platform.isNative()) {
    return 'native';
  }
  
  if (isWebApp()) {
    return 'web-app';
  }
  
  return 'web-view';
};

/**
 * Custom hook for platform detection
 */
export const usePlatform = () => {
  return {
    isNative: Platform.isNative(),
    isWeb: Platform.isWeb(),
    isIOS: Platform.isIOS(),
    isAndroid: Platform.isAndroid(),
    hasNotch: Platform.hasNotch(),
    platform: Platform.getPlatform(),
    isWebApp: isWebApp(),
    viewType: getViewType()
  };
};