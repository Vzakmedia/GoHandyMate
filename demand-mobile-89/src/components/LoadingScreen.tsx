
import { useResponsiveBreakpoints } from "@/hooks/useResponsiveBreakpoints";

export const LoadingScreen = () => {
  const { isMobile, isTablet } = useResponsiveBreakpoints();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
      <div className="text-center">
        <div className={`
          ${isMobile ? 'w-16 h-16' : isTablet ? 'w-20 h-20' : 'w-24 h-24'} 
          mx-auto mb-4 animate-pulse
        `}>
          <img 
            src="/gohandymate-logo.png"
            alt="GoHandyMate Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-green-600 text-sm sm:text-base">Loading...</p>
      </div>
    </div>
  );
};
