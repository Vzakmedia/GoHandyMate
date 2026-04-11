
import { useState, useEffect } from 'react';

interface Breakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  isFoldable: boolean;
  screenWidth: number;
  screenHeight: number;
}

export const useResponsiveBreakpoints = (): Breakpoints => {
  const [breakpoints, setBreakpoints] = useState<Breakpoints>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    isFoldable: false,
    screenWidth: 0,
    screenHeight: 0,
  });

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Check for foldable devices (common aspect ratios)
      const aspectRatio = width / height;
      const isFoldable = (
        (width >= 768 && width <= 900 && height >= 600) || // Tablet-like when unfolded
        (aspectRatio > 2.1 && width >= 600) || // Wide aspect ratio
        (width >= 600 && width <= 900 && height >= 700) // Square-ish when folded
      );

      setBreakpoints({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024 && width < 1440,
        isLargeDesktop: width >= 1440,
        isFoldable,
        screenWidth: width,
        screenHeight: height,
      });
    };

    updateBreakpoints();
    window.addEventListener('resize', updateBreakpoints);
    window.addEventListener('orientationchange', updateBreakpoints);

    return () => {
      window.removeEventListener('resize', updateBreakpoints);
      window.removeEventListener('orientationchange', updateBreakpoints);
    };
  }, []);

  return breakpoints;
};
