// Performance utilities for the handyman app
import { useCallback, useRef, useEffect } from 'react';

// Debounce utility for performance optimization
export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
};

// Throttle utility for scroll and resize events
export const useThrottle = <T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T => {
  const lastCall = useRef<number>(0);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  }, [callback, delay]) as T;
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  callback: () => void,
  options: IntersectionObserverInit = {}
) => {
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
      }
    }, options);

    observer.observe(target);

    return () => observer.disconnect();
  }, [callback, options]);

  return targetRef;
};

// Memory usage optimization
export const cleanupResources = () => {
  // Force garbage collection in development (Chrome specific)
  if (typeof window !== 'undefined' && 'performance' in window) {
    const perf = window.performance as any;
    if (perf.memory) {
      console.log('Memory usage:', {
        used: Math.round(perf.memory.usedJSHeapSize / 1048576) + ' MB',
        total: Math.round(perf.memory.totalJSHeapSize / 1048576) + ' MB',
        limit: Math.round(perf.memory.jsHeapSizeLimit / 1048576) + ' MB'
      });
    }
  }
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`⚡ ${name} took ${end - start} milliseconds`);
};

// Cache utility for expensive computations
export class SimpleCache<T> {
  private cache = new Map<string, { value: T; timestamp: number }>();
  private ttl: number;

  constructor(ttlMs: number = 300000) { // 5 minutes default
    this.ttl = ttlMs;
  }

  get(key: string): T | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  set(key: string, value: T): void {
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}