import { Mood, Weather } from './state';

export interface MoodParameters {
  baseColor: string;
  accentColor: string;
  glitchFrequency: number;
  particleDensity: number;
  bloomIntensity: number;
  rotationSpeed: number;
}

export function getMoodParameters(mood: Mood, weather: Weather, intensity: number): MoodParameters {
  const params: MoodParameters = {
    baseColor: '#050505',
    accentColor: '#3b82f6',
    glitchFrequency: 0.05,
    particleDensity: 50,
    bloomIntensity: 0.5,
    rotationSpeed: 0.2,
  };

  // Adjust by Mood
  switch (mood) {
    case 'calm':
      params.accentColor = '#3b82f6'; // Blue
      params.glitchFrequency = 0.02;
      break;
    case 'tense':
      params.accentColor = '#06b6d4'; // Cyan
      params.glitchFrequency = 0.1;
      params.rotationSpeed = 0.5;
      break;
    case 'alert':
      params.accentColor = '#10b981'; // Emerald
      params.glitchFrequency = 0.2;
      params.particleDensity = 100;
      break;
    case 'critical':
      params.accentColor = '#ef4444'; // Red
      params.glitchFrequency = 0.4;
      params.bloomIntensity = 1.2;
      params.rotationSpeed = 1.5;
      break;
  }

  // Adjust by Weather
  if (weather === 'rain') {
    params.particleDensity += 100;
    params.bloomIntensity *= 0.8;
  } else if (weather === 'storm') {
    params.glitchFrequency += 0.2;
    params.particleDensity += 200;
    params.bloomIntensity *= 1.5;
  } else if (weather === 'fog') {
    params.bloomIntensity *= 2.0;
    params.particleDensity *= 0.5;
  }

  // Scale by Intensity
  params.glitchFrequency *= intensity * 2;
  params.particleDensity *= intensity * 2;

  return params;
}
