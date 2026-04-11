import { ArrowLeft, Crown, Star, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/features/auth';
import { useSubscription } from "@/hooks/useSubscription";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MobileSubscriptionPageProps {
  onBack: () => void;
}

export const MobileSubscriptionPage = ({ onBack }: MobileSubscriptionPageProps) => {
  const { user } = useAuth();
  const { isSubscribed, subscriptionPlan } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 59,
      description: 'Perfect for getting started',
      features: [
        '15 jobs per month',
        'Basic profile visibility',
        'Standard support',
        'Job application tracking'
      ],
      icon: <Star className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 99,
      description: 'Most popular for growing professionals',
      features: [
        '40 jobs per month',
        'Enhanced profile visibility',
        'Priority support',
        'Advanced analytics',
        'Job matching alerts'
      ],
      icon: <Crown className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600',
      popular: true
    },
    {
      id: 'elite',
      name: 'Elite',
      price: 199,
      description: 'Unlimited opportunities',
      features: [
        'Unlimited jobs',
        'Premium profile placement',
        '24/7 dedicated support',
        'Advanced analytics',
        'Custom branding'
      ],
      icon: <Zap className="w-5 h-5" />,
      color: 'from-amber-500 to-orange-600'
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to select a plan",
        variant: "destructive",
      });
      return;
    }

    setLoading(planId);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId: planId,
          userId: user.id,
          userRole: 'handyman'
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Redirecting to checkout",
          description: "Opening payment page in a new tab",
        });
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Subscription Plans</h1>
          <p className="text-sm text-muted-foreground">Choose the perfect plan for your business</p>
        </div>
      </div>

      {/* Current Plan Status */}
      {isSubscribed && subscriptionPlan && (
        <Card className="mb-6 border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-800 capitalize">
                  {subscriptionPlan} Plan
                </p>
                <p className="text-sm text-green-600">Currently active</p>
              </div>
              <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="space-y-4">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative overflow-hidden ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                Most Popular
              </div>
            )}
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${plan.color} text-white`}>
                    {plan.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${plan.price}</div>
                  <div className="text-xs text-muted-foreground">/month</div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading === plan.id || (isSubscribed && subscriptionPlan === plan.id)}
                className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
              >
                {loading === plan.id ? (
                  "Processing..."
                ) : isSubscribed && subscriptionPlan === plan.id ? (
                  "Current Plan"
                ) : (
                  "Select Plan"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">
          All plans include secure payment processing and can be canceled anytime.
        </p>
      </div>
    </div>
  );
};