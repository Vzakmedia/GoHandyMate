
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Lock } from "lucide-react";
import { useAuth } from '@/features/auth';

interface JobLimitGuardProps {
  children: React.ReactNode;
  action: string;
  onUpgrade?: () => void;
}

export const JobLimitGuard = ({ children, action, onUpgrade }: JobLimitGuardProps) => {
  const { profile } = useAuth();
  const [canAccess, setCanAccess] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = () => {
      if (!profile) {
        setCanAccess(false);
        setLoading(false);
        return;
      }

      // Check if subscription is active
      if (profile.subscription_status !== 'active') {
        setCanAccess(false);
        setLoading(false);
        return;
      }

      // Get job limits based on role and plan
      const limits = {
        handyman: { starter: 15, pro: 40, elite: -1 },
        // contractor limits removed — contractor role archived
      };

      const userRole = profile.user_role as keyof typeof limits;
      const plan = profile.subscription_plan;
      
      if (!userRole || !plan || !limits[userRole]) {
        setCanAccess(false);
        setLoading(false);
        return;
      }

      const limit = limits[userRole][plan as keyof typeof limits.handyman];
      const used = profile.jobs_this_month || 0;

      // -1 means unlimited
      if (limit === -1) {
        setCanAccess(true);
      } else {
        setCanAccess(used < limit);
      }
      
      setLoading(false);
    };

    checkAccess();
  }, [profile]);

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        <p className="text-sm text-gray-600 mt-2">Checking access...</p>
      </div>
    );
  }

  if (!canAccess) {
    const isInactive = profile?.subscription_status !== 'active';
    const jobsUsed = profile?.jobs_this_month || 0;
    const userRole = profile?.user_role;
    const plan = profile?.subscription_plan;
    
    // Get current limit for display
    const limits = {
      handyman: { starter: 15, pro: 40, elite: -1 },
      contractor: { basic: 25, business: 60, enterprise: -1 }
    };
    
    const currentLimit = limits[userRole as keyof typeof limits]?.[plan as keyof typeof limits.handyman] || 0;
    
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-amber-800">
            <Lock className="w-5 h-5" />
            <span>Access Restricted</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isInactive ? (
            <>
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-800 font-medium">Subscription Required</p>
                  <p className="text-amber-700 text-sm">
                    You need an active subscription to {action}. Choose from our {userRole} plans to get started.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-800 font-medium">Monthly Limit Reached</p>
                  <p className="text-amber-700 text-sm">
                    You've used {jobsUsed} of your {currentLimit === -1 ? 'unlimited' : currentLimit} monthly {userRole === 'handyman' ? 'job' : 'lead'} allowance. 
                    Upgrade your plan to {action}.
                  </p>
                </div>
              </div>
            </>
          )}
          
          <Button 
            onClick={onUpgrade}
            className="w-full"
          >
            {isInactive ? "View Subscription Plans" : "Upgrade Plan"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};
