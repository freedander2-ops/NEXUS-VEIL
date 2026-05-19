'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Weather = 'clear' | 'rain' | 'storm' | 'fog';
export type Mood = 'calm' | 'tense' | 'alert' | 'critical';

interface EnvironmentState {
  time: Date;
  weather: Weather;
  mood: Mood;
  intensity: number; // 0 to 1
  isAuthenticated: boolean | null;
}

interface EnvironmentContextType extends EnvironmentState {
  setWeather: (weather: Weather) => void;
  setMood: (mood: Mood) => void;
  setIntensity: (intensity: number) => void;
  login: () => void;
  logout: () => void;
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(undefined);

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [time, setTime] = useState<Date | null>(null);
  const [weather, setWeather] = useState<Weather>('clear');
  const [mood, setMood] = useState<Mood>('calm');
  const [intensity, setIntensity] = useState(0.2);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('nexus_veil_auth');
    setIsAuthenticated(storedAuth === 'true');

    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000 * 60); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('nexus_veil_auth', 'true');
  };
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('nexus_veil_auth');
    document.cookie = "nexus_veil_auth_proxy=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setMood('calm');
    setIntensity(0.2);
  };

  return (
    <EnvironmentContext.Provider
      value={{
        time: time || new Date(0), // Fallback for initial SSR
        weather,
        mood,
        intensity,
        isAuthenticated,
        setWeather,
        setMood,
        setIntensity,
        login,
        logout,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext);
  if (context === undefined) {
    throw new Error('useEnvironment must be used within an EnvironmentProvider');
  }
  return context;
}
