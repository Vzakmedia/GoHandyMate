
import { ArrowLeft, Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NativeHeaderProps {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
  showSearch?: boolean;
  onSearchPress?: () => void;
  rightAction?: React.ReactNode;
}

export const NativeHeader = ({
  title,
  showBack = false,
  onBackPress,
  showSearch = false,
  onSearchPress,
  rightAction
}: NativeHeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      {/* Left side */}
      <div className="flex items-center">
        {showBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackPress}
            className="mr-2 p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Button>
        )}
        <h1 className="text-lg font-semibold text-gray-900 truncate">{title}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2">
        {showSearch && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSearchPress}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Search className="w-5 h-5 text-gray-700" />
          </Button>
        )}
        {rightAction || (
          <Button
            variant="ghost"
            size="sm"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Bell className="w-5 h-5 text-gray-700" />
          </Button>
        )}
      </div>
    </div>
  );
};
