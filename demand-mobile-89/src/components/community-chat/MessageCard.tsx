
import { ReplyIndicator } from './ReplyIndicator';
import { MessageHeader } from './MessageHeader';
import { MessageCardContent } from './MessageCardContent';
import { MessageActions } from './MessageActions';
import { MessageCardReplies } from './MessageCardReplies';
import { useMessageCardOperations } from './MessageCardOperations';

export interface ChatMessage {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  location: string;
  created_at: string;
  likes_count: number;
  replies_count: number;
  is_liked?: boolean;
  image_url?: string;
  reply_to_id?: string;
  reply_to_message?: string;
  reply_to_user?: string;
  profile?: {
    full_name?: string;
    avatar_url?: string;
  };
  replies?: ChatMessage[];
}

interface MessageCardProps {
  message: ChatMessage;
  isLiked: boolean;
  onToggleLike: (messageId: string) => void;
  onReply: (message: ChatMessage) => void;
  currentUserId?: string;
  onUpdate?: (messageId: string, newMessage: string) => void;
  onDelete?: (messageId: string) => void;
  isReply?: boolean;
  onSubmitReply?: (messageId: string, replyText: string) => void;
}

export const MessageCard = ({ 
  message, 
  isLiked, 
  onToggleLike, 
  onReply, 
  currentUserId,
  onUpdate,
  onDelete,
  isReply = false,
  onSubmitReply
}: MessageCardProps) => {
  const {
    isEditing,
    setIsEditing,
    editedMessage,
    setEditedMessage,
    showReplies,
    setShowReplies,
    isOwnMessage,
    handleSaveEdit,
    handleDelete,
    handleCancelEdit
  } = useMessageCardOperations({
    message,
    currentUserId,
    onUpdate,
    onDelete
  });

  const mainReplies = message.replies?.filter(reply => !reply.reply_to_id || reply.reply_to_id === message.id) || [];

  return (
    <div className={`bg-white ${isReply ? 'ml-8 mt-2 border-l-2 border-gray-100 pl-4' : 'border-b border-gray-100'}`}>
      <div className="p-4">
        {/* Reply indicator for main messages */}
        {!isReply && message.reply_to_id && (
          <ReplyIndicator 
            replyToUser={message.reply_to_user}
            replyToMessage={message.reply_to_message}
          />
        )}
        
        <MessageHeader
          message={message}
          isOwnMessage={isOwnMessage}
          onEdit={() => setIsEditing(true)}
          onDelete={handleDelete}
        />
        
        <MessageCardContent
          message={message}
          isEditing={isEditing}
          editedMessage={editedMessage}
          setEditedMessage={setEditedMessage}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={handleCancelEdit}
        />
        
        {/* Facebook-style action buttons */}
        <MessageActions
          message={message}
          isLiked={isLiked}
          onToggleLike={onToggleLike}
          onReply={onReply}
          isReply={isReply}
          mainRepliesCount={mainReplies.length}
          showReplies={showReplies}
          onToggleReplies={() => setShowReplies(!showReplies)}
          currentUserId={currentUserId}
          onSubmitReply={onSubmitReply}
        />
      </div>

      {/* Collapsible replies with Facebook-style layout */}
      {showReplies && (
        <MessageCardReplies
          message={message}
          mainReplies={mainReplies}
          showReplies={showReplies}
          onToggleLike={onToggleLike}
          onReply={onReply}
          currentUserId={currentUserId}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onSubmitReply={onSubmitReply}
        />
      )}
    </div>
  );
};
