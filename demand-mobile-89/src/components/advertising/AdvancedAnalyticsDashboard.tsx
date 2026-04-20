import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  DollarSign, 
  Target,
  BarChart3,
  PieChart,
  Calendar,
  Zap,
  Star,
  Users,
  MapPin,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';
import { useAdvertisements } from '@/hooks/useAdvertisements';

interface AdvancedAnalyticsDashboardProps {
  className?: string;
}

export const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = ({ className }) => {
  const { analytics, advertisements, loading, fetchAnalytics } = useAdvertisements();
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');
  const [selectedAdId, setSelectedAdId] = useState<number | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const performanceMetrics = [
    {
      title: 'Total Impressions',
      value: analytics?.total_impressions || 0,
      change: '+12.5%',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Clicks',
      value: analytics?.total_clicks || 0,
      change: '+8.3%',
      icon: MousePointer,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Conversions',
      value: analytics?.total_conversions || 0,
      change: '+15.7%',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'ROI',
      value: `${analytics?.roi_percentage || 0}%`,
      change: '+23.1%',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  const advancedMetrics = [
    {
      title: 'Click-Through Rate',
      value: `${analytics?.click_through_rate || 0}%`,
      benchmark: '2.1% (Industry Avg)',
      status: (analytics?.click_through_rate || 0) > 2.1 ? 'above' : 'below'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics?.conversion_rate || 0}%`,
      benchmark: '3.2% (Industry Avg)',
      status: (analytics?.conversion_rate || 0) > 3.2 ? 'above' : 'below'
    },
    {
      title: 'Cost Per Click',
      value: `$${analytics?.cost_per_click || 0}`,
      benchmark: '$1.85 (Industry Avg)',
      status: (analytics?.cost_per_click || 0) < 1.85 ? 'above' : 'below'
    },
    {
      title: 'Cost Per Conversion',
      value: `$${analytics?.cost_per_conversion || 0}`,
      benchmark: '$42 (Industry Avg)',
      status: (analytics?.cost_per_conversion || 0) < 42 ? 'above' : 'below'
    }
  ];

  const planColors = {
    basic: '#3B82F6',
    premium: '#10B981', 
    featured: '#F59E0B'
  };

  const activeAds = advertisements.filter(ad => ad.status === 'active');
  const adPerformanceData = activeAds.map(ad => ({
    name: ad.ad_title.substring(0, 20) + '...',
    impressions: ad.views_count,
    clicks: ad.clicks_count,
    conversions: ad.bookings_count,
    plan: ad.plan_type,
    cost: ad.cost
  }));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedTimeframe === '7days' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('7days')}
          >
            7 Days
          </Button>
          <Button
            variant={selectedTimeframe === '30days' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('30days')}
          >
            30 Days
          </Button>
          <Button
            variant={selectedTimeframe === '90days' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedTimeframe('90days')}
          >
            90 Days
          </Button>
          <Button variant="outline" size="sm" onClick={fetchAnalytics}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <Badge variant={metric.change.startsWith('+') ? 'default' : 'destructive'} className="text-xs">
                  {metric.change}
                </Badge>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Performance</span>
          </TabsTrigger>
          <TabsTrigger value="audience" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Audience</span>
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Optimization</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>Insights</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Performance Trends</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics?.daily_performance || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="impressions" stroke="#3B82F6" strokeWidth={2} name="Impressions" />
                    <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} name="Clicks" />
                    <Line type="monotone" dataKey="conversions" stroke="#F59E0B" strokeWidth={2} name="Conversions" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advancedMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                    <Badge variant={metric.status === 'above' ? 'default' : 'secondary'}>
                      {metric.status === 'above' ? 'Above Avg' : 'Below Avg'}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{metric.benchmark}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Ad Performance Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Ad Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="impressions" fill="#3B82F6" name="Impressions" />
                    <Bar dataKey="clicks" fill="#10B981" name="Clicks" />
                    <Bar dataKey="conversions" fill="#F59E0B" name="Conversions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Audience Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Audience Breakdown</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Homeowners</span>
                    <span className="text-sm text-gray-600">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Service Owners</span>
                    <span className="text-sm text-gray-600">25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Businesses</span>
                    <span className="text-sm text-gray-600">10%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Geographic Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Top Performing Areas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['20695', '20794', '20746', '20707', '20905'].map((zip, index) => (
                    <div key={zip} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">#{index + 1}</span>
                        <span className="text-sm">{zip}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{Math.floor(Math.random() * 100 + 50)} clicks</span>
                        <Badge variant="outline">{(Math.random() * 5 + 2).toFixed(1)}% CTR</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Optimization Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Smart Recommendations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">Increase Budget</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Your premium ad is performing 45% above average. Consider increasing budget for more reach.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-900">Optimize Timing</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Peak engagement occurs between 2-5 PM. Schedule more impressions during this window.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start space-x-3">
                      <Target className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-green-900">Refine Targeting</h4>
                        <p className="text-sm text-green-700 mt-1">
                          Homeowners in 20695 show 3x higher conversion rates. Focus more on this segment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* A/B Testing Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>A/B Testing Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Variant A (Original)</span>
                      <Badge variant="outline">Control</Badge>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">CTR: 2.4% | Conversions: 12</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '48%' }}></div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg border-green-300 bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Variant B (Optimized)</span>
                      <Badge className="bg-green-600">Winner</Badge>
                    </div>
                    <div className="text-xs text-gray-600 mb-2">CTR: 3.1% (+29%) | Conversions: 18 (+50%)</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                  
                  <Button className="w-full" size="sm">
                    Apply Winning Variant
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Advanced Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Best Performing Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>2:00 PM - 3:00 PM</span>
                    <span className="font-medium">4.2% CTR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>3:00 PM - 4:00 PM</span>
                    <span className="font-medium">3.8% CTR</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>8:00 AM - 9:00 AM</span>
                    <span className="font-medium">3.5% CTR</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Emergency plumbing</span>
                    <Badge variant="outline">High</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>24/7 service</span>
                    <Badge variant="outline">High</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Licensed plumber</span>
                    <Badge variant="outline">Medium</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Competitive Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Market Share</span>
                    <span className="font-medium">12.3%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg. Position</span>
                    <span className="font-medium">#2.1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Competitive Score</span>
                    <Badge className="bg-green-600">Strong</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};