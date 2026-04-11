
import React, { memo } from "react";
import { MetricCard } from "./metrics/MetricCard";
import { SecondaryMetric } from "./metrics/SecondaryMetric";
import type { LiveMetrics } from "./types";
import { DollarSign, TrendingUp, Wrench, Activity, Calendar, Sparkles, Star } from "lucide-react";
import { calculateGrowthPercentage, formatMetricBadge } from "@/utils/metricsCalculations";
import { useAuth } from '@/features/auth';
import { useRealRatings } from "@/hooks/useRealRatings";

interface OptimizedLiveMetricsSectionProps {
  liveMetrics: LiveMetrics;
  todayCompletedJobs: number;
}

// Memoized individual metric cards to prevent unnecessary re-renders
const MemoizedMetricCard = memo(MetricCard);
const MemoizedSecondaryMetric = memo(SecondaryMetric);

export const OptimizedLiveMetricsSection = memo(({
  liveMetrics,
  todayCompletedJobs
}: OptimizedLiveMetricsSectionProps) => {
  const { user } = useAuth();
  const { averageRating, totalReviews, loading: ratingsLoading } = useRealRatings(user?.id || '');

  const previousMonthEarnings = Math.max(liveMetrics.monthlyEarnings - 200, 0);
  const growthPercentage = calculateGrowthPercentage(liveMetrics.monthlyEarnings, previousMonthEarnings);

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center space-y-2 mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#166534]/5 flex items-center justify-center border border-[#166534]/10 shadow-sm">
            <Sparkles className="h-5 w-5 text-[#166534]" />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            Performance Analytics
          </h2>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Real-time business intelligence & system metrics
        </p>
        <div className="w-12 h-1 bg-gradient-to-r from-transparent via-[#166534]/20 to-transparent mt-4" />
      </div>

      {/* Hero Metrics - Enhanced Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <MemoizedMetricCard
          title="Today's Earnings"
          subtitle="From completed jobs"
          value={`$${liveMetrics.todayEarnings}`}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-100"
          gradientColors="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 hover:from-emerald-100 hover:via-green-100 hover:to-teal-100"
          borderColor="border-emerald-200 hover:border-emerald-300"
          footerText={`${todayCompletedJobs} jobs today`}
          footerIcon={Activity}
          badgeText={formatMetricBadge(liveMetrics.todayEarnings, 'earnings')}
          badgeColors="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200"
        />

        <MemoizedMetricCard
          title="Monthly Earnings"
          subtitle="This month's total"
          value={`$${liveMetrics.monthlyEarnings}`}
          icon={TrendingUp}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          gradientColors="bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 hover:from-blue-100 hover:via-indigo-100 hover:to-cyan-100"
          borderColor="border-blue-200 hover:border-blue-300"
          footerText={`${liveMetrics.thisMonthCompleted} completed`}
          footerIcon={Calendar}
          badgeText={formatMetricBadge(growthPercentage, 'growth')}
          badgeColors="bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200"
        />

        <MemoizedMetricCard
          title="Active Services"
          subtitle="Configured services"
          value={`${liveMetrics.activeSkills}`}
          icon={Wrench}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          gradientColors="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 hover:from-purple-100 hover:via-violet-100 hover:to-indigo-100"
          borderColor="border-purple-200 hover:border-purple-300"
          footerText="Services configured"
          footerIcon={Wrench}
          badgeText={formatMetricBadge(liveMetrics.activeSkills, 'skills')}
          badgeColors="bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-200"
        />

        <MemoizedMetricCard
          title="Customer Rating"
          subtitle="Based on reviews"
          value={ratingsLoading ? 'Loading...' : (averageRating && averageRating > 0) ? `${averageRating.toFixed(1)}★` : 'No ratings'}
          icon={Star}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
          gradientColors="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 hover:from-yellow-100 hover:via-amber-100 hover:to-orange-100"
          borderColor="border-yellow-200 hover:border-yellow-300"
          footerText={ratingsLoading ? 'Loading ratings...' : (totalReviews && totalReviews > 0) ? `${totalReviews} review${totalReviews !== 1 ? 's' : ''}` : 'Complete jobs to get rated'}
          footerIcon={Star}
          badgeText={(averageRating && averageRating > 0) ? 'Rated' : 'New'}
          badgeColors="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-200"
        />
      </div>

    </div>
  );
});

OptimizedLiveMetricsSection.displayName = 'OptimizedLiveMetricsSection';
