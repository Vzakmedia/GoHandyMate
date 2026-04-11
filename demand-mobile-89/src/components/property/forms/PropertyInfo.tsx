
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddressInput } from '@/components/ui/address-input';
import { AddUnitFormData } from '@/hooks/useAddUnitForm';

interface PropertyInfoProps {
  formData: AddUnitFormData;
  onInputChange: (field: keyof AddUnitFormData, value: string) => void;
}

export const PropertyInfo = ({ formData, onInputChange }: PropertyInfoProps) => {
  return (
    <>
      <div>
        <Label htmlFor="property_address">Property Address *</Label>
        <AddressInput
          value={formData.property_address}
          onChange={(value) => onInputChange('property_address', value)}
          onAddressSelect={(details) => {
            onInputChange('property_address', details.formatted_address);
          }}
          placeholder="Start typing property address..."
        />
      </div>

      <div>
        <Label htmlFor="property_id">Property ID *</Label>
        <Input
          id="property_id"
          value={formData.property_id}
          onChange={(e) => onInputChange('property_id', e.target.value)}
          required
          placeholder="Property identifier or code"
        />
      </div>
    </>
  );
};
