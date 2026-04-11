
import { ServiceAreaSettings } from './ServiceAreaSettings';
import { useProfile } from './ProfileProvider';

export const WorkAreasTab = () => {
  const { isEditing } = useProfile();

  return (
    <div className="space-y-6">
      <ServiceAreaSettings isEditing={isEditing} />
    </div>
  );
};
