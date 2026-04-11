
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/features/auth';
import { supabase } from "@/integrations/supabase/client";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Refresh subscription status after successful payment
    if (user) {
      const refreshSubscription = async () => {
        try {
          await supabase.functions.invoke('check-subscription');
        } catch (error) {
          console.error('Error refreshing subscription status:', error);
        }
      };
      
      refreshSubscription();
    }
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-700">
              Subscription Activated!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Your subscription has been successfully activated. You can now access all premium features and start growing your business.
            </p>
            
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/subscription')}
                className="w-full"
              >
                View Subscription Details
              </Button>
              
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full"
              >
                Continue to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
