
interface HandymanProfile {
  skill_rates?: Array<{
    skill_name: string;
    hourly_rate: number;
    is_active: boolean;
    experience_level?: string;
  }>;
  handyman_data?: {
    hourly_rate?: number;
    skills?: string[];
  };
  rating?: number;
  reviewCount?: number;
  completedJobs?: number;
  distance?: number;
}

export const calculateAverageRate = (skillRates: any[]): number => {
  if (!Array.isArray(skillRates) || skillRates.length === 0) return 0;
  
  const activeRates = skillRates.filter(skill => 
    skill?.is_active && 
    typeof skill.hourly_rate === 'number' && 
    skill.hourly_rate > 0
  );
  
  if (activeRates.length === 0) return 0;
  
  const sum = activeRates.reduce((total, skill) => total + skill.hourly_rate, 0);
  return Math.round(sum / activeRates.length);
};

export const getServiceSpecificRate = (handyman: HandymanProfile, serviceName: string): number => {
  if (!handyman?.skill_rates || handyman.skill_rates.length === 0) {
    return handyman?.handyman_data?.hourly_rate || 50;
  }

  const serviceKeywords = serviceName.toLowerCase();
  const relevantSkill = handyman.skill_rates.find(skill => 
    serviceKeywords.includes(skill.skill_name.toLowerCase()) ||
    skill.skill_name.toLowerCase().includes(serviceKeywords.split(' ')[0])
  );
  
  return relevantSkill?.hourly_rate || handyman.skill_rates[0]?.hourly_rate || handyman?.handyman_data?.hourly_rate || 50;
};

export const calculateCompletionRate = (completedJobs: number, totalJobs: number): number => {
  if (!totalJobs || totalJobs <= 0) return 0;
  return Math.round((completedJobs / totalJobs) * 100);
};

export const calculateExperienceYears = (createdAt: string): number => {
  if (!createdAt) return 0;
  const joinDate = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - joinDate.getTime());
  const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
  return Math.max(diffYears, 1); // Minimum 1 year
};

export const getSkillsByExperienceLevel = (skillRates: any[]): Record<string, number> => {
  if (!Array.isArray(skillRates)) return {};
  
  return skillRates.reduce((acc, skill) => {
    if (skill?.is_active && skill.experience_level) {
      const level = skill.experience_level;
      acc[level] = (acc[level] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
};
