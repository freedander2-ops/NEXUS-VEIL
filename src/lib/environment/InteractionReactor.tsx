'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface InteractionState {
  cursor: { x: number; y: number };
  velocity: { x: number; y: number };
  disturbance: number; // 0 to 1 based on velocity and activity
}

const InteractionContext = createContext<InteractionState | undefined>(undefined);

export function InteractionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<InteractionState>({
    cursor: { x: 0.5, y: 0.5 },
    velocity: { x: 0, y: 0 },
    disturbance: 0,
  });

  const lastPos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(Date.now());
  const disturbanceLevel = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const now = Date.now();
      const dt = now - lastTime.current;

      if (dt > 0) {
        const vx = (x - lastPos.current.x) / dt;
        const vy = (y - lastPos.current.y) / dt;
        const speed = Math.sqrt(vx * vx + vy * vy) * 1000; // Normalize speed

        // Increase disturbance based on speed, decay over time
        disturbanceLevel.current = Math.min(1, disturbanceLevel.current + speed * 0.05);

        setState({
          cursor: { x, y },
          velocity: { x: vx, y: vy },
          disturbance: disturbanceLevel.current,
        });

        lastPos.current = { x, y };
        lastTime.current = now;
      }
    };

    const decayInterval = setInterval(() => {
      disturbanceLevel.current *= 0.95; // Smooth decay
      setState(prev => ({ ...prev, disturbance: disturbanceLevel.current }));
    }, 50);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(decayInterval);
    };
  }, []);

  return (
    <InteractionContext.Provider value={state}>
      {children}
    </InteractionContext.Provider>
  );
}

export function useInteraction() {
  const context = useContext(InteractionContext);
  if (context === undefined) {
    throw new Error('useInteraction must be used within an InteractionProvider');
  }
  return context;
}
