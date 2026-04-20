
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/features/auth';
import { X, Plus } from 'lucide-react';
import { useAddUnitForm } from '@/hooks/useAddUnitForm';
import { submitUnitForm } from '@/utils/unitFormSubmission';
import { UnitBasicInfo } from './forms/UnitBasicInfo';
import { PropertySelector } from './PropertySelector';
import { TenantInfo } from './forms/TenantInfo';
import { UnitDetails } from './forms/UnitDetails';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnitAdded: (unitData?: any) => void;
  propertyId?: string;
}

export const AddUnitModal = ({ isOpen, onClose, onUnitAdded, propertyId }: AddUnitModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(propertyId || '');
  const { formData, handleInputChange, handleTagsChange, resetForm } = useAddUnitForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add a unit.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedPropertyId) {
      toast({
        title: "Property Required",
        description: "Please select an approved property first.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const unitData = {
        ...formData,
        property_id: selectedPropertyId
      };

      await submitUnitForm(unitData, user.id);

      toast({
        title: "Unit Added Successfully",
        description: `Unit ${formData.unit_number} has been added to the approved property.`,
      });

      resetForm();
      setSelectedPropertyId('');
      onUnitAdded(unitData);
      onClose();

    } catch (error: any) {
      console.error('Error adding unit:', error);
      const errorMessage = error.message?.includes('not approved') 
        ? "Units can only be added to approved properties."
        : "Failed to add unit. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add New Unit</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <UnitBasicInfo formData={formData} onInputChange={handleInputChange} />
          <PropertySelector 
            selectedPropertyId={selectedPropertyId}
            onPropertyChange={setSelectedPropertyId}
          />
          <TenantInfo formData={formData} onInputChange={handleInputChange} />
          <UnitDetails 
            formData={formData} 
            onInputChange={handleInputChange} 
            onTagsChange={handleTagsChange} 
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Unit</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
