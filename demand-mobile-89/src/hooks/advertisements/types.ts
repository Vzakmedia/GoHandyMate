
export interface Advertisement {
  id: string;
  user_id: string;
  status: string;
  content: string;
  ad_title: string;
  ad_description: string;
  image_url?: string;
  target_audience: string;
  target_zip_codes?: string[];
  plan_type: string;
  cost: number;
  schedule: string;
  start_date?: string;
  end_date: string;
  auto_renew: boolean;
  views_count: number;
  clicks_count: number;
  created_at?: string;
  updated_at?: string;
}
