
import type { Professional } from './types.ts'
import { hasDirectServiceMatch } from './filtering/direct-service-matcher.ts'
import { hasCategoryMatch } from './filtering/category-matcher.ts'
import { hasWordMatch } from './filtering/word-matcher.ts'
import { hasSkillMatch } from './filtering/skill-matcher.ts'
import { isWithinRadius } from './filtering/distance-filter.ts'
import { sortFilteredProfessionals } from './filtering/professional-sorter.ts'

export function filterProfessionalsByService(professionals: Professional[], serviceName: string): Professional[] {
  if (!serviceName || serviceName.trim() === '') {
    console.log(`[SERVICE-FILTER] No service name provided, returning all ${professionals.length} professionals`)
    return professionals
  }

  console.log(`[SERVICE-FILTER] Filtering ${professionals.length} professionals by service: "${serviceName}"`)
  
  const filtered = professionals.filter(professional => {
    // Apply distance filter first
    if (!isWithinRadius(professional)) {
      return false;
    }

    // PRIMARY FILTER: Check service_pricing for exact service matches (HIGHEST PRIORITY)
    const hasDirectService = hasDirectServiceMatch(professional, serviceName);

    // SECONDARY FILTER: Service pricing-based category matching (HIGH PRIORITY)
    const hasCategoryService = hasCategoryMatch(professional, serviceName);

    // TERTIARY FILTER: Fuzzy matching for service names (MEDIUM PRIORITY)
    const hasWordService = hasWordMatch(professional, serviceName);

    // FALLBACK FILTER: Skills-based matching (LOWEST PRIORITY - only for professionals without service pricing)
    const hasSkillService = hasSkillMatch(professional, serviceName);

    // Enhanced filtering: Prioritize professionals with active service_pricing
    const hasActiveServicePricing = professional.service_pricing && 
      professional.service_pricing.some(pricing => pricing.is_active);

    // PRIORITIZE: Active service pricing > Service pricing matches > Category matches > Word matches > Skill matches
    const shouldInclude = hasDirectService || hasCategoryService || hasWordService || 
                         (hasActiveServicePricing && (hasDirectService || hasCategoryService)) ||
                         hasSkillService;

    // Log the matching logic for debugging
    if (shouldInclude) {
      const matchType = hasDirectService ? 'DIRECT_SERVICE' : 
                       hasCategoryService ? 'CATEGORY_SERVICE' : 
                       hasWordService ? 'WORD_SERVICE' : 
                       hasActiveServicePricing ? 'ACTIVE_SERVICE_PRICING' : 'SKILL_FALLBACK';
      console.log(`[SERVICE-FILTER] ✅ Professional ${professional.full_name}: ${matchType} match for "${serviceName}"`);
      
      // Log service pricing details for debugging
      if (professional.service_pricing && professional.service_pricing.length > 0) {
        console.log(`[SERVICE-FILTER]   -> Service pricing: ${professional.service_pricing.length} services, ${professional.service_pricing.filter(p => p.is_active).length} active`);
      }
    } else {
      console.log(`[SERVICE-FILTER] ❌ Professional ${professional.full_name}: No service matches for "${serviceName}"`);
    }
    
    return shouldInclude;
  });

  // Sort by priority: those with active service pricing first, then direct service matches, then category matches, then others
  const sortedFiltered = sortFilteredProfessionals(filtered, serviceName);

  console.log(`[SERVICE-FILTER] After filtering: ${sortedFiltered.length} professionals match "${serviceName}" within 50-mile radius`);
  console.log(`[SERVICE-FILTER] Professionals with active service pricing: ${sortedFiltered.filter(p => p.service_pricing && p.service_pricing.some(sp => sp.is_active)).length}`);
  
  return sortedFiltered;
}
