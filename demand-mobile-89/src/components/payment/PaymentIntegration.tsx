
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Loader2, ExternalLink } from "lucide-react";
import { useAuth } from '@/features/auth';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentIntegrationProps {
  onIntegrationComplete?: () => void;
}

export const PaymentIntegration = ({ onIntegrationComplete }: PaymentIntegrationProps) => {
  const [integrationStatus, setIntegrationStatus] = useState<'checking' | 'not_setup' | 'partial' | 'complete'>('checking');
  const [connectAccount, setConnectAccount] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkIntegrationStatus = async () => {
    if (!user) return;

    try {
      // Check if user has a Stripe Connect account
      const { data: account, error } = await supabase
        .from('stripe_connect_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking integration status:', error);
        setIntegrationStatus('not_setup');
        return;
      }

      if (!account) {
        setIntegrationStatus('not_setup');
      } else {
        setConnectAccount(account);
        if (account.onboarding_completed && account.charges_enabled) {
          setIntegrationStatus('complete');
        } else {
          setIntegrationStatus('partial');
        }
      }
    } catch (error) {
      console.error('Error checking integration status:', error);
      setIntegrationStatus('not_setup');
    }
  };

  useEffect(() => {
    checkIntegrationStatus();
  }, [user]);

  const createConnectAccount = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-connect-account');
      
      if (error) throw error;

      if (data.onboarding_url) {
        window.open(data.onboarding_url, '_blank');
      }

      setConnectAccount({
        stripe_account_id: data.account_id,
        onboarding_completed: data.onboarding_completed,
        charges_enabled: false,
        payouts_enabled: false
      });

      setIntegrationStatus('partial');

      toast({
        title: "Connect Account Created",
        description: "Complete the onboarding process in the new tab.",
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

  const refreshStatus = () => {
    setIntegrationStatus('checking');
    checkIntegrationStatus();
  };

  const getStatusIcon = () => {
    switch (integrationStatus) {
      case 'checking':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusText = () => {
    switch (integrationStatus) {
      case 'checking':
        return 'Checking integration status...';
      case 'complete':
        return 'Payment integration complete';
      case 'partial':
        return 'Payment setup in progress';
      default:
        return 'Payment integration required';
    }
  };

  const getStatusBadge = () => {
    switch (integrationStatus) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800">Setup Required</Badge>;
      default:
        return <Badge variant="outline">Not Setup</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span>Payment Integration</span>
          </div>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">{getStatusText()}</p>

        {integrationStatus === 'not_setup' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Set up your payment account to start receiving payments from customers.
            </p>
            <Button 
              onClick={createConnectAccount} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Setting up account...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Set Up Payment Account
                </>
              )}
            </Button>
          </div>
        )}

        {integrationStatus === 'partial' && connectAccount && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                Complete your account setup to start receiving payments.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span>Account Created:</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span>Details Submitted:</span>
                {connectAccount.details_submitted ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Charges Enabled:</span>
                {connectAccount.charges_enabled ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Payouts Enabled:</span>
                {connectAccount.payouts_enabled ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                )}
              </div>
            </div>
            <Button 
              onClick={createConnectAccount}
              variant="outline"
              className="w-full"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Continue Setup
            </Button>
          </div>
        )}

        {integrationStatus === 'complete' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                Your payment integration is complete! You can now receive payments from customers.
              </p>
            </div>
            {onIntegrationComplete && (
              <Button onClick={onIntegrationComplete} className="w-full">
                Continue to Dashboard
              </Button>
            )}
          </div>
        )}

        <Button 
          variant="outline" 
          onClick={refreshStatus}
          className="w-full"
        >
          Refresh Status
        </Button>
      </CardContent>
    </Card>
  );
};
