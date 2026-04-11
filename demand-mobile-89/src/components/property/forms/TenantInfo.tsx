
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddUnitFormData } from '@/hooks/useAddUnitForm';

interface TenantInfoProps {
  formData: AddUnitFormData;
  onInputChange: (field: keyof AddUnitFormData, value: string) => void;
}

export const TenantInfo = ({ formData, onInputChange }: TenantInfoProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tenant Information (Optional)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tenant_name">Tenant Name</Label>
          <Input
            id="tenant_name"
            value={formData.tenant_name}
            onChange={(e) => onInputChange('tenant_name', e.target.value)}
            placeholder="Full name of tenant"
          />
        </div>
        <div>
          <Label htmlFor="tenant_phone">Tenant Phone</Label>
          <Input
            id="tenant_phone"
            type="tel"
            value={formData.tenant_phone}
            onChange={(e) => onInputChange('tenant_phone', e.target.value)}
            placeholder="Phone number"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tenant_email">Tenant Email</Label>
        <Input
          id="tenant_email"
          type="email"
          value={formData.tenant_email}
          onChange={(e) => onInputChange('tenant_email', e.target.value)}
          placeholder="tenant@email.com"
        />
      </div>
    </div>
  );
};
