
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useSubscription } from '@/hooks/useSubscription';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AcceptJobButton } from '@/components/handyman/AcceptJobButton';
import { BackButton } from '@/components/navigation/BackButton';
import { toast } from 'sonner';
import { MapPin, Clock, DollarSign, Wrench, Loader2, AlertCircle, UserX } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  job_type: string;
  priority: string;
  budget: number;
  status: string;
  created_at: string;
  units: {
    unit_number: string;
    property_address: string;
  };
}

export const JobsPage = () => {
  const { user, profile } = useAuth();
  const { canAcceptJob } = useSubscription();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  
  // Handle openJob parameter from notifications
  useEffect(() => {
    const openJobId = searchParams.get('openJob');
    if (openJobId) {
      setExpandedJobId(openJobId);
      // Scroll to the job card after a short delay
      setTimeout(() => {
        const jobElement = document.getElementById(`job-${openJobId}`);
        if (jobElement) {
          jobElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [searchParams]);

  const fetchAvailableJobs = async () => {
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    // Check if user is a handyman
    if (profile?.user_role !== 'handyman') {
      setError('This page is only available for handymen');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching available jobs for handyman:', user.id);
      
      const { data, error } = await supabase.functions.invoke('handyman-jobs', {
        body: { 
          userId: user.id,
          jobType: 'available'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to fetch jobs');
      }

      console.log('Jobs fetched successfully:', data);
      setJobs(data || []);
      
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      const errorMessage = error.message || 'Failed to load available jobs';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableJobs();
  }, [user, profile]);

  const handleJobAccepted = () => {
    fetchAvailableJobs();
    toast.success('Job accepted successfully!');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Show access denied for non-handymen
  if (user && profile && profile.user_role !== 'handyman') {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Available Jobs</h1>
            <p className="text-gray-600">Browse and accept jobs in your area</p>
          </div>
          <BackButton />
        </div>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6 text-center">
            <UserX className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-orange-900 mb-2">Access Restricted</h3>
            <p className="text-orange-700 mb-4">This page is only available for handymen. Please ensure you have the correct account type.</p>
            <BackButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Available Jobs</h1>
            <p className="text-gray-600">Browse and accept jobs in your area</p>
          </div>
          <BackButton />
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading available jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Available Jobs</h1>
            <p className="text-gray-600">Browse and accept jobs in your area</p>
          </div>
          <BackButton />
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-900 mb-2">Failed to Load Jobs</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchAvailableJobs}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Available Jobs</h1>
          <p className="text-gray-600">Browse and accept jobs in your area</p>
        </div>
        <BackButton />
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Available</h3>
            <p className="text-gray-600 mb-4">Check back later for new job opportunities.</p>
            <button
              onClick={fetchAvailableJobs}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Refresh Jobs
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Card 
              key={job.id} 
              id={`job-${job.id}`}
              className={`hover:shadow-lg transition-shadow ${
                expandedJobId === job.id ? 'ring-2 ring-blue-500 shadow-lg' : ''
              }`}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold">{job.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline">{job.job_type}</Badge>
                      <Badge className={getPriorityColor(job.priority)}>
                        {job.priority}
                      </Badge>
                    </div>
                  </div>
                  {job.budget && (
                    <div className="text-right">
                      <div className="flex items-center text-green-600 font-semibold">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {job.budget}
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-700">{job.description}</p>
                
                <div className="space-y-2">
                  {job.units && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{job.units.property_address} - Unit {job.units.unit_number}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-4">
                  {canAcceptJob() ? (
                    <AcceptJobButton 
                      jobId={job.id} 
                      onJobAccepted={handleJobAccepted}
                    />
                  ) : (
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        You've reached your monthly job limit. Upgrade your plan to accept more jobs.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
