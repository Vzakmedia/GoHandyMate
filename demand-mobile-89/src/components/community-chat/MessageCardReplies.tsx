
import { ChatMessage } from './MessageCard';
import { MessageCard } from './MessageCard';

interface MessageCardRepliesProps {
  message: ChatMessage;
  mainReplies: ChatMessage[];
  showReplies: boolean;
  onToggleLike: (messageId: string) => void;
  onReply: (message: ChatMessage) => void;
  currentUserId?: string;
  onUpdate?: (messageId: string, newMessage: string) => void;
  onDelete?: (messageId: string) => void;
  onSubmitReply?: (messageId: string, replyText: string) => void;
}

export const MessageCardReplies = ({
  message,
  mainReplies,
  showReplies,
  onToggleLike,
  onReply,
  currentUserId,
  onUpdate,
  onDelete,
  onSubmitReply
}: MessageCardRepliesProps) => {
  if (mainReplies.length === 0 || !showReplies) {
    return null;
  }

  return (
    <div className="bg-gray-50 border-t border-gray-100">
      <div className="px-4 py-2">
        {mainReplies.map((reply) => (
          <MessageCard
            key={reply.id}
            message={reply}
            isLiked={false}
            onToggleLike={onToggleLike}
            onReply={onReply}
            currentUserId={currentUserId}
            onUpdate={onUpdate}
            onDelete={onDelete}
            isReply={true}
            onSubmitReply={onSubmitReply}
          />
        ))}
      </div>
    </div>
  );
};
