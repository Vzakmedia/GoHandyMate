
export const APP_CONFIG = {
  name: 'GoHandyMate',
  version: '1.0.0',
  defaultRadius: 50, // miles
  maxRetries: 3,
  timeouts: {
    location: 10000,
    api: 30000
  }
} as const;

export const SUBSCRIPTION_PLANS = {
  BASIC: 'basic',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
} as const;

export const USER_ROLES = {
  CUSTOMER: 'customer',
  HANDYMAN: 'handyman',
  // CONTRACTOR and PROPERTY_MANAGER removed — those roles are archived
} as const;
