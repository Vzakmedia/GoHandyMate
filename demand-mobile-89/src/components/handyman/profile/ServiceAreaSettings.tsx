
import { useState, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { getAreaNameFromZipCode, extractZipCodeFromAddress, generateAreaNameFromZipCode } from '@/utils/zipCodeToArea';
import { ServiceArea, ServiceAreaSettingsProps } from './service-areas/types';
import { ServiceAreasHeader } from './service-areas/ServiceAreasHeader';
import { ServiceAreaCard } from './service-areas/ServiceAreaCard';
import { AddServiceAreaForm } from './service-areas/AddServiceAreaForm';
import { ServiceAreaStats } from './service-areas/ServiceAreaStats';
import { InfoCard } from './service-areas/InfoCard';

export const ServiceAreaSettings = ({ isEditing }: ServiceAreaSettingsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');
  const [addressInputs, setAddressInputs] = useState<Record<number, string>>({});

  // Load service areas
  useEffect(() => {
    if (user) {
      loadServiceAreas();
    }
  }, [user]);

  const loadServiceAreas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('handyman_work_areas')
        .select('*')
        .eq('user_id', user?.id)
        .order('priority_order');

      if (error) throw error;

      if (data && data.length > 0) {
        const areas = data.map(area => ({
          id: area.id,
          area_name: area.area_name,
          center_latitude: area.center_latitude,
          center_longitude: area.center_longitude,
          radius_miles: area.radius_miles,
          is_primary: area.is_primary,
          is_active: area.is_active,
          zip_code: area.zip_code || '',
          formatted_address: area.formatted_address || ''
        }));
        
        setServiceAreas(areas);
        
        // Initialize address inputs
        const initialAddresses: Record<number, string> = {};
        areas.forEach((area, index) => {
          initialAddresses[index] = area.formatted_address || area.zip_code || '';
        });
        setAddressInputs(initialAddresses);
      } else {
        // Default area
        const defaultArea = {
          area_name: 'My Main Area',
          center_latitude: 40.7128,
          center_longitude: -74.0060,
          radius_miles: 15,
          is_primary: true,
          is_active: true,
          zip_code: '',
          formatted_address: ''
        };
        setServiceAreas([defaultArea]);
        setAddressInputs({ 0: '' });
      }
    } catch (error) {
      console.error('Error loading service areas:', error);
      toast({
        title: "Error",
        description: "Failed to load service areas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = async (index: number, address: {
    formatted_address: string;
    latitude: number;
    longitude: number;
    place_id: string;
  }) => {
    console.log('Address selected:', address);
    
    // Extract zip code from the formatted address
    const zipCode = extractZipCodeFromAddress(address.formatted_address);
    let areaName = address.formatted_address;
    
    // Generate area name from zip code if available
    if (zipCode) {
      try {
        areaName = await getAreaNameFromZipCode(zipCode);
        console.log('Generated area name from zip code:', areaName);
      } catch (error) {
        console.error('Error generating area name:', error);
        // Fallback to formatted address or zip code area
        areaName = generateAreaNameFromZipCode(zipCode);
      }
    }
    
    const updatedAreas = [...serviceAreas];
    updatedAreas[index] = {
      ...updatedAreas[index],
      area_name: areaName,
      center_latitude: address.latitude,
      center_longitude: address.longitude,
      formatted_address: address.formatted_address,
      zip_code: zipCode || ''
    };
    setServiceAreas(updatedAreas);
    
    toast({
      title: "Address Updated",
      description: `Location set to: ${areaName}`,
    });
  };

  const handleAddressInputChange = async (index: number, value: string) => {
    setAddressInputs(prev => ({ ...prev, [index]: value }));
    
    // If the input looks like a zip code, generate area name in real time
    const zipCodeMatch = value.match(/^\d{5}$/);
    if (zipCodeMatch) {
      const zipCode = zipCodeMatch[0];
      try {
        const areaName = await getAreaNameFromZipCode(zipCode);
        
        // Update the area name in real time
        const updatedAreas = [...serviceAreas];
        updatedAreas[index] = {
          ...updatedAreas[index],
          area_name: areaName,
          zip_code: zipCode
        };
        setServiceAreas(updatedAreas);
        
        console.log('Real-time area name update:', areaName);
      } catch (error) {
        console.error('Error updating area name in real time:', error);
      }
    }
  };

  const addServiceArea = () => {
    if (!newAreaName.trim()) return;
    
    const newArea: ServiceArea = {
      area_name: newAreaName,
      center_latitude: 40.7128,
      center_longitude: -74.0060,
      radius_miles: 15,
      is_primary: serviceAreas.length === 0,
      is_active: true,
      zip_code: '',
      formatted_address: ''
    };
    
    const newIndex = serviceAreas.length;
    setServiceAreas([...serviceAreas, newArea]);
    setAddressInputs(prev => ({ ...prev, [newIndex]: '' }));
    setNewAreaName('');
  };

  const removeServiceArea = (index: number) => {
    if (serviceAreas.length <= 1) return;
    
    const updatedAreas = serviceAreas.filter((_, i) => i !== index);
    // Ensure at least one primary area
    if (!updatedAreas.some(area => area.is_primary) && updatedAreas.length > 0) {
      updatedAreas[0].is_primary = true;
    }
    setServiceAreas(updatedAreas);
    
    // Update address inputs
    const newAddressInputs: Record<number, string> = {};
    updatedAreas.forEach((_, i) => {
      if (i < index) {
        newAddressInputs[i] = addressInputs[i] || '';
      } else {
        newAddressInputs[i] = addressInputs[i + 1] || '';
      }
    });
    setAddressInputs(newAddressInputs);
  };

  const updateServiceArea = (index: number, field: keyof ServiceArea, value: any) => {
    const updatedAreas = [...serviceAreas];
    updatedAreas[index] = { ...updatedAreas[index], [field]: value };
    
    // Handle primary area logic
    if (field === 'is_primary' && value) {
      updatedAreas.forEach((area, i) => {
        if (i !== index) area.is_primary = false;
      });
    }
    
    setServiceAreas(updatedAreas);
  };

  const saveServiceAreas = async () => {
    if (!user) return;

    try {
      setSaving(true);
      console.log('Saving service areas:', serviceAreas);

      // Prepare areas for database with all required fields
      const areasToSave = serviceAreas.map((area, index) => ({
        user_id: user.id,
        area_name: area.area_name,
        center_latitude: area.center_latitude,
        center_longitude: area.center_longitude,
        radius_miles: area.radius_miles,
        is_primary: area.is_primary,
        is_active: area.is_active,
        priority_order: index + 1,
        additional_travel_fee: 0,
        travel_time_minutes: 0,
        zip_code: area.zip_code || null,
        formatted_address: area.formatted_address || null
      }));

      const { error } = await supabase.functions.invoke('handyman-enhanced-profile', {
        body: {
          action: 'update_work_areas',
          areas: areasToSave
        }
      });

      if (error) throw error;

      // Broadcast the service areas update for real-time sync
      const channel = supabase.channel('service-areas-updates');
      await channel.send({
        type: 'broadcast',
        event: 'service-areas-updated',
        payload: { userId: user.id, areas: serviceAreas.map(area => area.area_name) }
      });

      toast({
        title: "Success",
        description: "Service areas updated successfully",
      });

      // Reload the data to ensure consistency
      await loadServiceAreas();
    } catch (error) {
      console.error('Error saving service areas:', error);
      toast({
        title: "Error",
        description: "Failed to save service areas",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <ServiceAreasHeader 
          isEditing={isEditing} 
          saving={saving} 
          onSave={saveServiceAreas} 
        />

        <div className="space-y-4">
          {serviceAreas.map((area, index) => (
            <ServiceAreaCard
              key={index}
              area={area}
              index={index}
              addressInputValue={addressInputs[index] || ''}
              isEditing={isEditing}
              canRemove={serviceAreas.length > 1}
              onUpdateArea={updateServiceArea}
              onAddressInputChange={handleAddressInputChange}
              onAddressSelect={handleAddressSelect}
              onRemove={removeServiceArea}
            />
          ))}
        </div>

        {isEditing && (
          <AddServiceAreaForm
            newAreaName={newAreaName}
            onNewAreaNameChange={setNewAreaName}
            onAddArea={addServiceArea}
            maxAreasReached={serviceAreas.length >= 3}
          />
        )}

        <ServiceAreaStats serviceAreas={serviceAreas} />

        <InfoCard />
      </div>
    </TooltipProvider>
  );
};
