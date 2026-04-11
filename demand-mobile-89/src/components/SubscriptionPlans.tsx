import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star, Zap, Loader2 } from "lucide-react";
import { useAuth } from '@/features/auth';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
}

interface SubscriptionPlansProps {
  userRole: 'handyman' | 'contractor';
  currentPlan?: string;
  onPlanSelect?: (planId: string) => void;
}

export const SubscriptionPlans = ({ userRole, currentPlan, onPlanSelect }: SubscriptionPlansProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [trialLoading, setTrialLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { startFreeTrial, canStartTrial, isOnTrial, getTrialDaysLeft } = useSubscription();

  const handymanPlans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      price: 59,
      description: "Perfect for getting started",
      features: ["15 jobs per month", "Basic profile visibility", "Standard support", "Job application tracking"],
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: "pro",
      name: "Pro",
      price: 99,
      description: "Most popular for growing professionals",
      features: ["40 jobs per month", "Enhanced profile visibility", "Priority support", "Advanced analytics", "Job matching alerts"],
      popular: true,
      icon: <Star className="w-6 h-6" />
    },
    {
      id: "elite",
      name: "Elite",
      price: 199,
      description: "Unlimited opportunities",
      features: ["Unlimited jobs", "Premium profile placement", "24/7 dedicated support", "Advanced analytics", "Custom branding"],
      icon: <Crown className="w-6 h-6" />
    }
  ];

  const contractorPlans: Plan[] = [
    {
      id: "basic",
      name: "Basic",
      price: 199,
      description: "Essential tools for contractors",
      features: ["25 leads per month", "Project management tools", "Standard support", "Lead tracking"],
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: "business",
      name: "Business",
      price: 299,
      description: "Scale your contracting business",
      features: ["60 leads per month", "Advanced project tools", "Priority support", "Team management", "Custom estimates"],
      popular: true,
      icon: <Star className="w-6 h-6" />
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 499,
      description: "Ultimate contractor solution",
      features: ["Unlimited leads", "Full business suite", "24/7 dedicated support", "White-label options", "API access"],
      icon: <Crown className="w-6 h-6" />
    }
  ];

  const plans = userRole === 'handyman' ? handymanPlans : contractorPlans;

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to select a plan",
        variant: "destructive",
      });
      return;
    }

    if (currentPlan === planId) {
      toast({
        title: "Plan already active",
        description: "This is your current plan",
      });
      return;
    }

    setLoading(planId);
    
    try {
      console.log('Creating checkout session for plan:', planId, 'userRole:', userRole);
      
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId, userRole }
      });

      console.log('Checkout response:', data, 'Error:', error);

      if (error) {
        console.error('Checkout error:', error);
        throw new Error(error.message || 'Failed to create checkout session');
      }

      if (data?.url) {
        console.log('Redirecting to checkout URL:', data.url);
        
        // Try to open in new tab first, fallback to same window
        const newWindow = window.open(data.url, '_blank');
        
        if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
          // Popup blocked, use same window
          console.log('Popup blocked, redirecting in same window');
          window.location.href = data.url;
        } else {
          toast({
            title: "Redirecting to payment",
            description: "Opening Stripe checkout in a new tab",
          });
          onPlanSelect?.(planId);
        }
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: unknown) {
      console.error('Error creating checkout session:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create checkout session. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleStartTrial = async (planId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to start your free trial",
        variant: "destructive",
      });
      return;
    }

    setTrialLoading(planId);
    
    try {
      const result = await startFreeTrial(planId, userRole);
      
      if (result.success) {
        toast({
          title: "Free trial started!",
          description: "Your 30-day free trial has begun. Enjoy full access to all features!",
        });
        onPlanSelect?.(planId);
      } else {
        throw new Error(result.error || 'Failed to start trial');
      }
    } catch (error: unknown) {
      console.error('Error starting trial:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to start trial. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setTrialLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`relative ${plan.popular ? 'border-green-500' : ''} ${
            currentPlan === plan.id ? 'border-blue-500 bg-blue-50' : ''
          }`}
        >
          {plan.popular && (
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500">
              Most Popular
            </Badge>
          )}
          
          {currentPlan === plan.id && (
            <Badge className="absolute -top-3 right-4 bg-blue-500">
              Current Plan
            </Badge>
          )}

          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-2 text-green-600">
              {plan.icon}
            </div>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <div className="text-3xl font-bold">
              {canStartTrial() && currentPlan !== plan.id ? (
                <>
                  <span className="text-green-600">FREE</span>
                  <span className="text-sm font-normal text-gray-600"> for 30 days</span>
                  <div className="text-lg text-gray-500">
                    then ${plan.price}<span className="text-sm">/month</span>
                  </div>
                </>
              ) : (
                <>
                  ${plan.price}
                  <span className="text-sm font-normal text-gray-600">/month</span>
                </>
              )}
            </div>
            {isOnTrial() && currentPlan === plan.id && (
              <div className="text-sm text-green-600 font-medium">
                Trial: {getTrialDaysLeft()} days remaining
              </div>
            )}
            <p className="text-gray-600 text-sm">{plan.description}</p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            {canStartTrial() && currentPlan !== plan.id ? (
              <div className="space-y-2">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={trialLoading === plan.id}
                  onClick={() => handleStartTrial(plan.id)}
                >
                  {trialLoading === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Starting Trial...
                    </>
                  ) : (
                    "Start Free Trial"
                  )}
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  disabled={loading === plan.id}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Skip Trial & Subscribe"
                  )}
                </Button>
              </div>
            ) : (
              <Button 
                className={`w-full ${currentPlan === plan.id ? '' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                variant={currentPlan === plan.id ? "outline" : "default"}
                disabled={loading === plan.id || currentPlan === plan.id}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {loading === plan.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : currentPlan === plan.id ? (
                  isOnTrial() ? `Trial Active (${getTrialDaysLeft()} days left)` : "Current Plan"
                ) : (
                  isOnTrial() && currentPlan ? "Upgrade Plan" : "Select Plan"
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
