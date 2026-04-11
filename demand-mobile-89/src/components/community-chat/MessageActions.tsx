
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, Send, MoreHorizontal } from 'lucide-react';
import { FacebookStyleReactions } from '@/components/community/FacebookStyleReactions';
import { ChatMessage } from './MessageCard';

interface MessageActionsProps {
  message: ChatMessage;
  isLiked: boolean;
  onToggleLike: (messageId: string) => void;
  onReply: (message: ChatMessage) => void;
  isReply: boolean;
  mainRepliesCount: number;
  showReplies: boolean;
  onToggleReplies: () => void;
  currentUserId?: string;
  onSubmitReply?: (messageId: string, replyText: string) => void;
}

export const MessageActions = ({ 
  message, 
  isLiked, 
  onToggleLike, 
  onReply, 
  isReply,
  mainRepliesCount,
  showReplies,
  onToggleReplies,
  currentUserId,
  onSubmitReply
}: MessageActionsProps) => {
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReactionBar, setShowReactionBar] = useState(false);
  
  // Mock reaction data - in real app this would come from props or API
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({
    like: message.likes_count || 0,
    love: 0,
    laugh: 0,
    wow: 0,
    sad: 0,
    angry: 0
  });
  const [currentReaction, setCurrentReaction] = useState<string>(isLiked ? 'like' : '');

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUserId || !onSubmitReply) return;
    
    setIsSubmitting(true);
    try {
      await onSubmitReply(message.id, commentText.trim());
      setCommentText('');
      setShowCommentBox(false);
      // Show replies after commenting
      if (!showReplies) {
        onToggleReplies();
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentClick = () => {
    setShowCommentBox(!showCommentBox);
    // Also toggle replies to show existing comments
    if (!showReplies) {
      onToggleReplies();
    }
  };

  const handleReaction = (messageId: string, reactionType: string) => {
    // Update local reaction state
    const prevReaction = currentReaction;
    setCurrentReaction(reactionType === prevReaction ? '' : reactionType);
    
    // Update reaction counts
    setReactionCounts(prev => {
      const newCounts = { ...prev };
      if (prevReaction) {
        newCounts[prevReaction] = Math.max(0, newCounts[prevReaction] - 1);
      }
      if (reactionType && reactionType !== prevReaction) {
        newCounts[reactionType] = (newCounts[reactionType] || 0) + 1;
      }
      return newCounts;
    });

    // Call the original like handler for now (in real app, would call reaction handler)
    if (reactionType === 'like' || reactionType === '') {
      onToggleLike(messageId);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      {/* Reaction counts and comments - Facebook style */}
      {(Object.values(reactionCounts).some(count => count > 0) || mainRepliesCount > 0) && (
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3 px-1">
          <div className="flex items-center space-x-2">
            {Object.values(reactionCounts).some(count => count > 0) && (
              <div className="flex items-center space-x-1">
                <div className="flex -space-x-1">
                  {Object.entries(reactionCounts)
                    .filter(([, count]) => count > 0)
                    .slice(0, 3)
                    .map(([type]) => (
                      <div key={type} className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border border-white">
                        <span className="text-xs">
                          {type === 'like' ? '👍' : type === 'love' ? '❤️' : type === 'laugh' ? '😂' : 
                           type === 'wow' ? '😮' : type === 'sad' ? '😢' : '😡'}
                        </span>
                      </div>
                    ))}
                </div>
                <span className="text-gray-600 hover:underline cursor-pointer">
                  {Object.values(reactionCounts).reduce((sum, count) => sum + count, 0)}
                </span>
              </div>
            )}
          </div>
          {!isReply && mainRepliesCount > 0 && (
            <button
              onClick={onToggleReplies}
              className="text-gray-500 hover:underline text-sm flex items-center space-x-1"
            >
              <span>{mainRepliesCount} {mainRepliesCount === 1 ? 'comment' : 'comments'}</span>
              {showReplies && <span>•</span>}
              {showReplies && <span>Hide</span>}
            </button>
          )}
        </div>
      )}

      {/* Action buttons - Facebook style */}
      <div className="flex items-center border-t border-gray-100 pt-2">
        <div className="flex items-center flex-1 relative">
          <FacebookStyleReactions
            messageId={message.id}
            currentReaction={currentReaction}
            reactionCounts={reactionCounts}
            onReact={handleReaction}
            showReactionBar={showReactionBar}
            onShowReactionBar={setShowReactionBar}
          />
          
          <Button 
            variant="ghost"
            size="sm"
            onClick={handleCommentClick}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 mx-2 rounded-md transition-colors ${
              showCommentBox 
                ? 'text-blue-600 hover:bg-blue-50' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Comment</span>
          </Button>
          
          <Button 
            variant="ghost"
            size="sm"
            className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-md text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <Share className="w-5 h-5" />
            <span className="font-medium">Share</span>
          </Button>

          <Button 
            variant="ghost"
            size="sm"
            className="p-2 text-gray-500 hover:bg-gray-50 transition-colors rounded-full"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Comment input box dropdown - Facebook style */}
      {showCommentBox && currentUserId && (
        <div className="mt-3 px-3 py-2 bg-gray-50 rounded-lg">
          <form onSubmit={handleCommentSubmit} className="flex items-start space-x-2">
            <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
              <AvatarFallback className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {currentUserId.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="bg-white rounded-2xl px-4 py-2 border border-gray-200 shadow-sm">
                <Input
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 focus:border-none shadow-none p-0 text-sm placeholder-gray-500"
                  disabled={isSubmitting}
                />
              </div>
              
              {commentText.trim() && (
                <div className="flex justify-end mt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-xs"
                  >
                    {isSubmitting ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
