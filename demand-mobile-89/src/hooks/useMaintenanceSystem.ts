import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  type: 'emergency' | 'recurring' | 'standard';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  frequency?: string;
  next_scheduled?: string;
  estimated_cost?: number;
  actual_cost?: number;
  scheduled_date?: string;
  completed_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  properties?: {
    property_name: string;
    property_address: string;
  };
  units?: {
    unit_number: string;
  };
}

interface EmergencyReport {
  id: string;
  emergency_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location_details?: string;
  contact_phone?: string;
  status: 'reported' | 'dispatched' | 'on_site' | 'resolved';
  response_time_minutes?: number;
  resolved_at?: string;
  follow_up_required: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  properties?: {
    property_name: string;
    property_address: string;
  };
  units?: {
    unit_number: string;
  };
}

export const useMaintenanceSystem = () => {
  const { user } = useAuth();
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [emergencyReports, setEmergencyReports] = useState<EmergencyReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch maintenance requests
  const fetchMaintenanceRequests = async (type?: string) => {
    if (!user) return;

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.access_token) {
        throw new Error('No auth token');
      }

      const params = new URLSearchParams();
      if (type) {
        params.append('type', type);
      }
      
      const url = `https://iexcqvcuzmmiruqcssdz.supabase.co/functions/v1/maintenance-system/maintenance-requests${params.toString() ? `?${params.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMaintenanceRequests(data.requests || []);
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
      toast.error('Failed to load maintenance requests');
    }
  };

  // Fetch emergency reports
  const fetchEmergencyReports = async () => {
    if (!user) return;

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.access_token) {
        throw new Error('No auth token');
      }

      const url = `https://iexcqvcuzmmiruqcssdz.supabase.co/functions/v1/maintenance-system/emergency-reports`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setEmergencyReports(data.reports || []);
    } catch (error) {
      console.error('Error fetching emergency reports:', error);
      toast.error('Failed to load emergency reports');
    }
  };

  // Create maintenance request
  const createMaintenanceRequest = async (requestData: Partial<MaintenanceRequest>) => {
    if (!user) return;

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.access_token) {
        throw new Error('No auth token');
      }

      const url = `https://iexcqvcuzmmiruqcssdz.supabase.co/functions/v1/maintenance-system/maintenance-requests`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session.access_token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      await fetchMaintenanceRequests();
      toast.success('Maintenance request created successfully');
      return data.request;
    } catch (error) {
      console.error('Error creating maintenance request:', error);
      toast.error('Failed to create maintenance request');
      throw error;
    }
  };

  // Create emergency report
  const createEmergencyReport = async (reportData: Partial<EmergencyReport>) => {
    if (!user) return;

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.access_token) {
        throw new Error('No auth token');
      }

      const url = `https://iexcqvcuzmmiruqcssdz.supabase.co/functions/v1/maintenance-system/emergency-reports`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session.access_token}`,
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      await fetchEmergencyReports();
      toast.success('Emergency report submitted successfully');
      return data.report;
    } catch (error) {
      console.error('Error creating emergency report:', error);
      toast.error('Failed to submit emergency report');
      throw error;
    }
  };

  // Update maintenance request
  const updateMaintenanceRequest = async (requestId: string, updates: Partial<MaintenanceRequest>) => {
    if (!user) return;

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.access_token) {
        throw new Error('No auth token');
      }

      const url = `https://iexcqvcuzmmiruqcssdz.supabase.co/functions/v1/maintenance-system/maintenance-requests/${requestId}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session.access_token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      await fetchMaintenanceRequests();
      toast.success('Maintenance request updated successfully');
      return data.request;
    } catch (error) {
      console.error('Error updating maintenance request:', error);
      toast.error('Failed to update maintenance request');
      throw error;
    }
  };

  // Update emergency report
  const updateEmergencyReport = async (reportId: string, updates: Partial<EmergencyReport>) => {
    if (!user) return;

    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.access_token) {
        throw new Error('No auth token');
      }

      const url = `https://iexcqvcuzmmiruqcssdz.supabase.co/functions/v1/maintenance-system/emergency-reports/${reportId}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.data.session.access_token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      await fetchEmergencyReports();
      toast.success('Emergency report updated successfully');
      return data.report;
    } catch (error) {
      console.error('Error updating emergency report:', error);
      toast.error('Failed to update emergency report');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([
          fetchMaintenanceRequests(),
          fetchEmergencyReports(),
        ]);
        setLoading(false);
      };
      loadData();
    }
  }, [user]);

  return {
    maintenanceRequests,
    emergencyReports,
    loading,
    createMaintenanceRequest,
    createEmergencyReport,
    updateMaintenanceRequest,
    updateEmergencyReport,
    fetchMaintenanceRequests,
    fetchEmergencyReports,
  };
};