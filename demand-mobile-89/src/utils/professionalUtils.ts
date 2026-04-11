
interface Professional {
  id: string;
  full_name: string;
  user_role: 'handyman' | 'contractor';
  avatar_url?: string;
  subscription_plan?: string;
  handyman?: {
    hourly_rate?: number;
    skills?: string[];
    availability?: string;
  };
  skill_rates?: Array<{
    skill_name: string;
    hourly_rate: number;
  }>;
  distance?: number;
  rating: number;
  reviewCount: number;
  isSponsored: boolean;
  isOnline: boolean;
  completedJobs: number;
}

export const getRate = (professional: Professional): string => {
  if (professional.user_role === 'handyman' && professional.handyman?.hourly_rate) {
    return `$${professional.handyman.hourly_rate}/hr`;
  }
  if (professional.skill_rates && professional.skill_rates.length > 0) {
    return `$${professional.skill_rates[0].hourly_rate}/hr`;
  }
  return 'Quote on request';
};

export const getSpecialty = (professional: Professional): string => {
  if (professional.user_role === 'handyman') {
    const skills = professional.handyman?.skills || [];
    return skills.length > 0 ? skills[0] : 'General Handyman';
  }
  return 'Professional Contractor';
};
