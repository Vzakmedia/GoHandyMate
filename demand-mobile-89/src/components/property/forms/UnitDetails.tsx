
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddUnitFormData } from '@/hooks/useAddUnitForm';

interface UnitDetailsProps {
  formData: AddUnitFormData;
  onInputChange: (field: keyof AddUnitFormData, value: string) => void;
  onTagsChange: (tagsString: string) => void;
}

export const UnitDetails = ({ formData, onInputChange, onTagsChange }: UnitDetailsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="status">Unit Status</Label>
        <Select value={formData.status} onValueChange={(value) => onInputChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select unit status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vacant">Vacant</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="maintenance">Under Maintenance</SelectItem>
            <SelectItem value="renovation">Under Renovation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="tags">Tags (Optional)</Label>
        <Input
          id="tags"
          value={formData.tags.join(', ')}
          onChange={(e) => onTagsChange(e.target.value)}
          placeholder="e.g., pet-friendly, furnished, parking (comma separated)"
        />
        <p className="text-sm text-gray-500 mt-1">Separate multiple tags with commas</p>
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => onInputChange('notes', e.target.value)}
          placeholder="Additional notes about this unit..."
          rows={3}
        />
      </div>
    </>
  );
};
