
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Eye, Clock, CheckCircle, AlertCircle, Building, Loader2 } from 'lucide-react';
import { usePropertyJobTracking } from '@/hooks/usePropertyJobTracking';

export const PropertyJobTracking = () => {
  const { jobs, properties, loading } = usePropertyJobTracking();
  const [selectedProperty, setSelectedProperty] = useState('all');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading job tracking data...</span>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'scheduled': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-yellow-100 text-yellow-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityFromBudget = (budget: number) => {
    if (budget > 500) return 'high';
    if (budget > 200) return 'medium';
    if (budget > 100) return 'low';
    return 'medium';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredJobs = selectedProperty === 'all' 
    ? jobs 
    : jobs.filter(job => job.property === selectedProperty);

  const getStats = () => {
    const total = filteredJobs.length;
    const completed = filteredJobs.filter(job => job.status === 'completed').length;
    const inProgress = filteredJobs.filter(job => job.status === 'in_progress').length;
    const scheduled = filteredJobs.filter(job => job.status === 'scheduled').length;
    const pending = filteredJobs.filter(job => job.status === 'pending').length;
    
    return { total, completed, inProgress, scheduled, pending };
  };

  const stats = getStats();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">Job Tracking Dashboard</h2>
        <select
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border rounded-lg"
        >
          <option value="all">All Properties</option>
          {properties.map(property => (
            <option key={property} value={property}>{property}</option>
          ))}
        </select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <div>
                <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Jobs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <div>
                <div className="text-xl sm:text-2xl font-bold">{stats.inProgress}</div>
                <div className="text-xs sm:text-sm text-gray-600">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <div>
                <div className="text-xl sm:text-2xl font-bold">{stats.completed}</div>
                <div className="text-xs sm:text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              <div>
                <div className="text-xl sm:text-2xl font-bold">{stats.scheduled + stats.pending}</div>
                <div className="text-xs sm:text-sm text-gray-600">Scheduled/Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Ongoing Jobs</CardTitle>
          <CardDescription className="text-sm">Track all jobs across your properties</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {filteredJobs.map((job) => {
            const priority = getPriorityFromBudget(job.budget);
            const formattedDate = new Date(job.created_at).toLocaleDateString();
            
            return (
              <div key={job.id} className="p-3 sm:p-4 border rounded-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getStatusIcon(job.status)}
                      <h3 className="font-semibold text-sm sm:text-base">{job.title}</h3>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {job.property} - Unit {job.unit} • Technician: {job.technician}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Budget: ${job.budget} • Category: {job.category}
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-2 sm:space-x-0 sm:space-y-2">
                    <Badge className={`${getPriorityColor(priority)} text-xs`}>
                      {priority}
                    </Badge>
                    <Badge className={`${getStatusColor(job.status)} text-xs`}>
                      {job.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                {job.status === 'in_progress' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span>Progress</span>
                      <span>In Progress</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-600">
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-4">
                    <span>Created: {formattedDate}</span>
                    <span>Status: {job.status.replace('_', ' ')}</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full sm:w-auto">
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};
