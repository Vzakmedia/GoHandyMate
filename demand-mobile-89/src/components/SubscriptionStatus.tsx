
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Calendar, AlertTriangle, CheckCircle, Crown } from "lucide-react";
import { useAuth } from '@/features/auth';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionStatusProps {
  onManageSubscription?: () => void;
}

export const SubscriptionStatus = ({ onManageSubscription }: SubscriptionStatusProps) => {
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const checkSubscription = async () => {
    if (!user) return;
    
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setSubscriptionData(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
        onManageSubscription?.();
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [user]);

  const getJobLimit = () => {
    if (!profile?.user_role || !profile?.subscription_plan) return 0;
    
    const limits = {
      handyman: { starter: 15, pro: 40, elite: -1 },
      contractor: { basic: 25, business: 60, enterprise: -1 }
    };
    
    return limits[profile.user_role as keyof typeof limits]?.[profile.subscription_plan as keyof typeof limits.handyman] || 0;
  };

  const getProgressPercentage = () => {
    const limit = getJobLimit();
    if (limit === -1) return 0; // Unlimited
    const used = profile?.jobs_this_month || 0;
    return Math.min((used / limit) * 100, 100);
  };

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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading subscription status...</div>
        </CardContent>
      </Card>
    );
  }

  const isActive = subscriptionData?.subscribed;
  const jobLimit = getJobLimit();
  const jobsUsed = profile?.jobs_this_month || 0;
  const progressPercentage = getProgressPercentage();
  const userRole = profile?.user_role;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Subscription Status</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkSubscription}
              disabled={refreshing}
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Status:</span>
            <Badge variant={isActive ? "default" : "destructive"} className="flex items-center space-x-1">
              {isActive ? <CheckCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              <span>{isActive ? "Active" : "Inactive"}</span>
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Account Type:</span>
            <Badge variant="outline" className="capitalize">
              {userRole || 'Not Set'}
            </Badge>
          </div>
          
          {profile?.subscription_plan && (
            <div className="flex items-center justify-between">
              <span>Plan:</span>
              <div className="flex items-center space-x-2">
                <Crown className="w-4 h-4 text-yellow-600" />
                <Badge variant="outline" className="capitalize">
                  {formatPlanName(profile.subscription_plan)}
                </Badge>
              </div>
            </div>
          )}

          {subscriptionData?.subscription_end && (
            <div className="flex items-center justify-between">
              <span>Next billing:</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(subscriptionData.subscription_end).toLocaleDateString()}
                </span>
              </span>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{userRole === 'handyman' ? 'Jobs' : 'Leads'} this month:</span>
              <span>
                {jobsUsed} / {jobLimit === -1 ? "Unlimited" : jobLimit}
              </span>
            </div>
            {jobLimit !== -1 && (
              <Progress value={progressPercentage} className="h-2" />
            )}
          </div>

          {isActive && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleManageSubscription}
            >
              Manage Subscription
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
