/**
 * Promise utilities for better async operation handling
 */

/**
 * Creates a promise that resolves after a specified delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Promise with timeout that rejects if not resolved within the specified time
 */
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage = 'Operation timed out'
): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);
    
    // Clean up timeout if main promise resolves first
    promise.finally(() => clearTimeout(timeoutId));
  });

  return Promise.race([promise, timeoutPromise]);
};

/**
 * Safely handles promise rejections with optional fallback
 */
export const safePromise = <T>(
  promise: Promise<T>,
  fallback?: T
): Promise<{ data: T | null; error: Error | null }> => {
  return promise
    .then(data => ({ data, error: null }))
    .catch(error => ({ 
      data: fallback || null, 
      error: error instanceof Error ? error : new Error(String(error)) 
    }));
};

/**
 * Batches multiple promises and returns results with their success/failure status
 */
export const batchPromises = async <T>(
  promises: Promise<T>[],
  options: { 
    concurrency?: number;
    failFast?: boolean;
  } = {}
): Promise<Array<{ success: boolean; data?: T; error?: Error }>> => {
  const { concurrency = promises.length, failFast = false } = options;
  
  if (failFast) {
    // Use Promise.all for fail-fast behavior
    try {
      const results = await Promise.all(promises);
      return results.map(data => ({ success: true, data }));
    } catch (error) {
      throw error;
    }
  }
  
  // Use Promise.allSettled for non-fail-fast behavior
  const settledPromises = concurrency >= promises.length
    ? await Promise.allSettled(promises)
    : await batchWithConcurrency(promises, concurrency);
  
  return settledPromises.map(result => {
    if (result.status === 'fulfilled') {
      return { success: true, data: result.value };
    } else {
      return { 
        success: false, 
        error: result.reason instanceof Error ? result.reason : new Error(String(result.reason))
      };
    }
  });
};

/**
 * Helper function to batch promises with limited concurrency
 */
const batchWithConcurrency = async <T>(
  promises: Promise<T>[],
  concurrency: number
): Promise<PromiseSettledResult<T>[]> => {
  const results: PromiseSettledResult<T>[] = [];
  
  for (let i = 0; i < promises.length; i += concurrency) {
    const batch = promises.slice(i, i + concurrency);
    const batchResults = await Promise.allSettled(batch);
    results.push(...batchResults);
  }
  
  return results;
};

/**
 * Creates a cancellable promise wrapper
 */
export const createCancellablePromise = <T>(
  promise: Promise<T>
): {
  promise: Promise<T>;
  cancel: () => void;
  isCancelled: () => boolean;
} => {
  let cancelled = false;
  
  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise
      .then(value => {
        if (!cancelled) {
          resolve(value);
        }
      })
      .catch(error => {
        if (!cancelled) {
          reject(error);
        }
      });
  });
  
  return {
    promise: wrappedPromise,
    cancel: () => {
      cancelled = true;
    },
    isCancelled: () => cancelled
  };
};

/**
 * Retries a promise-returning function with exponential backoff
 */
export const retryPromise = async <T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    baseDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    shouldRetry?: (error: Error) => boolean;
  } = {}
): Promise<T> => {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    shouldRetry = () => true
  } = options;
  
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxAttempts || !shouldRetry(lastError)) {
        throw lastError;
      }
      
      const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt - 1), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};