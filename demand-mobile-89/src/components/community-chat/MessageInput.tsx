
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Image } from 'lucide-react';
import { ChatMessage } from './MessageCard';
import { ReplyIndicator } from './ReplyIndicator';
import { useToast } from '@/hooks/use-toast';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  selectedImage: File | null;
  setSelectedImage: (file: File | null) => void;
  replyingTo: ChatMessage | null;
  onCancelReply: () => void;
  onSendMessage: () => void;
  uploading: boolean;
}

export const MessageInput = ({
  newMessage,
  setNewMessage,
  selectedImage,
  setSelectedImage,
  replyingTo,
  onCancelReply,
  onSendMessage,
  uploading
}: MessageInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getUserDisplayName = (message: ChatMessage) => {
    return message.profile?.full_name || message.user_name || 'Anonymous';
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
      } else {
        toast({
          title: "Invalid file",
          description: "Please select an image file",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* Reply indicator */}
      {replyingTo && (
        <div className="flex items-center justify-between p-2 bg-blue-50 rounded border-l-2 border-blue-400">
          <div>
            <p className="text-xs text-blue-600">Replying to {getUserDisplayName(replyingTo)}</p>
            <p className="text-sm text-gray-600 truncate">{replyingTo.message}</p>
          </div>
          <button
            onClick={onCancelReply}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      )}

      {/* Image preview */}
      {selectedImage && (
        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            className="w-12 h-12 object-cover rounded"
          />
          <span className="text-sm text-gray-600">{selectedImage.name}</span>
          <button
            onClick={() => setSelectedImage(null)}
            className="text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex space-x-3">
        <div className="flex-1">
          <Input
            placeholder="Share something with your community..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            className="w-full"
          />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-3"
        >
          <Image className="w-4 h-4" />
        </Button>
        <Button
          onClick={onSendMessage}
          disabled={(!newMessage.trim() && !selectedImage) || uploading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
