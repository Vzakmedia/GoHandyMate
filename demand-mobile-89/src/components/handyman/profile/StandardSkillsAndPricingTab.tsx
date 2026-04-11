import { BaseSkillsAndPricingTab } from '../shared/BaseSkillsAndPricingTab';
import { TabHeader } from './skills-pricing/TabHeader';
import { useSkillsAndPricingData } from '../shared/hooks/useSkillsAndPricingData';

export const StandardSkillsAndPricingTab = () => {
  const {
    loading,
    isEditing,
    setIsEditing,
    handleRefresh,
    handleSaveChanges,
    handleDiscardChanges
  } = useSkillsAndPricingData();

  // Standard header component
  const StandardHeader = (props: any) => (
    <TabHeader
      {...props}
      onSaveAndSync={handleSaveChanges}
      onDiscardChanges={handleDiscardChanges}
    />
  );

  return (
    <BaseSkillsAndPricingTab
      variant="standard"
      headerComponent={StandardHeader}
    />
  );
};