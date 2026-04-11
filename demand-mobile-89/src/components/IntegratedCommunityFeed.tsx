
import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Users } from 'lucide-react';
import { MessagesList } from './community-chat/MessagesList';
import { MessageInput } from './community-chat/MessageInput';
import { useCommunityChat } from './community-chat/useCommunityChat';
import { useMessageOperations } from './community-chat/useMessageOperations';
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { CompactAdBanner } from './CompactAdBanner';

interface IntegratedCommunityFeedProps {
  selectedLocation: string;
}

export const IntegratedCommunityFeed = ({ selectedLocation }: IntegratedCommunityFeedProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, likedMessages, toggleLike, user, handleUpdateMessage, handleDeleteMessage } = useCommunityChat(selectedLocation);
  const messageOperations = useMessageOperations(user, selectedLocation);
  const { advertisements } = useAdvertisements();
  const [dismissedAds, setDismissedAds] = useState<Set<number>>(new Set());
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const activeAds = advertisements.filter(ad => 
    ad.status === 'active' && !dismissedAds.has(ad.id)
  );

  const handleDismissAd = (adId: number) => {
    setDismissedAds(prev => new Set([...prev, adId]));
    // Move to next ad if current one is dismissed
    if (activeAds.length > 1) {
      setCurrentAdIndex(prev => (prev + 1) % activeAds.length);
    }
  };

  // Auto-rotate ads every 10 seconds
  useEffect(() => {
    if (activeAds.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex(prev => (prev + 1) % activeAds.length);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [activeAds.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 h-full">
      <div className="max-w-2xl mx-auto">
        {/* Compact Ad Banner at Top */}
        {activeAds.length > 0 && (
          <div className="sticky top-24 sm:top-20 z-40 mb-4">
            <CompactAdBanner 
              ad={activeAds[currentAdIndex]} 
              onClose={() => handleDismissAd(activeAds[currentAdIndex].id)}
              showShovel={activeAds.length > 1}
            />
          </div>
        )}

        {/* Message Input - Facebook Style */}
        {user && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sticky top-32 sm:top-28 z-30">
            <div className="p-4">
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
            </div>
          </div>
        )}

        {/* Messages Feed */}
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Welcome to Your Community</h3>
              <p className="text-gray-500 px-4">Share what's happening in your neighborhood and connect with your neighbors!</p>
              {!user && (
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Join the Community
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <MessagesList
                    messages={[message]}
                    likedMessages={likedMessages}
                    onToggleLike={toggleLike}
                    onReply={messageOperations.handleReply}
                    currentUserId={user?.id}
                    onUpdateMessage={handleUpdateMessage}
                    onDeleteMessage={handleDeleteMessage}
                  />
                </div>
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Sign in prompt for non-users */}
        {!user && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-gray-700 mb-3 text-sm font-medium">Connect with your community</p>
                <p className="text-gray-500 mb-3 text-xs">Share updates, ask questions, and help your neighbors</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full text-sm font-medium">
                  Join Community
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
