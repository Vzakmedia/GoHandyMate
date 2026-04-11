import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';

interface Unit {
  id: string;
  unit_number: string;
  unit_name: string | null;
  property_address: string;
  property_id: string;
  status: string | null;
}

interface Property {
  id: string;
  address: string;
  units: Unit[];
}

export const usePropertyManagerUnits = () => {
  const { user, profile } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnits = async () => {
      if (!profile || profile.user_role !== 'property_manager') {
        setLoading(false);
        return;
      }

      try {
        const { data: units, error } = await supabase
          .from('units')
          .select('*')
          .eq('manager_id', user.id)
          .order('property_address', { ascending: true })
          .order('unit_number', { ascending: true });

        if (error) throw error;

        // Group units by property
        const propertyMap = new Map<string, Property>();
        
        units?.forEach(unit => {
          const propertyKey = `${unit.property_id}-${unit.property_address}`;
          
          if (!propertyMap.has(propertyKey)) {
            propertyMap.set(propertyKey, {
              id: unit.property_id,
              address: unit.property_address,
              units: []
            });
          }
          
          propertyMap.get(propertyKey)!.units.push(unit);
        });

        setProperties(Array.from(propertyMap.values()));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [user, profile]);

  return { properties, loading, error };
};