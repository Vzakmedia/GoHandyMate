
import { RealTimeServiceProvidersEnhanced } from './RealTimeServiceProvidersEnhanced';

interface RealTimeServiceProvidersProps {
  serviceCategory?: string;
  maxResults?: number;
  showDistance?: boolean;
  userRole?: 'customer';
}

export const RealTimeServiceProviders = (props: RealTimeServiceProvidersProps) => {
  return <RealTimeServiceProvidersEnhanced {...props} />;
};
