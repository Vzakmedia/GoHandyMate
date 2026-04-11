
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp, Users, DollarSign, Download, Calendar, Loader2 } from 'lucide-react';
import { useRealTimeAnalytics } from '@/hooks/useRealTimeAnalytics';

export const AnalyticsDashboard = () => {
  const { 
    totalJobs, 
    completedJobs, 
    inProgressJobs, 
    pendingJobs,
    totalProfessionals,
    handymen,
    contractors,
    customers,
    monthlyData,
    averageRating,
    totalRevenue,
    loading 
  } = useRealTimeAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  const completionRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
  const averageJobValue = completedJobs > 0 ? Math.round(totalRevenue / completedJobs) : 0;

  const kpiMetrics = [
    { 
      label: 'Total Revenue', 
      value: `$${(totalRevenue / 1000).toFixed(1)}K`, 
      change: monthlyData.length > 1 ? 
        `${((monthlyData[monthlyData.length - 1].revenue - monthlyData[monthlyData.length - 2].revenue) / monthlyData[monthlyData.length - 2].revenue * 100).toFixed(1)}%` : 
        '+0%', 
      trend: 'up' 
    },
    { 
      label: 'Total Jobs', 
      value: totalJobs.toString(), 
      change: `${completedJobs} completed`, 
      trend: 'up' 
    },
    { 
      label: 'Completion Rate', 
      value: `${completionRate}%`, 
      change: `${inProgressJobs} in progress`, 
      trend: completionRate > 70 ? 'up' : 'down' 
    },
    { 
      label: 'Avg Job Value', 
      value: `$${averageJobValue}`, 
      change: `${averageRating.toFixed(1)}⭐ rating`, 
      trend: 'up' 
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Automated Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <Select defaultValue="monthly">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpiMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`flex items-center space-x-1 ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue and Growth Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue performance across all franchises</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Growth</CardTitle>
            <CardDescription>Breakdown of professionals by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Handymen</span>
                <span className="font-semibold">{handymen}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Contractors</span>
                <span className="font-semibold">{contractors}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Property Managers</span>
                <span className="font-semibold">{totalProfessionals - handymen - contractors - customers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Customers</span>
                <span className="font-semibold">{customers}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center font-semibold">
                  <span>Total Users</span>
                  <span>{totalProfessionals}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs and Customer Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Jobs Completed</CardTitle>
            <CardDescription>Monthly job completion trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jobs" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Growth</CardTitle>
            <CardDescription>New and returning customers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="customers" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Job Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>Job Status Overview</span>
          </CardTitle>
          <CardDescription>Current status of all jobs in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-green-50">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>
                  <h3 className="font-semibold text-green-800">Jobs Completed</h3>
                </div>
                <Badge variant="default" className="bg-green-600">
                  {completionRate}% completion rate
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-green-600">Total Completed</p>
                  <p className="text-xl font-bold text-green-800">{completedJobs}</p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Total Revenue</p>
                  <p className="text-xl font-bold text-green-800">${totalRevenue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-green-600">Avg Job Value</p>
                  <p className="text-xl font-bold text-green-800">${averageJobValue}</p>
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>
                  <h3 className="font-semibold text-blue-800">Active Jobs</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-blue-600">In Progress</p>
                  <p className="text-xl font-bold text-blue-800">{inProgressJobs}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Pending</p>
                  <p className="text-xl font-bold text-blue-800">{pendingJobs}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automated Reporting Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span>Automated Reporting Schedule</span>
          </CardTitle>
          <CardDescription>Scheduled reports and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Weekly Reports</h4>
              <p className="text-sm text-blue-600 mb-2">Every Monday at 9:00 AM</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Franchise performance summary</li>
                <li>• Top performing technicians</li>
                <li>• Revenue by territory</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Monthly Reports</h4>
              <p className="text-sm text-green-600 mb-2">1st of each month</p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Comprehensive P&L statement</li>
                <li>• Royalty collection summary</li>
                <li>• Customer satisfaction metrics</li>
              </ul>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Quarterly Reports</h4>
              <p className="text-sm text-purple-600 mb-2">End of each quarter</p>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Growth analysis and trends</li>
                <li>• Competitive benchmarking</li>
                <li>• Strategic recommendations</li>
              </ul>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2">Real-time Alerts</h4>
              <p className="text-sm text-orange-600 mb-2">Instant notifications</p>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Revenue milestones</li>
                <li>• Performance anomalies</li>
                <li>• Critical system events</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
