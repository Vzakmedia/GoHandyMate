import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowRight, TrendingUp, Users, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { useToast } from '@/hooks/use-toast';
import { QuoteFormModal } from '@/components/QuoteFormModal';
import { BusinessProfileModal } from '@/components/BusinessProfileModal';

interface FeaturedBusiness {
  id: string;
  name: string;
  logo: string;
  category: string;
  rating: number;
  specialOffer: string;
  image: string;
  description: string;
}

const featuredBusinesses: FeaturedBusiness[] = [
  {
    id: '1',
    name: 'Elite Home Services',
    logo: '/placeholder.svg',
    category: 'Home Improvement',
    rating: 4.9,
    specialOffer: '20% OFF First Service',
    image: '/placeholder.svg',
    description: 'Professional home renovation and repair services'
  },
  {
    id: '2',
    name: 'GreenClean Pro',
    logo: '/placeholder.svg',
    category: 'Cleaning Services',
    rating: 4.8,
    specialOffer: 'Free Estimate',
    image: '/placeholder.svg',
    description: 'Eco-friendly cleaning solutions for homes and offices'
  },
  {
    id: '3',
    name: 'Austin Landscaping Co.',
    logo: '/placeholder.svg',
    category: 'Landscaping',
    rating: 4.7,
    specialOffer: 'Free Consultation',
    image: '/placeholder.svg',
    description: 'Transform your outdoor space with professional landscaping'
  }
];

export const AdvertisingBanner = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<FeaturedBusiness | null>(null);

  const handleAdvertisingClick = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access advertising features.",
        variant: "destructive"
      });
      return;
    }
    navigate('/business-advertising');
  };

  const nextBusiness = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredBusinesses.length);
  };

  const prevBusiness = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredBusinesses.length) % featuredBusinesses.length);
  };

  const handleGetQuote = (business: FeaturedBusiness) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request a quote.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedBusiness(business);
    setShowQuoteModal(true);
  };

  const handleViewProfile = (business: FeaturedBusiness) => {
    setSelectedBusiness(business);
    setShowProfileModal(true);
  };

  const currentBusiness = featuredBusinesses[currentIndex];

  return (
    <>
      <section className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              <span>Featured Business Partners</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Trusted{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Local Businesses
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover verified professionals and businesses in your area. Quality services with exclusive offers for our community.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-gray-200">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-800">500+</span>
                <span className="text-gray-600 text-sm">Verified Businesses</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-gray-200">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-800">10k+</span>
                <span className="text-gray-600 text-sm">Happy Customers</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-gray-200">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-semibold text-gray-800">4.8</span>
                <span className="text-gray-600 text-sm">Average Rating</span>
              </div>
            </div>
          </div>

          {/* Featured Business Carousel */}
          <div className="relative max-w-4xl mx-auto">
            <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border border-gray-200 overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Business Image */}
                  <div className="relative h-64 md:h-80">
                    <img
                      src={currentBusiness.image}
                      alt={currentBusiness.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    
                    {/* Special Offer Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-500 text-white font-bold text-sm px-3 py-1">
                        {currentBusiness.specialOffer}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Business Info */}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={currentBusiness.logo}
                        alt={`${currentBusiness.name} logo`}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{currentBusiness.name}</h3>
                        <Badge variant="secondary" className="mt-1">{currentBusiness.category}</Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(currentBusiness.rating)
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold text-gray-800">{currentBusiness.rating}</span>
                      <span className="text-gray-600">rating</span>
                    </div>
                    
                    <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                      {currentBusiness.description}
                    </p>
                    
                    <div className="flex space-x-3">
                      <Button 
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3"
                        onClick={() => handleGetQuote(currentBusiness)}
                      >
                        Get Quote
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                      <Button 
                        variant="outline" 
                        className="px-6 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                        onClick={() => handleViewProfile(currentBusiness)}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Navigation Arrows */}
            <button
              onClick={prevBusiness}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg border border-gray-200 transition-all hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={nextBusiness}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg border border-gray-200 transition-all hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mt-6">
              {featuredBusinesses.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex ? 'bg-indigo-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to grow your business?
              </h3>
              <p className="text-gray-600 mb-6">
                Join hundreds of successful businesses advertising on our platform. Reach thousands of local customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8"
                  onClick={handleAdvertisingClick}
                >
                  Start Advertising
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  onClick={handleAdvertisingClick}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form Modal */}
      {selectedBusiness && (
        <QuoteFormModal
          isOpen={showQuoteModal}
          onClose={() => {
            setShowQuoteModal(false);
            setSelectedBusiness(null);
          }}
          businessName={selectedBusiness.name}
          businessId={selectedBusiness.id}
          serviceCategory={selectedBusiness.category}
        />
      )}

      {/* Business Profile Modal */}
      {selectedBusiness && (
        <BusinessProfileModal
          isOpen={showProfileModal}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedBusiness(null);
          }}
          businessName={selectedBusiness.name}
          businessId={selectedBusiness.id}
          adData={{
            ad_title: selectedBusiness.name,
            ad_description: selectedBusiness.description,
            image_url: selectedBusiness.image,
            target_audience: selectedBusiness.category
          }}
        />
      )}
    </>
  );
};
