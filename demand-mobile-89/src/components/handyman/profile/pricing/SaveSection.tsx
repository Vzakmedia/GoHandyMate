
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface SaveSectionProps {
  isEditing: boolean;
  saving: boolean;
  activeServicesCount: number;
  onSave: () => void;
}

export const SaveSection = ({ isEditing, saving, activeServicesCount, onSave }: SaveSectionProps) => {
  if (!isEditing) return null;

  return (
    <div className="flex items-center space-x-3 pt-4 border-t">
      <Button 
        onClick={onSave} 
        disabled={saving}
        className="bg-green-600 hover:bg-green-700"
      >
        <Save className="w-4 h-4 mr-2" />
        {saving ? 'Saving...' : 'Save Service Pricing'}
      </Button>
      <div className="text-sm text-gray-600">
        {activeServicesCount} services will be saved
      </div>
    </div>
  );
};
