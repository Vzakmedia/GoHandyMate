
export interface HandymanServicePricing {
  id: string;
  user_id: string;
  category_id: string;
  subcategory_id?: string;
  base_price: number;
  custom_price?: number;
  is_active: boolean;
  same_day_multiplier: number;
  emergency_multiplier: number;
  created_at: string;
  updated_at: string;
}

export interface HandymanSkillRate {
  id: string;
  user_id: string;
  skill_name: string;
  hourly_rate: number;
  experience_level: string;
  is_active: boolean;
  minimum_hours: number;
  same_day_rate_multiplier: number;
  emergency_rate_multiplier: number;
  created_at: string;
  updated_at: string;
}

export interface HandymanWorkArea {
  id: string;
  user_id: string;
  area_name: string;
  center_latitude: number;
  center_longitude: number;
  radius_miles: number;
  is_primary: boolean;
  is_active: boolean;
  priority_order: number;
  additional_travel_fee: number;
  travel_time_minutes: number;
  zip_code?: string;
  formatted_address?: string;
  created_at: string;
  updated_at: string;
}

export interface HandymanWorkSettings {
  id: string;
  user_id: string;
  work_radius_miles: number;
  travel_fee_per_mile: number;
  travel_fee_enabled: boolean;
  minimum_job_amount: number;
  advance_booking_days: number;
  instant_booking: boolean;
  same_day_available: boolean;
  emergency_available: boolean;
  center_latitude?: number;
  center_longitude?: number;
  preferred_job_types: string[];
  blackout_dates: string[];
  created_at: string;
  updated_at: string;
}

export interface HandymanAvailabilitySlot {
  id: string;
  user_id: string;
  date: string;
  start_time: string;
  end_time: string;
  slot_type: string;
  is_booked: boolean;
  booking_id?: string;
  price_multiplier: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface HandymanData {
  skillRates: HandymanSkillRate[];
  servicePricing: HandymanServicePricing[];
  workAreas: HandymanWorkArea[];
  workSettings: HandymanWorkSettings | null;
  availabilitySlots: HandymanAvailabilitySlot[];
}

export interface HandymanDataResult {
  data: HandymanData;
  loading: boolean;
  error: string | null;
}

export interface UseHandymanDataReturn {
  data: HandymanData;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}
