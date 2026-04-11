import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessage } from '@/components/community-chat/MessageCard';
import { useAuth } from '@/features/auth';

interface CommentDialogProps {
  post: ChatMessage;
  onAddComment: (messageId: string, comment: string) => void;
  children?: React.ReactNode;
}

export const CommentDialog = ({ post, onAddComment, children }: CommentDialogProps) => {
  const [comment, setComment] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile } = useAuth();

  const handleSubmit = () => {
    if (comment.trim()) {
      onAddComment(post.id, comment);
      setComment('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="flex-1 text-gray-600 hover:text-green-600">
            <MessageCircle className="w-4 h-4 mr-2" />
            Comment
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
        </DialogHeader>
        
        {/* Original Post Preview */}
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={post.profile?.avatar_url} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                {(post.profile?.full_name || post.user_name).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{post.profile?.full_name || post.user_name}</span>
          </div>
          <p className="text-sm text-gray-700 line-clamp-3">{post.message}</p>
        </div>

        {/* Comment Input */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-green-100 text-green-700">
                {(profile?.full_name || user?.user_metadata?.full_name || user?.email)?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px] resize-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!comment.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Post Comment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};