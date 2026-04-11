// Application constants

export const USER_ROLES = {
  CUSTOMER: 'customer',
  HANDYMAN: 'handyman',
  CONTRACTOR: 'contractor',
  PROPERTY_MANAGER: 'property_manager',
  ADMIN: 'admin'
} as const;

export const ACCOUNT_STATUSES = {
  PENDING: 'pending',
  ACTIVE: 'active',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
} as const;

export const JOB_STATUSES = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
  ELITE: 'elite',
  BASIC: 'basic',
  BUSINESS: 'business',
  ENTERPRISE: 'enterprise'
} as const;

export const SUBSCRIPTION_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PAST_DUE: 'past_due',
  CANCELED: 'canceled',
  TRIALING: 'trialing'
} as const;

export const JOB_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

// API endpoints
export const API_ENDPOINTS = {
  PROFILES: '/profiles',
  JOBS: '/job_requests',
  HANDYMAN_JOBS: '/handyman-jobs',
  QUOTE_OPERATIONS: '/quote-operations',
  LOCATION_TRACKING: '/location-tracking',
  MAP_SERVICES: '/map-services'
} as const;