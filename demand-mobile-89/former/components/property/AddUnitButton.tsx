
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AddressInput } from '@/components/ui/address-input';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';

interface AddUnitButtonProps {
  onUnitAdded?: () => void;
}

export const AddUnitButton = ({ onUnitAdded }: AddUnitButtonProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    unit_number: '',
    unit_name: '',
    property_address: '',
    property_id: '',
    tenant_name: '',
    tenant_email: '',
    tenant_phone: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to add units');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('units')
        .insert({
          ...formData,
          manager_id: user.id,
          status: 'vacant'
        });

      if (error) throw error;

      toast.success('Unit added successfully!');
      setOpen(false);
      setFormData({
        unit_number: '',
        unit_name: '',
        property_address: '',
        property_id: '',
        tenant_name: '',
        tenant_email: '',
        tenant_phone: '',
        notes: ''
      });
      onUnitAdded?.();
    } catch (error: any) {
      console.error('Error adding unit:', error);
      toast.error('Failed to add unit');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Unit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Unit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unit_number">Unit Number *</Label>
            <Input
              id="unit_number"
              value={formData.unit_number}
              onChange={(e) => setFormData(prev => ({ ...prev, unit_number: e.target.value }))}
              placeholder="e.g., 101, A-1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="property_address">Property Address *</Label>
            <AddressInput
              value={formData.property_address}
              onChange={(value) => setFormData(prev => ({ ...prev, property_address: value }))}
              onAddressSelect={(details) => {
                setFormData(prev => ({ ...prev, property_address: details.formatted_address }));
              }}
              placeholder="Start typing property address..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="property_id">Property ID *</Label>
            <Input
              id="property_id"
              value={formData.property_id}
              onChange={(e) => setFormData(prev => ({ ...prev, property_id: e.target.value }))}
              placeholder="Property identifier"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit_name">Unit Name (Optional)</Label>
            <Input
              id="unit_name"
              value={formData.unit_name}
              onChange={(e) => setFormData(prev => ({ ...prev, unit_name: e.target.value }))}
              placeholder="e.g., Corner Suite"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenant_name">Tenant Name</Label>
            <Input
              id="tenant_name"
              value={formData.tenant_name}
              onChange={(e) => setFormData(prev => ({ ...prev, tenant_name: e.target.value }))}
              placeholder="Current tenant name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenant_email">Tenant Email</Label>
            <Input
              id="tenant_email"
              type="email"
              value={formData.tenant_email}
              onChange={(e) => setFormData(prev => ({ ...prev, tenant_email: e.target.value }))}
              placeholder="tenant@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tenant_phone">Tenant Phone</Label>
            <Input
              id="tenant_phone"
              value={formData.tenant_phone}
              onChange={(e) => setFormData(prev => ({ ...prev, tenant_phone: e.target.value }))}
              placeholder="Phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about the unit"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Unit'
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
