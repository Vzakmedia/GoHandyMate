
import { useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users } from 'lucide-react';
import { MessagesList } from './community-chat/MessagesList';
import { MessageInput } from './community-chat/MessageInput';
import { useCommunityChat } from './community-chat/useCommunityChat';
import { useMessageOperations } from './community-chat/useMessageOperations';

interface LiveChatSectionProps {
  selectedLocation: string;
}

export const LiveChatSection = ({ selectedLocation }: LiveChatSectionProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, likedMessages, toggleLike, user, handleUpdateMessage, handleDeleteMessage } = useCommunityChat(selectedLocation);
  const messageOperations = useMessageOperations(user, selectedLocation);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Live Community Chat</h3>
              <p className="text-sm text-gray-600">
                Connect with neighbors in {selectedLocation}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <Users className="w-3 h-3 mr-1" />
            {messages.length} messages
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Messages List */}
        <div className="max-h-96 overflow-y-auto space-y-3 border rounded-lg p-4 bg-gray-50">
          <MessagesList
            messages={messages}
            likedMessages={likedMessages}
            onToggleLike={toggleLike}
            onReply={messageOperations.handleReply}
            currentUserId={user?.id}
            onUpdateMessage={handleUpdateMessage}
            onDeleteMessage={handleDeleteMessage}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        {user ? (
          <MessageInput
            newMessage={messageOperations.newMessage}
            setNewMessage={messageOperations.setNewMessage}
            selectedImage={messageOperations.selectedImage}
            setSelectedImage={messageOperations.setSelectedImage}
            replyingTo={messageOperations.replyingTo}
            onCancelReply={messageOperations.cancelReply}
            onSendMessage={messageOperations.sendMessage}
            uploading={messageOperations.uploading}
          />
        ) : (
          <div className="text-center py-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Sign in to join the conversation</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
