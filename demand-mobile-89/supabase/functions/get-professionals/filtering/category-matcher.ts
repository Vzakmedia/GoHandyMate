
import type { Professional } from '../types.ts';
import { serviceCategories } from './service-categories.ts';

export function hasCategoryMatch(professional: Professional, serviceName: string): boolean {
  const lowerServiceName = serviceName.toLowerCase();
  
  // Check each service category for matches
  for (const [category, config] of Object.entries(serviceCategories)) {
    const { keywords, categoryIds } = config;
    
    // Enhanced keyword matching for compound service names
    const keywordMatch = keywords.some(keyword => {
      const lowerKeyword = keyword.toLowerCase();
      
      // Direct match
      if (lowerServiceName.includes(lowerKeyword) || lowerKeyword.includes(lowerServiceName)) {
        return true;
      }
      
      // Split service name into words for better matching
      const serviceWords = lowerServiceName.split(/[\s\-_]+/).filter(word => word.length > 2);
      const keywordWords = lowerKeyword.split(/[\s\-_]+/).filter(word => word.length > 2);
      
      // Check if any service word matches any keyword word
      const wordMatch = serviceWords.some(serviceWord => 
        keywordWords.some(keywordWord => 
          serviceWord === keywordWord || 
          serviceWord.includes(keywordWord) || 
          keywordWord.includes(serviceWord) ||
          // Special cross-matching for electrical services - expanded
          (serviceWord === 'fixture' && keywordWord === 'light') ||
          (serviceWord === 'light' && keywordWord === 'fixture') ||
          (serviceWord === 'installation' && keywordWord.includes('install')) ||
          (serviceWord === 'outlet' && keywordWord === 'electrical') ||
          (serviceWord === 'switch' && keywordWord === 'electrical') ||
          (serviceWord === 'wiring' && keywordWord === 'electrical')
        )
      );
      
      return wordMatch;
    });

    if (keywordMatch) {
      // Check if professional has any active service pricing in this category
      const hasServiceInCategory = professional.service_pricing?.some(pricing => {
        if (!pricing.is_active) return false;
        
        return categoryIds.some(categoryId => {
          const lowerCategoryId = categoryId.toLowerCase();
          const lowerPricingCategoryId = pricing.category_id.toLowerCase();
          const lowerPricingSubcategoryId = pricing.subcategory_id?.toLowerCase();
          
          // Enhanced matching including partial matches
          return lowerPricingCategoryId.includes(lowerCategoryId) ||
            lowerCategoryId.includes(lowerPricingCategoryId) ||
            (lowerPricingSubcategoryId && (
              lowerPricingSubcategoryId.includes(lowerCategoryId) ||
              lowerCategoryId.includes(lowerPricingSubcategoryId)
            )) ||
            // Special handling for electrical services - expanded
            (lowerCategoryId.includes('light') && lowerPricingCategoryId.includes('electrical')) ||
            (lowerCategoryId.includes('fixture') && lowerPricingCategoryId.includes('electrical')) ||
            (lowerCategoryId.includes('outlet') && lowerPricingCategoryId.includes('electrical')) ||
            (lowerCategoryId.includes('switch') && lowerPricingCategoryId.includes('electrical')) ||
            (lowerCategoryId.includes('wiring') && lowerPricingCategoryId.includes('electrical'));
        });
      }) || false;

      if (hasServiceInCategory) {
        return true;
      }
    }
  }
  
  return false;
}
