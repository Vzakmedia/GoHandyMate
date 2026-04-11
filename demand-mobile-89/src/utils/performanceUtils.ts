/**
 * Performance utilities for optimizing React components and async operations
 */

/**
 * Debounce function to limit the rate of function calls
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function to limit function calls to once per specified time period
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Safe timeout that can be cleaned up properly
 */
export const createSafeTimeout = (callback: () => void, delay: number) => {
  const timeoutId = setTimeout(callback, delay);
  
  return {
    id: timeoutId,
    clear: () => clearTimeout(timeoutId)
  };
};

/**
 * Safe interval that can be cleaned up properly
 */
export const createSafeInterval = (callback: () => void, delay: number) => {
  const intervalId = setInterval(callback, delay);
  
  return {
    id: intervalId,
    clear: () => clearInterval(intervalId)
  };
};

/**
 * Creates a cancellable async operation
 */
export const createCancellableAsync = <T>(
  asyncFn: () => Promise<T>
): {
  promise: Promise<T>;
  cancel: () => void;
  isCancelled: () => boolean;
} => {
  let cancelled = false;
  
  const promise = asyncFn().then(
    result => {
      if (cancelled) {
        throw new Error('Operation was cancelled');
      }
      return result;
    },
    error => {
      if (cancelled) {
        throw new Error('Operation was cancelled');
      }
      throw error;
    }
  );
  
  return {
    promise,
    cancel: () => {
      cancelled = true;
    },
    isCancelled: () => cancelled
  };
};

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};