
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface AdCarouselActionsProps {
  colors: {
    gradient: string;
    badge: string;
    button: string;
  };
  onGetQuote: () => void;
  onViewProfile: () => void;
  adsLength: number;
  currentIndex: number;
}

export const AdCarouselActions = ({ 
  colors, 
  onGetQuote, 
  onViewProfile, 
  adsLength, 
  currentIndex 
}: AdCarouselActionsProps) => {
  return (
    <>
      {/* Ultra-compact Action Buttons */}
      <div className="flex gap-2 pt-3">
        <Button 
          onClick={onGetQuote}
          className={`flex-1 bg-gradient-to-r ${colors.button} text-white font-bold py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] border-0 text-xs`}
          size="sm"
        >
          <Sparkles className="w-3 h-3 mr-1.5" />
          Get Quote
        </Button>
        
        <Button 
          onClick={onViewProfile}
          variant="outline"
          className="px-3 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-semibold py-2 rounded-lg transition-all duration-300 transform hover:scale-[1.02] bg-white/80 backdrop-blur-sm text-xs"
          size="sm"
        >
          View Profile
        </Button>
      </div>
      
      {/* Ultra-compact Footer */}
      <div className="flex justify-between items-center text-2xs text-gray-500 pt-2 border-t border-gray-100/50">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">Available Now</span>
        </div>
        {adsLength > 1 && (
          <span>
            {currentIndex + 1} of {adsLength}
          </span>
        )}
      </div>
    </>
  );
};
