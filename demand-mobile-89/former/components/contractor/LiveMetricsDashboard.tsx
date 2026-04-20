import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Briefcase, 
  Clock, 
  Star, 
  TrendingUp, 
  Activity,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { useContractorMetrics } from '@/hooks/useContractorMetrics';

export const LiveMetricsDashboard = () => {
  const { metrics, loading } = useContractorMetrics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalJobs}</div>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                Active: {metrics.activeJobs}
              </Badge>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month: ${metrics.monthlyRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageRating.toFixed(1)}</div>
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(metrics.averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.responseRate.toFixed(1)}%</div>
            <Progress value={metrics.responseRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Jobs Status & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Jobs by Status</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Pending</span>
              </div>
              <Badge variant="outline">{metrics.jobsByStatus.pending}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm">In Progress</span>
              </div>
              <Badge variant="outline">{metrics.jobsByStatus.in_progress}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Completed</span>
              </div>
              <Badge variant="outline">{metrics.jobsByStatus.completed}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Recent Activity</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {metrics.recentActivity.length === 0 ? (
                <p className="text-sm text-gray-500">No recent activity</p>
              ) : (
                metrics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      {activity.type === 'job' ? (
                        <Briefcase className="h-3 w-3 text-blue-500" />
                      ) : (
                        <DollarSign className="h-3 w-3 text-green-500" />
                      )}
                      <span>{activity.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={activity.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {activity.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quote Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span>Quote Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending Quotes</span>
              <Badge variant="outline">{metrics.pendingQuotes}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Accepted Quotes</span>
              <Badge className="bg-green-100 text-green-800">{metrics.acceptedQuotes}</Badge>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Success Rate</span>
                <span>{metrics.responseRate.toFixed(1)}%</span>
              </div>
              <Progress value={metrics.responseRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Performance Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{metrics.completedJobs}</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{metrics.activeJobs}</div>
                <div className="text-xs text-gray-500">Active</div>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="text-center">
                <div className="text-sm text-gray-600">Live Data</div>
                <div className="flex items-center justify-center space-x-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-500">Real-time updates</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};