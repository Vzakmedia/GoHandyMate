
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface UnitsHeaderProps {
  onAddUnit: () => void;
}

export const UnitsHeader = ({ onAddUnit }: UnitsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-2xl font-bold">Units Overview</h2>
      <Button onClick={onAddUnit} className="bg-blue-600 hover:bg-blue-700">
        <Plus className="w-4 h-4 mr-2" />
        Add Unit
      </Button>
    </div>
  );
};
