
import { supabase } from '@/integrations/supabase/client';
import { AddUnitFormData } from '@/hooks/useAddUnitForm';

export const submitUnitForm = async (formData: AddUnitFormData, userId: string) => {
  const { error } = await supabase
    .from('units')
    .insert([{
      manager_id: userId,
      unit_number: formData.unit_number,
      unit_name: formData.unit_name || null,
      property_address: formData.property_address,
      property_id: formData.property_id,
      tenant_name: formData.tenant_name || null,
      tenant_email: formData.tenant_email || null,
      tenant_phone: formData.tenant_phone || null,
      status: formData.status,
      notes: formData.notes || null,
      tags: formData.tags.length > 0 ? formData.tags : null
    }]);

  if (error) throw error;
};
