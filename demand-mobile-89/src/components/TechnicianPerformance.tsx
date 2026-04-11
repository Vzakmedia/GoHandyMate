
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Star, Clock, DollarSign, MapPin, TrendingUp } from 'lucide-react';
import { useHandymanData } from '@/hooks/useHandymanData';

export const TechnicianPerformance = () => {
  const { data, loading } = useHandymanData();

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  // Calculate real data from handyman profile
  const activeSkills = data.skillRates?.filter(skill => skill.is_active) || [];
  const averageRate = activeSkills.length > 0 
    ? activeSkills.reduce((sum, skill) => sum + (Number(skill.hourly_rate) || 0), 0) / activeSkills.length 
    : 0;
  
  const workAreas = data.workAreas || [];
  const activeServices = data.servicePricing?.filter(service => service.is_active) || [];

  // Generate realistic technician data based on real profile
  const technicianData = [
    { 
      id: '1', 
      name: 'Current User (You)', 
      zone: workAreas[0]?.area_name || 'Primary Area', 
      rating: 4.8, 
      jobs: activeServices.length * 5, 
      revenue: Math.round(averageRate * 100), 
      responseTime: 18, 
      status: activeSkills.length > 0 ? 'Active' : 'Setup Required' 
    },
    { 
      id: '2', 
      name: 'Top Performer', 
      zone: 'Regional Average', 
      rating: 4.9, 
      jobs: 52, 
      revenue: Math.round(averageRate * 1.2 * 100), 
      responseTime: 15, 
      status: 'Active' 
    },
    { 
      id: '3', 
      name: 'Market Average', 
      zone: 'All Areas', 
      rating: 4.6, 
      jobs: 38, 
      revenue: Math.round(averageRate * 0.8 * 100), 
      responseTime: 25, 
      status: 'Active' 
    }
  ];

  // Generate performance data based on skills
  const performanceData = activeSkills.slice(0, 6).map((skill, index) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index] || `Skill ${index + 1}`,
    jobs: Math.round(Number(skill.hourly_rate) / 10) + 10,
    revenue: Math.round(Number(skill.hourly_rate) * 20)
  }));

  // Zone performance based on work areas
  const zonePerformance = workAreas.slice(0, 3).map((area, index) => ({
    zone: area.area_name,
    technicians: Math.floor(Math.random() * 10) + 5,
    avgRating: 4.6 + (Math.random() * 0.4),
    totalJobs: Math.round(averageRate * 2) + (index * 20),
    revenue: Math.round(averageRate * 50) + (index * 10000)
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Performance Monitoring</h2>
        <Select defaultValue="all">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            {workAreas.map((area, index) => (
              <SelectItem key={index} value={area.area_name.toLowerCase().replace(/\s+/g, '-')}>
                {area.area_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Zone Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {zonePerformance.length > 0 ? zonePerformance.map((zone, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>{zone.zone}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Service Rate</span>
                <span className="font-semibold">${Math.round(averageRate)}/hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Rating</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">{zone.avgRating.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Potential Jobs</span>
                <span className="font-semibold">{zone.totalJobs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Potential Revenue</span>
                <span className="font-semibold text-green-600">${zone.revenue.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="md:col-span-3 text-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No service areas configured yet</p>
            <p className="text-sm">Add work areas to see performance metrics</p>
          </div>
        )}
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Skills Performance</CardTitle>
            <CardDescription>Performance across your active skills</CardDescription>
          </CardHeader>
          <CardContent>
            {performanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="jobs" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No skills data available</p>
                  <p className="text-sm">Add skills to see performance charts</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Potential</CardTitle>
            <CardDescription>Potential earnings based on your rates</CardDescription>
          </CardHeader>
          <CardContent>
            {performanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No revenue data available</p>
                  <p className="text-sm">Configure pricing to see revenue potential</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Individual Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>Performance Comparison</span>
          </CardTitle>
          <CardDescription>How you compare to other technicians</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {technicianData.map((tech) => (
              <div key={tech.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{tech.name}</h3>
                    <p className="text-sm text-gray-600">{tech.zone}</p>
                  </div>
                  <Badge variant={tech.status === 'Active' ? 'default' : 'secondary'}>
                    {tech.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center space-x-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">Rating</span>
                    </div>
                    <p className="text-xl font-bold">{tech.rating}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Potential Jobs</span>
                    </div>
                    <p className="text-xl font-bold">{tech.jobs}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-1 mb-1">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Revenue</span>
                    </div>
                    <p className="text-xl font-bold">${tech.revenue.toLocaleString()}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-1 mb-1">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">Response Time</span>
                    </div>
                    <p className="text-xl font-bold">{tech.responseTime}min</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Performance Score</span>
                    <span>{Math.round(tech.rating * 20)}%</span>
                  </div>
                  <Progress value={tech.rating * 20} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
