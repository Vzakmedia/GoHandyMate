
import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useJobMessages } from '@/hooks/useJobMessages';
import { useAuth } from '@/features/auth';
import { Send, MessageCircle, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobMessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  otherParticipantId: string;
  otherParticipantName: string;
  jobStatus: string;
  jobUpdatedAt?: string;
}

export const JobMessagingModal = ({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  otherParticipantId,
  otherParticipantName,
  jobStatus,
  jobUpdatedAt
}: JobMessagingModalProps) => {
  const { user } = useAuth();
  const { messages, loading, sending, sendMessage } = useJobMessages(jobId);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    await sendMessage(newMessage, otherParticipantId);
    setNewMessage('');
  };

  // Check if messaging should be disabled
  const isMessagingDisabled = () => {
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
  };

  const messagingDisabled = isMessagingDisabled();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat - {jobTitle}
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                Messaging with {otherParticipantName}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {messagingDisabled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              {jobStatus === 'cancelled' 
                ? 'Messaging is disabled for cancelled jobs.'
                : 'Messaging is disabled for jobs completed more than 48 hours ago.'
              }
            </p>
          </div>
        )}

        <ScrollArea className="flex-1 px-1" ref={scrollAreaRef}>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.sender_id === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message_text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-green-100' : 'text-gray-500'
                        }`}
                      >
                        {formatDistanceToNow(new Date(message.created_at), {
                          addSuffix: true
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {!messagingDisabled && (
          <form onSubmit={handleSendMessage} className="flex-shrink-0 mt-4">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={sending}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="bg-green-600 hover:bg-green-700"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
