
interface Professional {
  id: string;
  full_name: string;
  user_role: 'handyman' | 'contractor';
  rating: number;
  distance?: number;
  isSponsored: boolean;
}

export const sortProfessionals = (professionals: Professional[]): Professional[] => {
  return [...professionals].sort((a, b) => {
    // Sponsored first
    if (a.isSponsored && !b.isSponsored) return -1;
    if (!a.isSponsored && b.isSponsored) return 1;
    
    // Then by rating
    if (a.rating !== b.rating) return b.rating - a.rating;
    
    // Then by distance if available
    if (a.distance !== undefined && b.distance !== undefined) {
      return a.distance - b.distance;
    }
    
    return 0;
  });
};
