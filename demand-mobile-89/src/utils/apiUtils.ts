import { supabase } from '@/integrations/supabase/client';
import { AppError, createError, errorCodes, handleSupabaseError } from './errorHandling';

export interface ApiResponse<T = any> {
  data?: T;
  error?: AppError;
  success: boolean;
}

export const safeApiCall = async <T = any>(
  operation: () => Promise<T>,
  errorContext?: string
): Promise<ApiResponse<T>> => {
  try {
    const data = await operation();
    return { data, success: true };
  } catch (error) {
    const appError = error instanceof AppError ? error : handleSupabaseError(error);
    console.error(`API Error ${errorContext ? `[${errorContext}]` : ''}:`, appError);
    return { error: appError, success: false };
  }
};

export const invokeEdgeFunction = async (
  functionName: string, 
  payload?: any
): Promise<ApiResponse> => {
  return safeApiCall(async () => {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload
    });

    if (error) {
      throw handleSupabaseError(error);
    }

    return data;
  }, `Edge Function: ${functionName}`);
};

export const fetchFromSupabase = async <T = any>(
  queryBuilder: any
): Promise<ApiResponse<T>> => {
  return safeApiCall(async () => {
    const { data, error } = await queryBuilder;

    if (error) {
      throw handleSupabaseError(error);
    }

    return data;
  }, 'Supabase Query');
};

export const insertToSupabase = async <T = any>(
  table: string,
  payload: any
): Promise<ApiResponse<T>> => {
  return safeApiCall(async () => {
    const { data, error } = await (supabase as any)
      .from(table)
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error);
    }

    return data as T;
  }, `Insert to ${table}`);
};

export const updateInSupabase = async <T = any>(
  table: string,
  id: string,
  payload: any
): Promise<ApiResponse<T>> => {
  return safeApiCall(async () => {
    const { data, error } = await (supabase as any)
      .from(table)
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw handleSupabaseError(error);
    }

    return data as T;
  }, `Update ${table}`);
};

export const deleteFromSupabase = async (
  table: string,
  id: string
): Promise<ApiResponse> => {
  return safeApiCall(async () => {
    const { error } = await (supabase as any)
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      throw handleSupabaseError(error);
    }

    return { success: true };
  }, `Delete from ${table}`);
};

// Retry mechanism for failed operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }

  throw lastError!;
};

// Batch operations helper
export const batchOperation = async <T, R>(
  items: T[],
  operation: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> => {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchPromises = batch.map(operation);
    const batchResults = await Promise.allSettled(batchPromises);
    
    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.error('Batch operation failed:', result.reason);
      }
    }
  }
  
  return results;
};