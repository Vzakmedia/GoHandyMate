import { useEffect, useRef } from 'react';

/**
 * Custom hook to handle cleanup of async operations and timers
 */
export const useCleanupEffect = () => {
  const cleanupRef = useRef<(() => void)[]>([]);

  const addCleanup = (cleanupFn: () => void) => {
    cleanupRef.current.push(cleanupFn);
  };

  const cleanup = () => {
    cleanupRef.current.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    });
    cleanupRef.current = [];
  };

  useEffect(() => {
    return cleanup;
  }, []);

  return { addCleanup, cleanup };
};

/**
 * Hook for managing timeouts with automatic cleanup
 */
export const useSafeTimeout = () => {
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const setTimeout = (callback: () => void, delay: number) => {
    const timeoutId = globalThis.setTimeout(() => {
      timeoutsRef.current.delete(timeoutId);
      callback();
    }, delay);
    
    timeoutsRef.current.add(timeoutId);
    return timeoutId;
  };

  const clearTimeout = (timeoutId: NodeJS.Timeout) => {
    globalThis.clearTimeout(timeoutId);
    timeoutsRef.current.delete(timeoutId);
  };

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(id => globalThis.clearTimeout(id));
    timeoutsRef.current.clear();
  };

  useEffect(() => {
    return clearAllTimeouts;
  }, []);

  return { setTimeout, clearTimeout, clearAllTimeouts };
};

/**
 * Hook for managing intervals with automatic cleanup
 */
export const useSafeInterval = () => {
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const setInterval = (callback: () => void, delay: number) => {
    const intervalId = globalThis.setInterval(callback, delay);
    intervalsRef.current.add(intervalId);
    return intervalId;
  };

  const clearInterval = (intervalId: NodeJS.Timeout) => {
    globalThis.clearInterval(intervalId);
    intervalsRef.current.delete(intervalId);
  };

  const clearAllIntervals = () => {
    intervalsRef.current.forEach(id => globalThis.clearInterval(id));
    intervalsRef.current.clear();
  };

  useEffect(() => {
    return clearAllIntervals;
  }, []);

  return { setInterval, clearInterval, clearAllIntervals };
};