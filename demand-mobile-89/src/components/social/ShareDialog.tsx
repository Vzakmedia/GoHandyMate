import { useState } from 'react';
import { Share2, Copy, Facebook, Twitter, MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ShareDialogProps {
  messageId: string;
  onShare: (messageId: string, method: 'copy' | 'facebook' | 'twitter' | 'whatsapp') => void;
  children?: React.ReactNode;
}

export const ShareDialog = ({ messageId, onShare, children }: ShareDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = (method: 'copy' | 'facebook' | 'twitter' | 'whatsapp') => {
    onShare(messageId, method);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="flex-1 text-gray-600 hover:text-green-600">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button
            variant="outline"
            className="flex flex-col items-center space-y-2 h-auto py-4"
            onClick={() => handleShare('copy')}
          >
            <Copy className="w-6 h-6" />
            <span className="text-sm">Copy Link</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center space-y-2 h-auto py-4"
            onClick={() => handleShare('whatsapp')}
          >
            <MessageCircle className="w-6 h-6 text-green-600" />
            <span className="text-sm">WhatsApp</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center space-y-2 h-auto py-4"
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="w-6 h-6 text-blue-600" />
            <span className="text-sm">Facebook</span>
          </Button>
          
          <Button
            variant="outline"
            className="flex flex-col items-center space-y-2 h-auto py-4"
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="w-6 h-6 text-blue-400" />
            <span className="text-sm">Twitter</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};