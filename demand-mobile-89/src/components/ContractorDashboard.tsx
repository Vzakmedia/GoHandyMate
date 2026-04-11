
import { Tabs } from "@/components/ui/tabs";
import { useAuth } from '@/features/auth';
import { useSubscription } from "@/hooks/useSubscription";
import { DashboardHeader } from "@/components/contractor/DashboardHeader";
import { DashboardTabNavigation } from "@/components/contractor/DashboardTabNavigation";
import { DashboardContent } from "@/components/contractor/DashboardContent";

interface ContractorDashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ContractorDashboard = ({ activeTab, onTabChange }: ContractorDashboardProps) => {
  const { profile } = useAuth();
  const { isSubscribed, subscriptionPlan, jobsThisMonth, canAcceptJob } = useSubscription();

  const getLeadLimit = () => {
    if (!subscriptionPlan) return 0;
    const limits = { basic: 25, business: 60, enterprise: -1 };
    return limits[subscriptionPlan as keyof typeof limits] || 0;
  };

  const leadLimit = getLeadLimit();

  return (
    <div className="space-y-12 pb-20 lg:pb-10">
      <DashboardHeader
        profileName={profile?.full_name}
        businessName={profile?.business_name || profile?.company_name}
        isSubscribed={isSubscribed}
        subscriptionPlan={subscriptionPlan}
      />

      <div className="flex flex-col space-y-10">
        <DashboardTabNavigation
          activeTab={activeTab}
          onTabChange={onTabChange}
        />

        <div className="w-full">
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <DashboardContent
              activeTab={activeTab}
              onTabChange={onTabChange}
              isSubscribed={isSubscribed}
              subscriptionPlan={subscriptionPlan}
              jobsThisMonth={jobsThisMonth}
              leadLimit={leadLimit}
              canAcceptJob={canAcceptJob}
            />
          </Tabs>
        </div>
      </div>
    </div>
  );
};
