'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface WorldState {
  tension: number;        // 0 to 1: Global intensity and atmospheric pressure
  stability: number;      // 0 to 1: Structural integrity of UI and geometry
  anomalyLevel: number;   // 0 to 1: Frequency of glitches and rare states
  entropy: number;        // 0 to 1: Randomness and disorder in systems
  signalNoise: number;    // 0 to 1: Clarity of information and visual noise
  corruption: number;     // 0 to 1: Distortion of data and environments
  synchronization: number; // 0 to 1: Connection between sub-systems
}

export type WorldEventType = 'anomaly' | 'data_surge' | 'security_breach' | 'system_sync' | 'entropy_shift';

export interface WorldEvent {
  type: WorldEventType;
  payload?: Record<string, unknown>;
  timestamp: number;
}

const DEFAULT_STATE: WorldState = {
  tension: 0.2,
  stability: 0.9,
  anomalyLevel: 0.05,
  entropy: 0.1,
  signalNoise: 0.1,
  corruption: 0,
  synchronization: 0.5,
};

interface WorldStateContextType {
  state: WorldState;
  mutateWorldState: (mutation: Partial<WorldState>) => void;
  resetWorldState: () => void;
  emitWorldEvent: (event: Omit<WorldEvent, 'timestamp'>) => void;
  lastEvent: WorldEvent | null;
}

const WorldStateContext = createContext<WorldStateContextType | undefined>(undefined);

const STORAGE_KEY = 'nexus_veil_world_state';

export function WorldStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorldState>(DEFAULT_STATE);
  const [lastEvent, setLastEvent] = useState<WorldEvent | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse world state', e);
      }
    }
  }, []);

  useEffect(() => {
    if (isClient) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isClient]);

  // Decay mechanism
  useEffect(() => {
    if (!isClient) return;

    const decayTimer = setInterval(() => {
      setState(prev => ({
        tension: prev.tension + (DEFAULT_STATE.tension - prev.tension) * 0.05,
        stability: prev.stability + (DEFAULT_STATE.stability - prev.stability) * 0.05,
        anomalyLevel: prev.anomalyLevel + (DEFAULT_STATE.anomalyLevel - prev.anomalyLevel) * 0.05,
        entropy: prev.entropy + (DEFAULT_STATE.entropy - prev.entropy) * 0.05,
        signalNoise: prev.signalNoise + (DEFAULT_STATE.signalNoise - prev.signalNoise) * 0.05,
        corruption: prev.corruption + (DEFAULT_STATE.corruption - prev.corruption) * 0.05,
        synchronization: prev.synchronization + (DEFAULT_STATE.synchronization - prev.synchronization) * 0.05,
      }));
    }, 5000); // Decay every 5 seconds

    return () => clearInterval(decayTimer);
  }, [isClient]);

  const mutateWorldState = useCallback((mutation: Partial<WorldState>) => {
    setState(prev => {
      const newState = { ...prev };
      (Object.keys(mutation) as Array<keyof WorldState>).forEach(key => {
        const val = mutation[key];
        if (typeof val === 'number') {
          newState[key] = Math.max(0, Math.min(1, val));
        }
      });
      return newState;
    });
  }, []);

  const resetWorldState = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const emitWorldEvent = useCallback((event: Omit<WorldEvent, 'timestamp'>) => {
    const fullEvent = { ...event, timestamp: Date.now() };
    setLastEvent(fullEvent);

    // Automatic state mutation based on event type
    switch (event.type) {
      case 'anomaly':
        mutateWorldState({ anomalyLevel: state.anomalyLevel + 0.2, entropy: state.entropy + 0.1 });
        break;
      case 'data_surge':
        mutateWorldState({ tension: state.tension + 0.15, signalNoise: state.signalNoise + 0.1 });
        break;
      case 'security_breach':
        mutateWorldState({ corruption: state.corruption + 0.2, stability: state.stability - 0.2 });
        break;
      case 'system_sync':
        mutateWorldState({ synchronization: state.synchronization + 0.2, stability: state.stability + 0.1 });
        break;
      case 'entropy_shift':
        mutateWorldState({ entropy: state.entropy + 0.2, tension: state.tension + 0.05 });
        break;
    }
  }, [mutateWorldState, state.anomalyLevel, state.entropy, state.tension, state.signalNoise, state.corruption, state.stability, state.synchronization]);

  return (
    <WorldStateContext.Provider value={{ state, mutateWorldState, resetWorldState, emitWorldEvent, lastEvent }}>
      {children}
    </WorldStateContext.Provider>
  );
}

export function useWorldState() {
  const context = useContext(WorldStateContext);
  if (context === undefined) {
    throw new Error('useWorldState must be used within a WorldStateProvider');
  }
  return context;
}
