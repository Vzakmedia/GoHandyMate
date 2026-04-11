
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Wifi, WifiOff } from "lucide-react";

interface JobsErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const JobsErrorState = ({ error, onRetry }: JobsErrorStateProps) => {
  const isConnectionError = error.toLowerCase().includes('network') || 
                           error.toLowerCase().includes('connection') ||
                           error.toLowerCase().includes('session');

  return (
    <Card>
      <CardContent className="flex items-center justify-center h-64">
        <div className="text-center space-y-4 max-w-md mx-auto">
          {isConnectionError ? (
            <WifiOff className="w-12 h-12 text-orange-500 mx-auto" />
          ) : (
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isConnectionError ? 'Connection Issue' : 'Failed to Load Jobs'}
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              {isConnectionError 
                ? 'Please check your internet connection and try again.'
                : error
              }
            </p>
            <Button onClick={onRetry} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
          {isConnectionError && (
            <div className="text-xs text-gray-500 mt-4">
              <p>If the problem persists:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Check your internet connection</li>
                <li>Try refreshing the page</li>
                <li>Sign out and sign back in</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
