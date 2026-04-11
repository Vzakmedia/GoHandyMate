
import { Droplets, Zap, Hammer, Paintbrush, Wrench, Users } from 'lucide-react';

export const getSpecialtyIcon = (specialty: string) => {
  const iconMap: { [key: string]: any } = {
    'Plumbing': Droplets,
    'Electrical': Zap,
    'Carpentry': Hammer,
    'Painting': Paintbrush,
    'HVAC': Wrench,
    'Kitchen Remodeling': Users,
    'Bathroom Renovation': Users,
    'Flooring': Hammer,
    'Roofing': Hammer,
  };
  return iconMap[specialty] || Wrench;
};
