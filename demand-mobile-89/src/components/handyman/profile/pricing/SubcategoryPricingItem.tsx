
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ServiceSubcategory } from '@/data/expandedServiceCategories';
import { ServicePricing } from '../types/pricing';

interface SubcategoryPricingItemProps {
  subcategory: ServiceSubcategory;
  pricing: ServicePricing | undefined;
  isEditing: boolean;
  onUpdatePricing: (field: keyof ServicePricing, value: any) => void;
  getCurrentPrice: (pricing: ServicePricing) => number;
}

export const SubcategoryPricingItem = ({
  subcategory,
  pricing,
  isEditing,
  onUpdatePricing,
  getCurrentPrice
}: SubcategoryPricingItemProps) => {
  return (
    <div className="border rounded-lg bg-card">
      {/* Mobile Layout */}
      <div className="block sm:hidden p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Switch
              checked={pricing?.isActive || false}
              onCheckedChange={(checked) => {
                onUpdatePricing('isActive', checked);
              }}
              disabled={!isEditing}
              className="scale-90"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm leading-tight truncate">{subcategory.name}</p>
            </div>
          </div>
          {pricing?.isActive && !isEditing && (
            <Badge variant="outline" className="text-xs px-2 py-0.5 ml-2">
              ${getCurrentPrice(pricing)}
            </Badge>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {subcategory.description}
        </p>
        
        {pricing?.isActive && isEditing && (
          <div className="flex items-center space-x-2 pt-2 border-t border-border/50">
            <span className="text-sm text-muted-foreground">Rate:</span>
            <div className="flex items-center space-x-1">
              <span className="text-sm">$</span>
              <Input
                type="number"
                step="0.01"
                value={getCurrentPrice(pricing)}
                onChange={(e) => onUpdatePricing('customPrice', parseFloat(e.target.value) || 0)}
                className="w-20 h-8 text-sm"
                placeholder="0.00"
              />
              <span className="text-xs text-muted-foreground">/hr</span>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center justify-between p-3">
        <div className="flex items-center space-x-3">
          <Switch
            checked={pricing?.isActive || false}
            onCheckedChange={(checked) => {
              onUpdatePricing('isActive', checked);
            }}
            disabled={!isEditing}
          />
          <div className="flex-1">
            <p className="font-medium text-sm">{subcategory.name}</p>
            <p className="text-xs text-muted-foreground">
              {subcategory.description}
            </p>
          </div>
        </div>
        
        {pricing?.isActive && isEditing && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <span className="text-sm">$</span>
              <Input
                type="number"
                step="0.01"
                value={getCurrentPrice(pricing)}
                onChange={(e) => onUpdatePricing('customPrice', parseFloat(e.target.value) || 0)}
                className="w-20"
              />
            </div>
          </div>
        )}

        {pricing?.isActive && !isEditing && (
          <Badge variant="outline">
            ${getCurrentPrice(pricing)}
          </Badge>
        )}
      </div>
    </div>
  );
};
