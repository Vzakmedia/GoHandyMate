
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';
import { fetchHandymanData } from './handyman-data/dataFetcher';
import { useRealtimeSubscriptions } from './handyman-data/realtimeSubscriptions';
import type { HandymanData, UseHandymanDataReturn } from './handyman-data/types';

// Cache for handyman data to prevent unnecessary refetches
const dataCache = new Map<string, { data: HandymanData; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useOptimizedHandymanData = (): UseHandymanDataReturn => {
  const { user } = useAuth();
  const [data, setData] = useState<HandymanData>({
    skillRates: [],
    servicePricing: [],
    workAreas: [],
    workSettings: null,
    availabilitySlots: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const subscriptionsRef = useRef<{ setupSubscriptions: () => void; cleanupSubscriptions: () => void } | null>(null);
  const isInitialized = useRef(false);
  const fetchPromiseRef = useRef<Promise<HandymanData> | null>(null);

  // Memoized cache key
  const cacheKey = useMemo(() => user?.id || '', [user?.id]);

  const fetchData = useCallback(async (force = false) => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    // Check cache first
    const cached = dataCache.get(cacheKey);
    const now = Date.now();
    
    if (!force && cached && (now - cached.timestamp) < CACHE_DURATION) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    // Prevent duplicate requests
    if (fetchPromiseRef.current) {
      try {
        const result = await fetchPromiseRef.current;
        setData(result);
        return;
      } catch {
        // If the existing promise failed, continue with new request
      }
    }

    try {
      setLoading(true);
      setError(null);
      
      const fetchPromise = fetchHandymanData(user.id);
      fetchPromiseRef.current = fetchPromise;
      
      const handymanData = await fetchPromise;
      
      // Update cache
      dataCache.set(cacheKey, { data: handymanData, timestamp: now });
      
      setData(handymanData);
    } catch (error: any) {
      console.error('useOptimizedHandymanData: Error fetching data:', error);
      setError(error.message || 'Failed to fetch handyman data');
      
      // Only show toast if it's a new error (not from cache)
      if (force || !cached) {
        toast.error('Failed to load handyman data');
      }
    } finally {
      setLoading(false);
      fetchPromiseRef.current = null;
    }
  }, [user?.id, cacheKey]);

  const refreshData = useCallback(async () => {
    console.log('useOptimizedHandymanData: Force refreshing data...');
    await fetchData(true);
  }, [fetchData]);

  // Initialize subscriptions
  useEffect(() => {
    if (!user || isInitialized.current) return;

    console.log('useOptimizedHandymanData: Initializing subscriptions');
    const subscriptions = useRealtimeSubscriptions(user.id, refreshData);
    subscriptionsRef.current = subscriptions;
    
    const timer = setTimeout(() => {
      subscriptions.setupSubscriptions();
      isInitialized.current = true;
    }, 100);

    return () => {
      clearTimeout(timer);
      if (subscriptionsRef.current) {
        console.log('useOptimizedHandymanData: Cleaning up subscriptions');
        subscriptionsRef.current.cleanupSubscriptions();
        subscriptionsRef.current = null;
      }
      isInitialized.current = false;
    };
  }, [user?.id, refreshData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize return value to prevent unnecessary re-renders
  return useMemo(() => ({
    data,
    loading,
    error,
    refreshData
  }), [data, loading, error, refreshData]);
};
