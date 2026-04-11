export class AppError extends Error {
  public code: string;
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, code: string = 'GENERIC_ERROR', statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorCodes = {
  // Authentication errors
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Permission errors
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  ROLE_REQUIRED: 'ROLE_REQUIRED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Resource errors
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RESOURCE_ALREADY_EXISTS: 'RESOURCE_ALREADY_EXISTS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
  
  // External service errors
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  
  // Business logic errors
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
  
  // System errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
} as const;

export type ErrorCode = typeof errorCodes[keyof typeof errorCodes];

export const createError = (message: string, code: ErrorCode, statusCode?: number): AppError => {
  return new AppError(message, code, statusCode);
};

export const handleSupabaseError = (error: any): AppError => {
  if (!error) {
    return createError('Unknown error occurred', errorCodes.INTERNAL_SERVER_ERROR);
  }

  // Handle Supabase specific errors
  if (error.code) {
    switch (error.code) {
      case 'PGRST116':
        return createError('Resource not found', errorCodes.RESOURCE_NOT_FOUND, 404);
      case 'PGRST301':
        return createError('Insufficient permissions', errorCodes.INSUFFICIENT_PERMISSIONS, 403);
      case '42501':
        return createError('Database permission denied', errorCodes.INSUFFICIENT_PERMISSIONS, 403);
      case '23505':
        return createError('Resource already exists', errorCodes.RESOURCE_ALREADY_EXISTS, 409);
      case '23503':
        return createError('Related resource not found', errorCodes.RESOURCE_NOT_FOUND, 404);
      default:
        return createError(error.message || 'Database error', errorCodes.DATABASE_ERROR, 500);
    }
  }

  // Handle network errors
  if (error.name === 'NetworkError' || error.message?.includes('network')) {
    return createError('Network connection error', errorCodes.NETWORK_ERROR, 503);
  }

  // Handle authentication errors
  if (error.message?.includes('auth') || error.message?.includes('token')) {
    return createError('Authentication error', errorCodes.AUTH_REQUIRED, 401);
  }

  // Default error handling
  return createError(
    error.message || 'An unexpected error occurred', 
    errorCodes.INTERNAL_SERVER_ERROR,
    500
  );
};

export const getUserFriendlyMessage = (error: AppError | Error): string => {
  if (error instanceof AppError) {
    switch (error.code) {
      case errorCodes.AUTH_REQUIRED:
        return 'Please sign in to continue';
      case errorCodes.INSUFFICIENT_PERMISSIONS:
        return 'You do not have permission to perform this action';
      case errorCodes.RESOURCE_NOT_FOUND:
        return 'The requested item could not be found';
      case errorCodes.NETWORK_ERROR:
        return 'Please check your internet connection and try again';
      case errorCodes.VALIDATION_ERROR:
        return 'Please check your input and try again';
      default:
        return error.message;
    }
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export const logError = (error: Error | AppError, context?: Record<string, any>) => {
  if (process.env.NODE_ENV === 'development') {
    console.error('Application Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...(error instanceof AppError && {
        code: error.code,
        statusCode: error.statusCode,
        isOperational: error.isOperational
      }),
      context
    });
  }
  
  // In production, you might want to send this to an error reporting service
  // like Sentry, LogRocket, etc.
};

export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string
): T => {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = error instanceof AppError ? error : handleSupabaseError(error);
      logError(appError, { context, args });
      throw appError;
    }
  }) as T;
};