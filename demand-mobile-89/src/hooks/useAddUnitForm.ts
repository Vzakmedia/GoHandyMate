
import { useState } from 'react';

export interface AddUnitFormData {
  unit_number: string;
  unit_name: string;
  property_address: string;
  property_id: string;
  tenant_name: string;
  tenant_email: string;
  tenant_phone: string;
  status: string;
  notes: string;
  tags: string[];
}

export const useAddUnitForm = () => {
  const [formData, setFormData] = useState<AddUnitFormData>({
    unit_number: '',
    unit_name: '',
    property_address: '',
    property_id: '',
    tenant_name: '',
    tenant_email: '',
    tenant_phone: '',
    status: 'vacant',
    notes: '',
    tags: []
  });

  const handleInputChange = (field: keyof AddUnitFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, tags }));
  };

  const resetForm = () => {
    setFormData({
      unit_number: '',
      unit_name: '',
      property_address: '',
      property_id: '',
      tenant_name: '',
      tenant_email: '',
      tenant_phone: '',
      status: 'vacant',
      notes: '',
      tags: []
    });
  };

  return {
    formData,
    handleInputChange,
    handleTagsChange,
    resetForm
  };
};
