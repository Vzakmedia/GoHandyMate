import { useState, useRef, useEffect } from 'react';
import { 
  Wrench, 
  Monitor, 
  Truck, 
  Sparkles, 
  Trees, 
  Hammer, 
  Paintbrush, 
  TrendingUp,
  ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { expandedServiceCategories } from '@/data/expandedServiceCategories';
import { ServiceModal } from '@/components/customer-tabs/ServiceModal';
import { ProfessionalsPopup } from '@/components/customer-tabs/ProfessionalsPopup';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';

// Map category IDs to their corresponding expanded service categories
const categoryMapping = {
  'plumbing': 'plumbing',
  'electrical': 'electrical', 
  'cleaning': 'cleaning',
  'landscaping': 'landscaping',
  'repairs': 'handyman',
  'painting': 'painting',
  'assembly': 'assembly',
  'trending': 'hvac' // Map trending to HVAC for now
};

const categories = [
  { id: 'plumbing', name: 'Plumbing', icon: Wrench, mappedId: 'plumbing' },
  { id: 'electrical', name: 'Electrical', icon: Monitor, mappedId: 'electrical' },
  { id: 'assembly', name: 'Assembly', icon: Truck, mappedId: 'assembly' },
  { id: 'cleaning', name: 'Cleaning', icon: Sparkles, mappedId: 'cleaning' },
  { id: 'landscaping', name: 'Landscaping', icon: Trees, mappedId: 'landscaping' },
  { id: 'repairs', name: 'Home Repairs', icon: Hammer, mappedId: 'handyman' },
  { id: 'painting', name: 'Painting', icon: Paintbrush, mappedId: 'painting' },
  { id: 'trending', name: 'HVAC', icon: TrendingUp, mappedId: 'hvac' },
];

const popularServices = [
  'Plumbing Repairs',
  'Electrical Work', 
  'House Cleaning',
  'Furniture Assembly',
  'TV Mounting',
  'Bathroom Renovation'
];

export const GoHandyMateCategories = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSubservices, setShowSubservices] = useState<string | null>(null);
  const [showProfessionalsPopup, setShowProfessionalsPopup] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [dropdownPosition, setDropdownPosition] = useState<{[key: string]: string}>({});
  const buttonRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});
  const { isMobile, isTablet } = useResponsiveBreakpoints();

  const calculateDropdownPosition = (categoryId: string) => {
    const buttonEl = buttonRefs.current[categoryId];
    if (!buttonEl) return 'left-1/2 transform -translate-x-1/2';

    const rect = buttonEl.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    const dropdownWidth = isMobile ? screenWidth - 32 : 288; // Full width on mobile with padding

    // On mobile, always use full width
    if (isMobile) {
      return 'left-0 right-0 mx-4';
    }

    // Check if centering would cause overflow on larger screens
    const centerPosition = rect.left + rect.width / 2;
    const leftEdge = centerPosition - dropdownWidth / 2;
    const rightEdge = centerPosition + dropdownWidth / 2;

    if (rightEdge > screenWidth - 16) {
      return 'right-0';
    } else if (leftEdge < 16) {
      return 'left-0';
    } else {
      return 'left-1/2 transform -translate-x-1/2';
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (showSubservices === categoryId) {
      setShowSubservices(null);
    } else {
      // Calculate position before showing dropdown
      const position = calculateDropdownPosition(categoryId);
      setDropdownPosition(prev => ({ ...prev, [categoryId]: position }));
      setShowSubservices(categoryId);
    }
  };

  // Recalculate positions on window resize
  useEffect(() => {
    const handleResize = () => {
      if (showSubservices) {
        const position = calculateDropdownPosition(showSubservices);
        setDropdownPosition(prev => ({ ...prev, [showSubservices]: position }));
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showSubservices]);

  const handleSubserviceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setShowProfessionalsPopup(true);
  };

  const handlePopularServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setShowProfessionalsPopup(true);
  };

  const getExpandedCategory = (mappedId: string) => {
    return expandedServiceCategories.find(cat => cat.id === mappedId);
  };

  return (
    <>
      <section className={`${isMobile ? 'py-6' : 'py-12'} bg-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Icons */}
          <div className={`grid ${
            isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-4 lg:grid-cols-8 gap-6'
          } ${isMobile ? 'mb-8' : 'mb-12'}`}>
            {categories.map((category) => {
              const IconComponent = category.icon;
              const expandedCategory = getExpandedCategory(category.mappedId);
              const isActive = showSubservices === category.id;
              
              return (
                <div key={category.id} className="relative">
                  <button
                    ref={(el) => (buttonRefs.current[category.id] = el)}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`flex flex-col items-center gap-3 ${
                      isMobile ? 'p-4 min-h-[120px]' : 'p-4'
                    } rounded-xl transition-all duration-200 hover:bg-gray-50 group w-full ${
                      isActive ? 'text-green-600 bg-green-50 shadow-md' : 'text-gray-600 hover:text-gray-900'
                    } ${isMobile ? 'active:scale-95' : ''}`}
                  >
                    <div className={`${
                      isMobile ? 'w-20 h-20' : 'w-16 h-16'
                    } rounded-full flex items-center justify-center transition-colors ${
                      isActive 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    }`}>
                      <IconComponent className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'}`} />
                    </div>
                    <span className={`${
                      isMobile ? 'text-sm' : 'text-sm'
                    } font-medium text-center leading-tight`}>
                      {category.name}
                    </span>
                    {!isMobile && (
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        isActive ? 'rotate-180' : ''
                      }`} />
                    )}
                    {isActive && !isMobile && (
                      <div className="w-8 h-0.5 bg-green-600 rounded-full"></div>
                    )}
                  </button>

                  {/* Subservices Dropdown */}
                  {isActive && expandedCategory && (
                    <>
                      {isMobile && (
                        <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setShowSubservices(null)} />
                      )}
                      <Card className={`${
                        isMobile 
                          ? 'fixed bottom-0 left-0 right-0 z-40 rounded-t-2xl rounded-b-none max-h-[80vh] animate-in slide-in-from-bottom-full duration-300' 
                          : `absolute top-full mt-2 w-72 z-20 shadow-xl border-2 border-green-100 ${dropdownPosition[category.id] || 'left-1/2 transform -translate-x-1/2'}`
                      } shadow-2xl border-2 border-green-100`}>
                        <CardContent className={`${isMobile ? 'p-0' : 'p-4'}`}>
                          {isMobile && (
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
                              <h4 className="text-xl font-bold text-gray-900">
                                {expandedCategory.name}
                              </h4>
                              <button
                                onClick={() => setShowSubservices(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                              >
                                <ChevronDown className="w-5 h-5 rotate-180" />
                              </button>
                            </div>
                          )}
                          
                          {!isMobile && (
                            <h4 className="font-semibold text-gray-900 mb-3 text-center">
                              {expandedCategory.name}
                            </h4>
                          )}
                          
                          <div className={`${
                            isMobile ? 'p-4 space-y-1 overflow-y-auto' : 'space-y-2 max-h-64 overflow-y-auto'
                          } flex-1`} style={isMobile ? { maxHeight: 'calc(80vh - 140px)' } : {}}>
                            {expandedCategory.subcategories.map((subcategory, index) => (
                              <button
                                key={subcategory.id}
                                onClick={() => handleSubserviceClick(subcategory.name)}
                                className={`w-full text-left ${
                                  isMobile ? 'p-4 border-b border-gray-100 last:border-b-0' : 'p-3 rounded-lg border border-transparent hover:border-green-200'
                                } hover:bg-green-50 hover:text-green-700 transition-colors ${
                                  isMobile ? 'active:bg-green-100' : ''
                                }`}
                              >
                                <div className={`font-semibold ${
                                  isMobile ? 'text-lg' : 'text-sm'
                                } text-gray-900`}>{subcategory.name}</div>
                                <div className={`${
                                  isMobile ? 'text-base mt-2' : 'text-xs mt-1'
                                } text-gray-600`}>{subcategory.description}</div>
                              </button>
                            ))}
                          </div>
                          
                          <div className={`${
                            isMobile ? 'p-4 bg-white border-t border-gray-100' : 'mt-4 pt-4 border-t border-gray-100'
                          }`}>
                            <ServiceModal category={expandedCategory}>
                              <Button 
                                variant="outline" 
                                className={`w-full border-green-300 text-green-700 hover:bg-green-50 ${
                                  isMobile ? 'py-4 text-lg font-semibold rounded-xl' : ''
                                }`}
                                onClick={() => setShowSubservices(null)}
                              >
                                View All {expandedCategory.name}
                              </Button>
                            </ServiceModal>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Popular Services */}
          <div className={`${
            isMobile ? 'space-y-3' : 'flex flex-wrap gap-3 justify-center'
          }`}>
            {isMobile ? (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Services</h3>
                {popularServices.map((service, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => handlePopularServiceClick(service)}
                    className="w-full justify-start py-4 px-4 text-left border-gray-200 hover:border-green-600 hover:text-green-600 transition-colors active:scale-98"
                  >
                    <span className="text-base font-medium">{service}</span>
                  </Button>
                ))}
              </div>
            ) : (
              popularServices.map((service, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handlePopularServiceClick(service)}
                  className="rounded-full px-6 py-2 text-sm border-gray-300 hover:border-green-600 hover:text-green-600 transition-colors"
                >
                  {service}
                </Button>
              ))
            )}
          </div>
        </div>
      </section>

      <ProfessionalsPopup
        isOpen={showProfessionalsPopup}
        onClose={() => setShowProfessionalsPopup(false)}
        serviceName={selectedService}
      />
    </>
  );
};