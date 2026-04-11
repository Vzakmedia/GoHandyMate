
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { ChatMessage } from './MessageCard';

interface ReplySectionProps {
  message: ChatMessage;
  onSubmitReply: (messageId: string, replyText: string) => void;
  currentUserId?: string;
  showReplies: boolean;
}

export const ReplySection = ({ 
  message, 
  onSubmitReply, 
  currentUserId, 
  showReplies 
}: ReplySectionProps) => {
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentUserId) return;
    
    setIsSubmitting(true);
    try {
      await onSubmitReply(message.id, replyText.trim());
      setReplyText('');
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUserId) return null;

  return (
    <div className="mt-3">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
            You
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-3 py-2">
          <Input
            placeholder="Write a comment..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 focus:border-none shadow-none p-0 text-sm"
          />
          
          {replyText.trim() && (
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              variant="ghost"
              className="ml-2 p-1 h-auto text-blue-600 hover:text-blue-700 hover:bg-transparent"
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
