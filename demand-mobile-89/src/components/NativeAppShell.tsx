
import React, { ReactNode, useEffect, useState } from 'react';
import { NativeSplashScreen } from './NativeSplashScreen';
import { usePlatform } from '@/utils/platform';

interface NativeAppShellProps {
  children: ReactNode;
}

export const NativeAppShell = ({ children }: NativeAppShellProps) => {
  const { isNative } = usePlatform();
  const [showSplash, setShowSplash] = useState(isNative);
  const [isReady, setIsReady] = useState(!isNative);

  useEffect(() => {
    // Only initialize if this is a native app
    if (!isNative) return;

    const initializeApp = async () => {
      // Native app initialization
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsReady(true);
    };

    initializeApp();
  }, [isNative]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  // Show splash screen only for native apps
  if (isNative && (showSplash || !isReady)) {
    return <NativeSplashScreen onComplete={handleSplashComplete} />;
  }

  // For web apps, just return children without native shell wrapper
  if (!isNative) {
    return <>{children}</>;
  }

  // Native app layout with safe areas
  return (
    <div className="min-h-screen bg-background antialiased">
      {/* Safe area for notched devices */}
      <div className="min-h-screen">
        {children}
      </div>
    </div>
  );
};
