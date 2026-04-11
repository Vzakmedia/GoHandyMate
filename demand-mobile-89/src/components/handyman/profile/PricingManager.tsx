
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, DollarSign, Settings } from 'lucide-react';
import { expandedServiceCategories } from '@/data/expandedServiceCategories';

interface ServicePricing {
  categoryId: string;
  subcategoryId?: string;
  basePrice: number;
  customPrice?: number;
  isActive: boolean;
  sameDayMultiplier: number;
  emergencyMultiplier: number;
}

interface PricingManagerProps {
  servicePricing: ServicePricing[];
  onPricingChange: (pricing: ServicePricing[]) => void;
  isEditing: boolean;
}

export const PricingManager = ({
  servicePricing,
  onPricingChange,
  isEditing
}: PricingManagerProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getPricing = (categoryId: string, subcategoryId?: string) => {
    return servicePricing.find(p => 
      p.categoryId === categoryId && p.subcategoryId === subcategoryId
    );
  };

  const updatePricing = (categoryId: string, subcategoryId: string | undefined, updates: Partial<ServicePricing>) => {
    const existingIndex = servicePricing.findIndex(p => 
      p.categoryId === categoryId && p.subcategoryId === subcategoryId
    );

    if (existingIndex >= 0) {
      const updated = servicePricing.map((pricing, index) =>
        index === existingIndex ? { ...pricing, ...updates } : pricing
      );
      onPricingChange(updated);
    } else {
      const newPricing: ServicePricing = {
        categoryId,
        subcategoryId,
        basePrice: 0,
        isActive: false,
        sameDayMultiplier: 1.5,
        emergencyMultiplier: 2.0,
        ...updates
      };
      onPricingChange([...servicePricing, newPricing]);
    }
  };

  const activePricingCount = servicePricing.filter(p => p.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Service Category Pricing</span>
            </div>
            <Badge variant="outline">
              {activePricingCount} Active Categories
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm">
            Set custom pricing for specific service categories. This will override your general hourly rates for these services.
          </p>
        </CardContent>
      </Card>

      {/* Service Categories */}
      <div className="space-y-3">
        {expandedServiceCategories.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedCategories.includes(category.id);
          const categoryPricing = getPricing(category.id);
          const hasActiveSubcategories = category.subcategories.some(sub => 
            getPricing(category.id, sub.id)?.isActive
          );

          return (
            <Card key={category.id} className="overflow-hidden">
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <CardHeader 
                    className="hover:bg-gray-50 cursor-pointer transition-colors py-4"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${category.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {hasActiveSubcategories && (
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        )}
                        
                        <Badge variant="outline">
                          {category.subcategories.length} services
                        </Badge>
                        
                        {isExpanded ? 
                          <ChevronDown className="w-4 h-4" /> : 
                          <ChevronRight className="w-4 h-4" />
                        }
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Category-level pricing */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <Label className="font-medium">
                            Category Default Pricing
                          </Label>
                          <Switch
                            checked={categoryPricing?.isActive || false}
                            onCheckedChange={(checked) => 
                              updatePricing(category.id, undefined, { 
                                isActive: checked,
                                basePrice: categoryPricing?.basePrice || 0
                              })
                            }
                            disabled={!isEditing}
                          />
                        </div>
                        
                        {(categoryPricing?.isActive || isEditing) && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <Label className="text-sm">Base Price ($/hr)</Label>
                              <div className="flex items-center space-x-1 mt-1">
                                <span className="text-sm">$</span>
                                <Input
                                  type="number"
                                  value={categoryPricing?.basePrice || 0}
                                  onChange={(e) => updatePricing(category.id, undefined, { 
                                    basePrice: parseFloat(e.target.value) || 0 
                                  })}
                                  disabled={!isEditing}
                                  min="0"
                                  step="5"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-sm">Same Day Multiplier</Label>
                              <Input
                                type="number"
                                value={categoryPricing?.sameDayMultiplier || 1.5}
                                onChange={(e) => updatePricing(category.id, undefined, { 
                                  sameDayMultiplier: parseFloat(e.target.value) || 1.5 
                                })}
                                disabled={!isEditing}
                                min="1"
                                step="0.1"
                                className="mt-1"
                              />
                            </div>
                            
                            <div>
                              <Label className="text-sm">Emergency Multiplier</Label>
                              <Input
                                type="number"
                                value={categoryPricing?.emergencyMultiplier || 2.0}
                                onChange={(e) => updatePricing(category.id, undefined, { 
                                  emergencyMultiplier: parseFloat(e.target.value) || 2.0 
                                })}
                                disabled={!isEditing}
                                min="1"
                                step="0.1"
                                className="mt-1"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Subcategory pricing */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm text-gray-700">Individual Services</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {category.subcategories.map((subcategory) => {
                            const subPricing = getPricing(category.id, subcategory.id);
                            
                            return (
                              <div
                                key={subcategory.id}
                                className={`p-3 border rounded-lg transition-all ${
                                  subPricing?.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <h5 className="font-medium text-sm">{subcategory.name}</h5>
                                    <p className="text-xs text-gray-600">
                                      {subcategory.description}
                                    </p>
                                  </div>
                                  
                                  <Switch
                                    checked={subPricing?.isActive || false}
                                    onCheckedChange={(checked) => 
                                      updatePricing(category.id, subcategory.id, { 
                                        isActive: checked,
                                        basePrice: subPricing?.basePrice || 50
                                      })
                                    }
                                    disabled={!isEditing}
                                  />
                                </div>
                                
                                {(subPricing?.isActive || isEditing) && (
                                  <div className="grid grid-cols-2 gap-2 mt-3">
                                    <div>
                                      <Label className="text-xs">Custom Price</Label>
                                      <div className="flex items-center space-x-1 mt-1">
                                        <span className="text-xs">$</span>
                                        <Input
                                          type="number"
                                          value={subPricing?.customPrice || 50}
                                          onChange={(e) => updatePricing(category.id, subcategory.id, { 
                                            customPrice: parseFloat(e.target.value) || 0 
                                          })}
                                          disabled={!isEditing}
                                          min="0"
                                          step="5"
                                          className="text-xs"
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="text-center">
                                      <div className="text-xs text-gray-600 mb-1">Pricing Preview</div>
                                      <div className="flex items-center justify-center space-x-1">
                                        <DollarSign className="w-3 h-3 text-green-600" />
                                        <span className="text-sm font-medium">
                                          ${subPricing?.customPrice || 50}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
