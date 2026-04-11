
export interface CustomQuoteRequest {
  id: string;
  customer_id: string;
  service_name: string;
  service_description: string;
  location: string;
  preferred_date?: string;
  budget_range?: string;
  urgency: string;
  status: string;
  quote_type?: string;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

export interface QuoteSubmission {
  id: string;
  quote_request_id: string;
  handyman_id: string;
  quoted_price: number;
  estimated_hours?: number;
  description: string;
  materials_included: boolean;
  materials_cost: number;
  travel_fee: number;
  availability_note?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  custom_quote_requests?: {
    service_name: string;
    location: string;
    customer_id: string;
    profiles?: {
      full_name: string;
      email: string;
    };
  };
  profiles?: {
    full_name: string;
    email: string;
    avatar_url?: string;
  };
}

export interface CreateQuoteRequestData {
  service_name: string;
  service_description: string;
  location: string;
  preferred_date?: string;
  budget_range?: string;
  urgency?: string;
  quote_type?: string;
}

export interface SubmitQuoteData {
  quote_request_id: string;
  customer_id: string;
  service_name: string;
  quoted_price: number;
  estimated_hours?: number;
  description: string;
  materials_included?: boolean;
  materials_cost?: number;
  travel_fee?: number;
  availability_note?: string;
}
