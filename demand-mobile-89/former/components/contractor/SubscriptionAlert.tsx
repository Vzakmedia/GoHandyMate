
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface SubscriptionAlertProps {
  isSubscribed: boolean;
  onTabChange: (tab: string) => void;
}

export const SubscriptionAlert = ({ isSubscribed, onTabChange }: SubscriptionAlertProps) => {
  if (isSubscribed) return null;

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <div>
            <p className="font-medium text-orange-800">No Active Subscription</p>
            <p className="text-sm text-orange-600">
              Subscribe to a plan to start accepting leads and access premium features.
            </p>
          </div>
          <Button 
            onClick={() => onTabChange("subscription")} 
            size="sm" 
            className="ml-auto"
          >
            View Plans
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
