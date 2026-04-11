
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const PromotionalBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-1 px-4 relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-yellow-400 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
            LIMITED TIME
          </div>
          <p className="text-sm md:text-base font-medium">
            🎉 New users get 50% off their first service booking! Use code: WELCOME50
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white text-green-600 hover:bg-gray-100 border-white text-xs px-3 py-1"
          >
            Claim Offer
          </Button>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
