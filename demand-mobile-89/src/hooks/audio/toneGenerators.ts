interface SoundController {
  stop: () => void;
}

export const createJobRequestTone = (ctx: AudioContext, volume: number): SoundController | null => {
  try {
    const oscillators: OscillatorNode[] = [];
    const gainNodes: GainNode[] = [];
    
    // Create a repeating ascending chime sequence similar to quote alert but longer
    const baseSequence = [
      { freq: 440.00, start: 0, duration: 0.3 },     // A4
      { freq: 523.25, start: 0.15, duration: 0.3 },  // C5
      { freq: 659.25, start: 0.3, duration: 0.4 },   // E5
      { freq: 880.00, start: 0.5, duration: 0.5 }    // A5
    ];
    
    // Repeat the sequence multiple times over 8-10 seconds
    const repetitions = 8; // Will create about 8-9 seconds of audio
    const sequenceLength = 1.2; // Each sequence is 1.2 seconds
    
    for (let rep = 0; rep < repetitions; rep++) {
      const timeOffset = rep * sequenceLength;
      
      baseSequence.forEach((note) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        // Use sine wave with slight modulation for bell-like sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + note.start + timeOffset);
        
        // Add subtle frequency modulation for richness
        const modulator = ctx.createOscillator();
        const modulatorGain = ctx.createGain();
        modulator.connect(modulatorGain);
        modulatorGain.connect(oscillator.frequency);
        modulator.frequency.setValueAtTime(5, ctx.currentTime + note.start + timeOffset);
        modulatorGain.gain.setValueAtTime(2, ctx.currentTime + note.start + timeOffset);
        
        // Gradual volume fade for later repetitions to create a natural decay
        const volumeMultiplier = Math.max(0.3, 1 - (rep * 0.08));
        
        // Smooth envelope
        gainNode.gain.setValueAtTime(0, ctx.currentTime + note.start + timeOffset);
        gainNode.gain.linearRampToValueAtTime(volume * 0.5 * volumeMultiplier, ctx.currentTime + note.start + timeOffset + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.start + timeOffset + note.duration);
        
        oscillator.start(ctx.currentTime + note.start + timeOffset);
        oscillator.stop(ctx.currentTime + note.start + timeOffset + note.duration);
        modulator.start(ctx.currentTime + note.start + timeOffset);
        modulator.stop(ctx.currentTime + note.start + timeOffset + note.duration);
        
        oscillators.push(oscillator, modulator);
        gainNodes.push(gainNode, modulatorGain);
      });
    }
    
    return {
      stop: () => {
        try {
          oscillators.forEach(osc => {
            try { osc.stop(); } catch (e) { /* Already stopped */ }
          });
        } catch (e) {
          // Already stopped
        }
      }
    };
  } catch (error) {
    console.error('Error creating job request tone:', error);
    return null;
  }
};

export const createQuoteNotificationTone = (ctx: AudioContext, volume: number): SoundController | null => {
  try {
    const oscillators: OscillatorNode[] = [];
    const gainNodes: GainNode[] = [];
    
    // Modern ascending chime sequence
    const frequencies = [
      { freq: 440.00, start: 0, duration: 0.3 },     // A4
      { freq: 523.25, start: 0.15, duration: 0.3 },  // C5
      { freq: 659.25, start: 0.3, duration: 0.4 },   // E5
      { freq: 880.00, start: 0.5, duration: 0.5 }    // A5
    ];
    
    frequencies.forEach((note) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Use sine wave with slight modulation for bell-like sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + note.start);
      
      // Add subtle frequency modulation for richness
      const modulator = ctx.createOscillator();
      const modulatorGain = ctx.createGain();
      modulator.connect(modulatorGain);
      modulatorGain.connect(oscillator.frequency);
      modulator.frequency.setValueAtTime(5, ctx.currentTime + note.start);
      modulatorGain.gain.setValueAtTime(2, ctx.currentTime + note.start);
      
      // Smooth envelope
      gainNode.gain.setValueAtTime(0, ctx.currentTime + note.start);
      gainNode.gain.linearRampToValueAtTime(volume * 0.5, ctx.currentTime + note.start + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.start + note.duration);
      
      oscillator.start(ctx.currentTime + note.start);
      oscillator.stop(ctx.currentTime + note.start + note.duration);
      modulator.start(ctx.currentTime + note.start);
      modulator.stop(ctx.currentTime + note.start + note.duration);
      
      oscillators.push(oscillator, modulator);
      gainNodes.push(gainNode, modulatorGain);
    });
    
    return {
      stop: () => {
        try {
          oscillators.forEach(osc => {
            try { osc.stop(); } catch (e) { /* Already stopped */ }
          });
        } catch (e) {
          // Already stopped
        }
      }
    };
  } catch (error) {
    console.error('Error creating quote notification tone:', error);
    return null;
  }
};

export const createMessageTone = (ctx: AudioContext, volume: number): SoundController | null => {
  try {
    const oscillators: OscillatorNode[] = [];
    const gainNodes: GainNode[] = [];
    
    // Modern, smooth notification - inspired by iOS/material design
    const tones = [
      { freq: 523.25, start: 0, duration: 0.15 },      // C5 - soft start
      { freq: 659.25, start: 0.08, duration: 0.18 },   // E5 - harmony
      { freq: 783.99, start: 0.12, duration: 0.2 }     // G5 - gentle peak
    ];
    
    tones.forEach((tone, index) => {
      // Main oscillator with sine wave for purity
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();
      
      // Audio routing: oscillator -> filter -> gain -> destination
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      // Use sine wave for pure, clean sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(tone.freq, ctx.currentTime + tone.start);
      
      // Low-pass filter for warmth and smoothness
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(2000, ctx.currentTime + tone.start);
      filterNode.Q.setValueAtTime(1, ctx.currentTime + tone.start);
      
      // Add subtle harmonics for richness
      const harmonic = ctx.createOscillator();
      const harmonicGain = ctx.createGain();
      harmonic.connect(harmonicGain);
      harmonicGain.connect(filterNode);
      
      harmonic.type = 'sine';
      harmonic.frequency.setValueAtTime(tone.freq * 2, ctx.currentTime + tone.start); // Octave harmonic
      
      // Harmonic volume (very subtle)
      harmonicGain.gain.setValueAtTime(0, ctx.currentTime + tone.start);
      harmonicGain.gain.linearRampToValueAtTime(volume * 0.08, ctx.currentTime + tone.start + 0.01);
      harmonicGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + tone.start + tone.duration);
      
      // Smooth, modern envelope with gentle attack and decay
      const baseVolume = volume * (0.35 - index * 0.05); // Gradual volume decrease
      gainNode.gain.setValueAtTime(0, ctx.currentTime + tone.start);
      gainNode.gain.linearRampToValueAtTime(baseVolume, ctx.currentTime + tone.start + 0.02);
      gainNode.gain.setValueAtTime(baseVolume * 0.8, ctx.currentTime + tone.start + 0.08);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + tone.start + tone.duration);
      
      // Start and stop
      oscillator.start(ctx.currentTime + tone.start);
      oscillator.stop(ctx.currentTime + tone.start + tone.duration);
      harmonic.start(ctx.currentTime + tone.start);
      harmonic.stop(ctx.currentTime + tone.start + tone.duration);
      
      oscillators.push(oscillator, harmonic);
      gainNodes.push(gainNode, harmonicGain);
    });
    
    return {
      stop: () => {
        try {
          oscillators.forEach(osc => {
            try { osc.stop(); } catch (e) { /* Already stopped */ }
          });
        } catch (e) {
          // Already stopped
        }
      }
    };
  } catch (error) {
    console.error('Error creating message tone:', error);
    return null;
  }
};
