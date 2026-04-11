
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from '@/features/auth';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConnectAccount {
  stripe_account_id: string;
  onboarding_completed: boolean;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
}

export const StripeConnectOnboarding = () => {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<ConnectAccount | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const createConnectAccount = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-connect-account');
      
      if (error) throw error;

      if (data.onboarding_url) {
        // Open onboarding in new tab
        window.open(data.onboarding_url, '_blank');
      }

      setAccount({
        stripe_account_id: data.account_id,
        onboarding_completed: data.onboarding_completed,
        charges_enabled: false,
        payouts_enabled: false,
        details_submitted: false
      });

      toast({
        title: "Connect Account Created",
        description: "Complete the onboarding process in the new tab to start receiving payments.",
      });
    } catch (error) {
      console.error('Error creating Connect account:', error);
      toast({
        title: "Error",
        description: "Failed to create Connect account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (completed: boolean, enabled: boolean) => {
    if (completed && enabled) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
    } else if (completed) {
      return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>;
    } else {
      return <Badge variant="outline">Incomplete</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Payment Account Setup</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!account ? (
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              To receive payments from customers, you need to set up a payment account.
              This is a secure process handled by Stripe.
            </p>
            <Button 
              onClick={createConnectAccount} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Set Up Payment Account
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Account Setup:</span>
                {getStatusBadge(account.details_submitted, true)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Receive Payments:</span>
                {getStatusBadge(account.onboarding_completed, account.charges_enabled)}
              </div>
            </div>
            
            {!account.onboarding_completed && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  Complete your account setup to start receiving payments from customers.
                </p>
                <Button 
                  onClick={createConnectAccount}
                  variant="outline"
                  className="mt-2"
                  size="sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Continue Setup
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
