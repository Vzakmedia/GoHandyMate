
import React, { memo } from "react";
import { useOptimizedHandymanDataContext } from "@/contexts/OptimizedHandymanDataContext";
import { useOptimizedOverviewMetrics } from "@/hooks/overview/useOptimizedOverviewMetrics";
import { useOptimizedOverviewPerformance } from "@/hooks/overview/useOptimizedOverviewPerformance";
import { OptimizedLiveMetricsSection } from "./OptimizedLiveMetricsSection";
import { OptimizedPerformanceDashboard } from "./OptimizedPerformanceDashboard";
import { LiveJobsSection } from "./LiveJobsSection";

import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Loader2 } from "lucide-react";

const LoadingSkeleton = memo(() => (
  <div className="space-y-6 sm:space-y-8 animate-pulse">
    {/* Header Skeleton */}
    <div className="text-center space-y-4">
      <Skeleton className="h-8 w-64 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl" />
      <Skeleton className="h-4 w-96 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg" />
    </div>

    {/* Hero Metrics Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-48 bg-gradient-to-br from-gray-100 via-gray-150 to-gray-200 rounded-2xl shadow-lg" />
      ))}
    </div>

    {/* Secondary Metrics Skeleton */}
    <div className="bg-gray-100 rounded-2xl p-4 sm:p-6">
      <Skeleton className="h-6 w-32 mb-4 rounded-lg" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl" />
        ))}
      </div>
    </div>

    {/* Performance Dashboard Skeleton */}
    <Skeleton className="h-[500px] bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50 rounded-2xl shadow-xl" />

    {/* Jobs Section Skeleton */}
    <Skeleton className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg" />
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';

const LoadingOverlay = memo(() => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4">
      <div className="relative">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        <div className="absolute inset-0 h-12 w-12 border-4 border-blue-200 rounded-full animate-pulse"></div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Loading Dashboard</h3>
        <p className="text-sm text-gray-600">Fetching your latest data...</p>
      </div>
    </div>
  </div>
));

LoadingOverlay.displayName = 'LoadingOverlay';

export const OptimizedHandymanOverviewContent = memo(() => {
  const { handymanData, jobMetrics, loading } = useOptimizedHandymanDataContext();

  const liveMetrics = useOptimizedOverviewMetrics({ handymanData, jobMetrics });

  const performanceMetrics = useOptimizedOverviewPerformance({
    activeSkills: liveMetrics.activeSkills,
    workAreas: handymanData.workAreas?.length || 0,
    completedJobs: liveMetrics.completedJobs,
    totalEarnings: liveMetrics.totalEarnings
  });

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30">
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 pt-3 sm:pt-6 lg:pt-8 pb-0">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 pb-0">
          {/* HERO SECTION - Live Metrics Display */}
          <section className="relative">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/20 to-indigo-50/30 rounded-xl sm:rounded-2xl lg:rounded-3xl -z-10"></div>
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-2xl sm:blur-3xl"></div>
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-20 h-20 sm:w-28 sm:h-28 lg:w-40 lg:h-40 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-2xl sm:blur-3xl"></div>

            <div className="relative p-3 sm:p-6 lg:p-8">
              <OptimizedLiveMetricsSection
                liveMetrics={liveMetrics}
                todayCompletedJobs={jobMetrics.todayCompletedJobs}
              />
            </div>
          </section>

          {/* PERFORMANCE ANALYTICS */}
          <section className="relative px-1 sm:px-0">
            <OptimizedPerformanceDashboard
              performanceMetrics={performanceMetrics}
              activeSkills={liveMetrics.activeSkills}
              workAreas={handymanData.workAreas?.length || 0}
            />
          </section>

          {/* LIVE JOBS SECTION */}
          <section className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-black/5 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 mx-0 group">
            <div className="bg-slate-50/50 p-4 sm:p-8 lg:p-10 border-b border-black/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-[#fbbf24]/10 flex items-center justify-center border border-[#fbbf24]/20 shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp className="h-5 w-5 text-[#fbbf24]" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">Active Opportunities</h2>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Live system feed & territory leads</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">System Online</span>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-8 lg:p-10 group-hover:bg-slate-50/10 transition-colors duration-500">
              <LiveJobsSection />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
});

OptimizedHandymanOverviewContent.displayName = 'OptimizedHandymanOverviewContent';
