'use client';

import React, { createContext, useContext, useState } from 'react';

export interface EnvironmentDimension {
  id: string;
  name: string;
  atmosphere: {
    color: string;
    fog: number;
    density: number;
    grain: number;
  };
  visuals: {
    gridStability: number;
    shaderComplexity: number;
    geometryType: 'lattice' | 'nodes' | 'broken' | 'fluid';
  };
  motion: {
    speed: number;
    jitter: number;
  };
}

export const defaultDimensions: Record<string, EnvironmentDimension> = {
  weather: {
    id: 'weather',
    name: 'Digital Weather',
    atmosphere: { color: '#0f172a', fog: 0.1, density: 0.2, grain: 0.05 },
    visuals: { gridStability: 1.0, shaderComplexity: 0.5, geometryType: 'lattice' },
    motion: { speed: 1.0, jitter: 0 }
  },
  cyber: {
    id: 'cyber',
    name: 'Cybersecurity',
    atmosphere: { color: '#000000', fog: 0.4, density: 0.8, grain: 0.3 },
    visuals: { gridStability: 0.2, shaderComplexity: 1.0, geometryType: 'broken' },
    motion: { speed: 2.0, jitter: 0.8 }
  },
  osint: {
    id: 'osint',
    name: 'OSINT Layer',
    atmosphere: { color: '#010409', fog: 0.2, density: 0.4, grain: 0.1 },
    visuals: { gridStability: 0.8, shaderComplexity: 0.7, geometryType: 'nodes' },
    motion: { speed: 0.5, jitter: 0.1 }
  },
  github: {
    id: 'github',
    name: 'GitHub Signals',
    atmosphere: { color: '#0a0a0c', fog: 0.1, density: 0.2, grain: 0.02 },
    visuals: { gridStability: 1.0, shaderComplexity: 0.8, geometryType: 'lattice' },
    motion: { speed: 1.2, jitter: 0 }
  }
};

interface CreatorContextType {
  activeDimension: EnvironmentDimension;
  updateDimension: (params: Partial<EnvironmentDimension>) => void;
  setDimension: (id: string) => void;
}

const CreatorContext = createContext<CreatorContextType | undefined>(undefined);

export function CreatorProvider({ children }: { children: React.ReactNode }) {
  const [activeDimension, setActiveDimensionState] = useState<EnvironmentDimension>(defaultDimensions.weather);

  const setDimension = (id: string) => {
    if (defaultDimensions[id]) {
      setActiveDimensionState(defaultDimensions[id]);
    }
  };

  const updateDimension = (params: Partial<EnvironmentDimension>) => {
    setActiveDimensionState(prev => ({ ...prev, ...params }));
  };

  return (
    <CreatorContext.Provider value={{ activeDimension, updateDimension, setDimension }}>
      {children}
    </CreatorContext.Provider>
  );
}

export function useCreator() {
  const context = useContext(CreatorContext);
  if (context === undefined) {
    throw new Error('useCreator must be used within a CreatorProvider');
  }
  return context;
}
