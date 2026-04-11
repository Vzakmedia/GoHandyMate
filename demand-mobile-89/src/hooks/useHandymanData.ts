
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';
import { fetchHandymanData } from './handyman-data/dataFetcher';
import { useRealtimeSubscriptions } from './handyman-data/realtimeSubscriptions';
import type { HandymanData, UseHandymanDataReturn } from './handyman-data/types';

export const useHandymanData = (): UseHandymanDataReturn => {
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

  const fetchData = useCallback(async () => {
    if (!user) {
      console.log('useHandymanData: No user found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const handymanData = await fetchHandymanData(user.id);
      setData(handymanData);
    } catch (error: any) {
      console.error('useHandymanData: Error fetching data:', error);
      setError(error.message || 'Failed to fetch handyman data');
      toast.error('Failed to load handyman data');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refreshData = useCallback(async () => {
    console.log('useHandymanData: Refreshing data...');
    await fetchData();
  }, [fetchData]);

  // Initialize subscriptions
  useEffect(() => {
    if (!user || isInitialized.current) return;

    console.log('useHandymanData: Initializing subscriptions');
    const subscriptions = useRealtimeSubscriptions(user.id, refreshData);
    subscriptionsRef.current = subscriptions;
    
    // Setup subscriptions after a small delay to ensure component is ready
    const timer = setTimeout(() => {
      subscriptions.setupSubscriptions();
      isInitialized.current = true;
    }, 100);

    return () => {
      clearTimeout(timer);
      if (subscriptionsRef.current) {
        console.log('useHandymanData: Cleaning up subscriptions');
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

  return {
    data,
    loading,
    error,
    refreshData
  };
};
