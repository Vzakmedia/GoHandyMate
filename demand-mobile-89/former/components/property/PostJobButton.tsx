
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface PostJobButtonProps {
  onJobPosted?: () => void;
}

export const PostJobButton = ({ onJobPosted }: PostJobButtonProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    job_type: '',
    category: '',
    priority: 'medium',
    unit_id: '',
    budget: '',
    preferred_schedule: ''
  });

  // Fetch units for the dropdown
  const { data: units } = useQuery({
    queryKey: ['units', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('units')
        .select('id, unit_number, unit_name, property_address')
        .eq('manager_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user && open
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to post jobs');
      return;
    }

    setIsSubmitting(true);
    try {
      const jobData = {
        ...formData,
        manager_id: user.id,
        status: 'pending',
        budget: formData.budget ? parseInt(formData.budget) : null,
        preferred_schedule: formData.preferred_schedule ? new Date(formData.preferred_schedule).toISOString() : null
      };

      const { error } = await supabase
        .from('job_requests')
        .insert(jobData);

      if (error) throw error;

      // Notify available workers
      await supabase.functions.invoke('notify-available-workers', {
        body: { 
          jobId: 'new-job', // This would be the actual job ID in a real implementation
          jobType: formData.job_type 
        }
      });

      toast.success('Job posted successfully!');
      setOpen(false);
      setFormData({
        title: '',
        description: '',
        job_type: '',
        category: '',
        priority: 'medium',
        unit_id: '',
        budget: '',
        preferred_schedule: ''
      });
      onJobPosted?.();
    } catch (error: any) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post New Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Fix leaky faucet"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit_id">Unit *</Label>
            <Select value={formData.unit_id} onValueChange={(value) => setFormData(prev => ({ ...prev, unit_id: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units?.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    Unit {unit.unit_number} {unit.unit_name && `- ${unit.unit_name}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_type">Job Type *</Label>
            <Select value={formData.job_type} onValueChange={(value) => setFormData(prev => ({ ...prev, job_type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="hvac">HVAC</SelectItem>
                <SelectItem value="painting">Painting</SelectItem>
                <SelectItem value="carpentry">Carpentry</SelectItem>
                <SelectItem value="appliance_repair">Appliance Repair</SelectItem>
                <SelectItem value="general_maintenance">General Maintenance</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the job in detail"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              placeholder="Estimated budget"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferred_schedule">Preferred Schedule</Label>
            <Input
              id="preferred_schedule"
              type="datetime-local"
              value={formData.preferred_schedule}
              onChange={(e) => setFormData(prev => ({ ...prev, preferred_schedule: e.target.value }))}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting || !formData.unit_id} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post Job'
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
