
import { z } from 'zod';
import DOMPurify from 'dompurify';

// HTML sanitization utility
export const sanitizeHtml = (input: string): string => {
  if (typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};

// Text sanitization for plain text fields
export const sanitizeText = (input: string): string => {
  if (typeof input !== 'string') return '';
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};

// Email validation schema
export const emailSchema = z.string()
  .email('Invalid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must be less than 255 characters')
  .transform(sanitizeText);

// Password validation schema
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number');

// Name validation schema
export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods')
  .transform(sanitizeText);

// Phone validation schema
export const phoneSchema = z.string()
  .regex(/^\+?[\d\s\-\(\)\.]+$/, 'Invalid phone number format')
  .min(10, 'Phone number must be at least 10 digits')
  .max(20, 'Phone number must be less than 20 characters')
  .transform(sanitizeText);

// Description validation schema
export const descriptionSchema = z.string()
  .min(10, 'Description must be at least 10 characters')
  .max(2000, 'Description must be less than 2000 characters')
  .transform(sanitizeHtml);

// Title validation schema
export const titleSchema = z.string()
  .min(3, 'Title must be at least 3 characters')
  .max(200, 'Title must be less than 200 characters')
  .transform(sanitizeText);

// Address validation schema
export const addressSchema = z.string()
  .min(5, 'Address must be at least 5 characters')
  .max(300, 'Address must be less than 300 characters')
  .transform(sanitizeText);

// Budget validation schema
export const budgetSchema = z.number()
  .min(0, 'Budget must be positive')
  .max(1000000, 'Budget must be less than $1,000,000');

// Category validation schema
export const categorySchema = z.enum([
  'cleaning', 'handyman', 'painting', 'plumbing', 'electrical', 'hvac',
  'assembly', 'mounting', 'smart-home', 'moving', 'delivery'
]);

// Service request validation schema
export const serviceRequestSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  category: categorySchema,
  subcategory: z.string().min(1, 'Subcategory is required').transform(sanitizeText),
  location: addressSchema,
  propertyType: z.string().min(1, 'Property type is required').transform(sanitizeText),
  scheduledDate: z.string().optional(),
  timePreference: z.string().optional().transform((val) => val ? sanitizeText(val) : val),
  urgency: z.enum(['emergency', 'same-day', 'this-week', 'next-week', 'flexible']),
  estimatedPrice: budgetSchema,
  contact: z.object({
    name: nameSchema,
    phone: phoneSchema,
    email: emailSchema,
    alternateContact: z.string().optional().transform((val) => val ? sanitizeText(val) : val)
  }),
  additionalInfo: z.object({
    accessInstructions: z.string().max(500, 'Access instructions must be less than 500 characters').optional().transform((val) => val ? sanitizeHtml(val) : val),
    specialRequirements: z.string().max(500, 'Special requirements must be less than 500 characters').optional().transform((val) => val ? sanitizeHtml(val) : val),
    materialsProvided: z.boolean()
  })
});

// Auth validation schemas
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: nameSchema,
  userRole: z.enum(['customer', 'handyman']) // contractor and property_manager removed — those roles are archived
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
});

// Profile validation schema
export const profileSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  bio: descriptionSchema.optional(),
  location: addressSchema.optional(),
  businessName: z.string().max(200, 'Business name must be less than 200 characters').optional().transform((val) => val ? sanitizeText(val) : val),
  licenseNumber: z.string().max(100, 'License number must be less than 100 characters').optional().transform((val) => val ? sanitizeText(val) : val),
  yearsExperience: z.number().min(0, 'Years of experience must be positive').max(100, 'Years of experience must be realistic').optional(),
  hourlyRate: budgetSchema.optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  skills: z.array(z.string().transform(sanitizeText)).optional()
});

// File upload validation
export const validateFileUpload = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 10MB' };
  }
  
  return { isValid: true };
};

// Rate limiting utility
export class RateLimiter {
  private attempts: Map<string, { count: number; firstAttempt: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier);

    if (!attempts) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now });
      return false;
    }

    if (now - attempts.firstAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now });
      return false;
    }

    if (attempts.count >= this.maxAttempts) {
      return true;
    }

    attempts.count++;
    return false;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
