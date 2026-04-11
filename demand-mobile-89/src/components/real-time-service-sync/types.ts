
export interface HandymanService {
  id: string;
  user_id: string;
  category_id: string;
  subcategory_id?: string;
  base_price: number;
  custom_price?: number;
  same_day_multiplier: number;
  emergency_multiplier: number;
  is_active: boolean;
  handyman_name: string;
  handyman_rating: number;
  handyman_reviews: number;
  category_name: string;
  subcategory_name?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  services: HandymanService[];
  avgPrice: number;
}
