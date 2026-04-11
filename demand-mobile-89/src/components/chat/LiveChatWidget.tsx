import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { useChat } from '@/hooks/useChat';
import { useToast } from '@/hooks/use-toast';

export const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [minimized, setMinimized] = useState(false);
  const { createSession } = useChat();
  const { toast } = useToast();

  const handleOpenChat = async () => {
    if (!sessionId) {
      const newSessionId = await createSession('Live Chat Support');
      if (newSessionId) {
        setSessionId(newSessionId);
        setIsOpen(true);
        setMinimized(false);
        toast({
          title: "Chat Started",
          description: "You're now connected to our support team",
        });
      }
    } else {
      setIsOpen(true);
      setMinimized(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSessionId(null);
    setMinimized(false);
  };

  const handleMinimize = () => {
    if (minimized) {
      setMinimized(false);
    } else {
      setMinimized(true);
    }
  };

  if (!isOpen && !minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleOpenChat}
          className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <ChatInterface
      sessionId={sessionId || undefined}
      onClose={handleClose}
      onMinimize={handleMinimize}
      minimized={minimized}
    />
  );
};