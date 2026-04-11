
export const calculateGrowthPercentage = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const formatMetricBadge = (value: number, type: 'earnings' | 'growth' | 'skills'): string => {
  switch (type) {
    case 'earnings':
      return value > 0 ? 'Active' : 'Ready';
    case 'growth':
      return value > 0 ? `+${value}%` : value < 0 ? `${value}%` : 'Starting';
    case 'skills':
      return value > 0 ? 'Ready' : 'Setup Needed';
    default:
      return 'N/A';
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatRating = (rating: number): string => {
  return `${rating.toFixed(1)}★`;
};

export const calculateLiveMetrics = (handymanData: any, jobMetrics: any, ratingsData: any) => {
  // Calculate active skills from handyman data
  const activeSkills = handymanData.skillRates?.filter((skill: any) => skill.is_active) || [];
  const activeServices = handymanData.servicePricing?.filter((service: any) => service.is_active) || [];
  
  // Use the higher count between skills and services
  const totalActiveServices = Math.max(activeSkills.length, activeServices.length);
  
  return {
    todayEarnings: jobMetrics.todayEarnings || 0,
    monthlyEarnings: jobMetrics.monthlyEarnings || 0,
    activeSkills: totalActiveServices,
    activeJobs: jobMetrics.activeJobs || 0,
    completedJobs: jobMetrics.completedJobs || 0,
    totalEarnings: jobMetrics.totalEarnings || 0,
    thisMonthCompleted: jobMetrics.thisMonthCompletedJobs || 0,
    averageRating: ratingsData.averageRating || 0,
    totalReviews: ratingsData.totalReviews || 0
  };
};
