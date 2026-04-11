
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useSubscription } from '@/hooks/useSubscription';
import { useAppMetrics } from '@/hooks/useAppMetrics';
import { 
  Search, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Star, 
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Crown,
  Loader2
} from "lucide-react";

interface QuickActionsProps {
  onEarningsClick: () => void;
}

export const QuickActions = ({ onEarningsClick }: QuickActionsProps) => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { subscriptionData, isSubscribed, subscriptionPlan, jobsThisMonth, canAcceptJob } = useSubscription();
  const { averageRating, loading: metricsLoading } = useAppMetrics();

  const handleBrowseJobs = () => {
    navigate('/jobs');
  };

  const handleManageSchedule = () => {
    navigate('/schedule');
  };

  const handleSubscription = () => {
    navigate('/subscription');
  };

  // Get job limit based on subscription plan
  const getJobLimit = () => {
    if (!subscriptionPlan) return 0;
    const limits = { starter: 15, pro: 40, elite: -1 };
    return limits[subscriptionPlan as keyof typeof limits] || 0;
  };

  const jobLimit = getJobLimit();
  const progressPercentage = jobLimit === -1 ? 0 : Math.min((jobsThisMonth / jobLimit) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Subscription Status Alert */}
      {!isSubscribed && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <h4 className="font-semibold text-orange-800">Subscription Required</h4>
                  <p className="text-sm text-orange-700">Subscribe to start accepting jobs</p>
                </div>
              </div>
              <Button 
                onClick={handleSubscription}
                className="bg-orange-600 hover:bg-orange-700"
                size="sm"
              >
                <Crown className="w-4 h-4 mr-1" />
                Subscribe Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Progress Card */}
      {isSubscribed && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                Monthly Job Progress
              </CardTitle>
              <Badge variant="outline" className="capitalize">
                {subscriptionPlan} Plan
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Jobs this month: {jobsThisMonth} / {jobLimit === -1 ? '∞' : jobLimit}
                </span>
                {!canAcceptJob() && (
                  <Badge variant="destructive" className="text-xs">
                    Limit Reached
                  </Badge>
                )}
              </div>
              {jobLimit !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      progressPercentage >= 100 ? 'bg-red-500' : 
                      progressPercentage >= 80 ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Browse Jobs */}
        <Card className="transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-100 rounded-lg">
                <Search className="h-5 w-5 text-green-600" />
              </div>
              {canAcceptJob() ? (
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              ) : (
                <Badge variant="secondary">Limited</Badge>
              )}
            </div>
            <CardTitle className="text-lg">Find Jobs</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-600 text-sm mb-4">
              {canAcceptJob() 
                ? "Browse and accept available handyman jobs in your area" 
                : "View available jobs (subscription required to accept)"
              }
            </p>
            <Button 
              className="w-full group-hover:bg-green-600" 
              onClick={handleBrowseJobs}
              disabled={!canAcceptJob()}
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Jobs
            </Button>
          </CardContent>
        </Card>

        {/* Manage Schedule */}
        <Card className="transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <Badge variant="outline">Essential</Badge>
            </div>
            <CardTitle className="text-lg">Schedule</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-600 text-sm mb-4">
              Set your working hours and availability for the week
            </p>
            <Button 
              variant="outline" 
              className="w-full group-hover:bg-blue-50"
              onClick={handleManageSchedule}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Manage Schedule
            </Button>
          </CardContent>
        </Card>

        {/* Earnings Analytics */}
        <Card className="transition-shadow cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <Badge variant="outline">Insights</Badge>
            </div>
            <CardTitle className="text-lg">Analytics</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-600 text-sm mb-4">
              Track your earnings, performance metrics, and growth opportunities
            </p>
            <Button 
              variant="outline" 
              className="w-full group-hover:bg-purple-50"
              onClick={onEarningsClick}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Response Time</p>
                <p className="font-semibold">&lt; 2 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-xs text-gray-500">Platform Rating</p>
                <p className="font-semibold">
                  {metricsLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    `${averageRating.toFixed(1)}/5`
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">This Month</p>
                <p className="font-semibold">$1,240</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Completed</p>
                <p className="font-semibold">{jobsThisMonth} jobs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
