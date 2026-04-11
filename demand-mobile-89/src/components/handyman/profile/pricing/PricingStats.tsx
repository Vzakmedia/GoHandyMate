
import { Badge } from '@/components/ui/badge';

interface PricingStatsProps {
  activeServicesCount: number;
}

export const PricingStats = ({ activeServicesCount }: PricingStatsProps) => {
  return (
    <Badge variant="outline">
      {activeServicesCount} services active
    </Badge>
  );
};
