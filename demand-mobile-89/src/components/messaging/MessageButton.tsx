
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { JobMessagingModal } from './JobMessagingModal';

interface MessageButtonProps {
  jobId: string;
  jobTitle: string;
  jobStatus: string;
  otherParticipantId: string;
  otherParticipantName: string;
  jobUpdatedAt?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default';
  className?: string;
}

export const MessageButton = ({
  jobId,
  jobTitle,
  jobStatus,
  otherParticipantId,
  otherParticipantName,
  jobUpdatedAt,
  variant = 'outline',
  size = 'sm',
  className
}: MessageButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if messaging should be disabled
  const isDisabled = (() => {
    // Disable for cancelled regular jobs
    if (jobStatus === 'cancelled' && !jobId.startsWith('quote-')) {
      return true;
    }

    // Disable for completed jobs after 48 hours
    if (jobStatus === 'completed' && jobUpdatedAt) {
      const completedTime = new Date(jobUpdatedAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - completedTime.getTime()) / (1000 * 60 * 60);
      return hoursDiff > 48;
    }

    return false;
  })();

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsModalOpen(true)}
        disabled={isDisabled}
        className={className}
      >
        <MessageCircle className="w-4 h-4" />
        Message
      </Button>

      <JobMessagingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobId={jobId}
        jobTitle={jobTitle}
        jobStatus={jobStatus}
        jobUpdatedAt={jobUpdatedAt}
        otherParticipantId={otherParticipantId}
        otherParticipantName={otherParticipantName}
      />
    </>
  );
};
