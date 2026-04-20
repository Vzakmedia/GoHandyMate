
import { EnhancedServiceGrid } from "@/components/services/EnhancedServiceGrid";
import { TopProfessionals } from "@/components/TopProfessionals";
import { RealTimeServiceSync } from "@/components/RealTimeServiceSync";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Users, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MyBookings } from "@/components/MyBookings";
import { AddressInput } from "@/components/ui/address-input";
import { Badge } from "@/components/ui/badge";

interface SearchTabContentProps {
  onProtectedAction: (action: () => void) => void;
}

export const SearchTabContent = ({ onProtectedAction }: SearchTabContentProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [showMyBookings, setShowMyBookings] = useState(false);
  const navigate = useNavigate();

  const handleServiceSelect = (categoryId: string, subcategoryId?: string) => {
    console.log('Service selected from search tab:', categoryId, subcategoryId);
    navigate(`/professionals?category=${categoryId}${subcategoryId ? `&service=${subcategoryId}` : ''}`);
  };

  const handleProfessionalSearch = (serviceName: string) => {
    console.log('Professional search from search tab:', serviceName);
    const params = new URLSearchParams();
    params.set('search', serviceName);
    if (locationAddress) params.set('location', locationAddress);
    navigate(`/professionals?${params.toString()}`);
  };

  const handleAddressSelect = (address: {
    formatted_address: string;
    latitude: number;
    longitude: number;
    place_id: string;
  }) => {
    console.log('Selected address in search tab:', address);
    setLocationAddress(address.formatted_address);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (locationAddress) params.set('location', locationAddress);
    navigate(`/professionals?${params.toString()}`);
  };

  // Handle showing My Bookings subpage
  if (showMyBookings) {
    return (
      <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <MyBookings onBack={() => setShowMyBookings(false)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-12 pb-20 lg:pb-6">
      {/* Enhanced Search Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="px-1 sm:px-0">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Find your pro</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-sm">Search through thousands of verified experts in your area</p>
        </div>

        <div className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-black/5 shadow-sm overflow-hidden p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-12 space-y-4">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-[#166534]" />
                <Input
                  type="text"
                  placeholder="What service do you need today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 h-16 text-lg border-black/5 bg-slate-50/50 rounded-[2rem] focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#166534]/5 focus:outline-none transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-[#166534]" />
                  <AddressInput
                    value={locationAddress}
                    onChange={setLocationAddress}
                    onAddressSelect={handleAddressSelect}
                    placeholder="Enter your location..."
                    className="w-full pl-14 pr-6 h-14 text-sm border-black/5 bg-slate-50/50 rounded-[1.5rem] focus:bg-white focus:border-[#166534] focus:ring-4 focus:ring-[#166534]/5 focus:outline-none transition-all duration-300"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-14 bg-[#166534] hover:bg-[#166534]/90 text-white font-black uppercase text-xs tracking-widest rounded-[1.5rem] shadow-lg shadow-[#166534]/20 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Pill Bar */}
      <div className="-mx-4 sm:mx-0">
        <div className="overflow-x-auto scrollbar-hide py-2 px-4 sm:px-0 pb-4 flex">
          <div className="flex w-max items-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-white/50 backdrop-blur-sm border border-black/5 rounded-[3rem]">
          <Button
            onClick={() => onProtectedAction(() => setShowMyBookings(true))}
            variant="ghost"
            className="rounded-full px-8 h-12 hover:bg-[#166534] hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            My Bookings
          </Button>

          <Button
            onClick={() => navigate('/professionals')}
            variant="ghost"
            className="rounded-full px-8 h-12 hover:bg-[#166534] hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            All Pros
          </Button>

          <Button
            onClick={() => navigate('/map')}
            variant="ghost"
            className="rounded-full px-8 h-12 hover:bg-[#166534] hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Map View
          </Button>

          <Button
            onClick={() => { }}
            variant="ghost"
            className="rounded-full px-8 h-12 hover:bg-[#166534] hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
          >
            <Star className="w-4 h-4" />
            Popular
          </Button>
        </div>
       </div>
      </div>

      {/* Search Result Sections with Rounded Containers */}
      <div className="grid grid-cols-1 gap-8 sm:gap-12">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 sm:px-0">
            <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">Service Categories</h3>
            <Badge className="bg-slate-100 text-slate-500 rounded-full font-black uppercase text-[10px] tracking-widest px-3 w-fit">Live Now</Badge>
          </div>
          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-black/5 shadow-sm p-4 sm:p-8">
            <RealTimeServiceSync />
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-black/5 shadow-sm p-4 sm:p-10">
            <TopProfessionals showViewAllButton={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

