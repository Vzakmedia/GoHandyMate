
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddUnitFormData } from '@/hooks/useAddUnitForm';

interface UnitBasicInfoProps {
  formData: AddUnitFormData;
  onInputChange: (field: keyof AddUnitFormData, value: string) => void;
}

export const UnitBasicInfo = ({ formData, onInputChange }: UnitBasicInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="unit_number">Unit Number *</Label>
        <Input
          id="unit_number"
          value={formData.unit_number}
          onChange={(e) => onInputChange('unit_number', e.target.value)}
          required
          placeholder="e.g., 101, A-1, Studio 5"
        />
      </div>
      <div>
        <Label htmlFor="unit_name">Unit Name (Optional)</Label>
        <Input
          id="unit_name"
          value={formData.unit_name}
          onChange={(e) => onInputChange('unit_name', e.target.value)}
          placeholder="e.g., Corner Suite, Garden View"
        />
      </div>
    </div>
  );
};
