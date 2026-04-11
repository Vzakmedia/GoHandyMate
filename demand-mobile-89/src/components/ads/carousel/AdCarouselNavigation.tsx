
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdCarouselNavigationProps {
  adsLength: number;
  currentIndex: number;
  colors: {
    gradient: string;
    badge: string;
    button: string;
  };
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onSetIndex: (index: number) => void;
}

export const AdCarouselNavigation = ({ 
  adsLength, 
  currentIndex, 
  colors, 
  onPrevSlide, 
  onNextSlide, 
  onSetIndex 
}: AdCarouselNavigationProps) => {
  if (adsLength <= 1) return null;

  return (
    <>
      {/* Ultra-compact Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white shadow-md border-0 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        onClick={onPrevSlide}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white shadow-md border-0 w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
        onClick={onNextSlide}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Ultra-compact Dots Indicator */}
      <div className="flex justify-center mt-3 space-x-1">
        {Array.from({ length: adsLength }).map((_, index) => (
          <button
            key={index}
            onClick={() => onSetIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? `bg-gradient-to-r ${colors.gradient} w-4 shadow-sm` 
                : 'bg-gray-300 hover:bg-gray-400 w-1.5'
            }`}
          />
        ))}
      </div>
    </>
  );
};
