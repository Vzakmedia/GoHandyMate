
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { SubscriptionStatus } from "@/components/SubscriptionStatus";
import { useAuth } from '@/features/auth';
import { CreditCard, Star } from "lucide-react";

export const SubscriptionPage = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("plans");

  useEffect(() => {
    // If user has an active subscription, show status tab by default
    if (profile?.subscription_status === 'active') {
      setActiveTab("status");
    }
  }, [profile]);

  const userRole = profile?.user_role;

  if (!userRole || !['handyman', 'contractor'].includes(userRole)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Subscription Plans</h1>
          <p className="text-gray-600">Please complete your profile setup to view subscription plans.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {userRole === 'handyman' ? 'Handyman' : 'Contractor'} Subscription Plans
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan to grow your business and access more opportunities.
          {userRole === 'handyman' ? ' Get more jobs' : ' Generate more leads'} with our premium features.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="plans" className="flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>Choose Plan</span>
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4" />
            <span>My Subscription</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6">
          <SubscriptionPlans 
            userRole={userRole as 'handyman' | 'contractor'}
            currentPlan={profile?.subscription_plan}
            onPlanSelect={() => setActiveTab("status")}
          />
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <SubscriptionStatus 
            onManageSubscription={() => {
              // Optionally refresh status after managing subscription
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
