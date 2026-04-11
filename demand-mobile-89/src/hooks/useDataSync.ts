
import { useState, useCallback, useRef } from 'react';

interface DataSyncState {
  isLoading: boolean;
  lastSync: Date | null;
  error: string | null;
  hasUnsavedChanges: boolean;
}

export const useDataSync = () => {
  const [syncState, setSyncState] = useState<DataSyncState>({
    isLoading: false,
    lastSync: null,
    error: null,
    hasUnsavedChanges: false
  });

  const lastSyncRef = useRef<Date | null>(null);

  const startSync = useCallback(() => {
    setSyncState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));
  }, []);

  const completeSync = useCallback((success: boolean, error?: string) => {
    const now = new Date();
    lastSyncRef.current = now;
    
    setSyncState(prev => ({
      ...prev,
      isLoading: false,
      lastSync: success ? now : prev.lastSync,
      error: error || null,
      hasUnsavedChanges: success ? false : prev.hasUnsavedChanges
    }));
  }, []);

  const markUnsavedChanges = useCallback(() => {
    setSyncState(prev => ({
      ...prev,
      hasUnsavedChanges: true
    }));
  }, []);

  const clearError = useCallback(() => {
    setSyncState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  return {
    syncState,
    startSync,
    completeSync,
    markUnsavedChanges,
    clearError
  };
};
