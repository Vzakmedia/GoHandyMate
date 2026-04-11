import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building, 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search,
  MoreHorizontal,
  Eye,
  Home
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PropertyApprovalDialog } from './PropertyApprovalDialog';
import { PropertyManagerDetails } from './PropertyManagerDetails';
import { PropertyDetailsModal } from './PropertyDetailsModal';

interface Property {
  id: string;
  property_name: string;
  property_address: string;
  property_type: string;
  total_units: number;
  status: string;
  created_at: string;
  manager_id: string;
  approved_at?: string;
  approved_by?: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

interface PropertyManager {
  id: string;
  full_name: string;
  email: string;
  user_role: string;
  account_status: string;
  created_at: string;
  properties?: any[];
}

interface AdminStats {
  totalProperties: number;
  pendingProperties: number;
  approvedProperties: number;
  rejectedProperties: number;
  totalPropertyManagers: number;
  activePropertyManagers: number;
}

export const PropertyManagementAdmin = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyManagers, setPropertyManagers] = useState<PropertyManager[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalProperties: 0,
    pendingProperties: 0,
    approvedProperties: 0,
    rejectedProperties: 0,
    totalPropertyManagers: 0,
    activePropertyManagers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedManager, setSelectedManager] = useState<PropertyManager | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);
  const [showManagerDetails, setShowManagerDetails] = useState(false);

  // Check if user is admin
  const isAdmin = user?.email === 'admin@gohandymate.com' || 
                  user?.email?.endsWith('@admin.gohandymate.com') ||
                  user?.email === 'support@gohandymate.com';

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles!properties_manager_id_fkey (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties((data as any) || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to fetch properties');
    }
  };

  const fetchPropertyManagers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          properties!properties_manager_id_fkey (*)
        `)
        .eq('user_role', 'property_manager')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPropertyManagers((data as any) || []);
    } catch (error) {
      console.error('Error fetching property managers:', error);
      toast.error('Failed to fetch property managers');
    }
  };

  const calculateStats = () => {
    const totalProperties = properties.length;
    const pendingProperties = properties.filter(p => p.status === 'pending').length;
    const approvedProperties = properties.filter(p => p.status === 'approved').length;
    const rejectedProperties = properties.filter(p => p.status === 'rejected').length;
    const totalPropertyManagers = propertyManagers.length;
    const activePropertyManagers = propertyManagers.filter(pm => pm.account_status === 'active').length;

    setStats({
      totalProperties,
      pendingProperties,
      approvedProperties,
      rejectedProperties,
      totalPropertyManagers,
      activePropertyManagers,
    });
  };

  const handlePropertyAction = async (propertyId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          approved_at: action === 'approve' ? new Date().toISOString() : null,
          approved_by: action === 'approve' ? user?.id : null,
          rejection_reason: action === 'reject' ? reason : null,
        })
        .eq('id', propertyId);

      if (error) throw error;

      toast.success(`Property ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      fetchProperties();
    } catch (error) {
      console.error(`Error ${action}ing property:`, error);
      toast.error(`Failed to ${action} property`);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProperties();
      fetchPropertyManagers();
    }
  }, [isAdmin]);

  useEffect(() => {
    calculateStats();
  }, [properties, propertyManagers]);

  const filteredProperties = properties.filter(property =>
    property.property_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.property_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredManagers = propertyManagers.filter(manager =>
    manager.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    manager.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading property management data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProperties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingProperties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedProperties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejectedProperties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Property Managers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPropertyManagers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Managers</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activePropertyManagers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search properties, addresses, or managers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="properties" className="space-y-4">
        <TabsList>
          <TabsTrigger value="properties" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Properties
          </TabsTrigger>
          <TabsTrigger value="managers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Property Managers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Home className="h-5 w-5 text-gray-500" />
                        <div>
                          <h3 className="font-medium">{property.property_name}</h3>
                          <p className="text-sm text-gray-500">{property.property_address}</p>
                          <p className="text-xs text-gray-400">
                            Manager: {property.profiles?.full_name} ({property.profiles?.email})
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          property.status === 'approved' ? 'default' :
                          property.status === 'pending' ? 'secondary' : 'destructive'
                        }
                      >
                        {property.status}
                      </Badge>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProperty(property);
                            setShowPropertyDetails(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {property.status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProperty(property);
                              setShowApprovalDialog(true);
                            }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="managers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Manager Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredManagers.map((manager) => (
                  <div key={manager.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-gray-500" />
                        <div>
                          <h3 className="font-medium">{manager.full_name}</h3>
                          <p className="text-sm text-gray-500">{manager.email}</p>
                          <p className="text-xs text-gray-400">
                            {manager.properties?.length || 0} properties
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={manager.account_status === 'active' ? 'default' : 'secondary'}
                      >
                        {manager.account_status}
                      </Badge>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedManager(manager);
                          setShowManagerDetails(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <PropertyApprovalDialog
        property={selectedProperty}
        open={showApprovalDialog}
        onOpenChange={setShowApprovalDialog}
        onAction={handlePropertyAction}
      />

      <PropertyDetailsModal
        property={selectedProperty}
        open={showPropertyDetails}
        onOpenChange={setShowPropertyDetails}
      />

      <PropertyManagerDetails
        manager={selectedManager}
        open={showManagerDetails}
        onOpenChange={setShowManagerDetails}
      />
    </div>
  );
};