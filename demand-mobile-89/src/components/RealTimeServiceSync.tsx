
import { useState } from 'react';
import { useRealTimeServices } from './real-time-service-sync/useRealTimeServices';
import { ServiceSyncHeader } from './real-time-service-sync/ServiceSyncHeader';
import { ServiceCategoriesGrid } from './real-time-service-sync/ServiceCategoriesGrid';
import { ServiceCategoryModal } from './real-time-service-sync/ServiceCategoryModal';
import { LoadingState } from './real-time-service-sync/LoadingState';
import { ErrorState } from './real-time-service-sync/ErrorState';
import type { ServiceCategory } from './real-time-service-sync/types';

export const RealTimeServiceSync = () => {
  const {
    activeServices,
    serviceCategories,
    loading,
    error,
    totalSubcategories,
    fetchHandymanServices
  } = useRealTimeServices();

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchHandymanServices} />;
  }

  return (
    <div className="space-y-8">
      <ServiceSyncHeader
        serviceCategories={serviceCategories.length}
        totalSubcategories={totalSubcategories}
        availableHandymen={new Set(activeServices.map(s => s.user_id)).size}
        onRefresh={fetchHandymanServices}
      />

      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Service Categories</h2>
          <p className="text-gray-600">Click on any category to explore available services and professionals</p>
        </div>
        
        <ServiceCategoriesGrid
          serviceCategories={serviceCategories}
          onCategorySelect={setSelectedCategory}
          onRefresh={fetchHandymanServices}
        />
      </div>

      <ServiceCategoryModal
        selectedCategory={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />
    </div>
  );
};
