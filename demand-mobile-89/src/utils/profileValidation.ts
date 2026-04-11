
export const isValidProfileData = (data: any): data is { full_name: string; email: string } => {
  return data && 
         typeof data === 'object' && 
         data !== null &&
         !('error' in data) &&
         typeof data.full_name === 'string' &&
         typeof data.email === 'string';
};

export const validateHandymanData = (data: any): boolean => {
  return data && 
         typeof data === 'object' && 
         data !== null &&
         typeof data.full_name === 'string';
};

export const validateSkillRate = (skill: any): boolean => {
  return skill &&
         typeof skill === 'object' &&
         typeof skill.skill_name === 'string' &&
         typeof skill.hourly_rate === 'number' &&
         skill.hourly_rate > 0;
};

export const validateWorkArea = (area: any): boolean => {
  return area &&
         typeof area === 'object' &&
         typeof area.area_name === 'string' &&
         typeof area.center_latitude === 'number' &&
         typeof area.center_longitude === 'number' &&
         typeof area.radius_miles === 'number';
};
