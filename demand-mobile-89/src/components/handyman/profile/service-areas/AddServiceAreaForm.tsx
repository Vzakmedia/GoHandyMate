
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface AddServiceAreaFormProps {
  newAreaName: string;
  onNewAreaNameChange: (name: string) => void;
  onAddArea: () => void;
  maxAreasReached: boolean;
}

export const AddServiceAreaForm = ({
  newAreaName,
  onNewAreaNameChange,
  onAddArea,
  maxAreasReached
}: AddServiceAreaFormProps) => {
  if (maxAreasReached) return null;

  return (
    <Card className="border-dashed border-2 border-gray-200 hover:border-blue-300 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Enter area name (e.g., Downtown, Suburbs)"
            value={newAreaName}
            onChange={(e) => onNewAreaNameChange(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={onAddArea} 
            disabled={!newAreaName.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Area
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          You can manage up to 3 service areas with live address suggestions
        </p>
      </CardContent>
    </Card>
  );
};
