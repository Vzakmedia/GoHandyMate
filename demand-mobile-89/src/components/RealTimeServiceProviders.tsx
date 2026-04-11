
import { RealTimeServiceProvidersEnhanced } from './RealTimeServiceProvidersEnhanced';

interface RealTimeServiceProvidersProps {
  serviceCategory?: string;
  maxResults?: number;
  showDistance?: boolean;
  userRole?: 'customer' | 'property_manager';
}

export const RealTimeServiceProviders = (props: RealTimeServiceProvidersProps) => {
  return <RealTimeServiceProvidersEnhanced {...props} />;
};
