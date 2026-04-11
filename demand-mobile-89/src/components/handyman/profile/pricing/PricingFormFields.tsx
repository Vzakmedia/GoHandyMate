
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServicePricing } from '../types/pricing';

interface PricingFormFieldsProps {
  title: string;
  pricing: ServicePricing;
  onUpdate: (field: keyof ServicePricing, value: any) => void;
}

export const PricingFormFields = ({ title, pricing, onUpdate }: PricingFormFieldsProps) => {
  const getCurrentPrice = () => pricing.customPrice || pricing.basePrice;

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-3">
      <Label className="font-medium">{title}</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-sm">Hourly Rate ($)</Label>
          <Input
            type="number"
            step="0.01"
            value={getCurrentPrice()}
            onChange={(e) => onUpdate('customPrice', parseFloat(e.target.value) || 0)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm">Same Day (x)</Label>
          <Input
            type="number"
            step="0.1"
            value={pricing.sameDayMultiplier}
            onChange={(e) => onUpdate('sameDayMultiplier', parseFloat(e.target.value) || 1.5)}
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-sm">Emergency (x)</Label>
          <Input
            type="number"
            step="0.1"
            value={pricing.emergencyMultiplier}
            onChange={(e) => onUpdate('emergencyMultiplier', parseFloat(e.target.value) || 2.0)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};
