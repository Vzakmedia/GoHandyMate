
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from './MessageCard';

export const useMessageOperations = (user: any, selectedLocation: string) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `community_images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('community_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('community_images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = async () => {
    if ((!newMessage.trim() && !selectedImage) || !user) return;

    try {
      let imageUrl = null;
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
        if (!imageUrl) return;
      }

      const messageData = {
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email || 'Anonymous',
        message: newMessage.trim() || (imageUrl ? 'Shared an image' : ''),
        location: selectedLocation,
        likes_count: 0,
        replies_count: 0,
        image_url: imageUrl,
        reply_to_id: replyingTo?.id || null,
        reply_to_message: replyingTo?.message || null,
        reply_to_user: replyingTo?.user_name || null,
      };

      const { error } = await supabase
        .from('community_messages')
        .insert([messageData]);

      if (error) throw error;

      setNewMessage('');
      setSelectedImage(null);
      setReplyingTo(null);
      
      toast({
        title: "Message sent!",
        description: "Your message has been posted to the community",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  return {
    newMessage,
    setNewMessage,
    selectedImage,
    setSelectedImage,
    replyingTo,
    uploading,
    sendMessage,
    handleReply,
    cancelReply
  };
};
