
// This component has been replaced by ServiceAreaSettings - redirect to the new component
import { ServiceAreaSettings } from './profile/ServiceAreaSettings';

interface WorkAreaManagerProps {
  isEditing: boolean;
}

export const WorkAreaManager = ({ isEditing }: WorkAreaManagerProps) => {
  return <ServiceAreaSettings isEditing={isEditing} />;
};
