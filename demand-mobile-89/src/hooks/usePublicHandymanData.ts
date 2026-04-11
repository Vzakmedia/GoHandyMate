
import { useHandymanDataFetcher } from './handyman-data/useHandymanDataFetcher';

export const usePublicHandymanData = (userId: string | null) => {
  // Always call the fetcher hook - never conditionally
  const result = useHandymanDataFetcher(userId || '');
  
  // Handle the case where no userId is provided after the hook call
  if (!userId) {
    return {
      data: { 
        servicePricing: [], 
        skillRates: [],
        workAreas: [],
        workSettings: null,
        availabilitySlots: []
      },
      loading: false,
      error: null
    };
  }
  
  return result;
};
