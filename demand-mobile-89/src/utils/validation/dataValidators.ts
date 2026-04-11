
export const validateHandymanData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false;
  
  return (
    Array.isArray(data.skillRates) &&
    Array.isArray(data.servicePricing) &&
    Array.isArray(data.workAreas) &&
    Array.isArray(data.availabilitySlots)
  );
};

export const validateJobMetrics = (metrics: any): boolean => {
  if (!metrics || typeof metrics !== 'object') return false;
  
  const requiredFields = [
    'completedJobs', 'activeJobs', 'totalEarnings', 
    'thisMonthJobs', 'thisMonthCompletedJobs', 
    'todayCompletedJobs', 'todayEarnings', 
    'weeklyEarnings', 'monthlyEarnings'
  ];
  
  return requiredFields.every(field => 
    typeof metrics[field] === 'number' && !isNaN(metrics[field])
  );
};

export const validateLiveMetrics = (metrics: any): boolean => {
  if (!metrics || typeof metrics !== 'object') return false;
  
  const requiredFields = [
    'todayEarnings', 'monthlyEarnings', 'activeSkills',
    'activeJobs', 'completedJobs', 'thisMonthCompleted', 'totalEarnings'
  ];
  
  return requiredFields.every(field => 
    typeof metrics[field] === 'number' && !isNaN(metrics[field])
  );
};
