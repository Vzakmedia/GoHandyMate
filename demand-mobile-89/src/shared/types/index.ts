// Shared TypeScript types and interfaces

export type UserRole = 'customer' | 'handyman' | 'admin';

export type AccountStatus = 'pending' | 'active' | 'rejected' | 'suspended';

export type SubscriptionPlan = 'free' | 'starter' | 'pro' | 'elite' | 'basic' | 'business' | 'enterprise';

export type SubscriptionStatus = 'active' | 'inactive' | 'past_due' | 'canceled' | 'trialing';

// Common API response structure
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

// Common pagination interface
export interface PaginationParams {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// Common filter interface
export interface BaseFilters {
  search?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}