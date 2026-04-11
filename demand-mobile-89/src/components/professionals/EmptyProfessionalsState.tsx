
import { EmptyProfessionalsStateEnhanced } from './EmptyProfessionalsStateEnhanced';

interface EmptyProfessionalsStateProps {
  serviceCategory?: string;
  showLocationMessage?: boolean;
  onRetry?: () => void;
  hasLocation?: boolean;
}

export const EmptyProfessionalsState = (props: EmptyProfessionalsStateProps) => {
  return <EmptyProfessionalsStateEnhanced {...props} />;
};
