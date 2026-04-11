
// Enhanced service to skill mapping for better matching
export const serviceToSkillMapping: Record<string, string[]> = {
  // Cleaning services - more specific mapping
  'deep cleaning': ['deep cleaning', 'house cleaning', 'residential cleaning', 'move-in cleaning', 'move-out cleaning'],
  'regular cleaning': ['regular cleaning', 'house cleaning', 'weekly cleaning', 'bi-weekly cleaning', 'monthly cleaning'],
  'office cleaning': ['office cleaning', 'commercial cleaning', 'janitorial', 'workplace cleaning'],
  'carpet cleaning': ['carpet cleaning', 'upholstery cleaning', 'steam cleaning', 'rug cleaning'],
  'window cleaning': ['window cleaning', 'glass cleaning', 'exterior cleaning'],
  
  // Technical services
  'electrical': ['electrical', 'electrician', 'wiring', 'outlet', 'switch', 'lighting', 'electrical repair', 'circuit', 'breaker', 'voltage'],
  'plumbing': ['plumbing', 'plumber', 'pipes', 'faucet', 'toilet', 'drain', 'water heater', 'leak', 'pipe repair', 'leak repair', 'water damage'],
  'carpentry': ['carpentry', 'carpenter', 'wood', 'furniture', 'cabinet', 'trim', 'framing', 'woodwork', 'custom'],
  'painting': ['painting', 'painter', 'wall', 'interior', 'exterior', 'drywall', 'primer', 'brush', 'roller'],
  'hvac': ['hvac', 'heating', 'cooling', 'air conditioning', 'furnace', 'duct', 'ventilation', 'thermostat'],
  'appliance': ['appliance', 'repair', 'installation', 'dishwasher', 'washer', 'dryer', 'refrigerator', 'oven'],
  
  // General services
  'handyman': ['handyman', 'general', 'maintenance', 'repair', 'installation', 'fix', 'home repair', 'maintenance'],
  'roofing': ['roofing', 'roof', 'shingles', 'gutters', 'leak repair', 'roof repair'],
  'flooring': ['flooring', 'floor', 'hardwood', 'tile', 'carpet', 'laminate', 'vinyl'],
  'landscaping': ['landscaping', 'lawn', 'garden', 'trees', 'trimming', 'mowing', 'outdoor']
}

export const getRelatedSkills = (serviceName: string): string[] => {
  const lowerServiceName = serviceName.toLowerCase()
  
  // Direct keyword matching - prioritize exact matches
  let directMatches: string[] = []
  
  // First, try to find exact category match
  if (serviceToSkillMapping[lowerServiceName]) {
    directMatches = [...serviceToSkillMapping[lowerServiceName]]
  } else {
    // Check each category for partial matches
    for (const [category, skills] of Object.entries(serviceToSkillMapping)) {
      if (lowerServiceName.includes(category) || category.includes(lowerServiceName)) {
        directMatches.push(...skills)
      } else {
        // Check if any skills in the category match
        const matchingSkills = skills.filter(skill => 
          lowerServiceName.includes(skill) || 
          skill.includes(lowerServiceName)
        )
        directMatches.push(...matchingSkills)
      }
    }
  }
  
  // If no direct matches, try word-by-word matching
  if (directMatches.length === 0) {
    const serviceWords = lowerServiceName.split(/\s+/)
    for (const word of serviceWords) {
      if (word.length > 2) { // Skip very short words
        for (const [category, skills] of Object.entries(serviceToSkillMapping)) {
          const matchingSkills = skills.filter(skill => 
            word.includes(skill) || 
            skill.includes(word)
          )
          directMatches.push(...matchingSkills)
        }
      }
    }
  }
  
  // Always include the original service name for exact matching
  directMatches.push(lowerServiceName)
  
  // Remove duplicates and return
  return [...new Set(directMatches)]
}
