
import { useAuth } from '@/features/auth';
import { BaseSkillsAndPricingTab } from '../shared/BaseSkillsAndPricingTab';
import { ActionsHeader } from './skills-pricing/ActionsHeader';
import { SyncStatusTab } from './skills-pricing/SyncStatusTab';
import { useSkillsAndPricingData } from '../shared/hooks/useSkillsAndPricingData';
import { toast } from 'sonner';

export const EnhancedSkillsAndPricingTab = () => {
  const { user } = useAuth();
  const {
    handymanData,
    loading,
    isEditing,
    setIsEditing,
    syncingToCustomer,
    setSyncingToCustomer,
    lastSyncTime,
    setLastSyncTime,
    handleRefresh,
    handleDiscardChanges
  } = useSkillsAndPricingData();

  const syncToCustomerSection = async () => {
    setSyncingToCustomer(true);
    try {
      console.log('EnhancedSkillsAndPricingTab: Syncing to customer section...');
      
      await fetch('/api/sync-handyman-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handyman_id: user?.id,
          skills: handymanData.skillRates,
          services: handymanData.servicePricing
        })
      });

      toast.success('Pricing synced to customer section successfully!');
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('EnhancedSkillsAndPricingTab: Sync error:', error);
      toast.error('Failed to sync pricing to customer section');
    } finally {
      setSyncingToCustomer(false);
    }
  };

  const handleSaveAndSync = () => {
    setIsEditing(false);
    syncToCustomerSection();
    toast.success('Changes saved and synced successfully');
  };

  // Enhanced header component
  const EnhancedHeader = (props: any) => (
    <ActionsHeader
      {...props}
      syncingToCustomer={syncingToCustomer}
      lastSyncTime={lastSyncTime}
      onSyncToCustomer={syncToCustomerSection}
      onSave={handleSaveAndSync}
      onCancel={handleDiscardChanges}
    />
  );

  return (
    <BaseSkillsAndPricingTab
      variant="enhanced"
      showSyncStatus={true}
      headerComponent={EnhancedHeader}
      additionalTabs={[
        {
          id: 'sync-status',
          label: 'Sync Status',
          content: <SyncStatusTab />
        }
      ]}
    />
  );
};
