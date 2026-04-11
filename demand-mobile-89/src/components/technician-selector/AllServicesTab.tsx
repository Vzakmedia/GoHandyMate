
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RealTimeServiceProviders } from "@/components/RealTimeServiceProviders";
import { ServiceWithRealData } from "@/components/ServiceWithRealData";
import { EnhancedServiceGrid } from "@/components/services/EnhancedServiceGrid";
import { useState } from "react";
import { Search, ArrowLeft, Users, Wrench, MapPin, Star, Clock, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { expandedServiceCategories, getCategoryBySubcategory } from "@/data/expandedServiceCategories";

export const AllServicesTab = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'categories' | 'service-detail' | 'professionals'>('landing');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const quickStats = [
    { label: "Services Available", value: "200+", icon: Sparkles },
    { label: "Avg Response Time", value: "15min", icon: Clock },
    { label: "Customer Rating", value: "4.9★", icon: Star }
  ];

  const popularServices = [
    { name: "House Cleaning", icon: "🏠", trend: "+23%" },
    { name: "Handyman", icon: "🔧", trend: "+18%" },
    { name: "Moving Help", icon: "📦", trend: "+31%" },
    { name: "Plumbing", icon: "🚿", trend: "+15%" },
    { name: "Electrical", icon: "⚡", trend: "+22%" },
    { name: "Painting", icon: "🎨", trend: "+19%" },
    { name: "Furniture Assembly", icon: "🪑", trend: "+25%" },
    { name: "HVAC Services", icon: "❄️", trend: "+17%" }
  ];

  const handleServiceSelect = (categoryId: string, subcategoryId?: string) => {
    console.log('Service selected:', categoryId, subcategoryId);
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId || null);
    
    // Find the service name for professionals view
    const category = expandedServiceCategories.find(cat => cat.id === categoryId);
    if (category) {
      if (subcategoryId) {
        const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
        if (subcategory) {
          setSelectedService({ name: subcategory.name, category: category.name });
        }
      } else {
        setSelectedService({ name: category.name, category: category.name });
      }
    }
    
    setCurrentView('professionals');
  };

  const handleProfessionalSearch = (serviceName: string) => {
    console.log('Professional search for:', serviceName);
    setSelectedCategory(serviceName);
    setCurrentView('professionals');
  };

  const handleServiceDetail = (service: any) => {
    setSelectedService(service);
    setCurrentView('service-detail');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedService(null);
    setSearchTerm("");
  };

  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedService(null);
  };

  const handleBrowseServices = () => {
    setCurrentView('categories');
  };

  // Service Detail View
  if (currentView === 'service-detail' && selectedService) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handleBackToCategories}
            className="text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
        </div>

        <ServiceWithRealData
          serviceName={selectedService.name}
          serviceDescription={selectedService.description}
          serviceIcon={() => <span className="text-2xl">{selectedService.icon}</span>}
        />
      </div>
    );
  }

  // Professionals List View
  if (currentView === 'professionals' && selectedCategory) {
    const serviceName = selectedService?.name || selectedCategory;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handleBackToCategories}
            className="text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
          <Badge variant="outline" className="text-green-600 border-green-600">
            {serviceName}
          </Badge>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={`Search for ${serviceName.toLowerCase()} professionals...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Available {serviceName} Professionals
          </h3>
          <RealTimeServiceProviders 
            serviceCategory={serviceName}
            maxResults={12}
            showDistance={true}
          />
        </div>
      </div>
    );
  }

  // Categories/Services Grid View
  if (currentView === 'categories') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handleBackToLanding}
            className="text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Professional Services</h2>
          <p className="text-gray-600">Find verified professionals in your area with real-time availability</p>
        </div>

        <EnhancedServiceGrid
          onServiceSelect={handleServiceSelect}
          onProfessionalSearch={handleProfessionalSearch}
          showPricing={false}
          layout="list"
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Wrench className="w-5 h-5" />
                <span>Browse All Handymen</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">Find skilled handymen for quick repairs and maintenance</p>
              <Button 
                onClick={() => handleProfessionalSearch('Handyman')}
                className="bg-green-600 hover:bg-green-700 w-full"
              >
                <MapPin className="w-4 h-4 mr-2" />
                View Handymen Near Me
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-800">
                <Users className="w-5 h-5" />
                <span>Browse All Contractors</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">Find licensed contractors for major projects and renovations</p>
              <Button 
                onClick={() => handleProfessionalSearch('Contractor')}
                className="bg-blue-600 hover:bg-blue-700 w-full"
              >
                <MapPin className="w-4 h-4 mr-2" />
                View Contractors Near Me
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Landing Page View
  return (
    <div className="space-y-8">
      {/* Enhanced Landing Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>Get Started in Minutes</span>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
            Find the Perfect{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Professional
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse thousands of skilled professionals ready to help with your next project. 
            From quick fixes to major renovations, we've got you covered.
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 lg:px-6 py-3 shadow-sm border border-gray-200">
              <stat.icon className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-800">{stat.value}</span>
              <span className="text-gray-600 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Action Card */}
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">
                Browse All Services
              </h3>
              <p className="text-gray-600">
                Explore our complete catalog of professional services and find the perfect match for your needs
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleBrowseServices}
                className="bg-green-600 hover:bg-green-700 w-full"
                size="lg"
              >
                Browse Services
              </Button>
              
              <div className="text-sm text-gray-500">
                Over {expandedServiceCategories.length} service categories available
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">500+</div>
                <div className="text-xs text-gray-500">Verified Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{expandedServiceCategories.length}+</div>
                <div className="text-xs text-gray-500">Service Categories</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Services Preview */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 text-center">Popular Services</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {popularServices.map((service, index) => (
            <div 
              key={index}
              onClick={() => handleProfessionalSearch(service.name)}
              className="group bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all duration-300 cursor-pointer transform hover:scale-105"
            >
              <div className="text-center">
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">{service.name}</h4>
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-xs text-green-600 font-medium">{service.trend}</span>
                  <span className="text-xs text-gray-500 hidden sm:inline">trending</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
