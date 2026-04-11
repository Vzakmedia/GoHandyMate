
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from './MessageCard';

interface MessageCardOperationsProps {
  message: ChatMessage;
  currentUserId?: string;
  onUpdate?: (messageId: string, newMessage: string) => void;
  onDelete?: (messageId: string) => void;
}

export const useMessageCardOperations = ({
  message,
  currentUserId,
  onUpdate,
  onDelete
}: MessageCardOperationsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message.message);
  const [showReplies, setShowReplies] = useState(false);
  const { toast } = useToast();

  const isOwnMessage = currentUserId === message.user_id;

  const handleSaveEdit = async () => {
    try {
      const { error } = await supabase
        .from('community_messages')
        .update({ message: editedMessage.trim() })
        .eq('id', message.id);

      if (error) throw error;

      onUpdate?.(message.id, editedMessage.trim());
      setIsEditing(false);
      toast({
        title: "Message updated",
        description: "Your message has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating message:', error);
      toast({
        title: "Error",
        description: "Failed to update message",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('community_messages')
        .delete()
        .eq('id', message.id);

      if (error) throw error;

      onDelete?.(message.id);
      toast({
        title: "Message deleted",
        description: "Your message has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedMessage(message.message);
  };

  return {
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
  };
};
