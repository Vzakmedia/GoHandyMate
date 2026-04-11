
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Star, MapPin, Clock, Phone, MessageCircle, User, Calendar, CheckCircle, ChevronDown, ShoppingCart, AlertCircle } from 'lucide-react';
import { useHandymanProfile } from '@/hooks/useHandymanProfile';
import { useRealRatings } from '@/hooks/useRealRatings';
import { usePublicHandymanData } from '@/hooks/usePublicHandymanData';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { expandedServiceCategories } from '@/data/expandedServiceCategories';

interface HandymanProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  handymanId: string;
}

export const HandymanProfileModal = ({ isOpen, onClose, handymanId }: HandymanProfileModalProps) => {
  // Always call all hooks with proper fallbacks - never conditionally
  const { handyman, loading } = useHandymanProfile(handymanId || '');
  const { reviews, loading: reviewsLoading, averageRating, totalReviews } = useRealRatings(handymanId || '');
  // Only call usePublicHandymanData when we have a valid handymanId to avoid warnings
  const { data: handymanData } = usePublicHandymanData(handymanId || null);
  const [selectedService, setSelectedService] = useState<string>('');

  // Mock completed jobs photos - in real app, this would come from the database
  const completedJobsPhotos = [
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=300&h=200&fit=crop'
  ];

  const handleBookNow = () => {
    if (!handyman) return;
    window.location.href = `/book/${handymanId}`;
    toast.success(`Booking ${handyman.full_name}`);
  };

  const handleBookService = (serviceName: string, price: number, categoryId?: string, subcategoryId?: string) => {
    const params = new URLSearchParams({
      service: serviceName,
      price: price.toString()
    });
    
    if (categoryId) params.append('category', categoryId);
    if (subcategoryId) params.append('subcategory', subcategoryId);
    
    window.location.href = `/book/${handymanId}?${params.toString()}`;
    toast.success(`Booking ${serviceName} for $${price}`);
  };

  const handleMessage = () => {
    window.location.href = `/messages?to=${handymanId}`;
  };

  const handleCall = () => {
    toast.info('Calling feature will be available soon');
  };

  // Get service categories and subcategories with pricing - improved logic
  const getServicesWithPricing = () => {
    console.log('getServicesWithPricing: handymanData:', handymanData);
    console.log('getServicesWithPricing: handyman from profile:', handyman);
    
    // Try to get service pricing from multiple sources
    let servicePricingData: any[] = [];
    
    if (handymanData?.servicePricing && handymanData.servicePricing.length > 0) {
      servicePricingData = handymanData.servicePricing;
      console.log('Using handymanData.servicePricing:', servicePricingData);
    } else if (handyman?.service_pricing && handyman.service_pricing.length > 0) {
      servicePricingData = handyman.service_pricing;
      console.log('Using handyman.service_pricing:', servicePricingData);
    } else {
      console.log('No service pricing data found in either source');
      return [];
    }
    
    const servicesMap = new Map();
    
    servicePricingData.forEach(pricing => {
      console.log('Processing pricing:', pricing);
      
      if (!pricing.is_active) {
        console.log('Skipping inactive pricing:', pricing.category_id);
        return;
      }
      
      const category = expandedServiceCategories.find(cat => cat.id === pricing.category_id);
      if (!category) {
        console.log('Category not found for:', pricing.category_id);
        return;
      }
      
      console.log('Found category:', category.name);
      
      if (!servicesMap.has(category.id)) {
        servicesMap.set(category.id, {
          categoryId: category.id,
          categoryName: category.name,
          categoryIcon: category.icon,
          categoryPrice: null,
          subcategories: []
        });
      }
      
      if (pricing.subcategory_id) {
        const subcategory = category.subcategories.find(sub => sub.id === pricing.subcategory_id);
        if (subcategory) {
          console.log('Adding subcategory:', subcategory.name);
          servicesMap.get(category.id).subcategories.push({
            id: subcategory.id,
            name: subcategory.name,
            price: pricing.custom_price || pricing.base_price,
            unit: '/hr'
          });
        }
      } else {
        // Category-level pricing
        console.log('Setting category price for:', category.name);
        servicesMap.get(category.id).categoryPrice = pricing.custom_price || pricing.base_price;
      }
    });
    
    const result = Array.from(servicesMap.values());
    console.log('Final services with pricing:', result);
    return result;
  };

  // Early return if modal should not be shown
  if (!isOpen) {
    return null;
  }

  // Don't show anything if no handymanId provided
  if (!handymanId) {
    return null;
  }

  // Loading state
  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Not found state
  if (!handyman) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="text-center py-8">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Handyman Profile Not Found</h3>
            <p className="text-gray-600 mb-4">
              The handyman profile you're looking for doesn't exist or may have been removed.
            </p>
            <div className="text-sm text-gray-500 mb-4">
              Profile ID: <code className="bg-gray-100 px-2 py-1 rounded">{handymanId}</code>
            </div>
            <Button onClick={onClose} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const servicesWithPricing = getServicesWithPricing();

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(review => review.rating === rating).length;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { rating, count, percentage };
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
                {handyman.avatar_url ? (
                  <img 
                    src={handyman.avatar_url} 
                    alt={handyman.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  handyman.full_name.split(' ').map(n => n[0]).join('').toUpperCase()
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{handyman.full_name}</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    {averageRating.toFixed(1)} ({totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-green-600">
                      {handyman.completedJobs || 0}
                    </div>
                    <div className="text-sm text-gray-600">Jobs Completed</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {servicesWithPricing.length}
                    </div>
                    <div className="text-sm text-gray-600">Services Offered</div>
                  </div>
                </CardContent>
              </Card>
            </div>


            {/* Services & Pricing Dropdown */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center justify-between">
                  Services & Pricing
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {servicesWithPricing.length} Available
                  </Badge>
                </h3>
                
                {servicesWithPricing.length > 0 ? (
                  <div className="space-y-3">
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a service to view pricing" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {servicesWithPricing.map((service) => (
                          <SelectItem key={service.categoryId} value={service.categoryId}>
                            <div className="flex items-center justify-between w-full">
                              <span className="font-medium">{service.categoryName}</span>
                              {service.categoryPrice && (
                                <Badge variant="outline" className="ml-2 text-green-600 border-green-200">
                                  ${service.categoryPrice}/hr
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {selectedService && (
                      <div className="mt-4 space-y-3">
                        {servicesWithPricing
                          .filter(service => service.categoryId === selectedService)
                          .map((service, index) => (
                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-900">{service.categoryName}</h4>
                                 <div className="flex items-center gap-2">
                                   {service.categoryPrice && (
                                     <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                       ${service.categoryPrice}/hr
                                     </div>
                                   )}
                                   <Button
                                     size="sm"
                                     onClick={() => handleBookService(
                                       service.categoryName,
                                       service.categoryPrice,
                                       service.categoryId
                                     )}
                                     className="bg-blue-600 hover:bg-blue-700 text-white"
                                   >
                                     <ShoppingCart className="w-3 h-3 mr-1" />
                                     Book
                                   </Button>
                                 </div>
                              </div>
                              
                              {service.subcategories.length > 0 && (
                                <div className="space-y-2">
                                  <p className="text-sm font-medium text-gray-700 mb-2">Available Subcategories:</p>
                                  <div className="grid gap-2">
                                    {service.subcategories.map((sub, subIndex) => (
                                      <div key={subIndex} className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
                                        <span className="text-sm text-gray-700">{sub.name}</span>
                                        <div className="flex items-center gap-2">
                                         <span className="font-semibold text-green-600 text-sm">
                                           ${sub.price}{sub.unit}
                                         </span>
                                         <Button
                                           size="sm"
                                           onClick={() => handleBookService(
                                             sub.name,
                                             sub.price,
                                             service.categoryId,
                                             sub.id
                                           )}
                                           className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 h-6"
                                         >
                                           <ShoppingCart className="w-3 h-3 mr-1" />
                                           Book
                                         </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">No services configured yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Debug: handymanData has {handymanData?.servicePricing?.length || 0} pricing records,
                      handyman has {handyman?.service_pricing?.length || 0} service_pricing records
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Completed Jobs Photos */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Recent Work</h3>
                <div className="grid grid-cols-2 gap-2">
                  {completedJobsPhotos.map((photo, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden group cursor-pointer">
                      <img 
                        src={photo} 
                        alt={`Completed work ${index + 1}`}
                        className="w-full h-20 object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Reviews */}
          <div className="lg:col-span-2 space-y-4">
            {/* Rating Distribution */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Rating Distribution</h3>
                <div className="space-y-3">
                  {ratingDistribution.map((item) => (
                    <div key={item.rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm font-medium">{item.rating}</span>
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      </div>
                      
                      <div className="flex-1 relative">
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 w-20 text-right">
                        <span className="text-sm text-gray-600">{item.count}</span>
                        <span className="text-xs text-gray-500">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Recent Reviews</h3>
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {reviews.slice(0, 5).map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{review.customer.full_name}</h5>
                              <div className="flex items-center space-x-1 mt-1">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                ))}
                                {Array.from({ length: 5 - review.rating }).map((_, i) => (
                                  <Star key={i} className="w-4 h-4 text-gray-300" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}</span>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {review.job.title}
                          </Badge>
                        </div>
                        
                        {review.review_text && (
                          <p className="text-gray-700 text-sm leading-relaxed">{review.review_text}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No reviews yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
