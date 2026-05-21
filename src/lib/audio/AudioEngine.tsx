'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useEnvironment } from '@/lib/environment/state';
import { useCreator } from '@/lib/environment/creatorState';

interface AudioEngineContextType {
  playFeedback: (type: 'hover' | 'click' | 'anomaly' | 'success') => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const AudioEngineContext = createContext<AudioEngineContextType | undefined>(undefined);

export function AudioEngineProvider({ children }: { children: React.ReactNode }) {
  const { mood, intensity } = useEnvironment();
  const { activeDimension } = useCreator();
  const [isMuted, setIsMuted] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const masterGain = useRef<GainNode | null>(null);

  useEffect(() => {
    const initAudio = () => {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();

        masterGain.current = audioCtx.current.createGain();
        masterGain.current.connect(audioCtx.current.destination);
        masterGain.current.gain.setValueAtTime(isMuted ? 0 : 1, audioCtx.current.currentTime);

        // Ambient Hum Setup
        oscillator.current = audioCtx.current.createOscillator();
        gainNode.current = audioCtx.current.createGain();

        oscillator.current.type = 'sine';
        oscillator.current.frequency.setValueAtTime(60, audioCtx.current.currentTime);

        gainNode.current.gain.setValueAtTime(0.01, audioCtx.current.currentTime);

        oscillator.current.connect(gainNode.current);
        gainNode.current.connect(masterGain.current);
        oscillator.current.start();
      }
    };

    window.addEventListener('mousedown', initAudio, { once: true });
    return () => window.removeEventListener('mousedown', initAudio);
  }, [isMuted]);

  useEffect(() => {
    if (masterGain.current && audioCtx.current) {
        masterGain.current.gain.linearRampToValueAtTime(isMuted ? 0 : 1, audioCtx.current.currentTime + 0.5);
    }
  }, [isMuted]);

  useEffect(() => {
    if (audioCtx.current && oscillator.current && gainNode.current) {
      const freq = activeDimension?.id === 'cyber' ? 40 : activeDimension?.id === 'osint' ? 50 : 80;
      const targetFreq = freq + (intensity * 20);
      oscillator.current.frequency.exponentialRampToValueAtTime(targetFreq, audioCtx.current.currentTime + 2);

      const targetGain = mood === 'critical' ? 0.03 : 0.01;
      gainNode.current.gain.linearRampToValueAtTime(targetGain, audioCtx.current.currentTime + 1);
    }
  }, [activeDimension?.id, mood, intensity]);

  const playFeedback = (type: 'hover' | 'click' | 'anomaly' | 'success') => {
    if (!audioCtx.current || !masterGain.current || isMuted) return;

    const osc = audioCtx.current.createOscillator();
    const g = audioCtx.current.createGain();

    osc.connect(g);
    g.connect(masterGain.current);

    const now = audioCtx.current.currentTime;

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.05);
      g.gain.setValueAtTime(0.005, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.1);
      g.gain.setValueAtTime(0.02, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'anomaly') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, now);
      osc.frequency.linearRampToValueAtTime(40, now + 0.5);
      g.gain.setValueAtTime(0.03, now);
      g.gain.linearRampToValueAtTime(0, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.2);
      g.gain.setValueAtTime(0.02, now);
      g.gain.linearRampToValueAtTime(0, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <AudioEngineContext.Provider value={{ playFeedback, isMuted, toggleMute }}>
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
