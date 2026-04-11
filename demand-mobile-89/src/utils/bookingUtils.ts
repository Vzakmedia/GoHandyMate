
import { expandedServiceCategories } from '@/data/expandedServiceCategories';

export const getSelectedServicePricing = (
  priceFromUrl: string,
  categoryFromUrl: string,
  subcategoryFromUrl: string,
  serviceFromUrl: string,
  handymanData: any
): number => {
  console.log('bookingUtils: getSelectedServicePricing called with:', {
    priceFromUrl,
    categoryFromUrl,
    subcategoryFromUrl,
    serviceFromUrl,
    handymanDataKeys: handymanData ? Object.keys(handymanData) : null,
    servicePricingCount: handymanData?.servicePricing?.length || 0,
    skillRatesCount: handymanData?.skillRates?.length || 0
  });

  if (priceFromUrl) {
    console.log('bookingUtils: Using price from URL:', priceFromUrl);
    return parseFloat(priceFromUrl);
  }

  // PRIORITY 1: Find pricing from ACTIVE service pricing first
  if (handymanData?.servicePricing?.length > 0) {
    console.log('bookingUtils: Checking ACTIVE service pricing entries:', handymanData.servicePricing);
    
    // Filter only ACTIVE service pricing
    const activeServicePricing = handymanData.servicePricing.filter((sp: any) => sp.is_active === true);
    console.log('bookingUtils: Active service pricing entries:', activeServicePricing);
    
    if (activeServicePricing.length > 0) {
      // First try exact category/subcategory match
      let servicePricing = activeServicePricing.find((sp: any) => {
        const categoryMatch = sp.category_id === categoryFromUrl;
        const subcategoryMatch = (!subcategoryFromUrl && !sp.subcategory_id) || 
                               (subcategoryFromUrl && sp.subcategory_id === subcategoryFromUrl);
        
        console.log('bookingUtils: Checking active service pricing exact match:', {
          categoryId: sp.category_id,
          subcategoryId: sp.subcategory_id,
          categoryMatch,
          subcategoryMatch,
          customPrice: sp.custom_price,
          basePrice: sp.base_price
        });
        
        return categoryMatch && subcategoryMatch;
      });
      
      // If no exact match, try service name matching with active entries only
      if (!servicePricing && serviceFromUrl) {
        servicePricing = activeServicePricing.find((sp: any) => {
          const category = expandedServiceCategories.find(cat => cat.id === sp.category_id);
          if (!category) return false;
          
          let serviceName = category.name;
          if (sp.subcategory_id) {
            const subcategory = category.subcategories.find(sub => sub.id === sp.subcategory_id);
            if (subcategory) serviceName = subcategory.name;
          }
          
          const serviceNameLower = serviceName.toLowerCase();
          const serviceFromUrlLower = serviceFromUrl.toLowerCase();
          
          const nameMatch = serviceNameLower.includes(serviceFromUrlLower) || 
                           serviceFromUrlLower.includes(serviceNameLower);
          
          console.log('bookingUtils: Checking active service pricing name match:', {
            serviceName,
            serviceFromUrl,
            nameMatch,
            categoryId: sp.category_id,
            customPrice: sp.custom_price,
            basePrice: sp.base_price
          });
          
          return nameMatch;
        });
      }
      
      if (servicePricing) {
        // Prioritize custom_price over base_price for accurate pricing
        const actualPrice = servicePricing.custom_price || servicePricing.base_price;
        console.log('bookingUtils: Found ACTIVE service pricing - using configured price:', {
          customPrice: servicePricing.custom_price,
          basePrice: servicePricing.base_price,
          finalPrice: actualPrice
        });
        return actualPrice;
      }
      
      // Use first active service pricing as fallback
      const firstActiveService = activeServicePricing[0];
      const fallbackPrice = firstActiveService.custom_price || firstActiveService.base_price;
      console.log('bookingUtils: Using first active service pricing as fallback:', fallbackPrice);
      return fallbackPrice;
    }
  }

  // PRIORITY 2: Check ACTIVE skill rates only if no active service pricing found
  if (handymanData?.skillRates?.length > 0) {
    console.log('bookingUtils: Checking ACTIVE skill rates:', handymanData.skillRates);
    
    // Filter only ACTIVE skill rates
    const activeSkillRates = handymanData.skillRates.filter((sr: any) => sr.is_active === true);
    console.log('bookingUtils: Active skill rates entries:', activeSkillRates);
    
    if (activeSkillRates.length > 0) {
      const skillRate = activeSkillRates.find((sr: any) => {
        const skillMatch = sr.skill_name.toLowerCase().includes(serviceFromUrl.toLowerCase()) ||
                         serviceFromUrl.toLowerCase().includes(sr.skill_name.toLowerCase());
        
        console.log('bookingUtils: Checking active skill rate:', {
          skillName: sr.skill_name,
          serviceFromUrl,
          skillMatch,
          hourlyRate: sr.hourly_rate
        });
        
        return skillMatch;
      });
      
      if (skillRate) {
        console.log('bookingUtils: Found ACTIVE skill rate - using configured rate:', skillRate.hourly_rate);
        return skillRate.hourly_rate;
      }
      
      // Use first active skill rate as fallback
      const firstActiveSkill = activeSkillRates[0];
      console.log('bookingUtils: Using first active skill rate as fallback:', firstActiveSkill.hourly_rate);
      return firstActiveSkill.hourly_rate;
    }
  }

  console.log('bookingUtils: No active pricing found, using emergency fallback rate of $150');
  return 150; // Higher fallback to ensure handyman gets fair compensation when no pricing is configured
};

export const getServiceName = (
  serviceFromUrl: string,
  categoryFromUrl: string,
  subcategoryFromUrl: string
): string => {
  if (serviceFromUrl) return serviceFromUrl;
  
  if (categoryFromUrl) {
    const category = expandedServiceCategories.find(cat => cat.id === categoryFromUrl);
    if (category) {
      if (subcategoryFromUrl) {
        const subcategory = category.subcategories.find(sub => sub.id === subcategoryFromUrl);
        return subcategory ? subcategory.name : category.name;
      }
      return category.name;
    }
  }
  
  return 'General Service';
};

export const calculateEstimatedCost = (
  serviceRate: number,
  estimatedHours: number,
  urgency: string
): number => {
  const multiplier = urgency === 'emergency' ? 2 : urgency === 'same_day' ? 1.5 : 1;
  return Math.round(serviceRate * estimatedHours * multiplier);
};
