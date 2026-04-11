
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RefreshCw } from 'lucide-react';
import { PendingUser } from '../types/verification';

interface RejectionDialogProps {
  showRejectDialog: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: PendingUser | null;
  rejectionReason: string;
  onReasonChange: (reason: string) => void;
  onReject: () => void;
  onCancel: () => void;
  processingUsers: Set<string>;
}

export const RejectionDialog = ({
  showRejectDialog,
  onOpenChange,
  selectedUser,
  rejectionReason,
  onReasonChange,
  onReject,
  onCancel,
  processingUsers
}: RejectionDialogProps) => {
  return (
    <Dialog open={showRejectDialog} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Account Application</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting {selectedUser?.full_name}'s account application.
            This reason will be stored and can be referenced later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Rejection Reason</label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Enter the reason for rejection..."
              className="mt-1"
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onReject}
              disabled={!rejectionReason.trim() || (selectedUser && processingUsers.has(selectedUser.id))}
            >
              {selectedUser && processingUsers.has(selectedUser.id) ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              Reject Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
