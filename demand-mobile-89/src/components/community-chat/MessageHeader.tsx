
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChatMessage } from './MessageCard';

interface MessageHeaderProps {
  message: ChatMessage;
  isOwnMessage: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export const MessageHeader = ({ message, isOwnMessage, onEdit, onDelete }: MessageHeaderProps) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h`;
    const days = Math.floor(diffInHours / 24);
    return days === 1 ? '1d' : `${days}d`;
  };

  const getUserDisplayName = (message: ChatMessage) => {
    return message.profile?.full_name || message.user_name || 'Anonymous';
  };

  const getUserInitials = (message: ChatMessage) => {
    const name = getUserDisplayName(message);
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex items-start space-x-3 mb-2">
      {/* User Avatar */}
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarImage 
          src={message.profile?.avatar_url} 
          alt={getUserDisplayName(message)}
        />
        <AvatarFallback className="text-sm bg-blue-100 text-blue-700">
          {getUserInitials(message)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <span className="font-semibold text-gray-900 text-sm">
              {getUserDisplayName(message)}
            </span>
            <span className="text-xs text-gray-500">
              {formatTimeAgo(message.created_at)}
            </span>
          </div>
          
          {/* Options menu for own messages */}
          {isOwnMessage && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0 text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white shadow-lg border border-gray-200 z-50">
                <DropdownMenuItem onClick={onEdit} className="text-sm">
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-sm text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};
