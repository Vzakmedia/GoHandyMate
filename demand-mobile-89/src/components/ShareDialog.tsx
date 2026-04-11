import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Facebook, Twitter, MessageCircle } from 'lucide-react';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShare: (method: 'copy' | 'facebook' | 'twitter' | 'whatsapp') => void;
}

export const ShareDialog = ({ open, onOpenChange, onShare }: ShareDialogProps) => {
  const handleShare = (method: 'copy' | 'facebook' | 'twitter' | 'whatsapp') => {
    onShare(method);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Advertisement</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleShare('copy')}
            className="flex flex-col items-center space-y-2 h-20"
          >
            <Copy className="w-6 h-6" />
            <span className="text-sm">Copy Link</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleShare('facebook')}
            className="flex flex-col items-center space-y-2 h-20"
          >
            <Facebook className="w-6 h-6" />
            <span className="text-sm">Facebook</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleShare('twitter')}
            className="flex flex-col items-center space-y-2 h-20"
          >
            <Twitter className="w-6 h-6" />
            <span className="text-sm">Twitter</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => handleShare('whatsapp')}
            className="flex flex-col items-center space-y-2 h-20"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-sm">WhatsApp</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};