
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Clock, Users, CheckCircle2, Loader2 } from "lucide-react";
import { useUnifiedHandymanMetrics } from "@/hooks/useUnifiedHandymanMetrics";
import { useHandymanJobs } from "@/hooks/useHandymanJobs";

export const LiveJobsSection = () => {
  const { metrics, loading: jobDataLoading } = useUnifiedHandymanMetrics();
  
  const { 
    handleJobStatusUpdate, 
    loading: jobsLoading 
  } = useHandymanJobs();

  const loading = jobDataLoading || jobsLoading;

  // Get all jobs with proper status filtering and real-time data
  const liveJobs = [] // For now, show empty until we have proper job data access
    .filter(job => 
      job.status === 'in_progress' || 
      job.status === 'assigned' || 
      job.status === 'ongoing'
    )
    .slice(0, 5); // Show top 5 jobs for now

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': 
      case 'ongoing': return 'bg-blue-500 text-white';
      case 'assigned': return 'bg-orange-500 text-white';
      case 'completed': return 'bg-green-500 text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'ongoing': return 'Ongoing';
      case 'assigned': return 'Assigned';
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  const handleMarkComplete = async (jobId: string) => {
    try {
      await handleJobStatusUpdate(jobId, 'completed');
    } catch (error) {
      console.error('Failed to mark job as complete:', error);
    }
  };

  const isJobOverdue = (scheduledDate: Date, status: string) => {
    if (status === 'completed') return false;
    return scheduledDate < new Date();
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader className="px-2 sm:px-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <span>Live Job Data</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
              <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs">
                Loading...
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-24 sm:h-32 px-2 sm:px-4">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="px-2 sm:px-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base sm:text-lg lg:text-xl flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            <span>Live Job Data</span>
          </CardTitle>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 text-xs">
            {liveJobs.length} active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-2 sm:px-4">
        {liveJobs.length > 0 ? liveJobs.map((job) => {
          const isOverdue = isJobOverdue(job.scheduledDate, job.status);
          
          return (
            <div 
              key={job.id} 
              className={`group p-3 sm:p-4 border rounded-lg sm:rounded-xl transition-all duration-200 hover:border-blue-300 ${
                isOverdue ? 'border-red-200 bg-red-50' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                      job.status === 'in_progress' || job.status === 'ongoing' ? 'bg-blue-500' :
                      job.status === 'assigned' ? 'bg-orange-500' : 'bg-gray-500'
                    }`}></div>
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{job.title}</h4>
                    <Badge className={`text-xs capitalize flex-shrink-0 ${getStatusColor(job.status)}`}>
                      {getStatusLabel(job.status)}
                    </Badge>
                    {job.jobType === 'custom_quote' && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 flex-shrink-0">
                        Quote
                      </Badge>
                    )}
                    {isOverdue && (
                      <Badge variant="destructive" className="text-xs flex-shrink-0">
                        Overdue
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">
                        {job.scheduledDate.toLocaleDateString()} at {job.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{job.customer}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-2 text-right">
                  <div className="text-lg sm:text-xl font-bold text-green-600">${job.price}</div>
                  <div className="flex gap-2">
                    {(job.status === 'in_progress' || job.status === 'assigned' || job.status === 'ongoing') && (
                      <Button 
                        size="sm" 
                        onClick={() => handleMarkComplete(job.id)}
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-auto"
                      >
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 h-auto hidden sm:inline-flex"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
              
              {job.status === 'in_progress' && (
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{job.progress}%</span>
                  </div>
                  <Progress value={job.progress} className="h-1.5 sm:h-2" />
                </div>
              )}
            </div>
          );
        }) : (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <Calendar className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
            <p className="text-sm sm:text-base">No active jobs at the moment</p>
            <p className="text-xs sm:text-sm">New jobs will appear here when assigned</p>
          </div>
        )}
        
        {/* Real-time Status Summary */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg border">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center text-xs sm:text-sm">
            <div>
              <div className="font-semibold text-blue-600 text-sm sm:text-base">
                {metrics.totalActiveJobs}
              </div>
              <div className="text-gray-600">In Progress</div>
            </div>
            <div>
              <div className="font-semibold text-orange-600 text-sm sm:text-base">
                0
              </div>
              <div className="text-gray-600">Assigned</div>
            </div>
            <div>
              <div className="font-semibold text-green-600 text-sm sm:text-base">
                {metrics.totalCompletedJobs}
              </div>
              <div className="text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
