
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';
import { Loader2, CheckCircle } from 'lucide-react';

interface AcceptJobButtonProps {
  jobId: string;
  onJobAccepted: () => void;
}

export const AcceptJobButton = ({ jobId, onJobAccepted }: AcceptJobButtonProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAcceptJob = async () => {
    if (!user) {
      toast.error('You must be logged in to accept jobs');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('handle-job-assignment', {
        body: { 
          jobId,
          handymanId: user.id,
          action: 'accept'
        }
      });

      if (error) throw error;
      
      if (data.success) {
        toast.success('Job accepted successfully!');
        onJobAccepted();
      } else {
        toast.error(data.error || 'Failed to accept job');
      }
    } catch (error: any) {
      console.error('Error accepting job:', error);
      toast.error('Failed to accept job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleAcceptJob}
      disabled={loading}
      className="w-full bg-green-600 hover:bg-green-700"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Accepting...
        </>
      ) : (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Accept Job
        </>
      )}
    </Button>
  );
};
