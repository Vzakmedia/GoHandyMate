
import { Professional } from '@/types/professional';

export const filterProfessionals = (
  professionals: Professional[],
  searchTerm: string,
  selectedType: 'handyman' | 'all'
): Professional[] => {
  return professionals.filter(prof => {
    const matchesSearch = prof.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (prof.handyman_data?.skills || []).some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || prof.user_role === selectedType;
    return matchesSearch && matchesType;
  });
};

export const sortProfessionals = (
  professionals: Professional[],
  sortBy: 'rating' | 'distance' | 'experience'
): Professional[] => {
  return professionals.sort((a, b) => {
    // 1. Sponsored/boosted accounts first
    if (a.isSponsored && !b.isSponsored) return -1;
    if (!a.isSponsored && b.isSponsored) return 1;
    
    // 2. Prioritize by review count and rating quality
    const aRating = a.average_rating || a.rating || 0;
    const bRating = b.average_rating || b.rating || 0;
    const aReviews = a.total_ratings || a.reviewCount || 0;
    const bReviews = b.total_ratings || b.reviewCount || 0;
    
    // Calculate quality score (rating * log(reviews + 1) to balance quality vs quantity)
    const aQualityScore = aRating * Math.log(aReviews + 1);
    const bQualityScore = bRating * Math.log(bReviews + 1);
    
    // 3. Apply main sorting criteria
    switch (sortBy) {
      case 'rating':
        // For rating sort, prioritize quality score first
        if (Math.abs(bQualityScore - aQualityScore) > 0.5) {
          return bQualityScore - aQualityScore;
        }
        // If quality scores are close, sort by pure rating
        if (Math.abs(bRating - aRating) > 0.1) {
          return bRating - aRating;
        }
        // If ratings are very close, prefer more reviews
        return bReviews - aReviews;
        
      case 'distance':
        // For distance sort, still consider quality as secondary factor
        if (a.distance && b.distance) {
          const distanceDiff = a.distance - b.distance;
          // If distance difference is small (< 5 miles), consider quality
          if (Math.abs(distanceDiff) < 5 && Math.abs(bQualityScore - aQualityScore) > 1) {
            return bQualityScore - aQualityScore;
          }
          return distanceDiff;
        }
        return 0;
        
      case 'experience':
        const aExperience = a.experienceYears || 0;
        const bExperience = b.experienceYears || 0;
        // If experience is close (within 2 years), consider quality
        if (Math.abs(bExperience - aExperience) <= 2 && Math.abs(bQualityScore - aQualityScore) > 1) {
          return bQualityScore - aQualityScore;
        }
        return bExperience - aExperience;
        
      default:
        return bQualityScore - aQualityScore;
    }
  });
};
