
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  syncError: string;
  onRetry: () => void;
}

export const ErrorAlert = ({ syncError, onRetry }: ErrorAlertProps) => {
  return (
    <Alert className="border-red-200 bg-red-50">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-red-800">
        <strong>Sync Error:</strong> {syncError}
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="ml-2"
        >
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
};
