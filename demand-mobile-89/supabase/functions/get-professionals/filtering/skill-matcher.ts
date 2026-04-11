
import type { Professional } from '../types.ts';

export function hasSkillMatch(professional: Professional, serviceName: string): boolean {
  const lowerServiceName = serviceName.toLowerCase();
  
  // Only use skill matching as a fallback if no service pricing is available
  const hasServicePricing = professional.service_pricing && professional.service_pricing.length > 0;
  if (hasServicePricing) {
    return false; // Don't use skill matching if service pricing is available
  }
  
  // Check skill rates for matching skills
  return professional.skill_rates?.some(skillRate => {
    if (!skillRate.is_active) return false;
    
    const lowerSkillName = skillRate.skill_name.toLowerCase();
    
    // Direct skill name match
    if (lowerSkillName.includes(lowerServiceName) || lowerServiceName.includes(lowerSkillName)) {
      return true;
    }
    
    // Word-based matching for compound service names
    const serviceWords = lowerServiceName.split(/[\s\-_]+/).filter(word => word.length > 2);
    const skillWords = lowerSkillName.split(/[\s\-_]+/).filter(word => word.length > 2);
    
    // Check if any service word matches any skill word
    return serviceWords.some(serviceWord => 
      skillWords.some(skillWord => 
        serviceWord === skillWord || 
        serviceWord.includes(skillWord) || 
        skillWord.includes(serviceWord) ||
        // Special electrical service matching
        (serviceWord === 'fixture' && skillWord === 'electrical') ||
        (serviceWord === 'light' && skillWord === 'electrical') ||
        (serviceWord === 'installation' && skillWord === 'electrical')
      )
    );
  }) || false;
}
