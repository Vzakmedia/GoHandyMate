
export interface Professional {
  id: string;
  full_name: string;
  email: string;
  user_role: 'handyman' | 'contractor';
  subscription_plan?: string;
  subscription_status: string;
  account_status: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  distance?: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  responseTime: string;
  zip_code?: string;
  handyman_data?: {
    hourly_rate?: number;
    skills?: string[];
    phone?: string;
    availability?: string;
    years_experience?: number;
  };
  skill_rates?: Array<{
    skill_name: string;
    hourly_rate: number;
    is_active: boolean;
  }>;
  work_areas?: Array<{
    area_name: string;
    center_latitude: number;
    center_longitude: number;
    radius_miles: number;
    is_active: boolean;
  }>;
  handyman_work_areas?: Array<{
    area_name: string;
    center_latitude: number;
    center_longitude: number;
    radius_miles: number;
    is_active: boolean;
    is_primary?: boolean;
  }>;
  handyman_locations?: {
    latitude: number;
    longitude: number;
    last_updated: string;
    is_active: boolean;
  };
  service_pricing?: Array<{
    category_id: string;
    subcategory_id?: string;
    base_price: number;
    custom_price?: number;
    is_active: boolean;
  }>;
  averageRate: number;
  average_rating?: number;
  total_ratings?: number;
  jobs_this_month?: number;
  experienceYears?: number;
  isSponsored?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
  hasRealtimePricing?: boolean;
  realtimePricing?: any;
}
