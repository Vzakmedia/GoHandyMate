
import { useRef, useEffect } from 'react';

export const useAudioContext = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isClosedRef = useRef(false);

  // Initialize audio context
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          isClosedRef.current = false;
          console.log('Audio context initialized');
        }
      } catch (error) {
        console.error('Error initializing audio context:', error);
      }
    };

    initAudioContext();

    return () => {
      try {
        if (audioContextRef.current && !isClosedRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
          isClosedRef.current = true;
        }
      } catch (error) {
        console.error('Error closing audio context:', error);
      }
    };
  }, []);

  const getAudioContext = () => audioContextRef.current;
  const isContextClosed = () => isClosedRef.current || !audioContextRef.current || audioContextRef.current.state === 'closed';

  return {
    getAudioContext,
    isContextClosed
  };
};
