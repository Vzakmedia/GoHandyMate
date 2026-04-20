
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Settings, History, DollarSign, Crown } from "lucide-react";
import { useAuth } from '@/features/auth';
import { StripeConnectOnboarding } from "@/components/payment/StripeConnectOnboarding";
import { EscrowPaymentForm } from "@/components/payment/EscrowPaymentForm";
import { PayoutHistory } from "@/components/payment/PayoutHistory";
import { CommissionDashboard } from "@/components/payment/CommissionDashboard";
import { PaymentSettings } from "@/components/PaymentSettings";
import { useNavigate } from "react-router-dom";

const PaymentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Please sign in to access payment features.</p>
            <Button onClick={() => navigate("/")} className="mt-4">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isProvider = profile?.user_role === 'handyman';
  const hasActiveSubscription = profile?.subscription_status === 'active';
  const subscriptionPlan = profile?.subscription_plan;

  const formatPlanName = (plan: string) => {
    const planNames: { [key: string]: string } = {
      'starter': 'Starter Plan',
      'pro': 'Pro Plan', 
      'elite': 'Elite Plan',
      'basic': 'Basic Plan',
      'business': 'Business Plan',
      'enterprise': 'Enterprise Plan'
    };
    return planNames[plan] || plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan';
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Payment Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your payments and earnings</p>
        </div>
        {isProvider && hasActiveSubscription && subscriptionPlan && (
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-600" />
            <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1">
              {formatPlanName(subscriptionPlan)}
            </Badge>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="connect">Connect Account</TabsTrigger>
          {isProvider && <TabsTrigger value="payouts">Payouts</TabsTrigger>}
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {isProvider && hasActiveSubscription && subscriptionPlan && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <Crown className="w-5 h-5" />
                  <span>Active Subscription</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-green-800">
                      {formatPlanName(subscriptionPlan)}
                    </p>
                    <p className="text-sm text-green-600">
                      Your current {profile.user_role} subscription plan
                    </p>
                  </div>
                  <Badge className="bg-green-600 text-white">
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <Badge variant="outline">
                    {isProvider ? "Service Provider" : "Customer"}
                  </Badge>
                </div>
                {isProvider && hasActiveSubscription && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {formatPlanName(subscriptionPlan)}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {isProvider && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">$0.00</div>
                  <div className="text-xs text-gray-600">Total earnings</div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-xs text-gray-600">Connected methods</div>
              </CardContent>
            </Card>
          </div>

          {isProvider && <CommissionDashboard />}
        </TabsContent>

        <TabsContent value="connect" className="space-y-4">
          <StripeConnectOnboarding />
        </TabsContent>

        {isProvider && (
          <TabsContent value="payouts" className="space-y-4">
            <PayoutHistory />
          </TabsContent>
        )}

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Payment Creation</CardTitle>
            </CardHeader>
            <CardContent>
              <EscrowPaymentForm 
                jobRequestId="test-job-123"
                providerId={user.id}
                onPaymentCreated={(clientSecret) => {
                  console.log("Payment created:", clientSecret);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <PaymentSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentDashboard;
