
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Gift, Clock, Users, ArrowRight } from "lucide-react";

export const InteractiveBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Badge */}
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
              <Gift className="w-5 h-5 text-yellow-300 animate-bounce" />
              <span className="text-sm font-bold">FLASH SALE</span>
            </div>
            
            {/* Main message */}
            <div className="hidden md:block">
              <p className="text-lg font-semibold">
                🎉 New Year Special: Get 60% OFF your first 3 bookings!
              </p>
              <p className="text-sm opacity-90">
                Use code: <span className="font-mono bg-white/20 px-2 py-1 rounded">NEWYEAR60</span>
              </p>
            </div>

            {/* Mobile message */}
            <div className="md:hidden">
              <p className="text-sm font-semibold">🎉 60% OFF first 3 bookings!</p>
              <p className="text-xs opacity-90">Code: NEWYEAR60</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Countdown timer */}
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
              <Clock className="w-4 h-4 text-yellow-300" />
              <span className="font-mono text-sm font-bold">{formatTime(timeLeft)}</span>
            </div>

            {/* Users counter */}
            <div className="hidden sm:flex items-center space-x-1 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/30">
              <Users className="w-4 h-4 text-green-300" />
              <span className="text-sm font-medium">247 claimed</span>
            </div>
            
            {/* CTA Button */}
            <Button 
              size="sm"
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Claim Now
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            
            {/* Close button */}
            <button 
              onClick={() => setIsVisible(false)}
              className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/20 rounded"
              aria-label="Close banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
