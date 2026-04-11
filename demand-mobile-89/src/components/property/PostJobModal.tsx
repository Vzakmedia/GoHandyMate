
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Unit {
  id: string;
  unit_number: string;
  unit_name?: string;
  property_address: string;
}

interface PostJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  units: Unit[];
  selectedUnitId?: string;
  onJobPosted: () => void;
}

const jobTypes = [
  'Plumbing',
  'Electrical',
  'HVAC',
  'Cleaning',
  'Painting',
  'Flooring',
  'Appliance Repair',
  'Pest Control',
  'Landscaping',
  'General Maintenance',
  'Emergency Repair',
  'Other'
];

export const PostJobModal = ({ open, onOpenChange, units, selectedUnitId, onJobPosted }: PostJobModalProps) => {
  const [formData, setFormData] = useState({
    unitId: selectedUnitId || '',
    jobType: '',
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    preferredSchedule: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.unitId || !formData.jobType || !formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const selectedUnit = units.find(u => u.id === formData.unitId);
      
      const { error } = await supabase
        .from('job_requests')
        .insert({
          unit_id: formData.unitId,
          job_type: formData.jobType,
          title: formData.title,
          description: formData.description,
          location: selectedUnit?.property_address || '',
          category: formData.jobType,
          priority: formData.priority,
          preferred_schedule: formData.preferredSchedule ? new Date(formData.preferredSchedule).toISOString() : null,
          status: 'pending',
        });

      if (error) throw error;

      toast.success('Job request posted successfully!');
      onJobPosted();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        unitId: selectedUnitId || '',
        jobType: '',
        title: '',
        description: '',
        priority: 'medium',
        preferredSchedule: '',
      });
    } catch (error) {
      console.error('Error posting job:', error);
      toast.error('Failed to post job request');
    } finally {
      setLoading(false);
    }
  };

  const selectedUnit = units.find(u => u.id === formData.unitId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post Maintenance Job</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Select Unit *</Label>
              <Select value={formData.unitId} onValueChange={(value) => setFormData(prev => ({ ...prev, unitId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      Unit {unit.unit_number} {unit.unit_name ? `- ${unit.unit_name}` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedUnit && (
                <p className="text-sm text-gray-600">{selectedUnit.property_address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Select value={formData.jobType} onValueChange={(value) => setFormData(prev => ({ ...prev, jobType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Fix leaking faucet in bathroom"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Provide detailed description of the issue..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: any) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      Urgent
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule">Preferred Schedule</Label>
              <div className="relative">
                <Input
                  id="schedule"
                  type="datetime-local"
                  value={formData.preferredSchedule}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredSchedule: e.target.value }))}
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Upload Images (Optional)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Drag & drop images or click to upload</p>
              <p className="text-xs text-gray-500 mt-1">Support: JPG, PNG, GIF (max 5MB each)</p>
              <Button type="button" variant="outline" className="mt-2" size="sm">
                Choose Files
              </Button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Posting...' : 'Post Job Request'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
