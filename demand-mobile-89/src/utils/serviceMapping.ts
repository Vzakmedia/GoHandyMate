
// Service to skill mapping for better matching
export const serviceToSkillMapping: Record<string, string[]> = {
  'electrical': ['electrical', 'electrician', 'wiring', 'outlet', 'switch', 'lighting', 'electrical repair'],
  'plumbing': ['plumbing', 'plumber', 'pipes', 'faucet', 'toilet', 'drain', 'water heater'],
  'carpentry': ['carpentry', 'carpenter', 'wood', 'furniture', 'cabinet', 'trim', 'framing'],
  'painting': ['painting', 'painter', 'wall', 'interior', 'exterior', 'drywall'],
  'hvac': ['hvac', 'heating', 'cooling', 'air conditioning', 'furnace', 'duct'],
  'appliance': ['appliance', 'repair', 'installation', 'dishwasher', 'washer', 'dryer'],
  'handyman': ['handyman', 'general', 'maintenance', 'repair', 'installation', 'fix']
};

export const getRelatedSkills = (serviceName: string, serviceCategory?: string): string[] => {
  // First try to match with service category
  if (serviceCategory && serviceToSkillMapping[serviceCategory.toLowerCase()]) {
    return serviceToSkillMapping[serviceCategory.toLowerCase()];
  }
  
  // Then try to match with service name
  const lowerServiceName = serviceName.toLowerCase();
  
  // Find matching category based on service name
  for (const [category, skills] of Object.entries(serviceToSkillMapping)) {
    if (skills.some(skill => lowerServiceName.includes(skill) || skill.includes(lowerServiceName))) {
      return skills;
    }
  }
  
  // Default to the service name itself
  return [serviceName.toLowerCase()];
};
