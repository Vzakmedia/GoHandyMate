
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Target, MapPin, Calendar, Eye, MousePointer, DollarSign } from 'lucide-react';

export const MarketingTools = () => {
  const [newPromo, setNewPromo] = useState({
    title: '',
    description: '',
    discount: '',
    territory: '',
    startDate: '',
    endDate: '',
    budget: ''
  });

  const activePromotions = [
    {
      id: '1',
      title: 'Spring Cleaning Special',
      description: '20% off all cleaning services',
      territory: 'Northern CA',
      startDate: '2024-03-01',
      endDate: '2024-04-30',
      budget: 5000,
      spent: 3200,
      impressions: 15400,
      clicks: 892,
      conversions: 47
    },
    {
      id: '2',
      title: 'New Customer Welcome',
      description: '$50 off first booking',
      territory: 'All Regions',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      budget: 10000,
      spent: 6800,
      impressions: 28900,
      clicks: 1456,
      conversions: 134
    }
  ];

  const territories = [
    'All Regions',
    'Northern CA',
    'Southern TX', 
    'Metro Atlanta',
    'Central FL'
  ];

  const handleCreatePromo = () => {
    console.log('Creating promotion:', newPromo);
    setNewPromo({
      title: '',
      description: '',
      discount: '',
      territory: '',
      startDate: '',
      endDate: '',
      budget: ''
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Marketing Tools & Territory Targeting</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Promotion */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Megaphone className="w-5 h-5 text-orange-600" />
              <span>Create Promotion</span>
            </CardTitle>
            <CardDescription>Design targeted marketing campaigns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="promoTitle">Campaign Title</Label>
              <Input
                id="promoTitle"
                value={newPromo.title}
                onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                placeholder="e.g., Summer Home Maintenance"
              />
            </div>

            <div>
              <Label htmlFor="promoDescription">Description</Label>
              <Textarea
                id="promoDescription"
                value={newPromo.description}
                onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                placeholder="Promotion details and terms..."
              />
            </div>

            <div>
              <Label htmlFor="discount">Discount/Offer</Label>
              <Input
                id="discount"
                value={newPromo.discount}
                onChange={(e) => setNewPromo({ ...newPromo, discount: e.target.value })}
                placeholder="e.g., 25% off or $50 credit"
              />
            </div>

            <div>
              <Label>Target Territory</Label>
              <Select value={newPromo.territory} onValueChange={(value) => setNewPromo({ ...newPromo, territory: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select territory" />
                </SelectTrigger>
                <SelectContent>
                  {territories.map((territory) => (
                    <SelectItem key={territory} value={territory}>{territory}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newPromo.startDate}
                  onChange={(e) => setNewPromo({ ...newPromo, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newPromo.endDate}
                  onChange={(e) => setNewPromo({ ...newPromo, endDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="budget">Marketing Budget</Label>
              <Input
                id="budget"
                value={newPromo.budget}
                onChange={(e) => setNewPromo({ ...newPromo, budget: e.target.value })}
                placeholder="Budget amount"
              />
            </div>

            <Button onClick={handleCreatePromo} className="w-full bg-orange-600 hover:bg-orange-700">
              <Target className="w-4 h-4 mr-2" />
              Launch Campaign
            </Button>
          </CardContent>
        </Card>

        {/* Campaign Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span>Campaign Performance</span>
            </CardTitle>
            <CardDescription>Real-time marketing metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Impressions</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">44.3K</p>
                  <p className="text-xs text-gray-600">This month</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MousePointer className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Clicks</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">2.35K</p>
                  <p className="text-xs text-gray-600">5.3% CTR</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Conversions</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">181</p>
                  <p className="text-xs text-gray-600">7.7% rate</p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium">ROAS</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">3.8x</p>
                  <p className="text-xs text-gray-600">Return on ad spend</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Top Performing Territories</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Northern CA</span>
                    <Badge variant="default">4.2x ROAS</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Metro Atlanta</span>
                    <Badge variant="default">3.9x ROAS</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Southern TX</span>
                    <Badge variant="secondary">3.1x ROAS</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <span>Active Promotions</span>
          </CardTitle>
          <CardDescription>Currently running marketing campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activePromotions.map((promo) => (
              <div key={promo.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{promo.title}</h3>
                    <p className="text-gray-600">{promo.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{promo.territory}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-semibold">${promo.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Spent</p>
                    <p className="font-semibold text-orange-600">${promo.spent.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Impressions</p>
                    <p className="font-semibold">{promo.impressions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Clicks</p>
                    <p className="font-semibold">{promo.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversions</p>
                    <p className="font-semibold text-green-600">{promo.conversions}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {promo.startDate} - {promo.endDate}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Pause</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
