import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';

interface Property {
  id: string;
  property_name: string;
  property_address: string;
  property_type: string;
  total_units: number;
  city?: string;
  state?: string;
  zip_code?: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

interface Unit {
  id: string;
  unit_number: string;
  status: 'occupied' | 'vacant' | 'maintenance';
  rent_amount?: number;
  tenant_name?: string;
  tenant_email?: string;
  tenant_phone?: string;
  lease_start?: string;
  lease_end?: string;
  maintenance_requests?: number;
  created_at: string;
  updated_at: string;
}

export const usePropertyManagement = () => {
  const { user, session } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${session?.access_token}`,
    'Content-Type': 'application/json'
  });

  const fetchProperties = async () => {
    if (!user || !session) return;

    try {
      setLoading(true);
      console.log('Fetching properties...');

      const { data, error } = await supabase.functions.invoke('property-management', {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (error) throw error;

      setProperties(data.properties || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async (propertyId: string) => {
    if (!user || !session) return;

    try {
      setLoading(true);
      console.log(`Fetching units for property: ${propertyId}`);

      const { data, error } = await supabase.functions.invoke('property-management', {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (error) throw error;

      setUnits(data.units || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching units:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch units');
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (propertyData: Omit<Property, 'id' | 'total_units' | 'created_at' | 'updated_at'>) => {
    if (!user || !session) throw new Error('Not authenticated');

    try {
      console.log('Creating property:', propertyData);

      const { data, error } = await supabase.functions.invoke('property-management', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: propertyData,
      });

      if (error) throw error;

      setProperties(prev => [data.property, ...prev]);
      return data.property;
    } catch (err) {
      console.error('Error creating property:', err);
      throw err;
    }
  };

  const createUnit = async (propertyId: string, unitData: Omit<Unit, 'id' | 'created_at' | 'updated_at' | 'maintenance_requests'>) => {
    if (!user || !session) throw new Error('Not authenticated');

    try {
      console.log('Creating unit:', unitData);

      const { data, error } = await supabase.functions.invoke('property-management', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: unitData,
      });

      if (error) throw error;

      setUnits(prev => [data.unit, ...prev]);
      return data.unit;
    } catch (err) {
      console.error('Error creating unit:', err);
      throw err;
    }
  };

  const updateUnit = async (unitId: string, unitData: Partial<Unit>) => {
    if (!user || !session) throw new Error('Not authenticated');

    try {
      console.log('Updating unit:', unitId, unitData);

      const { data, error } = await supabase.functions.invoke('property-management', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: unitData,
      });

      if (error) throw error;

      setUnits(prev => prev.map(unit => unit.id === unitId ? data.unit : unit));
      return data.unit;
    } catch (err) {
      console.error('Error updating unit:', err);
      throw err;
    }
  };

  const deleteUnit = async (unitId: string) => {
    if (!user || !session) throw new Error('Not authenticated');

    try {
      console.log('Deleting unit:', unitId);

      const { error } = await supabase.functions.invoke('property-management', {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (error) throw error;

      setUnits(prev => prev.filter(unit => unit.id !== unitId));
    } catch (err) {
      console.error('Error deleting unit:', err);
      throw err;
    }
  };

  useEffect(() => {
    if (user && session) {
      fetchProperties();
    }
  }, [user, session]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const propertiesChannel = supabase
      .channel('properties-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'properties',
        filter: `manager_id=eq.${user.id}`
      }, () => {
        fetchProperties();
      })
      .subscribe();

    const unitsChannel = supabase
      .channel('units-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'units',
        filter: `manager_id=eq.${user.id}`
      }, () => {
        // Refresh units if we have any loaded
        if (units.length > 0) {
          // Get the property ID from the first unit to refresh
          const propertyId = properties[0]?.id;
          if (propertyId) {
            fetchUnits(propertyId);
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(propertiesChannel);
      supabase.removeChannel(unitsChannel);
    };
  }, [user, units.length, properties]);

  return {
    properties,
    units,
    loading,
    error,
    fetchProperties,
    fetchUnits,
    createProperty,
    createUnit,
    updateUnit,
    deleteUnit,
  };
};