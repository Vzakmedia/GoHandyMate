
import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface NativeCardProps {
  children: ReactNode;
  onPress?: () => void;
  showArrow?: boolean;
  className?: string;
}

export const NativeCard = ({ 
  children, 
  onPress, 
  showArrow = false, 
  className = '' 
}: NativeCardProps) => {
  const Component = onPress ? 'button' : 'div';
  
  return (
    <Component
      onClick={onPress}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100 p-4
        ${onPress ? 'active:bg-gray-50 transition-colors' : ''}
        ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">{children}</div>
        {showArrow && (
          <ChevronRight className="w-5 h-5 text-gray-400 ml-3" />
        )}
      </div>
    </Component>
  );
};
