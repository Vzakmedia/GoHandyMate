
import { ServiceCategoryPricing } from './ServiceCategoryPricing';
import { ServiceAreaSettings } from './ServiceAreaSettings';
import { useProfile } from './ProfileProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const ServicesTab = () => {
  const { isEditing } = useProfile();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="areas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="areas">Service Areas</TabsTrigger>
          <TabsTrigger value="pricing">Service Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="areas" className="mt-6">
          <ServiceAreaSettings isEditing={isEditing} />
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <ServiceCategoryPricing isEditing={isEditing} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
