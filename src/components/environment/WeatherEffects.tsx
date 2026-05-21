'use client';

import React, { useEffect, useState } from 'react';
import { useEnvironment } from '@/lib/environment/state';
import { cn } from '@/lib/utils';

export const WeatherEffects = () => {
  const { weather } = useEnvironment();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <>
      <div className={cn(
        "weather-overlay",
        weather === 'storm' && "storm-active",
        weather === 'fog' && "fog-active",
        weather === 'rain' && "rain-active"
      )} />

      {/* Global Grain/Noise layer */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-noise mix-blend-overlay" />
    </>
  );
};
