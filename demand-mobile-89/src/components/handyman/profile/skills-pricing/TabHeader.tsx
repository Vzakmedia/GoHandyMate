
import { Button } from '@/components/ui/button';
import { RefreshCw, Settings, Save, RotateCcw } from 'lucide-react';

interface TabHeaderProps {
  isEditing: boolean;
  loading: boolean;
  lastSyncTime: Date | null;
  onRefresh: () => void;
  onEditToggle: () => void;
  onSaveAndSync: () => void;
  onDiscardChanges: () => void;
}

export const TabHeader = ({
  isEditing,
  loading,
  lastSyncTime,
  onRefresh,
  onEditToggle,
  onSaveAndSync,
  onDiscardChanges
}: TabHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="min-w-0 flex-1">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">Services & Pricing Management</h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Manage your services and set pricing for service categories
        </p>
        {lastSyncTime && (
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {lastSyncTime.toLocaleTimeString()}
          </p>
        )}
      </div>
      
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          <span className="truncate">Refresh</span>
        </Button>
        
        {!isEditing ? (
          <Button onClick={onEditToggle} className="w-full sm:w-auto">
            <Settings className="w-4 h-4 mr-2" />
            <span className="truncate">Edit Settings</span>
          </Button>
        ) : (
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
            <Button
              variant="outline"
              onClick={onDiscardChanges}
              className="w-full sm:w-auto"
            >
              <span className="truncate">Cancel</span>
            </Button>
            <Button
              onClick={onSaveAndSync}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              <span className="truncate">Save Changes</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
