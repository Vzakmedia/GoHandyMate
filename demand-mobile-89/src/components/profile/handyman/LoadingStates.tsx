
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, DollarSign } from 'lucide-react';

interface LoadingStateProps {
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

interface EmptyStateProps {
  servicePricingCount: number;
  skillRatesCount: number;
}

export const LoadingState = () => (
  <Card>
    <CardContent className="p-8 text-center">
      <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Loading Services</h3>
      <p className="text-gray-600">Loading professional services...</p>
    </CardContent>
  </Card>
);

export const ErrorState = ({ error, onRetry }: { error: string; onRetry?: () => void }) => (
  <Card>
    <CardContent className="p-8 text-center">
      <div className="text-red-500 mb-4">⚠️</div>
      <h3 className="text-lg font-semibold mb-2 text-red-600">Error Loading Services</h3>
      <p className="text-gray-600 mb-4">{error}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </CardContent>
  </Card>
);

export const EmptyState = ({ servicePricingCount, skillRatesCount }: EmptyStateProps) => (
  <Card>
    <CardContent className="p-8 text-center">
      <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Services Configured</h3>
      <p className="text-gray-600 mb-4">
        This professional hasn't configured their services yet.
      </p>
      <div className="text-sm text-gray-500">
        <p>Service Pricing: {servicePricingCount} items</p>
        <p>Skill Rates: {skillRatesCount} items</p>
      </div>
    </CardContent>
  </Card>
);
