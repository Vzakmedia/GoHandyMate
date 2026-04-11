
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award
} from 'lucide-react';
import { useAuth } from '@/features/auth';
import { useUnifiedHandymanMetrics } from '@/hooks/useUnifiedHandymanMetrics';
import { useSubscription } from '@/hooks/useSubscription';
import { useRealRatings } from '@/hooks/useRealRatings';

export const ContractorOverview = () => {
  const { profile } = useAuth();
  const { metrics } = useUnifiedHandymanMetrics();
  const { subscriptionPlan, isSubscribed } = useSubscription();
  const { averageRating, totalReviews } = useRealRatings(profile?.id || '');

  // Calculate real-time metrics
  const businessName = profile?.business_name || profile?.company_name || `${profile?.full_name} Construction`;
  const yearsInBusiness = profile?.created_at ? 
    Math.max(1, new Date().getFullYear() - new Date(profile.created_at).getFullYear()) : 1;
  
  const stats = [
    {
      title: 'Total Earnings',
      value: `$${metrics.totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Monthly Earnings',
      value: `$${metrics.monthlyEarnings.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Projects Completed',
      value: metrics.totalCompletedJobs.toString(),
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Active Projects',
      value: metrics.totalActiveJobs.toString(),
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Business Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{businessName}</h1>
              <p className="text-gray-600 mt-1">Owner: {profile?.full_name}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{metrics.averageRating > 0 ? metrics.averageRating.toFixed(1) : '0.0'}</span>
                  <span className="text-gray-500">({metrics.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{yearsInBusiness} years in business</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Badge 
                variant={isSubscribed ? "default" : "destructive"}
                className="w-fit"
              >
                {isSubscribed ? `${subscriptionPlan} Plan` : 'No Subscription'}
              </Badge>
              <Badge 
                variant={profile?.account_status === 'active' ? "default" : "secondary"}
                className="w-fit"
              >
                {profile?.account_status === 'active' ? 'Verified Business' : 'Pending Verification'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Business Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Business Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-500" />
              <span>{profile?.email}</span>
            </div>
            {profile?.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile?.address && (
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>{profile.address}</span>
              </div>
            )}
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <span>Member since {new Date(profile?.created_at || '').toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline">
              View All Projects
            </Button>
            <Button className="w-full" variant="outline">
              Manage Quotes
            </Button>
            <Button className="w-full" variant="outline">
              Update Availability
            </Button>
            <Button className="w-full">
              Upgrade Subscription
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
