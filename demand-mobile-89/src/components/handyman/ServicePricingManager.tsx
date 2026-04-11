
// This component has been replaced by ServiceCategoryPricing - redirect to the new component
import { ServiceCategoryPricing } from './profile/ServiceCategoryPricing';

interface ServicePricingManagerProps {
  isEditing: boolean;
}

export const ServicePricingManager = ({ isEditing }: ServicePricingManagerProps) => {
  return <ServiceCategoryPricing isEditing={isEditing} />;
};
