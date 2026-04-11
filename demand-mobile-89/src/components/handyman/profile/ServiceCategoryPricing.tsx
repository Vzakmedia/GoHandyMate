import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import { expandedServiceCategories } from '@/data/expandedServiceCategories';
import { CategoryPricingCard } from './pricing/CategoryPricingCard';
import { PricingStats } from './pricing/PricingStats';
import { SaveSection } from './pricing/SaveSection';
import { PricingLoadingState } from './pricing/PricingLoadingState';
import { useServicePricing } from './pricing/useServicePricing';

interface ServiceCategoryPricingProps {
  isEditing: boolean;
}

export const ServiceCategoryPricing = ({ isEditing }: ServiceCategoryPricingProps) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  const {
    loading,
    saving,
    saveServicePricing,
    updateServicePricing,
    getCategoryPricing,
    getSubcategoryPricing,
    getActiveServicesCount,
    getCurrentPrice
  } = useServicePricing();

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (loading) {
    return <PricingLoadingState />;
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 px-3 sm:px-6">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">Service Pricing</span>
          </CardTitle>
          <div className="sm:block">
            <PricingStats activeServicesCount={getActiveServicesCount()} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 space-y-3 sm:space-y-4">
        <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
          <p className="text-xs sm:text-sm text-primary/80">
            💡 Service categories sync with your skills automatically
          </p>
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          {expandedServiceCategories.map((category) => (
            <CategoryPricingCard
              key={category.id}
              category={category}
              categoryPricing={getCategoryPricing(category.id)}
              isExpanded={expandedCategories.includes(category.id)}
              isEditing={isEditing}
              onToggleExpand={toggleCategory}
              onUpdatePricing={updateServicePricing}
              getSubcategoryPricing={getSubcategoryPricing}
              getCurrentPrice={getCurrentPrice}
            />
          ))}
        </div>

        <SaveSection
          isEditing={isEditing}
          saving={saving}
          activeServicesCount={getActiveServicesCount()}
          onSave={saveServicePricing}
        />
      </CardContent>
    </Card>
  );
};
