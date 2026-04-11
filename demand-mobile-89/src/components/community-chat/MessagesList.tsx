
import { MessageCircle } from 'lucide-react';
import { MessageCard, ChatMessage } from './MessageCard';

interface MessagesListProps {
  messages: ChatMessage[];
  likedMessages: Set<string>;
  onToggleLike: (messageId: string) => void;
  onReply: (message: ChatMessage) => void;
  currentUserId?: string;
  onUpdateMessage?: (messageId: string, newMessage: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onSubmitReply?: (messageId: string, replyText: string) => void;
}

export const MessagesList = ({ 
  messages, 
  likedMessages, 
  onToggleLike, 
  onReply,
  currentUserId,
  onUpdateMessage,
  onDeleteMessage,
  onSubmitReply
}: MessagesListProps) => {
  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No messages yet. Start the conversation!</p>
      </div>
    );
  }

  // Group messages to show main messages and their replies
  const mainMessages = messages.filter(msg => !msg.reply_to_id);
  const repliesMap = messages.reduce((acc, msg) => {
    if (msg.reply_to_id) {
      if (!acc[msg.reply_to_id]) {
        acc[msg.reply_to_id] = [];
      }
      acc[msg.reply_to_id].push(msg);
    }
    return acc;
  }, {} as Record<string, ChatMessage[]>);

  // Attach replies to main messages
  const messagesWithReplies = mainMessages.map(msg => ({
    ...msg,
    replies: repliesMap[msg.id] || []
  }));

  return (
    <div className="w-full">
      {messagesWithReplies.map((message) => (
        <MessageCard
          key={message.id}
          message={message}
          isLiked={likedMessages.has(message.id)}
          onToggleLike={onToggleLike}
          onReply={onReply}
          currentUserId={currentUserId}
          onUpdate={onUpdateMessage}
          onDelete={onDeleteMessage}
          onSubmitReply={onSubmitReply}
        />
      ))}
    </div>
  );
};
