
import { MetricCard } from "./metrics/MetricCard";
import { SecondaryMetric } from "./metrics/SecondaryMetric";
import type { LiveMetrics } from "./types";
import { DollarSign, TrendingUp, Wrench, Activity, Calendar, Star } from "lucide-react";
import { useAuth } from '@/features/auth';
import { useRealRatings } from "@/hooks/useRealRatings";

interface LiveMetricsSectionProps {
  liveMetrics: LiveMetrics;
  todayCompletedJobs: number;
}

export const LiveMetricsSection = ({ 
  liveMetrics, 
  todayCompletedJobs
}: LiveMetricsSectionProps) => {
  const { user } = useAuth();
  const { averageRating, totalReviews, loading: ratingsLoading } = useRealRatings(user?.id || '');
  
  const previousMonthEarnings = Math.max(liveMetrics.monthlyEarnings - 200, 0);
  const growthPercentage = previousMonthEarnings > 0 ? 
    Math.round(((liveMetrics.monthlyEarnings - previousMonthEarnings) / previousMonthEarnings) * 100) : 0;

  console.log('LiveMetricsSection - Ratings data:', { averageRating, totalReviews, ratingsLoading });

  return (
    <div className="space-y-6">
      {/* Hero Metrics - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Earnings"
          subtitle="From completed jobs"
          value={`$${liveMetrics.todayEarnings}`}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBgColor="bg-emerald-100"
          gradientColors="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"
          borderColor="border-emerald-200"
          footerText={`${todayCompletedJobs} jobs today`}
          footerIcon={Activity}
          badgeText={liveMetrics.todayEarnings > 0 ? 'Active' : 'Ready'}
          badgeColors="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
        />

        <MetricCard
          title="Monthly Earnings"
          subtitle="This month's total"
          value={`$${liveMetrics.monthlyEarnings}`}
          icon={TrendingUp}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          gradientColors="bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50"
          borderColor="border-blue-200"
          footerText={`${liveMetrics.thisMonthCompleted} jobs completed`}
          footerIcon={Calendar}
          badgeText={growthPercentage > 0 ? `+${growthPercentage}%` : 'Starting'}
          badgeColors="bg-blue-100 text-blue-700 hover:bg-blue-200"
        />

        <MetricCard
          title="Active Services"
          subtitle="Configured services"
          value={`${liveMetrics.activeSkills}`}
          icon={Wrench}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          gradientColors="bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50"
          borderColor="border-purple-200"
          footerText="Services configured"
          footerIcon={Wrench}
          badgeText={liveMetrics.activeSkills > 0 ? 'Ready' : 'Setup Needed'}
          badgeColors="bg-purple-100 text-purple-700 hover:bg-purple-200"
        />

        <MetricCard
          title="Customer Rating"
          subtitle="Based on reviews"
          value={ratingsLoading ? 'Loading...' : (averageRating && averageRating > 0) ? `${averageRating.toFixed(1)}★` : 'No ratings'}
          icon={Star}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
          gradientColors="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50"
          borderColor="border-yellow-200"
          footerText={ratingsLoading ? 'Loading ratings...' : (totalReviews && totalReviews > 0) ? `${totalReviews} review${totalReviews !== 1 ? 's' : ''}` : 'Complete jobs to get rated'}
          footerIcon={Star}
          badgeText={(averageRating && averageRating > 0) ? 'Rated' : 'New'}
          badgeColors="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
        />
      </div>

      {/* Secondary Metrics - Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SecondaryMetric
          title="Active Jobs"
          value={liveMetrics.activeJobs}
          icon={Activity}
          description={liveMetrics.activeJobs > 0 ? 'Currently in progress' : 'No active jobs'}
        />

        <SecondaryMetric
          title="Total Completed"
          value={liveMetrics.completedJobs}
          icon={TrendingUp}
          description={liveMetrics.completedJobs > 0 ? 'All time achievements' : 'Start completing jobs!'}
        />

        <SecondaryMetric
          title="Total Earnings"
          value={`$${liveMetrics.totalEarnings}`}
          icon={DollarSign}
          description={liveMetrics.totalEarnings > 0 ? 'Lifetime revenue' : 'Start earning today!'}
        />
      </div>
    </div>
  );
};
