
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StripeConnectOnboarding } from "@/components/payment/StripeConnectOnboarding";
import { EscrowPaymentForm } from "@/components/payment/EscrowPaymentForm";
import { PayoutHistory } from "@/components/payment/PayoutHistory";
import { CommissionDashboard } from "@/components/payment/CommissionDashboard";
import { useAuth } from '@/features/auth';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TestStripeConnect = () => {
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  const [testing, setTesting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const testEdgeFunction = async (functionName: string) => {
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke(functionName);
      
      if (error) {
        setTestResults(prev => ({
          ...prev,
          [functionName]: `Error: ${error.message}`
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          [functionName]: `Success: ${JSON.stringify(data)}`
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [functionName]: `Error: ${error}`
      }));
    } finally {
      setTesting(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Please sign in to test Stripe Connect integration.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Stripe Connect Integration Test</h1>
        <p className="text-gray-600 mt-2">Test all Stripe Connect functionality</p>
      </div>

      <Tabs defaultValue="connect" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="connect">Connect Account</TabsTrigger>
          <TabsTrigger value="escrow">Escrow Payment</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
        </TabsList>

        <TabsContent value="connect" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Connect Account Creation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => testEdgeFunction('create-connect-account')}
                disabled={testing}
              >
                Test Create Connect Account
              </Button>
              {testResults['create-connect-account'] && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <pre className="text-sm">{testResults['create-connect-account']}</pre>
                </div>
              )}
              <StripeConnectOnboarding />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escrow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Escrow Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <EscrowPaymentForm 
                jobRequestId="test-job-123"
                providerId={user.id}
                onPaymentCreated={(clientSecret) => {
                  toast({
                    title: "Payment Created",
                    description: `Client secret: ${clientSecret.substring(0, 20)}...`,
                  });
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <PayoutHistory />
        </TabsContent>

        <TabsContent value="commission" className="space-y-4">
          <CommissionDashboard />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Edge Function Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Available Functions:</h3>
              <ul className="space-y-1 text-sm">
                <li>✅ create-connect-account</li>
                <li>✅ create-escrow-payment</li>
                <li>✅ release-escrow-payment</li>
                <li>✅ stripe-connect-webhook</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Required Setup:</h3>
              <ul className="space-y-1 text-sm">
                <li>🔑 STRIPE_SECRET_KEY configured</li>
                <li>🌐 Webhook endpoint: /functions/v1/stripe-connect-webhook</li>
                <li>📋 Database tables created</li>
                <li>🔒 RLS policies enabled</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestStripeConnect;
