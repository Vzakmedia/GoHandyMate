import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Briefcase, MapPin, Clock, DollarSign, User, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';

interface JobRequest {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  budget: number | null;
  status: string | null;
  priority: string | null;
  created_at: string;
  updated_at: string;
  customer_id: string | null;
  assigned_to_user_id: string | null;
  job_type: string | null;
  category: string | null;
  preferred_schedule: string | null;
  unit_id: string | null;
  manager_id: string | null;
  images: string[] | null;
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
}

export const ContractorJobsTab = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchJobs = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('job_requests')
        .select(`
          *,
          profiles:customer_id (
            full_name,
            email
          )
        `)
        .eq('assigned_to_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs((data as unknown as JobRequest[]) || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`contractor-jobs-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_requests',
          filter: `assigned_to_user_id=eq.${user.id}`
        },
        fetchJobs
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  useEffect(() => {
    fetchJobs();
  }, [user?.id]);

  const filteredJobs = jobs.filter(job => {
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (job.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (job.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading jobs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filter Jobs</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span>Your Jobs</span>
            <Badge variant="secondary">{filteredJobs.length}</Badge>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No jobs found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{job.profiles?.full_name || 'Customer'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location || 'No location'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(job.status || 'pending')}>
                        {(job.status || 'pending').replace('_', ' ')}
                      </Badge>
                      {job.budget && (
                        <div className="flex items-center space-x-1 text-green-600 font-medium">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.budget}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3 text-sm line-clamp-2">{job.description || 'No description'}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {job.priority && (
                        <Badge variant="outline" className="text-xs">
                          {job.priority} priority
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        Updated: {new Date(job.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};