
import { Filter, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AddressInput } from '@/components/ui/address-input';
import { IntegratedCommunityFeed } from '@/components/IntegratedCommunityFeed';
import { CommunitySidebar } from '@/components/community/CommunitySidebar';
import { useState } from 'react';

export const CommunityFeed = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleAddressSelect = (address: {
    formatted_address: string;
    latitude: number;
    longitude: number;
    place_id: string;
  }) => {
    console.log('Selected address in community feed:', address);
    setSelectedLocation(address.formatted_address);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col lg:flex-row relative">
      {/* Sidebar - Hidden on mobile/tablet */}
      <div className="hidden lg:block h-full sticky top-0">
        <CommunitySidebar 
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 z-30 shadow-sm">
          <div className="w-full px-3 sm:px-4 lg:px-6 py-3">
            {/* Header Title */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-[#166534]" />
                <h2 className="text-lg font-semibold text-gray-900">Community Feed</h2>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[10px] uppercase font-black tracking-widest px-2 py-1 animate-pulse border border-emerald-200">
                  Live
                </Badge>
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <AddressInput
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  onAddressSelect={handleAddressSelect}
                  placeholder="What's happening in your neighborhood?"
                  className="w-full h-10 text-sm bg-gray-50/50 rounded-xl border-black/5"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search posts, people, topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full h-10 text-sm bg-gray-50/50 rounded-xl border-black/5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Feed Content */}
        <div className="flex-1 p-4 pb-24 sm:pb-8">
          <IntegratedCommunityFeed selectedLocation={selectedLocation || 'All Areas'} />
        </div>
      </div>
    </div>
  );
};
