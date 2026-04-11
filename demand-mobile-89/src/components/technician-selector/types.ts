
export interface PreviousTechnician {
  id: string;
  full_name: string;
  avatar_url?: string;
  rating: number;
  last_service: string;
  last_service_date: string;
  total_jobs: number;
  skills: string[];
  isRecommended?: boolean;
  email?: string;
}

export interface TechnicianSelectorCalendarProps {
  onClose: () => void;
  onBooking: (booking: { date: Date; timeSlot: string; duration: string; technicianId: string }) => void;
}
