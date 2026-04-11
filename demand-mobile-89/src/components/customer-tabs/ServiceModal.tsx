
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Users, X, DollarSign } from 'lucide-react';
import { expandedServiceCategories, type ExpandedServiceCategory } from '@/data/expandedServiceCategories';
import { CustomQuoteRequestModal } from '@/components/quotes/CustomQuoteRequestModal';
import { ProfessionalsPopup } from './ProfessionalsPopup';

interface ServiceModalProps {
  category: ExpandedServiceCategory;
  children: React.ReactNode;
}

export const ServiceModal = ({ category, children }: ServiceModalProps) => {
  const [open, setOpen] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showProfessionalsPopup, setShowProfessionalsPopup] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');

  const handleViewProfessionals = (subcategoryName?: string) => {
    const searchParam = subcategoryName || category.name;
    setSelectedService(searchParam);
    setShowProfessionalsPopup(true);
  };

  const handleCustomQuote = (serviceName?: string) => {
    setSelectedService(serviceName || category.name);
    setShowQuoteModal(true);
    setOpen(false);
  };

  const handleBookProfessional = (professional: any, serviceName: string) => {
    const serviceParam = encodeURIComponent(serviceName);
    window.location.href = `/book/${professional.id}?service=${serviceParam}`;
  };

  const Icon = category.icon;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-4xl h-[90vh] p-0 gap-0 overflow-hidden bg-white rounded-2xl shadow-2xl border-0 flex flex-col">
          {/* Fixed Header */}
          <DialogHeader className="relative p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex-shrink-0">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            
            <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pr-12">
              <div className={`p-3 sm:p-4 rounded-xl ${category.color} shadow-lg`}>
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                  {category.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {category.description}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable Content Container */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 space-y-6">
              {/* Stats and Main CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {category.subcategories.length} Services Available
                    </p>
                    <p className="text-sm text-gray-600">Professional technicians ready to help</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button 
                    onClick={() => handleViewProfessionals()}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View All Professionals
                  </Button>
                  <Button 
                    onClick={() => handleCustomQuote()}
                    variant="outline"
                    className="border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Get Custom Quote
                  </Button>
                </div>
              </div>

              {/* Services Grid */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 px-1">Available Services</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {category.subcategories.map((subcategory) => (
                    <Card key={subcategory.id} className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 rounded-xl overflow-hidden bg-white">
                      <CardContent className="p-4 sm:p-5">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-base sm:text-lg text-gray-900 mb-2 leading-tight">
                              {subcategory.name}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                              {subcategory.description}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-end pt-2 border-t border-gray-100">
                            <div className="flex space-x-1">
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewProfessionals(subcategory.name)}
                                className="text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300 px-2 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 group-hover:scale-105"
                              >
                                View Pros
                                <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => handleCustomQuote(subcategory.name)}
                                className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 px-2 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 group-hover:scale-105"
                              >
                                Quote
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">
                      Need a custom quote?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Get personalized pricing from multiple professionals in your area
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleCustomQuote()}
                    variant="outline" 
                    className="w-full sm:w-auto border-gray-300 hover:bg-gray-50 px-6 py-2.5 rounded-lg font-medium transition-all duration-200"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Get Custom Quote
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ProfessionalsPopup
        isOpen={showProfessionalsPopup}
        onClose={() => setShowProfessionalsPopup(false)}
        serviceName={selectedService}
        onBookProfessional={handleBookProfessional}
      />

      <CustomQuoteRequestModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        initialServiceName={selectedService}
      />
    </>
  );
};
