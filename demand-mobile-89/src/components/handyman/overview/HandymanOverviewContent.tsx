
import { useHandymanDataContext } from "@/contexts/HandymanDataContext";
import { useOverviewMetrics } from "@/hooks/overview/useOverviewMetrics";
import { useOverviewPerformance } from "@/hooks/overview/useOverviewPerformance";
import { LiveMetricsSection } from "@/components/handyman/overview/LiveMetricsSection";
import { PerformanceDashboard } from "@/components/handyman/overview/PerformanceDashboard";
import { LiveJobsSection } from "@/components/handyman/overview/LiveJobsSection";


export const HandymanOverviewContent = () => {
  const { handymanData, jobMetrics, loading } = useHandymanDataContext();
  
  const liveMetrics = useOverviewMetrics({ handymanData, jobMetrics });
  
  const performanceMetrics = useOverviewPerformance({
    activeSkills: liveMetrics.activeSkills,
    workAreas: handymanData.workAreas?.length || 0,
    completedJobs: liveMetrics.completedJobs,
    totalEarnings: liveMetrics.totalEarnings
  });

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Hero Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl"></div>
          ))}
        </div>
        {/* Secondary Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg"></div>
          ))}
        </div>
        {/* Performance Dashboard Skeleton */}
        <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl"></div>
        {/* Jobs Section Skeleton */}
        <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* HERO SECTION - Live Metrics Display */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 rounded-2xl -z-10"></div>
        <LiveMetricsSection 
          liveMetrics={liveMetrics}
          todayCompletedJobs={jobMetrics.todayCompletedJobs}
        />
      </div>

      {/* PERFORMANCE ANALYTICS */}
      <PerformanceDashboard 
        performanceMetrics={performanceMetrics}
        activeSkills={liveMetrics.activeSkills}
        workAreas={handymanData.workAreas?.length || 0}
      />

      {/* LIVE JOBS SECTION */}
      <LiveJobsSection />

    </div>
  );
};
