
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface JobStatusUpdaterProps {
  jobId: string;
  currentStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  onStatusUpdated: () => void;
  size?: 'sm' | 'default';
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-700' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-700' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-700' }
] as const;

type StatusType = typeof statusOptions[number]['value'];

export const JobStatusUpdater = ({ jobId, currentStatus, onStatusUpdated, size = 'default' }: JobStatusUpdaterProps) => {
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusType>(currentStatus);

  const updateStatus = async (newStatus: StatusType) => {
    if (newStatus === currentStatus) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('job_requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      if (error) throw error;

      toast.success('Job status updated successfully');
      onStatusUpdated();
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
      setSelectedStatus(currentStatus); // Reset on error
    } finally {
      setUpdating(false);
    }
  };

  const currentStatusOption = statusOptions.find(option => option.value === currentStatus);

  return (
    <div className="flex items-center gap-2">
      <Badge className={currentStatusOption?.color} variant="outline">
        {currentStatusOption?.label}
      </Badge>
      
      <Select 
        value={selectedStatus} 
        onValueChange={(value) => {
          const typedValue = value as StatusType;
          setSelectedStatus(typedValue);
          updateStatus(typedValue);
        }}
        disabled={updating}
      >
        <SelectTrigger className={size === 'sm' ? 'h-8 w-32' : 'w-40'}>
          <SelectValue placeholder="Update status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${option.color.split(' ')[0]}`}></div>
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
