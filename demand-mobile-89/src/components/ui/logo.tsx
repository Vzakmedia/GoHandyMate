
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  textVariant?: 'full' | 'short';
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
  xl: 'w-12 h-12'
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
};

export const Logo = ({ 
  size = 'md', 
  className, 
  showText = true, 
  textVariant = 'full' 
}: LogoProps) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn(
        "flex-shrink-0",
        sizeClasses[size]
      )}>
        <img 
          src="/lovable-uploads/eb567480-8cf9-4f27-a7fe-8c3ae2c6ab2f.png" 
          alt="GoHandyMate Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      {showText && (
        <div>
          <h1 className={cn(
            "font-bold bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent",
            textSizeClasses[size]
          )}>
            {textVariant === 'short' ? 'GoHandy' : 'GoHandyMate'}
          </h1>
          {size === 'lg' || size === 'xl' ? (
            <p className="text-xs text-gray-600">
              On-demand service platform
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
};
