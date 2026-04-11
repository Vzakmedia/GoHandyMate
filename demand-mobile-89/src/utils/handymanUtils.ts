
import { 
  calculateAverageRate, 
  getServiceSpecificRate, 
  getSkillsByExperienceLevel 
} from './profileCalculations';
import { 
  formatHourlyRate, 
  formatRating, 
  formatDistance 
} from './profileFormatters';

interface HandymanProfile {
  handyman_data?: {
    hourly_rate?: number;
    skills?: string[];
  };
  skill_rates?: Array<{
    skill_name: string;
    hourly_rate: number;
    is_active: boolean;
  }>;
  rating?: number;
  reviewCount?: number;
  completedJobs?: number;
  distance?: number;
}

export { getServiceSpecificRate };

export const getHandymanSkills = (handyman: HandymanProfile) => {
  if (handyman?.skill_rates && handyman.skill_rates.length > 0) {
    return handyman.skill_rates.map(sr => ({
      name: sr.skill_name,
      rate: sr.hourly_rate,
      level: 'Professional'
    }));
  }
  
  const skills = handyman?.handyman_data?.skills || ['General Repair'];
  const rate = handyman?.handyman_data?.hourly_rate || 50;
  
  return skills.map(skill => ({
    name: skill,
    rate: rate,
    level: 'Professional'
  }));
};

export const getHandymanStats = (handyman: any) => {
  // Use real data from the database instead of mock data
  const realRating = handyman?.average_rating || handyman?.rating || 0;
  const realReviewCount = handyman?.total_ratings || handyman?.reviewCount || 0;
  const realCompletedJobs = handyman?.jobs_this_month || handyman?.completedJobs || 0;
  
  return {
    rating: parseFloat(realRating.toString()),
    reviewCount: realReviewCount,
    completedTasks: realCompletedJobs,
    responseTime: 'Usually responds in 1-2 hours',
    distance: formatDistance(handyman?.distance)
  };
};
