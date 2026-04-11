
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Wrench } from 'lucide-react';
import { ExpandedServiceCategory } from '@/data/expandedServiceCategories';
import { ServicePricing } from '../types/pricing';
import { PricingFormFields } from './PricingFormFields';
import { SubcategoryPricingItem } from './SubcategoryPricingItem';
import { useHandymanData } from '@/hooks/useHandymanData';

interface CategoryPricingCardProps {
  category: ExpandedServiceCategory;
  categoryPricing: ServicePricing | undefined;
  isExpanded: boolean;
  isEditing: boolean;
  onToggleExpand: (categoryId: string) => void;
  onUpdatePricing: (categoryId: string, subcategoryId: string | undefined, field: keyof ServicePricing, value: any) => void;
  getSubcategoryPricing: (categoryId: string, subcategoryId: string) => ServicePricing | undefined;
  getCurrentPrice: (pricing: ServicePricing) => number;
}

export const CategoryPricingCard = ({
  category,
  categoryPricing,
  isExpanded,
  isEditing,
  onToggleExpand,
  onUpdatePricing,
  getSubcategoryPricing,
  getCurrentPrice
}: CategoryPricingCardProps) => {
  const Icon = category.icon;
  const { data: handymanData } = useHandymanData();

  // Find corresponding skill for this category
  const correspondingSkill = handymanData.skillRates?.find(
    skill => skill.skill_name.toLowerCase() === category.name.toLowerCase() ||
             skill.skill_name.toLowerCase().includes(category.name.toLowerCase()) ||
             category.name.toLowerCase().includes(skill.skill_name.toLowerCase())
  );

  return (
    <Card className="overflow-hidden">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <CardHeader 
            className="hover:bg-muted/50 cursor-pointer transition-colors p-3 sm:p-4"
            onClick={() => onToggleExpand(category.id)}
          >
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={categoryPricing?.isActive || false}
                    onCheckedChange={(checked) => {
                      onUpdatePricing(category.id, undefined, 'isActive', checked);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    disabled={!isEditing}
                    className="scale-90"
                  />
                  <div className={`p-1.5 rounded-md ${category.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {categoryPricing?.isActive && (
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      ${getCurrentPrice(categoryPricing)}/hr
                    </Badge>
                  )}
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-sm leading-tight">{category.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{category.description}</p>
                
                {/* Mobile skill status */}
                {correspondingSkill && (
                  <div className="flex flex-wrap items-center gap-1 mt-1.5">
                    <Wrench className="w-3 h-3 text-primary" />
                    <span className="text-xs text-primary truncate max-w-[120px]">
                      {correspondingSkill.skill_name}
                    </span>
                    <Badge 
                      variant={correspondingSkill.is_active ? "default" : "outline"}
                      className="text-xs px-1.5 py-0"
                    >
                      {correspondingSkill.is_active ? "✓" : "○"}
                    </Badge>
                    {correspondingSkill.is_active && (
                      <span className="text-xs text-emerald-600 font-medium">
                        ${correspondingSkill.hourly_rate}/hr
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={categoryPricing?.isActive || false}
                  onCheckedChange={(checked) => {
                    onUpdatePricing(category.id, undefined, 'isActive', checked);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  disabled={!isEditing}
                />
                <div className={`p-2 rounded-lg ${category.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                  
                  {/* Desktop skill status */}
                  {correspondingSkill && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Wrench className="w-3 h-3 text-primary" />
                      <span className="text-xs text-primary">
                        Skill: {correspondingSkill.skill_name}
                      </span>
                      <Badge 
                        variant={correspondingSkill.is_active ? "default" : "outline"}
                        className="text-xs"
                      >
                        {correspondingSkill.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {correspondingSkill.is_active && (
                        <span className="text-xs text-emerald-600">
                          ${correspondingSkill.hourly_rate}/hr
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {categoryPricing?.isActive && (
                  <Badge variant="secondary">
                    ${getCurrentPrice(categoryPricing)}/hr
                  </Badge>
                )}
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 px-3 sm:px-6 space-y-3 sm:space-y-4">
            {/* Skill-Service Sync Notice */}
            {correspondingSkill && (
              <div className={`p-2.5 sm:p-3 rounded-lg border ${
                categoryPricing?.isActive === correspondingSkill.is_active 
                  ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800' 
                  : 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800'
              }`}>
                <div className="text-xs sm:text-sm">
                  {categoryPricing?.isActive === correspondingSkill.is_active ? (
                    <span className="text-emerald-700 dark:text-emerald-300">
                      ✅ Service and skill synchronized
                    </span>
                  ) : (
                    <span className="text-amber-700 dark:text-amber-300">
                      ⚠️ Will sync when saved
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Category Base Pricing */}
            {categoryPricing?.isActive && isEditing && (
              <PricingFormFields
                title="Category Base Rate"
                pricing={categoryPricing}
                onUpdate={(field, value) => onUpdatePricing(category.id, undefined, field, value)}
              />
            )}

            {/* Subcategory Pricing */}
            <div className="space-y-2 sm:space-y-3">
              <span className="font-medium text-sm sm:text-base">Individual Services</span>
              <div className="space-y-2 sm:space-y-3">
                {category.subcategories.map((subcategory) => {
                  const subPricing = getSubcategoryPricing(category.id, subcategory.id);
                  
                  return (
                    <SubcategoryPricingItem
                      key={subcategory.id}
                      subcategory={subcategory}
                      pricing={subPricing}
                      isEditing={isEditing}
                      onUpdatePricing={(field, value) => 
                        onUpdatePricing(category.id, subcategory.id, field, value)
                      }
                      getCurrentPrice={getCurrentPrice}
                    />
                  );
                })}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
