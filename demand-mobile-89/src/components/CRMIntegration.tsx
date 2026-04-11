
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Building, Users, Phone, Mail, MapPin, Calendar, DollarSign, BarChart3 } from 'lucide-react';

export const CRMIntegration = () => {
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const locations = [
    {
      id: '1',
      name: 'Northern California Hub',
      address: '123 Market St, San Francisco, CA 94103',
      manager: 'Sarah Johnson',
      phone: '(415) 555-0123',
      email: 'sarah.johnson@franchise.com',
      status: 'Active',
      customers: 1247,
      revenue: 68500,
      franchiseOwner: 'Golden Gate Services LLC'
    },
    {
      id: '2',
      name: 'Southern Texas Center',
      address: '456 Commerce Dr, Austin, TX 78701',
      manager: 'Mike Rodriguez',
      phone: '(512) 555-0456',
      email: 'mike.rodriguez@franchise.com',
      status: 'Active',
      customers: 892,
      revenue: 52300,
      franchiseOwner: 'Lone Star Home Services'
    },
    {
      id: '3',
      name: 'Metro Atlanta Office',
      address: '789 Peachtree St, Atlanta, GA 30309',
      manager: 'Jennifer Davis',
      phone: '(404) 555-0789',
      email: 'jennifer.davis@franchise.com',
      status: 'Expanding',
      customers: 634,
      revenue: 41200,
      franchiseOwner: 'Peach State Solutions'
    }
  ];

  const customerSegments = [
    { segment: 'Property Managers', count: 234, value: 45600, growth: 12.3 },
    { segment: 'Homeowners', count: 1567, value: 89200, growth: 8.7 },
    { segment: 'Real Estate Agents', count: 89, value: 23400, growth: 15.8 },
    { segment: 'Commercial Properties', count: 45, value: 78900, growth: 22.1 }
  ];

  const leadSources = [
    { source: 'Website', leads: 145, conversion: 23.4, cost: 1200 },
    { source: 'Referrals', leads: 89, conversion: 34.8, cost: 0 },
    { source: 'Google Ads', leads: 234, conversion: 18.7, cost: 3400 },
    { source: 'Social Media', leads: 67, conversion: 12.3, cost: 890 },
    { source: 'Direct Mail', leads: 34, conversion: 8.9, cost: 1500 }
  ];

  const crmIntegrations = [
    { name: 'Salesforce', status: 'Connected', lastSync: '2 minutes ago', records: 2847 },
    { name: 'HubSpot', status: 'Connected', lastSync: '15 minutes ago', records: 1934 },
    { name: 'Pipedrive', status: 'Disconnected', lastSync: '2 days ago', records: 0 },
    { name: 'Zoho CRM', status: 'Pending', lastSync: 'Never', records: 0 }
  ];

  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Multi-Location CRM Integration</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Building className="w-4 h-4 mr-2" />
          Add Location
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search locations or managers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map(location => (
              <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* CRM Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>CRM System Integrations</span>
          </CardTitle>
          <CardDescription>Connected systems and data synchronization status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {crmIntegrations.map((integration, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">{integration.name}</h3>
                  <Badge variant={integration.status === 'Connected' ? 'default' : 
                                 integration.status === 'Pending' ? 'secondary' : 'destructive'}>
                    {integration.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Sync:</span>
                    <span>{integration.lastSync}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Records:</span>
                    <span className="font-semibold">{integration.records.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Auto-sync</span>
                    <Switch checked={integration.status === 'Connected'} />
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  disabled={integration.status === 'Connected'}
                >
                  {integration.status === 'Connected' ? 'Connected' : 'Connect'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-green-600" />
            <span>Franchise Locations</span>
          </CardTitle>
          <CardDescription>Manage customer data across all franchise locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLocations.map((location) => (
              <div key={location.id} className="p-6 border rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{location.name}</h3>
                    <p className="text-gray-600">{location.franchiseOwner}</p>
                  </div>
                  <Badge variant={location.status === 'Active' ? 'default' : 'secondary'}>
                    {location.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{location.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{location.manager}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{location.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{location.email}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Customers</p>
                      <p className="text-xl font-bold text-blue-800">{location.customers.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-600">Revenue</p>
                      <p className="text-xl font-bold text-green-800">${location.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">View Customers</Button>
                  <Button variant="outline" size="sm">Export Data</Button>
                  <Button variant="outline" size="sm">Sync CRM</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Segments Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span>Customer Segments</span>
            </CardTitle>
            <CardDescription>Customer distribution by segment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerSegments.map((segment, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{segment.segment}</h3>
                    <Badge variant="outline">+{segment.growth}% growth</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Count</p>
                      <p className="text-lg font-bold">{segment.count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Value</p>
                      <p className="text-lg font-bold text-green-600">${segment.value.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-orange-600" />
              <span>Lead Sources Performance</span>
            </CardTitle>
            <CardDescription>Lead generation and conversion metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leadSources.map((source, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{source.source}</h3>
                    <Badge variant={source.conversion > 20 ? 'default' : 'secondary'}>
                      {source.conversion}% conversion
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Leads</p>
                      <p className="text-lg font-bold">{source.leads}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Cost</p>
                      <p className="text-lg font-bold">${source.cost}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
