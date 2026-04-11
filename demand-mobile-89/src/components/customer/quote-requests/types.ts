
export interface QuoteWithSubmissions {
  id: string;
  service_name: string;
  service_description: string;
  location: string;
  preferred_date?: string | null;
  budget_range?: string | null;
  status: string;
  created_at: string;
  accepted_quote_id?: string | null;
  urgency: string | null;
  customer_id: string;
  updated_at: string;
  submissions: Array<{
    id: string;
    handyman_id: string;
    quoted_price: number;
    description: string;
    status: string;
    created_at: string;
    estimated_hours?: number | null;
    availability_note?: string | null;
    materials_included?: boolean | null;
    materials_cost?: number | null;
    travel_fee?: number | null;
    profiles?: {
      full_name: string;
      email: string;
    } | null;
  }>;
}

export interface QuoteRequest {
  id: string;
  service_name: string;
  service_description: string;
  location: string;
  preferred_date?: string | null;
  budget_range?: string | null;
  status: string;
  created_at: string;
  accepted_quote_id?: string | null;
  urgency: string | null;
  customer_id: string;
  updated_at: string;
  quote_submissions?: Array<{
    id: string;
    handyman_id: string;
    handyman_name?: string;
    quoted_price: number;
    description: string;
    status: string;
    created_at: string;
    estimated_hours?: number | null;
    availability_note?: string | null;
    materials_included?: boolean | null;
    materials_cost?: number | null;
    travel_fee?: number | null;
    profiles?: {
      full_name: string;
      email: string;
    } | null;
  }>;
}

export interface WorkProgress {
  progress: number;
  text: string;
}
