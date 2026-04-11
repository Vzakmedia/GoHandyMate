
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Users, Wrench, Clock, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useToast } from '@/hooks/use-toast';
import { HandymanProfileModal } from '@/components/real-time-service-sync/HandymanProfileModal';

interface Task {
  id: string;
  title: string;
  property: string;
  unit: string;
  priority: 'low' | 'medium' | 'high' | 'emergency';
  status: 'unassigned' | 'assigned' | 'in-progress' | 'completed';
  assignedTo?: string;
  type: 'internal' | 'external';
}

interface Technician {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'handyman' | 'contractor';
  skills: string[];
  available: boolean;
  rating: number;
  completedJobs?: number;
  reviewCount?: number;
  subscriptionPlan?: string;
  distance?: number;
  servicePricing?: Array<{
    category_id: string;
    base_price: number;
    emergency_multiplier: number;
    same_day_multiplier: number;
  }>;
}

export const TaskAssignment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfessionalId, setSelectedProfessionalId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    fetchTasks();
    fetchTechnicians();

    // Set up real-time subscription for job requests
    const jobsChannel = supabase
      .channel('jobs-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'job_requests', filter: `manager_id=eq.${user.id}` },
        () => fetchTasks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(jobsChannel);
    };
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      const { data: jobRequests, error } = await supabase
        .from('job_requests')
        .select(`
          *,
          units!job_requests_unit_id_fkey (
            unit_number,
            property_address,
            unit_name
          )
        `)
        .eq('manager_id', user.id)
        .neq('status', 'completed')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTasks: Task[] = jobRequests?.map(job => ({
        id: job.id,
        title: job.title,
        property: job.units?.property_address || job.location || 'Unknown Property',
        unit: job.units?.unit_number || 'N/A',
        priority: job.priority as 'low' | 'medium' | 'high' | 'emergency',
        status: job.assigned_to_user_id ? 'assigned' : 'unassigned',
        assignedTo: job.assigned_to_user_id ? 'Assigned' : undefined,
        type: 'internal'
      })) || [];

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    }
  };

  const fetchTechnicians = async () => {
    try {
      // Fetch both handymen and contractors
      const [handymenResponse, contractorsResponse] = await Promise.all([
        supabase.functions.invoke('get-professionals', {
          body: {
            userType: 'handyman',
            userLat: 0,
            userLng: 0,
            radius: 50,
            serviceName: '',
            includeServicePricing: true
          }
        }),
        supabase.functions.invoke('get-professionals', {
          body: {
            userType: 'contractor',
            userLat: 0,
            userLng: 0,
            radius: 50,
            serviceName: '',
            includeServicePricing: true
          }
        })
      ]);

      if (handymenResponse.error) throw handymenResponse.error;
      if (contractorsResponse.error) throw contractorsResponse.error;

      const handymen = handymenResponse.data || [];
      const contractors = contractorsResponse.data || [];
      const allProfessionals = [...handymen, ...contractors];
      
      const formattedTechnicians: Technician[] = allProfessionals
        .filter((prof: any) => prof.user_role === 'contractor') // Only show contractors, not handymen
        .map((prof: any) => ({
          id: prof.id,
          name: prof.full_name || prof.email || 'Unknown',
          type: 'contractor',
          skills: prof.skill_rates?.map((sr: any) => sr.skill_name) || 
                  prof.services_offered || 
                  ['General Maintenance'],
          available: prof.subscription_status === 'active' && prof.account_status === 'active',
          rating: prof.rating || prof.average_rating || 0,
          completedJobs: prof.completedJobs || 0,
          reviewCount: prof.reviewCount || prof.total_ratings || 0,
          subscriptionPlan: prof.subscription_plan,
          distance: prof.distance,
          servicePricing: prof.service_pricing || []
        }));

      // Sort by availability first, then by rating
      formattedTechnicians.sort((a, b) => {
        if (a.available !== b.available) return a.available ? -1 : 1;
        return b.rating - a.rating;
      });

      setTechnicians(formattedTechnicians);
      
      // Set up real-time subscription for professionals
      const professionalsChannel = supabase
        .channel('professionals-changes')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'profiles', filter: `user_role=in.(handyman,contractor)` },
          () => {
            // Re-fetch professionals when profiles change
            setTimeout(() => fetchTechnicians(), 1000);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(professionalsChannel);
      };
    } catch (error) {
      console.error('Error fetching professionals:', error);
      toast({
        title: "Error",
        description: "Failed to fetch professionals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'assigned': return 'bg-yellow-100 text-yellow-700';
      case 'unassigned': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const assignTask = (taskId: string, technicianId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            assignedTo: technicians.find(t => t.id === technicianId)?.name,
            status: 'assigned' as const
          }
        : task
    ));
  };

  const handleProfessionalClick = (professional: Technician) => {
    setSelectedProfessionalId(professional.id);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 animate-pulse">
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {tasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Wrench className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No active tasks</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{task.title}</h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{task.property} - Unit {task.unit}</span>
                    </div>
                  </div>
                  <div className="flex space-x-1 ml-2">
                    <Badge className={`${getPriorityColor(task.priority)} text-xs px-1 py-0`}>
                      {task.priority}
                    </Badge>
                    <Badge className={`${getStatusColor(task.status)} text-xs px-1 py-0`}>
                      {task.status}
                    </Badge>
                  </div>
                </div>

                {task.assignedTo && (
                  <div className="flex items-center space-x-1 text-xs">
                    <User className="w-3 h-3 text-blue-600" />
                    <span>Assigned to: {task.assignedTo}</span>
                  </div>
                )}

                {task.status === 'unassigned' && (
                  <div className="flex items-center space-x-2">
                    <Select onValueChange={(value) => assignTask(task.id, value)}>
                      <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue placeholder="Assign technician" />
                      </SelectTrigger>
                      <SelectContent>
                        {technicians.filter(t => t.available).map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name} ({tech.type === 'handyman' ? 'Handyman' : tech.type === 'contractor' ? 'Contractor' : tech.type}) - ⭐{tech.rating.toFixed(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {technicians.map((tech) => (
          <div key={tech.id} className="p-2 border rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 transition-all duration-200 cursor-pointer"
               onClick={() => handleProfessionalClick(tech)}>
            {/* Header with name and status */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex-1 min-w-0">
                <span className="font-medium text-sm truncate block">{tech.name}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs px-1 py-0 capitalize">
                    {tech.type === 'handyman' ? 'Handyman' : tech.type === 'contractor' ? 'Contractor' : tech.type}
                  </Badge>
                  {tech.subscriptionPlan && (
                    <span className="text-xs text-blue-600 font-medium capitalize">{tech.subscriptionPlan}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Badge variant={tech.available ? 'default' : 'destructive'} className="text-xs px-1 py-0">
                  {tech.available ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="text-xs">
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600">Rating:</span>
                  <span className="font-medium">⭐{tech.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600">Reviews:</span>
                  <span className="font-medium">{tech.reviewCount || 0}</span>
                </div>
              </div>
              <div className="text-xs">
                <div className="flex items-center space-x-1">
                  <span className="text-gray-600">Jobs:</span>
                  <span className="font-medium">{tech.completedJobs || 0}</span>
                </div>
                {tech.distance && (
                  <div className="flex items-center space-x-1">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-medium">{tech.distance.toFixed(1)}mi</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="text-xs text-gray-600 mb-2">
              <span className="font-medium">Skills:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {tech.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                    {skill}
                  </Badge>
                ))}
                {tech.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    +{tech.skills.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Pricing info if available */}
            {tech.servicePricing && tech.servicePricing.length > 0 && (
              <div className="text-xs text-gray-600">
                <span className="font-medium">Base Rate:</span>
                <span className="ml-1">${tech.servicePricing[0]?.base_price || 'N/A'}/hr</span>
                {tech.servicePricing[0]?.emergency_multiplier && (
                  <span className="ml-2 text-red-600">
                    Emergency: {tech.servicePricing[0].emergency_multiplier}x
                  </span>
                )}
              </div>
            )}

            {/* Quick assign button for available professionals */}
            {tech.available && tasks.some(task => task.status === 'unassigned') && (
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full mt-2 h-6 text-xs"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent navigation when clicking assign button
                  const unassignedTask = tasks.find(task => task.status === 'unassigned');
                  if (unassignedTask) {
                    assignTask(unassignedTask.id, tech.id);
                  }
                }}
              >
                Quick Assign
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Professional Profile Modal */}
      {selectedProfessionalId && (
        <HandymanProfileModal
          isOpen={!!selectedProfessionalId}
          onClose={() => setSelectedProfessionalId(null)}
          handymanId={selectedProfessionalId}
        />
      )}
    </div>
  );
};
