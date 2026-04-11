
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface JobDetailsActionsProps {
  job: {
    id: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  };
  onJobUpdated: () => void;
  onClose: () => void;
}

export const JobDetailsActions = ({ job, onJobUpdated, onClose }: JobDetailsActionsProps) => {
  const [updating, setUpdating] = useState(false);

  const updateJobStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('job_requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', job.id);

      if (error) throw error;

      toast.success('Job status updated successfully');
      onJobUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Separator />
      <div className="space-y-4">
        <h3 className="font-medium">Quick Actions</h3>
        
        {/* Status Update */}
        <div className="flex flex-col sm:flex-row gap-3">
          {job.status === 'pending' && (
            <Button 
              onClick={() => updateJobStatus('in_progress')}
              disabled={updating}
              className="flex-1"
            >
              {updating ? 'Updating...' : 'Start Job'}
            </Button>
          )}
          
          {job.status === 'in_progress' && (
            <Button 
              onClick={() => updateJobStatus('completed')}
              disabled={updating}
              className="bg-green-600 hover:bg-green-700 flex-1"
            >
              {updating ? 'Updating...' : 'Mark Complete'}
            </Button>
          )}

          {(job.status === 'pending' || job.status === 'in_progress') && (
            <Button 
              variant="destructive" 
              onClick={() => updateJobStatus('cancelled')}
              disabled={updating}
              className="flex-1"
            >
              Cancel Job
            </Button>
          )}
        </div>

        {/* Communication Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex-1">
            <MessageSquare className="w-4 h-4 mr-2" />
            Message Support
          </Button>
          <Button variant="outline" className="flex-1">
            <Edit className="w-4 h-4 mr-2" />
            Edit Job
          </Button>
        </div>
      </div>
    </>
  );
};
