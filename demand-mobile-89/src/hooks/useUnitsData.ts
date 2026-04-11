
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Unit {
  id: string;
  property_id: string;
  unit_number: string;
  unit_name?: string;
  property_address: string;
  tenant_name?: string;
  tenant_phone?: string;
  tenant_email?: string;
  status: 'vacant' | 'occupied' | 'maintenance';
  notes?: string;
  tags?: string[];
  created_at: string;
}

export const useUnitsData = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUnits = async () => {
    try {
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the data to ensure proper typing
      const typedUnits: Unit[] = (data || []).map(unit => ({
        ...unit,
        status: unit.status as 'vacant' | 'occupied' | 'maintenance'
      }));
      
      setUnits(typedUnits);
    } catch (error) {
      console.error('Error fetching units:', error);
      toast.error('Failed to load units');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  return {
    units,
    loading,
    refetch: fetchUnits
  };
};
