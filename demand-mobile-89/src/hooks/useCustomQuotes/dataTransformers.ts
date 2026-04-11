
import { CustomQuoteRequest } from './types';

// Type guard to check if profiles is valid
export const isValidProfileObject = (obj: any): obj is { full_name: string; email: string } => {
  return obj && 
         typeof obj === 'object' && 
         !Array.isArray(obj) &&
         typeof obj.full_name === 'string' &&
         typeof obj.email === 'string';
};

// Transform raw Supabase data to CustomQuoteRequest
export const transformQuoteRequest = (request: any): CustomQuoteRequest => {
  const profiles = request.profiles;
  
  return {
    id: request.id,
    customer_id: request.customer_id,
    service_name: request.service_name,
    service_description: request.service_description,
    location: request.location,
    preferred_date: request.preferred_date,
    budget_range: request.budget_range,
    urgency: request.urgency,
    status: request.status,
    created_at: request.created_at,
    profiles: isValidProfileObject(profiles) ? {
      full_name: profiles.full_name,
      email: profiles.email
    } : undefined
  };
};

// Transform array of raw data to CustomQuoteRequest array
export const transformQuoteRequests = (data: any[]): CustomQuoteRequest[] => {
  return (data || []).map(transformQuoteRequest);
};
