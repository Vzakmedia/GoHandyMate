
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Advertisement } from '@/hooks/useAdvertisements';

interface EditAdDialogProps {
  advertisement: Advertisement | null;
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const EditAdDialog = ({ advertisement, open, onClose, onSave }: EditAdDialogProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    ad_title: advertisement?.ad_title || '',
    ad_description: advertisement?.ad_description || '',
    target_zip_codes: advertisement?.target_zip_codes?.join(', ') || '',
    target_audience: advertisement?.target_audience || 'all',
    auto_renew: advertisement?.auto_renew || false,
  });

  const handleSave = async () => {
    if (!advertisement) return;

    setSaving(true);
    try {
      const zipCodes = formData.target_zip_codes
        .split(',')
        .map(zip => zip.trim())
        .filter(zip => zip.length > 0);

      const { error } = await supabase
        .from('advertisements')
        .update({
          ad_title: formData.ad_title,
          ad_description: formData.ad_description,
          target_zip_codes: zipCodes,
          target_audience: formData.target_audience,
          auto_renew: formData.auto_renew,
          updated_at: new Date().toISOString()
        })
        .eq('id', advertisement.id);

      if (error) throw error;

      toast({
        title: "Advertisement Updated",
        description: "Your advertisement has been successfully updated.",
      });

      onSave();
      onClose();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update advertisement.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (!advertisement) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Advertisement</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="ad_title">Advertisement Title</Label>
            <Input
              id="ad_title"
              value={formData.ad_title}
              onChange={(e) => setFormData(prev => ({ ...prev, ad_title: e.target.value }))}
              placeholder="Enter advertisement title"
            />
          </div>

          <div>
            <Label htmlFor="ad_description">Description</Label>
            <Textarea
              id="ad_description"
              value={formData.ad_description}
              onChange={(e) => setFormData(prev => ({ ...prev, ad_description: e.target.value }))}
              placeholder="Describe your service or business"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="target_zip_codes">Target Zip Codes (comma-separated)</Label>
            <Input
              id="target_zip_codes"
              value={formData.target_zip_codes}
              onChange={(e) => setFormData(prev => ({ ...prev, target_zip_codes: e.target.value }))}
              placeholder="e.g., 10001, 10002, 10003"
            />
          </div>

          <div>
            <Label htmlFor="target_audience">Target Audience</Label>
            <Select
              value={formData.target_audience}
              onValueChange={(value) => setFormData(prev => ({ ...prev, target_audience: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select target audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="customers">Customers Only</SelectItem>
                <SelectItem value="property_managers">Property Managers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="auto_renew"
              checked={formData.auto_renew}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, auto_renew: checked as boolean }))
              }
            />
            <Label htmlFor="auto_renew">Auto-renew advertisement</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
