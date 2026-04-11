
export const generateProfileInitials = (name: string | null | undefined): string => {
  if (!name) return 'PH'; // Professional Handyman
  
  const words = name.trim().split(' ').filter(word => word.length > 0);
  if (words.length === 0) return 'PH';
  
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return words[0].charAt(0).toUpperCase() + words[words.length - 1].charAt(0).toUpperCase();
};

export const getProfileStatus = (accountStatus: string, isOnline?: boolean): {
  status: string;
  color: string;
  text: string;
} => {
  if (accountStatus !== 'active') {
    return {
      status: 'inactive',
      color: 'text-gray-500',
      text: 'Inactive'
    };
  }
  
  if (isOnline) {
    return {
      status: 'online',
      color: 'text-green-500',
      text: 'Online'
    };
  }
  
  return {
    status: 'offline',
    color: 'text-yellow-500',
    text: 'Offline'
  };
};

export const getSubscriptionTier = (subscriptionPlan: string | null | undefined): {
  tier: string;
  features: string[];
  color: string;
} => {
  switch (subscriptionPlan?.toLowerCase()) {
    case 'starter':
      return {
        tier: 'Starter',
        features: ['15 jobs/month', 'Basic support'],
        color: 'text-blue-600'
      };
    case 'pro':
      return {
        tier: 'Pro',
        features: ['40 jobs/month', 'Priority support', 'Advanced analytics'],
        color: 'text-purple-600'
      };
    case 'elite':
      return {
        tier: 'Elite',
        features: ['Unlimited jobs', '24/7 support', 'Premium features'],
        color: 'text-gold-600'
      };
    default:
      return {
        tier: 'Free',
        features: ['Limited features'],
        color: 'text-gray-600'
      };
  }
};

export const sortHandymenByRelevance = (handymen: any[], userLocation?: { lat: number; lng: number }): any[] => {
  return handymen.sort((a, b) => {
    // Priority order: sponsored > rating > distance > completion rate
    
    // 1. Sponsored listings first
    if (a.isSponsored && !b.isSponsored) return -1;
    if (!a.isSponsored && b.isSponsored) return 1;
    
    // 2. Higher rating
    const ratingDiff = (b.rating || 0) - (a.rating || 0);
    if (Math.abs(ratingDiff) > 0.1) return ratingDiff;
    
    // 3. Closer distance (if available)
    if (a.distance && b.distance) {
      const distanceDiff = a.distance - b.distance;
      if (Math.abs(distanceDiff) > 1) return distanceDiff;
    }
    
    // 4. More completed jobs
    return (b.completedJobs || 0) - (a.completedJobs || 0);
  });
};

export const filterHandymenBySkills = (handymen: any[], requiredSkills: string[]): any[] => {
  if (!requiredSkills || requiredSkills.length === 0) return handymen;
  
  return handymen.filter(handyman => {
    const handymanSkills = [
      ...(handyman.skill_rates?.map((sr: any) => sr.skill_name) || []),
      ...(handyman.handyman_data?.skills || [])
    ].map(skill => skill.toLowerCase());
    
    return requiredSkills.some(required => 
      handymanSkills.some(skill => 
        skill.includes(required.toLowerCase()) || 
        required.toLowerCase().includes(skill)
      )
    );
  });
};
