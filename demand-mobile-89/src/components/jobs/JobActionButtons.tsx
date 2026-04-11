
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, X, MessageSquare, Eye, Loader2 } from 'lucide-react';

interface JobActionButtonsProps {
  job: {
    id: number | string;
    status: string;
  };
  onJobStatusUpdate?: (jobId: string, newStatus: string) => void;
  onJobUpdated?: () => void;
  onViewDetails?: () => void;
}

export const JobActionButtons = ({ job, onJobStatusUpdate, onJobUpdated, onViewDetails }: JobActionButtonsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateJobStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      console.log('Updating job status:', { jobId: job.id, newStatus, currentStatus: job.status });
      
      const { data, error } = await supabase
        .from('job_requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', job.id.toString())
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Job status updated successfully:', data);
      
      const statusMessages = {
        'completed': 'Job completed successfully!',
        'cancelled': 'Job cancelled successfully!',
        'in_progress': 'Job started successfully!'
      };
      
      toast.success(statusMessages[newStatus as keyof typeof statusMessages] || 'Job status updated successfully!');
      
      // Call the callback to refresh the job list
      if (onJobStatusUpdate) {
        onJobStatusUpdate(job.id.toString(), newStatus);
      }
      if (onJobUpdated) {
        onJobUpdated();
      }
    } catch (error: any) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status: ' + (error.message || 'Unknown error'));
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        size="sm" 
        variant="outline"
        onClick={onViewDetails}
        className="flex-1 sm:flex-none"
      >
        <Eye className="w-4 h-4 mr-1" />
        Details
      </Button>

      {(job.status === 'pending' || job.status === 'new_request') && (
        <Button 
          size="sm" 
          className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
          onClick={() => updateJobStatus('in_progress')}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <Check className="w-4 h-4 mr-1" />
          )}
          Start Job
        </Button>
      )}

      {job.status === 'in_progress' && (
        <Button 
          size="sm" 
          className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
          onClick={() => updateJobStatus('completed')}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <Check className="w-4 h-4 mr-1" />
          )}
          Complete
        </Button>
      )}

      {(job.status === 'pending' || job.status === 'new_request') && (
        <Button 
          size="sm" 
          variant="destructive"
          onClick={() => updateJobStatus('cancelled')}
          disabled={isUpdating}
          className="flex-1 sm:flex-none"
        >
          {isUpdating ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <X className="w-4 h-4 mr-1" />
          )}
          Decline
        </Button>
      )}

      <Button 
        size="sm" 
        variant="outline"
        className="flex-1 sm:flex-none"
      >
        <MessageSquare className="w-4 h-4 mr-1" />
        Message
      </Button>
    </div>
  );
};
