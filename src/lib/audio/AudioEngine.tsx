'use client';

import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useEnvironment } from '@/lib/environment/state';
import { useCreator } from '@/lib/environment/creatorState';

interface AudioEngineContextType {
  playFeedback: (type: 'hover' | 'click' | 'anomaly') => void;
}

const AudioEngineContext = createContext<AudioEngineContextType | undefined>(undefined);

export function AudioEngineProvider({ children }: { children: React.ReactNode }) {
  const { mood, intensity } = useEnvironment();
  const { activeDimension } = useCreator();
  const audioCtx = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);

  useEffect(() => {
    // Lazy init audio context on first interaction
    const initAudio = () => {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();

        // Ambient Hum Setup
        oscillator.current = audioCtx.current.createOscillator();
        gainNode.current = audioCtx.current.createGain();

        oscillator.current.type = 'sine';
        oscillator.current.frequency.setValueAtTime(60, audioCtx.current.currentTime);

        gainNode.current.gain.setValueAtTime(0.02, audioCtx.current.currentTime);

        oscillator.current.connect(gainNode.current);
        gainNode.current.connect(audioCtx.current.destination);
        oscillator.current.start();
      }
    };

    window.addEventListener('mousedown', initAudio, { once: true });
    return () => window.removeEventListener('mousedown', initAudio);
  }, []);

  useEffect(() => {
    if (audioCtx.current && oscillator.current && gainNode.current) {
      // Shift ambient hum based on dimension and mood
      const freq = activeDimension.id === 'cyber' ? 40 : activeDimension.id === 'osint' ? 50 : 80;
      const targetFreq = freq + (intensity * 20);
      oscillator.current.frequency.exponentialRampToValueAtTime(targetFreq, audioCtx.current.currentTime + 2);

      const targetGain = mood === 'critical' ? 0.05 : 0.02;
      gainNode.current.gain.linearRampToValueAtTime(targetGain, audioCtx.current.currentTime + 1);
    }
  }, [activeDimension.id, mood, intensity]);

  const playFeedback = (type: 'hover' | 'click' | 'anomaly') => {
    if (!audioCtx.current) return;

    const osc = audioCtx.current.createOscillator();
    const g = audioCtx.current.createGain();

    osc.connect(g);
    g.connect(audioCtx.current.destination);

    const now = audioCtx.current.currentTime;

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      g.gain.setValueAtTime(0.01, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'click') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
      g.gain.setValueAtTime(0.05, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  };

  return (
    <AudioEngineContext.Provider value={{ playFeedback }}>
      {children}
    </AudioEngineContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioEngineContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioEngineProvider');
  }
  return context;
}
