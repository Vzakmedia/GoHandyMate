
export const formatProfileName = (name: string | null | undefined): string => {
  if (!name) return 'Professional Handyman';
  return name.trim() || 'Professional Handyman';
};

export const formatPhoneNumber = (phone: string | null | undefined): string => {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  return phone;
};

export const formatHourlyRate = (rate: number | null | undefined): string => {
  if (!rate || rate <= 0) return 'Quote on request';
  return `$${rate.toFixed(0)}/hr`;
};

export const formatRating = (rating: number | null | undefined): number => {
  if (!rating || rating < 0) return 0;
  if (rating > 5) return 5;
  return Math.round(rating * 10) / 10; // Round to 1 decimal place
};

export const formatDistance = (distance: number | null | undefined): string => {
  if (!distance || distance < 0) return 'Distance unavailable';
  return `${distance.toFixed(1)} miles away`;
};

export const formatExperienceLevel = (level: string | null | undefined): string => {
  const validLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  if (!level || !validLevels.includes(level)) return 'Intermediate';
  return level;
};
