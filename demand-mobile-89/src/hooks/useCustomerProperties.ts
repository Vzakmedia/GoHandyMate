import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';

export interface CustomerProperty {
    id: string;
    property_name: string;
    property_address: string;
    city: string | null;
    state: string | null;
    zip_code: string | null;
}

export const useCustomerProperties = () => {
    const { user } = useAuth();
    const [properties, setProperties] = useState<CustomerProperty[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProperties = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('properties')
                .select('id, property_name, property_address, city, state, zip_code')
                .eq('manager_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProperties(data || []);
        } catch (err: any) {
            console.error('Error fetching properties:', err);
        } finally {
            setLoading(false);
        }
    };

    const addProperty = async (property: Omit<CustomerProperty, 'id'>) => {
        if (!user) return null;
        try {
            const { data, error } = await supabase
                .from('properties')
                .insert({
                    manager_id: user.id,
                    property_name: property.property_name,
                    property_address: property.property_address,
                    city: property.city,
                    state: property.state,
                    zip_code: property.zip_code,
                    property_type: 'residential',
                })
                .select()
                .single();

            if (error) throw error;

            setProperties(prev => [data, ...prev]);
            toast.success('Address added successfully');
            return data;
        } catch (err: any) {
            console.error('Error adding property:', err);
            toast.error('Failed to add address');
            return null;
        }
    };

    const deleteProperty = async (id: string) => {
        if (!user) return false;
        try {
            const { error } = await supabase
                .from('properties')
                .delete()
                .eq('id', id)
                .eq('manager_id', user.id);

            if (error) throw error;

            setProperties(prev => prev.filter(p => p.id !== id));
            toast.success('Address removed');
            return true;
        } catch (err: any) {
            console.error('Error deleting property:', err);
            toast.error('Failed to remove address');
            return false;
        }
    };

    useEffect(() => {
        fetchProperties();
    }, [user]);

    return {
        properties,
        loading,
        addProperty,
        deleteProperty,
        refreshProperties: fetchProperties
    };
};
