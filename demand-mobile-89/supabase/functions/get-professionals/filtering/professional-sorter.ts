
import type { Professional } from '../types.ts';
import { hasDirectServiceMatch } from './direct-service-matcher.ts';
import { hasCategoryMatch } from './category-matcher.ts';

export function sortFilteredProfessionals(professionals: Professional[], serviceName: string): Professional[] {
  return professionals.sort((a, b) => {
    // Priority 1: Direct service matches first
    const aHasDirectService = hasDirectServiceMatch(a, serviceName);
    const bHasDirectService = hasDirectServiceMatch(b, serviceName);
    
    if (aHasDirectService && !bHasDirectService) return -1;
    if (!aHasDirectService && bHasDirectService) return 1;
    
    // Priority 2: Category matches
    const aHasCategoryService = hasCategoryMatch(a, serviceName);
    const bHasCategoryService = hasCategoryMatch(b, serviceName);
    
    if (aHasCategoryService && !bHasCategoryService) return -1;
    if (!aHasCategoryService && bHasCategoryService) return 1;
    
    // Priority 3: Distance (if available)
    if (a.distance !== undefined && b.distance !== undefined) {
      return a.distance - b.distance;
    }
    
    // Priority 4: Rating
    const aRating = a.rating || 0;
    const bRating = b.rating || 0;
    if (aRating !== bRating) {
      return bRating - aRating;
    }
    
    // Priority 5: Subscription plan priority
    const planPriority = { 'elite': 3, 'pro': 2, 'starter': 1, 'free': 0 };
    const aPlanPriority = planPriority[a.subscription_plan as keyof typeof planPriority] || 0;
    const bPlanPriority = planPriority[b.subscription_plan as keyof typeof planPriority] || 0;
    
    return bPlanPriority - aPlanPriority;
  });
}
