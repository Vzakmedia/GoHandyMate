
import type { Professional } from '../types.ts';

export function isWithinRadius(professional: Professional): boolean {
  // Distance-based filtering - only include professionals within 50 miles if distance is available  
  if (professional.distance !== undefined) {
    const withinRadius = professional.distance <= 50;
    if (!withinRadius) {
      console.log(`[SERVICE-FILTER] Professional ${professional.full_name} excluded due to distance: ${professional.distance} miles`);
    }
    return withinRadius;
  }
  return true;
}
