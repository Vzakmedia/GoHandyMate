
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lovable.gohandymate',
  appName: 'GoHandyMate',
  webDir: 'dist',
  // Comment out server config for production builds
  // server: {
  //   url: 'https://89f651fe-3214-4ee2-b94b-c288222554bf.lovableproject.com?forceHideBadge=true',
  //   cleartext: true
  // },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#16a34a',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: false
    },
    StatusBar: {
      style: 'LIGHT_CONTENT',
      backgroundColor: '#16a34a',
      overlaysWebView: false
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true
    },
    App: {
      keepScreenOn: false
    },
    Geolocation: {
      permissions: {
        location: 'always'
      }
    },
    Camera: {
      permissions: {
        camera: 'always',
        photos: 'always'
      }
    },
    Device: {},
    Network: {},
    Haptics: {},
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#16a34a',
      sound: 'beep.wav'
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true
  }
};

export default config;
