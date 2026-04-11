
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Users, Building, Plus } from 'lucide-react';

export const FranchiseOnboarding = () => {
  const [newRegion, setNewRegion] = useState({
    name: '',
    state: '',
    zipCodes: '',
    manager: '',
    population: '',
    description: ''
  });

  const regions = [
    { id: '1', name: 'Northern California', manager: 'Sarah Johnson', zipCodes: '94101-94199', population: '850K', status: 'Active' },
    { id: '2', name: 'Southern Texas', manager: 'Mike Rodriguez', zipCodes: '75001-75099', population: '1.2M', status: 'Active' },
    { id: '3', name: 'Metro Atlanta', manager: 'Jennifer Davis', zipCodes: '30301-30399', population: '950K', status: 'Pending' },
  ];

  const handleAddRegion = () => {
    console.log('Adding new region:', newRegion);
    // Reset form
    setNewRegion({ name: '', state: '', zipCodes: '', manager: '', population: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Franchise Onboarding & Region Management</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-blue-600" />
              <span>Add New Region</span>
            </CardTitle>
            <CardDescription>Create a new franchise territory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="regionName">Region Name</Label>
              <Input
                id="regionName"
                value={newRegion.name}
                onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                placeholder="e.g., Northern California"
              />
            </div>

            <div>
              <Label>State</Label>
              <Select value={newRegion.state} onValueChange={(value) => setNewRegion({ ...newRegion, state: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ca">California</SelectItem>
                  <SelectItem value="tx">Texas</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="fl">Florida</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="zipCodes">ZIP Code Range</Label>
              <Input
                id="zipCodes"
                value={newRegion.zipCodes}
                onChange={(e) => setNewRegion({ ...newRegion, zipCodes: e.target.value })}
                placeholder="e.g., 94101-94199"
              />
            </div>

            <div>
              <Label htmlFor="manager">Regional Manager</Label>
              <Input
                id="manager"
                value={newRegion.manager}
                onChange={(e) => setNewRegion({ ...newRegion, manager: e.target.value })}
                placeholder="Manager name"
              />
            </div>

            <div>
              <Label htmlFor="population">Population</Label>
              <Input
                id="population"
                value={newRegion.population}
                onChange={(e) => setNewRegion({ ...newRegion, population: e.target.value })}
                placeholder="e.g., 850K"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newRegion.description}
                onChange={(e) => setNewRegion({ ...newRegion, description: e.target.value })}
                placeholder="Region details and notes..."
              />
            </div>

            <Button onClick={handleAddRegion} className="w-full bg-blue-600 hover:bg-blue-700">
              <MapPin className="w-4 h-4 mr-2" />
              Create Region
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="w-5 h-5 text-green-600" />
              <span>Active Regions</span>
            </CardTitle>
            <CardDescription>Manage existing franchise territories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regions.map((region) => (
                <div key={region.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{region.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded ${
                      region.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {region.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{region.manager}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{region.zipCodes}</span>
                    </div>
                    <div>Population: {region.population}</div>
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
