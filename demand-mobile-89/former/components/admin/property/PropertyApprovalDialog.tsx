import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle } from 'lucide-react';

interface Property {
  id: string;
  property_name: string;
  property_address: string;
  property_type: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

interface PropertyApprovalDialogProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (propertyId: string, action: 'approve' | 'reject', reason?: string) => Promise<void>;
}

export const PropertyApprovalDialog = ({
  property,
  open,
  onOpenChange,
  onAction,
}: PropertyApprovalDialogProps) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!property) return;

    setLoading(true);
    setActionType(action);

    try {
      await onAction(property.id, action, action === 'reject' ? rejectionReason : undefined);
      onOpenChange(false);
      setRejectionReason('');
      setActionType(null);
    } catch (error) {
      console.error('Error processing property action:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Property Review</DialogTitle>
          <DialogDescription>
            Review and approve or reject this property registration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium">{property.property_name}</h3>
            <p className="text-sm text-gray-600">{property.property_address}</p>
            <p className="text-sm text-gray-500">Type: {property.property_type}</p>
            <p className="text-xs text-gray-400">
              Manager: {property.profiles?.full_name} ({property.profiles?.email})
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Rejection Reason (if rejecting)</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Provide a reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          
          <Button
            variant="destructive"
            onClick={() => handleAction('reject')}
            disabled={loading || !rejectionReason.trim()}
            className="flex items-center gap-2"
          >
            {loading && actionType === 'reject' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            Reject
          </Button>
          
          <Button
            onClick={() => handleAction('approve')}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading && actionType === 'approve' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};