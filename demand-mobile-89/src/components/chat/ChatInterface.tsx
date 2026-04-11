import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, X, Minimize2 } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { format } from 'date-fns';

interface ChatInterfaceProps {
  sessionId?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  minimized?: boolean;
}

export const ChatInterface = ({ 
  sessionId, 
  onClose, 
  onMinimize, 
  minimized = false 
}: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const { 
    messages, 
    session, 
    loading, 
    sending, 
    otherUserTyping,
    sendMessage, 
    markAsRead,
    handleTyping,
    stopTyping
  } = useChat(sessionId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (sessionId && !minimized) {
      markAsRead();
    }
  }, [messages, minimized, sessionId, markAsRead]);

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    
    await sendMessage(message);
    setMessage('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Start typing
    handleTyping();
    
    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const handleInputBlur = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    stopTyping();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onMinimize}
          className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 z-50 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <h3 className="text-sm font-semibold">Live Support</h3>
            {session && (
              <Badge 
                variant={session.status === 'active' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {session.status}
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {onMinimize && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onMinimize}
                className="w-6 h-6 p-0"
              >
                <Minimize2 className="w-3 h-3" />
              </Button>
            )}
            {onClose && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="w-6 h-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        <ScrollArea className="h-64 px-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Start a conversation...
            </div>
          ) : (
            <div className="space-y-3 py-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_type === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                      msg.sender_type === 'customer'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                     <p className="whitespace-pre-wrap">{msg.content || msg.message}</p>
                     <div className="flex items-center justify-between mt-1">
                       <p className="text-xs opacity-70">
                         {format(new Date(msg.created_at), 'HH:mm')}
                       </p>
                       {msg.sender_type === 'customer' && (
                         <div className="text-xs opacity-70">
                           {msg.is_read ? '✓✓' : '✓'}
                         </div>
                       )}
                     </div>
                  </div>
                </div>
               ))}
               {otherUserTyping && (
                 <div className="flex justify-start">
                   <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                     <div className="flex space-x-1">
                       <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                       <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                       <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                     </div>
                   </div>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="p-3 pt-2">
        <div className="flex space-x-2 w-full">
           <Input
             value={message}
             onChange={handleInputChange}
             onKeyPress={handleKeyPress}
             onBlur={handleInputBlur}
             placeholder="Type your message..."
             disabled={sending || !sessionId}
             className="flex-1"
           />
          <Button
            onClick={handleSend}
            disabled={!message.trim() || sending || !sessionId}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};