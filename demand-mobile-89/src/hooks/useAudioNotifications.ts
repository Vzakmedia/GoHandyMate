import { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { useAudioContext } from './audio/useAudioContext';
import { createJobRequestTone, createQuoteNotificationTone, createMessageTone } from './audio/toneGenerators';
import { AudioNotificationOptions, SoundController } from './audio/types';
import { useNotificationPreferences } from './useNotificationPreferences';

export const useAudioNotifications = (options: AudioNotificationOptions = {}) => {
  const { user } = useAuth();
  const { preferences, loading, savePreferences } = useNotificationPreferences();
  const [isEnabled, setIsEnabled] = useState(options.enabled ?? true);
  const [volume, setVolume] = useState(options.volume ?? 0.7);
  
  const { getAudioContext, isContextClosed } = useAudioContext();
  const currentSoundRef = useRef<SoundController | null>(null);

  // Sync with notification preferences
  useEffect(() => {
    if (!loading && preferences) {
      setIsEnabled(preferences.audio_enabled);
      setVolume(preferences.volume);
    }
  }, [preferences, loading]);

  console.log('useAudioNotifications: Hook initialized, isEnabled:', isEnabled, 'volume:', volume, 'preferences loaded:', !loading);

  // Update preferences when audio settings change
  const updateIsEnabled = useCallback(async (enabled: boolean) => {
    setIsEnabled(enabled);
    if (preferences && savePreferences) {
      await savePreferences({ audio_enabled: enabled });
    }
  }, [preferences, savePreferences]);

  const updateVolume = useCallback(async (vol: number) => {
    setVolume(vol);
    if (preferences && savePreferences) {
      await savePreferences({ volume: vol });
    }
  }, [preferences, savePreferences]);

  const playJobRequestTone = useCallback(() => {
    try {
      console.log('Playing job request tone');
      const ctx = getAudioContext();
      
      if (!ctx || !isEnabled || isContextClosed()) {
        console.log('Audio disabled or context not available');
        return;
      }

      if (currentSoundRef.current) {
        currentSoundRef.current.stop();
      }
      
      currentSoundRef.current = createJobRequestTone(ctx, volume);
    } catch (error) {
      console.error('Error playing job request tone:', error);
    }
  }, [getAudioContext, isEnabled, isContextClosed, volume]);

  const playQuoteNotificationTone = useCallback(() => {
    try {
      console.log('Playing quote notification tone');
      const ctx = getAudioContext();
      
      if (!ctx || !isEnabled || isContextClosed()) {
        console.log('Audio disabled or context not available');
        return;
      }

      if (currentSoundRef.current) {
        currentSoundRef.current.stop();
      }
      
      currentSoundRef.current = createQuoteNotificationTone(ctx, volume);
    } catch (error) {
      console.error('Error playing quote notification tone:', error);
    }
  }, [getAudioContext, isEnabled, isContextClosed, volume]);

  const playMessageTone = useCallback(() => {
    try {
      console.log('Playing message tone');
      const ctx = getAudioContext();
      
      if (!ctx || !isEnabled || isContextClosed()) {
        console.log('Audio disabled or context not available');
        // Don't play fallback if audio is intentionally disabled
        if (!isEnabled) return;
        
        // Fallback to simple tone for messaging only if context failed
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = 800;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);
        } catch (fallbackError) {
          console.log('Fallback audio also failed:', fallbackError);
        }
        return;
      }

      if (currentSoundRef.current) {
        currentSoundRef.current.stop();
      }
      
      currentSoundRef.current = createMessageTone(ctx, volume);
    } catch (error) {
      console.log('Audio notification not available:', error);
    }
  }, [getAudioContext, isEnabled, isContextClosed, volume]);

  const stopCurrentSound = useCallback(() => {
    try {
      if (currentSoundRef.current) {
        currentSoundRef.current.stop();
        currentSoundRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping current sound:', error);
    }
  }, []);

  return {
    playJobRequestTone,
    playQuoteNotificationTone,
    playMessageTone,
    stopCurrentSound,
    isEnabled,
    setIsEnabled: updateIsEnabled,
    volume,
    setVolume: updateVolume
  };
};