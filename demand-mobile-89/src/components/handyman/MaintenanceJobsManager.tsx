import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Phone, 
  Wrench, 
  CheckCircle, 
  CheckCircle2,
  X, 
  ClipboardList, 
  Activity, 
  ShieldCheck, 
  User,
  Search,
  Filter,
  Edit2,
  Check,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  Star,
  DollarSign,
  Briefcase,
  History,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/features/auth';
import { cn } from "@/lib/utils";

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  type: 'emergency' | 'recurring' | 'standard';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: string;
  estimated_cost?: number;
  actual_cost?: number;
  scheduled_date?: string;
  created_at: string;
  properties?: {
    property_name: string;
    property_address: string;
  };
  units?: {
    unit_number: string;
  };
  job_requests?: {
    id: string;
    status: string;
    budget: number;
  }[];
}

export const MaintenanceJobsManager = () => {
  const { user } = useAuth();
  const [maintenanceJobs, setMaintenanceJobs] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState<MaintenanceRequest | null>(null);
  const [updateData, setUpdateData] = useState({
    status: '',
    actual_cost: '',
    notes: ''
  });

  // Fetch maintenance jobs assigned to this handyman
  const fetchMaintenanceJobs = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const { data: jobRequests, error: jobError } = await supabase
        .from('job_requests')
        .select(`
          id,
          title,
          description,
          status,
          budget,
          job_type,
          category,
          created_at,
          location
        `)
        .eq('assigned_to_user_id', user.id)
        .eq('job_type', 'maintenance');

      if (jobError) throw jobError;

      const transformedJobs = jobRequests?.map(job => ({
        id: job.id,
        title: job.title,
        description: job.description,
        type: (job.category as 'emergency' | 'recurring' | 'standard') || 'standard',
        priority: 'medium' as const,
        status: job.status,
        estimated_cost: job.budget,
        created_at: job.created_at,
        job_requests: [{
          id: job.id,
          status: job.status,
          budget: job.budget
        }]
      })) || [];

      setMaintenanceJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching maintenance jobs:', error);
      toast.error('Failed to load maintenance jobs');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleUpdateJob = async () => {
    if (!selectedJob || !selectedJob.job_requests?.[0]) return;

    try {
      const jobRequestId = selectedJob.job_requests[0].id;
      
      const { error: jobError } = await supabase
        .from('job_requests')
        .update({
          status: updateData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobRequestId);

      if (jobError) throw jobError;

      if (updateData.status === 'completed') {
        const { error: maintenanceError } = await supabase.functions.invoke('maintenance-system', {
          method: 'PUT',
          body: {
            status: 'completed',
            actual_cost: updateData.actual_cost ? parseFloat(updateData.actual_cost) : undefined,
            notes: updateData.notes
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        });

        if (maintenanceError) {
          console.error('Error updating maintenance request:', maintenanceError);
        }
      }

      toast.success('Job status updated successfully');
      setShowUpdateDialog(false);
      fetchMaintenanceJobs(); 
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job status');
    }
  };

  const handleAcceptJob = async (job: MaintenanceRequest) => {
    if (!job.job_requests?.[0]) return;

    try {
      const { error } = await supabase
        .from('job_requests')
        .update({
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', job.job_requests[0].id);

      if (error) throw error;

      toast.success('Job accepted successfully');
      fetchMaintenanceJobs();
    } catch (error) {
      console.error('Error accepting job:', error);
      toast.error('Failed to accept job');
    }
  };

  const handleDeclineJob = async (job: MaintenanceRequest) => {
    if (!job.job_requests?.[0]) return;

    try {
      const { error } = await supabase
        .from('job_requests')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', job.job_requests[0].id);

      if (error) throw error;

      toast.success('Job declined');
      fetchMaintenanceJobs();
    } catch (error) {
      console.error('Error declining job:', error);
      toast.error('Failed to decline job');
    }
  };

  useEffect(() => {
    fetchMaintenanceJobs();
  }, [fetchMaintenanceJobs]);

  const filterJobsByStatus = (status: string) => {
    return maintenanceJobs.filter(job => job.job_requests?.[0]?.status === status);
  };

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-xl rounded-[48px] border border-black/5 p-20 flex flex-col items-center justify-center min-h-[480px] animate-pulse">
        <Loader2 className="w-10 h-10 text-[#166534] animate-spin mb-4" />
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Syncing maintenance tasks...</p>
      </div>
    );
  }

  const statusTabs = [
    { id: 'all', label: 'All Tasks', count: maintenanceJobs.length },
    { id: 'assigned', label: 'New', count: filterJobsByStatus('assigned').length },
    { id: 'in_progress', label: 'Active', count: filterJobsByStatus('in_progress').length },
    { id: 'completed', label: 'Done', count: filterJobsByStatus('completed').length },
    { id: 'cancelled', label: 'Cancelled', count: filterJobsByStatus('cancelled').length },
  ];

  return (
    <div className="space-y-10 animate-fade-in outline-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#166534] flex items-center justify-center transition-transform group-hover:scale-105 duration-500">
            <ClipboardList className="w-7 h-7 text-white" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight lowercase first-letter:uppercase">
              Maintenance jobs
            </h2>
            <p className="text-[13px] font-medium text-slate-500">
              Oversee your property maintenance assignments and recurring service tasks.
            </p>
          </div>
        </div>
        <button 
          onClick={fetchMaintenanceJobs}
          className="group flex items-center gap-2.5 px-6 py-3 rounded-full border border-black/5 bg-white text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
        >
          <Clock className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
          Refresh Pipeline
        </button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between border-b border-black/5 pb-6 mb-8 overflow-x-auto scrollbar-hide">
          <TabsList className="inline-flex h-auto p-1 bg-slate-50 border border-black/5 rounded-full">
            {statusTabs.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300",
                  "text-[10px] font-black uppercase tracking-widest",
                  "data-[state=active]:bg-white data-[state=active]:text-[#166534] data-[state=active]:border-black/5",
                  "text-slate-400"
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 rounded-full text-[9px] font-black bg-black/5 text-slate-500">
                    {tab.count}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="animate-in fade-in duration-700">
          <TabsContent value="all" className="space-y-6 focus-visible:outline-none">
            {maintenanceJobs.map((job) => (
              <MaintenanceJobCard 
                key={job.id} 
                job={job} 
                onAccept={handleAcceptJob}
                onDecline={handleDeclineJob}
                onUpdate={() => {
                  setSelectedJob(job);
                  setShowUpdateDialog(true);
                  setUpdateData({
                    status: job.job_requests?.[0]?.status || '',
                    actual_cost: job.actual_cost?.toString() || '',
                    notes: ''
                  });
                }}
              />
            ))}
          </TabsContent>

          {['assigned', 'in_progress', 'completed', 'cancelled'].map((status) => (
            <TabsContent key={status} value={status} className="space-y-6 focus-visible:outline-none">
              {filterJobsByStatus(status).map((job) => (
                <MaintenanceJobCard 
                  key={job.id} 
                  job={job} 
                  onAccept={handleAcceptJob}
                  onDecline={handleDeclineJob}
                  onUpdate={() => {
                    setSelectedJob(job);
                    setShowUpdateDialog(true);
                    setUpdateData({
                      status: job.job_requests?.[0]?.status || '',
                      actual_cost: job.actual_cost?.toString() || '',
                      notes: ''
                    });
                  }}
                />
              ))}
            </TabsContent>
          ))}
        </div>
      </Tabs>

      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="rounded-[32px] border-black/5 backdrop-blur-xl bg-white/95 max-w-lg">
          <DialogHeader className="pb-4 border-b border-black/5 mb-6">
            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight uppercase">Update Job Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Phase</label>
              <Select value={updateData.status} onValueChange={(value) => setUpdateData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger className="h-12 rounded-[16px] border-black/5 bg-slate-50/50 font-bold text-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-[16px] border-black/5">
                  <SelectItem value="assigned" className="font-bold">Assigned</SelectItem>
                  <SelectItem value="in_progress" className="font-bold text-emerald-600">In Progress</SelectItem>
                  <SelectItem value="completed" className="font-bold text-indigo-600">Completed</SelectItem>
                  <SelectItem value="cancelled" className="font-bold text-rose-600">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {updateData.status === 'completed' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Final Settlement (USD)</label>
                  <Input 
                    type="number"
                    value={updateData.actual_cost}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, actual_cost: e.target.value }))}
                    placeholder="Final project cost"
                    className="h-12 rounded-[16px] border-black/5 bg-slate-50/50 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Closeout Notes</label>
                  <Textarea 
                    value={updateData.notes}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add mission-critical completion details..."
                    rows={4}
                    className="rounded-[20px] border-black/5 bg-slate-50/50 font-medium resize-none text-[13px]"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-black/5">
              <button 
                onClick={() => setShowUpdateDialog(false)}
                className="flex-1 px-6 py-4 rounded-full border border-black/5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateJob}
                className="flex-[2] px-6 py-4 rounded-full bg-[#166534] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#166534]/90 transition-all active:scale-95"
              >
                Synchronize Status
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface MaintenanceJobCardProps {
  job: MaintenanceRequest;
  onAccept: (job: MaintenanceRequest) => void;
  onDecline: (job: MaintenanceRequest) => void;
  onUpdate: () => void;
}

const MaintenanceJobCard = ({ job, onAccept, onDecline, onUpdate }: MaintenanceJobCardProps) => {
  const jobStatus = job.job_requests?.[0]?.status || 'pending';
  const jobBudget = job.job_requests?.[0]?.budget || job.estimated_cost || 0;
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Pending Approval', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' };
      case 'assigned': return { label: 'Assigned', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
      case 'in_progress': return { label: 'In Progress', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'completed': return { label: 'Completed', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' };
      case 'cancelled': return { label: 'Cancelled', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' };
      default: return { label: status, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' };
    }
  };

  const status = getStatusConfig(jobStatus);

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 to-[#166534]/0 rounded-[42px] blur opacity-0 group-hover:opacity-100 transition duration-500" />
      
      <div className="relative bg-white/90 backdrop-blur-xl border border-black/5 rounded-[40px] overflow-hidden transition-all duration-500">
        <div className="p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
            <div className="space-y-4 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <div className={cn("flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest", status.bg, status.color, status.border)}>
                  <Activity className="w-3 h-3" />
                  {status.label}
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 border border-black/5 text-[10px] font-black uppercase tracking-widest uppercase tracking-widest">
                  Maintenance {job.type}
                </div>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight transition-colors group-hover:text-[#166534]">
                {job.title}
              </h3>
              
              <p className="text-[13px] font-medium text-slate-500 leading-relaxed line-clamp-2 max-w-2xl">
                {job.description}
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-end justify-center px-8 py-6 bg-slate-50/50 rounded-[32px] border border-black/5 shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Maintenance Budget</span>
              <span className="text-3xl font-black text-emerald-600 tracking-tight leading-none">
                ${jobBudget.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-black/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-y-4 gap-x-12">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-black/5 group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4 text-[#166534]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Asset Location</p>
                  <p className="text-[12px] font-bold text-slate-700 truncate">
                    {job.properties?.property_name || 'Unspecified Property'}
                    {job.units?.unit_number && ` - Unit ${job.units.unit_number}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-black/5 group-hover:scale-110 transition-transform">
                  <Calendar className="w-4 h-4 text-[#166534]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Assigned Date</p>
                  <p className="text-[12px] font-bold text-slate-700">{new Date(job.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {jobStatus === 'assigned' && (
                <>
                  <button 
                    onClick={() => onAccept(job)}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#166534] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#166534]/90 transition-all active:scale-95"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Accept
                  </button>
                  <button 
                    onClick={() => onDecline(job)}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-rose-600 border border-rose-100 text-[11px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95"
                  >
                    <X className="w-3.5 h-3.5" />
                    Decline
                  </button>
                </>
              )}
              
              {(jobStatus === 'in_progress' || jobStatus === 'assigned') && (
                <button 
                  onClick={onUpdate}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Update Phase
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};