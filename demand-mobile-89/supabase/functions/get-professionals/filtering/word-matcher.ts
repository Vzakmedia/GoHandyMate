
import type { Professional } from '../types.ts';

export function hasWordMatch(professional: Professional, serviceName: string): boolean {
  const lowerServiceName = serviceName.toLowerCase();
  const serviceWords = lowerServiceName.split(/[\s\-_]+/).filter(word => word.length > 2);
  
  if (serviceWords.length === 0) return false;
  
  return serviceWords.some(word => {
    // Check service pricing for individual words
    const servicePricingMatch = professional.service_pricing?.some(pricing => {
      if (!pricing.is_active) return false;
      
      const lowerCategoryId = pricing.category_id.toLowerCase();
      const lowerSubcategoryId = pricing.subcategory_id?.toLowerCase();
      
      // Enhanced matching with special electrical cases
      const categoryMatch = lowerCategoryId.includes(word) || 
        word.includes(lowerCategoryId) ||
        // Special electrical matching
        (word === 'fixture' && lowerCategoryId.includes('electrical')) ||
        (word === 'light' && lowerCategoryId.includes('electrical')) ||
        (word === 'installation' && lowerCategoryId.includes('electrical'));
      
      const subcategoryMatch = lowerSubcategoryId && (
        lowerSubcategoryId.includes(word) || 
        word.includes(lowerSubcategoryId) ||
        // Special electrical matching for subcategories
        (word === 'fixture' && lowerSubcategoryId.includes('electrical')) ||
        (word === 'light' && lowerSubcategoryId.includes('electrical'))
      );
      
      return categoryMatch || subcategoryMatch;
    }) || false;

    // If no service pricing match, check skills as fallback
    if (!servicePricingMatch && (!professional.service_pricing || professional.service_pricing.length === 0)) {
      return professional.skill_rates?.some(skillRate => {
        if (!skillRate.is_active) return false;
        
        const lowerSkillName = skillRate.skill_name.toLowerCase();
        return lowerSkillName.includes(word) || 
          word.includes(lowerSkillName) ||
          // Special electrical matching
          (word === 'fixture' && lowerSkillName.includes('electrical')) ||
          (word === 'light' && lowerSkillName.includes('electrical'));
      }) || false;
    }
    
    return servicePricingMatch;
  });
}
