
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, MapPin, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface JobRequest {
  id: string;
  title: string;
  description: string;
  job_type: string;
  budget: number;
  status: string;
  priority: string;
  created_at: string;
  units: {
    unit_number: string;
    property_address: string;
    property_id: string;
  };
}

export const RecentServiceRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentJobs, setRecentJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableProfessionals, setAvailableProfessionals] = useState<number>(0);

  useEffect(() => {
    if (!user) return;

    const fetchRecentJobs = async () => {
      try {
        // Fetch recent job requests
        const { data: jobsData, error } = await supabase
          .from('job_requests')
          .select(`
            id,
            title,
            description,
            job_type,
            budget,
            status,
            priority,
            created_at,
            units (
              unit_number,
              property_address,
              property_id
            )
          `)
          .eq('manager_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        // Fetch available professionals count
        const { count: professionalsCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .in('user_role', ['handyman', 'contractor'])
          .eq('account_status', 'active');

        setRecentJobs(jobsData || []);
        setAvailableProfessionals(professionalsCount || 0);
      } catch (error) {
        console.error('Error fetching recent jobs:', error);
        toast.error('Failed to load recent service requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentJobs();

    // Set up real-time subscription
    const subscription = supabase
      .channel('recent-jobs-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'job_requests', filter: `manager_id=eq.${user.id}` },
        () => fetchRecentJobs()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleAssignProfessional = (jobId: string) => {
    // Navigate to job details where they can assign professionals
    navigate(`/jobs/${jobId}`);
  };

  const handleEditJob = (jobId: string) => {
    // This could open an edit modal or navigate to edit page
    navigate(`/jobs/${jobId}/edit`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Service Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg border animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Recent Service Requests</CardTitle>
          <Button 
            onClick={() => navigate('/professionals')}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Users className="w-4 h-4 mr-2" />
            View Available Professionals ({availableProfessionals})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {recentJobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No recent service requests</p>
            <Button 
              onClick={() => navigate('/jobs')} 
              className="mt-4"
              variant="outline"
            >
              Create Your First Job Request
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="bg-gray-50 p-4 rounded-lg border hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status.replace('_', ' ')}
                      </Badge>
                      {job.priority && (
                        <AlertCircle className={`w-4 h-4 ${getPriorityColor(job.priority)}`} />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{job.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.units?.property_address || 'No address'}
                      </span>
                      <span>Unit: {job.units?.unit_number || 'N/A'}</span>
                      <span>Type: {job.job_type || 'General'}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xl font-bold text-green-600 mb-1">
                      ${job.budget?.toLocaleString() || 'TBD'}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {availableProfessionals} professionals available
                    </span>
                    {job.priority && (
                      <span className={`capitalize ${getPriorityColor(job.priority)}`}>
                        • {job.priority} priority
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditJob(job.id)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleAssignProfessional(job.id)}
                      disabled={job.status === 'completed' || job.status === 'cancelled'}
                    >
                      {job.status === 'pending' ? 'Assign Professional' : 'View Details'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {recentJobs.length > 0 && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/jobs')}
            >
              View All Jobs
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
