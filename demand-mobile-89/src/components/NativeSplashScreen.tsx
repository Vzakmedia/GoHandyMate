
import { useEffect, useState } from 'react';
import { Logo } from '@/components/ui/logo';

interface NativeSplashScreenProps {
  onComplete: () => void;
}

export const NativeSplashScreen = ({ onComplete }: NativeSplashScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-600 via-green-500 to-orange-500 flex flex-col items-center justify-center z-[9999]">
      {/* Logo with animation */}
      <div className="mb-8 animate-pulse">
        <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm p-4 shadow-2xl">
          <Logo size="lg" showText={false} className="w-full h-full" />
        </div>
      </div>

      {/* App Name */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">GoHandyMate</h1>
        <p className="text-white/80 text-lg">Your Home Service Solution</p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-1 bg-white/30 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Loading Text */}
      <p className="text-white/70 mt-4 text-sm">Loading your experience...</p>
    </div>
  );
};
