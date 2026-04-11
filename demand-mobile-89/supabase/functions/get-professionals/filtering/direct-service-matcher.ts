
import type { Professional } from '../types.ts';

export function hasDirectServiceMatch(professional: Professional, serviceName: string): boolean {
  const lowerServiceName = serviceName.toLowerCase();
  
  console.log(`[DIRECT-SERVICE] Checking professional ${professional.full_name} for service "${serviceName}"`);
  
  const hasMatch = professional.service_pricing?.some(pricing => {
    if (!pricing.is_active) {
      console.log(`[DIRECT-SERVICE] Skipping inactive pricing for ${pricing.category_id}`);
      return false;
    }
    
    const lowerCategoryId = pricing.category_id.toLowerCase();
    const lowerSubcategoryId = pricing.subcategory_id?.toLowerCase();
    
    console.log(`[DIRECT-SERVICE] Checking pricing: category=${lowerCategoryId}, subcategory=${lowerSubcategoryId}`);
    
    // Enhanced electrical service detection
    const isElectricalService = (
      lowerServiceName.includes('light') ||
      lowerServiceName.includes('fixture') ||
      lowerServiceName.includes('electrical') ||
      lowerServiceName.includes('install') ||
      lowerServiceName.includes('installation') ||
      lowerServiceName.includes('outlet') ||
      lowerServiceName.includes('switch') ||
      lowerServiceName.includes('wiring') ||
      lowerServiceName.includes('lamp') ||
      lowerServiceName.includes('ceiling') ||
      lowerServiceName.includes('chandelier')
    );
    
    // Check if professional offers electrical services
    const hasElectricalService = (
      lowerCategoryId.includes('electrical') || 
      lowerCategoryId.includes('light') || 
      lowerCategoryId.includes('fixture') ||
      lowerCategoryId.includes('outlet') ||
      lowerCategoryId.includes('switch') ||
      lowerCategoryId.includes('wiring') ||
      lowerCategoryId.includes('install') ||
      (lowerSubcategoryId && (
        lowerSubcategoryId.includes('electrical') ||
        lowerSubcategoryId.includes('light') ||
        lowerSubcategoryId.includes('fixture') ||
        lowerSubcategoryId.includes('outlet') ||
        lowerSubcategoryId.includes('switch') ||
        lowerSubcategoryId.includes('wiring') ||
        lowerSubcategoryId.includes('install')
      ))
    );
    
    // Priority electrical service matching
    if (isElectricalService && hasElectricalService) {
      console.log(`[DIRECT-SERVICE] ✅ Electrical service match found for ${professional.full_name}`);
      return true;
    }
    
    // Direct category match (case insensitive)
    const categoryMatches = lowerCategoryId.includes(lowerServiceName) ||
      lowerServiceName.includes(lowerCategoryId);
    
    // Direct subcategory match (case insensitive)
    const subcategoryMatches = lowerSubcategoryId && (
      lowerSubcategoryId.includes(lowerServiceName) ||
      lowerServiceName.includes(lowerSubcategoryId)
    );
    
    // Enhanced word-based matching for compound service names
    const serviceWords = lowerServiceName.split(/[\s\-_]+/).filter(word => word.length > 2);
    const categoryWords = lowerCategoryId.split(/[\s\-_]+/).filter(word => word.length > 2);
    const subcategoryWords = lowerSubcategoryId?.split(/[\s\-_]+/).filter(word => word.length > 2) || [];
    
    console.log(`[DIRECT-SERVICE] Service words: [${serviceWords.join(', ')}]`);
    console.log(`[DIRECT-SERVICE] Category words: [${categoryWords.join(', ')}]`);
    console.log(`[DIRECT-SERVICE] Subcategory words: [${subcategoryWords.join(', ')}]`);
    
    // Enhanced word matching with electrical service priority
    const wordMatches = serviceWords.some(serviceWord => {
      // Check against category words
      const categoryWordMatch = categoryWords.some(categoryWord => 
        serviceWord === categoryWord || 
        serviceWord.includes(categoryWord) || 
        categoryWord.includes(serviceWord) ||
        // Enhanced electrical cross-matching
        (serviceWord === 'fixture' && (categoryWord === 'electrical' || categoryWord.includes('light'))) ||
        (serviceWord === 'light' && (categoryWord === 'electrical' || categoryWord.includes('fixture'))) ||
        (serviceWord === 'installation' && categoryWord === 'electrical') ||
        (serviceWord === 'install' && categoryWord === 'electrical') ||
        (serviceWord === 'outlet' && categoryWord === 'electrical') ||
        (serviceWord === 'switch' && categoryWord === 'electrical') ||
        (serviceWord === 'wiring' && categoryWord === 'electrical') ||
        // Reverse matching
        (categoryWord === 'fixture' && serviceWord.includes('light')) ||
        (categoryWord === 'light' && serviceWord.includes('fixture')) ||
        (categoryWord === 'installation' && (serviceWord.includes('light') || serviceWord.includes('fixture')))
      );
      
      // Check against subcategory words
      const subcategoryWordMatch = subcategoryWords.some(subcategoryWord => 
        serviceWord === subcategoryWord || 
        serviceWord.includes(subcategoryWord) || 
        subcategoryWord.includes(serviceWord) ||
        // Enhanced electrical cross-matching
        (serviceWord === 'fixture' && (subcategoryWord === 'electrical' || subcategoryWord.includes('light'))) ||
        (serviceWord === 'light' && (subcategoryWord === 'electrical' || subcategoryWord.includes('fixture'))) ||
        (serviceWord === 'installation' && subcategoryWord === 'electrical') ||
        (serviceWord === 'install' && subcategoryWord === 'electrical') ||
        (serviceWord === 'outlet' && subcategoryWord === 'electrical') ||
        (serviceWord === 'switch' && subcategoryWord === 'electrical') ||
        (serviceWord === 'wiring' && subcategoryWord === 'electrical') ||
        // Reverse matching
        (subcategoryWord === 'fixture' && serviceWord.includes('light')) ||
        (subcategoryWord === 'light' && serviceWord.includes('fixture')) ||
        (subcategoryWord === 'installation' && (serviceWord.includes('light') || serviceWord.includes('fixture')))
      );
      
      const hasWordMatch = categoryWordMatch || subcategoryWordMatch;
      if (hasWordMatch) {
        console.log(`[DIRECT-SERVICE] Word match found: "${serviceWord}" matched in category or subcategory`);
      }
      
      return hasWordMatch;
    });
    
    const finalMatch = categoryMatches || subcategoryMatches || wordMatches;
    
    if (finalMatch) {
      console.log(`[DIRECT-SERVICE] ✅ Match found for ${professional.full_name}: category=${categoryMatches}, subcategory=${subcategoryMatches}, words=${wordMatches}`);
    }
    
    return finalMatch;
  }) || false;

  console.log(`[DIRECT-SERVICE] Final result for ${professional.full_name}: ${hasMatch}`);
  return hasMatch;
}
