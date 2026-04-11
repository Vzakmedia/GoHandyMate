
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Filter, Sparkles, Clock, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/features/auth';
import { toast } from "sonner";
import { AddressInput } from "@/components/ui/address-input";

export const FindServicesSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [locationAddress, setLocationAddress] = useState("");

  const handleAdvertisingClick = () => {
    if (!user) {
      toast.error("Please sign in to access advertising features.");
      return;
    }
    toast.success("Business advertising features will be available soon!");
  };

  const handleFindServices = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (locationAddress) params.set('location', locationAddress);
    
    navigate(`/professionals${params.toString() ? '?' + params.toString() : ''}`);
  };

  const handleAddressSelect = (address: {
    formatted_address: string;
    latitude: number;
    longitude: number;
    place_id: string;
  }) => {
    console.log('Selected address:', address);
    setLocationAddress(address.formatted_address);
  };

  const popularServices = [
    { name: "House Cleaning", icon: "🏠", trend: "+23%" },
    { name: "Handyman", icon: "🔧", trend: "+18%" },
    { name: "Moving Help", icon: "📦", trend: "+31%" },
    { name: "Plumbing", icon: "🚿", trend: "+15%" },
    { name: "Electrical", icon: "⚡", trend: "+22%" },
    { name: "Painting", icon: "🎨", trend: "+19%" }
  ];

  const quickStats = [
    { label: "Services Available", value: "200+", icon: Sparkles },
    { label: "Avg Response Time", value: "15min", icon: Clock },
    { label: "Customer Rating", value: "4.9★", icon: Star }
  ];

  return (
    <section className="relative bg-gradient-to-br from-white via-green-50 to-emerald-50 py-8 sm:py-12 lg:py-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-24 h-24 sm:w-40 sm:h-40 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>500+ Verified Professionals Online</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Find <span className="text-green-600">Trusted</span> Professionals
            <br className="hidden sm:block" />
            <span className="text-green-600">Near You</span>
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Connect with verified handymen, contractors, and service providers in your area within 50 miles. 
            Get quotes, book services, and get the job done right.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {quickStats.map((stat, index) => (
              <div key={index} className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-white/20">
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <span className="text-sm sm:text-base font-semibold text-gray-900">{stat.value}</span>
                <span className="text-xs sm:text-sm text-gray-600">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Service Search */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What service do you need?
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="e.g., Plumbing, Electrical, Cleaning..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 sm:h-14 text-base border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Location Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Where do you need the service?
                </label>
                <AddressInput
                  value={locationAddress}
                  onChange={setLocationAddress}
                  onAddressSelect={handleAddressSelect}
                  placeholder="Enter your address or ZIP code..."
                  className="h-12 sm:h-14 text-base border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Search Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                onClick={handleFindServices}
                size="lg"
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Search className="w-5 h-5 mr-2" />
                Find Professionals (50 mile radius)
              </Button>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Instant Quotes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Background Checked</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Insured Pros</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Services */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Popular Services</h2>
          <p className="text-gray-600 mb-6 sm:mb-8">Most requested services this week</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 max-w-5xl mx-auto">
            {popularServices.map((service, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(service.name);
                  handleFindServices();
                }}
                className="group bg-white/60 backdrop-blur-sm hover:bg-white/80 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 hover:border-green-200 transition-all duration-200 hover:shadow-lg"
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{service.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base group-hover:text-green-600 transition-colors">
                  {service.name}
                </h3>
                <div className="text-xs sm:text-sm text-green-600 font-medium">
                  {service.trend} this week
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Business CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-white max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Are You a Professional?
            </h2>
            <p className="text-green-100 mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto">
              Join thousands of professionals growing their business on our platform. 
              Get more customers, manage your schedule, and increase your income.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-green-600 hover:bg-gray-50 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl"
                onClick={() => navigate('/auth')}
              >
                Join as a Professional
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white border-white/30 hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl"
                onClick={handleAdvertisingClick}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Advertise Your Business
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
