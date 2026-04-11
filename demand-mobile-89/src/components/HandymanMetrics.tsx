
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Clock, Star } from "lucide-react";
import { useUnifiedHandymanMetrics } from "@/hooks/useUnifiedHandymanMetrics";

interface HandymanMetricsProps {
  completedJobsToday?: number;
}

export const HandymanMetrics = ({ completedJobsToday }: HandymanMetricsProps) => {
  const { metrics, loading } = useUnifiedHandymanMetrics();


  // Create an array of all cards to ensure they all render (5 cards including ratings)
  const metricsCards = [
    {
      id: 'today-earnings',
      title: 'Today\'s Earnings',
      icon: DollarSign,
      iconColor: 'text-green-600',
      value: `$${metrics.todayEarnings}`,
      valueColor: 'text-green-600',
      subtitle: `From ${metrics.todayCompletedJobs} completed jobs today`
    },
    {
      id: 'monthly-earnings',
      title: 'Monthly Earnings',
      icon: TrendingUp,
      iconColor: 'text-blue-600',
      value: `$${metrics.monthlyEarnings}`,
      valueColor: '',
      subtitle: 'This month\'s total earnings'
    },
    {
      id: 'active-jobs',
      title: 'Active Jobs',
      icon: Clock,
      iconColor: 'text-orange-600',
      value: metrics.totalActiveJobs,
      valueColor: '',
      subtitle: 'Jobs in progress'
    },
    {
      id: 'customer-rating',
      title: 'Customer Rating',
      icon: Star,
      iconColor: 'text-yellow-600',
      value: metrics.averageRating > 0 ? `${metrics.averageRating.toFixed(1)}★` : 'No ratings',
      valueColor: 'text-yellow-600',
      subtitle: metrics.totalReviews > 0 ? `Based on ${metrics.totalReviews} review${metrics.totalReviews !== 1 ? 's' : ''}` : 'Complete jobs to get rated'
    },
    {
      id: 'total-jobs',
      title: 'Total Completed',
      icon: TrendingUp,
      iconColor: 'text-purple-600',
      value: metrics.totalCompletedJobs,
      valueColor: 'text-purple-600',
      subtitle: 'All time completions'
    }
  ];


  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricsCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <Card key={card.id} className="min-h-[120px]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <IconComponent className={`h-4 w-4 ${card.iconColor}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${card.valueColor}`}>
                  {card.value}
                </div>
                <p className="text-xs text-gray-600">
                  {card.subtitle}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
