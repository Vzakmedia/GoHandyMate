
import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { useAuth } from '@/features/auth';
import { useSubscription } from "@/hooks/useSubscription";
import { useHandymanData } from "@/hooks/useHandymanData";
import { useUnifiedHandymanMetrics } from "@/hooks/useUnifiedHandymanMetrics";
import { HandymanEarningsOverview } from "@/components/HandymanEarningsOverview";
import { DashboardHeader } from "@/components/handyman/dashboard/DashboardHeader";

import { DashboardTabNavigation } from "@/components/handyman/dashboard/DashboardTabNavigation";
import { DashboardContent } from "@/components/handyman/dashboard/DashboardContent";

interface HandymanDashboardProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const HandymanDashboard = ({ activeTab, onTabChange }: HandymanDashboardProps) => {
  const { profile } = useAuth();
  const { isSubscribed, subscriptionPlan, jobsThisMonth } = useSubscription();
  const { data: handymanData, loading: handymanLoading } = useHandymanData();
  const { metrics, loading: metricsLoading } = useUnifiedHandymanMetrics();
  const [showEarningsOverview, setShowEarningsOverview] = useState(false);

  const loading = handymanLoading || metricsLoading;

  const getJobLimit = () => {
    if (!subscriptionPlan) return 0;
    const limits = { starter: 15, pro: 40, elite: -1 };
    return limits[subscriptionPlan as keyof typeof limits] || 0;
  };

  const jobLimit = getJobLimit();

  // Calculate real stats from handyman and job data
  const activeSkills = handymanData.skillRates?.filter(skill => skill.is_active) || [];
  const averageRate = activeSkills.length > 0
    ? activeSkills.reduce((sum, skill) => sum + (Number(skill.hourly_rate) || 0), 0) / activeSkills.length
    : 0;
  const activeServices = handymanData.servicePricing?.filter(service => service.is_active) || [];

  // Prepare real job data
  const realJobData = {
    completedJobs: metrics.totalCompletedJobs,
    activeJobs: metrics.totalActiveJobs,
    pendingJobs: 0, // No pending jobs in unified metrics yet
    monthlyEarnings: metrics.monthlyEarnings,
    totalEarnings: metrics.totalEarnings
  };

  // Prepare handyman data
  const realHandymanData = {
    activeSkills: activeSkills.length,
    averageRate
  };

  const realStats = {
    totalJobs: activeSkills.length + activeServices.length,
    completedJobs: realJobData.completedJobs,
    earnings: Math.round(averageRate * 40), // Estimated monthly earnings
    rating: 4.8, // This would come from reviews system
    activeJobs: realJobData.activeJobs,
    pendingJobs: realJobData.pendingJobs,
    responseRate: 95
  };

  console.log('HandymanDashboard: Passing real data to overview card:', {
    realJobData,
    realHandymanData,
    jobsThisMonth,
    subscriptionPlan
  });

  const handleEarningsClick = () => {
    setShowEarningsOverview(true);
  };

  const handleBackToMain = () => {
    setShowEarningsOverview(false);
  };

  if (showEarningsOverview) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center space-x-4 mb-2">
          <button
            onClick={handleBackToMain}
            className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-black/5 rounded-full text-sm font-black uppercase tracking-widest text-[#166534] hover:bg-emerald-50 transition-all duration-300 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Dashboard</span>
          </button>
        </div>
        <HandymanEarningsOverview />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 lg:pb-6">
      <DashboardHeader
        profileName={profile?.full_name}
        isSubscribed={isSubscribed}
        subscriptionPlan={subscriptionPlan}
      />

      <div className="flex flex-col">
        <DashboardTabNavigation
          activeTab={activeTab}
          onTabChange={onTabChange}
        />

        <div className="w-full">
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <DashboardContent
              activeTab={activeTab}
            />
          </Tabs>
        </div>
      </div>
    </div>
  );
};
