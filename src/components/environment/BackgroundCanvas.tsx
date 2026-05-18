'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useEnvironment } from '@/lib/environment/state';
import { useCreator } from '@/lib/environment/creatorState';
import { useInteraction } from '@/lib/environment/InteractionReactor';
import { useWorldState } from '@/lib/environment/WorldStateContext';
import { getMoodParameters } from '@/lib/environment/moodLogic';

function StarField() {
  const ref = useRef<THREE.Points>(null!);
  const { mood, weather, intensity } = useEnvironment();
  const { state: worldState } = useWorldState();
  const { activeDimension } = useCreator();
  const { cursor, disturbance } = useInteraction();
  const params = useMemo(() => getMoodParameters(mood, weather, intensity), [mood, weather, intensity]);

  const sphere = useMemo(() => {
    const positions = new Float32Array(params.particleDensity * 3);
    for (let i = 0; i < params.particleDensity; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [params.particleDensity]);

  useFrame((state, delta) => {
    if (ref.current) {
      const speedMult = (1 + disturbance * 5) * (0.5 + worldState.tension);
      ref.current.rotation.x += delta * params.rotationSpeed * 0.1 * speedMult;
      ref.current.rotation.y += delta * params.rotationSpeed * 0.15 * speedMult;

      // React to cursor position
      ref.current.position.x = (cursor.x - 0.5) * 0.2;
      ref.current.position.y = (0.5 - cursor.y) * 0.2;

      // Add subtle glitch jump influenced by world entropy and anomaly level
      const glitchChance = (params.glitchFrequency * 0.01 * (1 + disturbance)) + (worldState.anomalyLevel * 0.05);
      if (Math.random() < glitchChance) {
        ref.current.position.x = (Math.random() - 0.5) * (0.1 + worldState.entropy * 0.5);
      } else {
        ref.current.position.x *= 0.9;
      }
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={activeDimension.id === 'cyber' ? '#ef4444' : params.accentColor}
          size={0.02 * activeDimension.motion.speed}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={activeDimension.atmosphere.density}
        />
      </Points>
    </group>
  );
}

export default function BackgroundCanvas() {
  const { activeDimension } = useCreator();

  return (
    <div className="fixed inset-0 -z-10 bg-cyber-black transition-colors duration-1000" style={{ backgroundColor: activeDimension.atmosphere.color }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <StarField />
      </Canvas>
      <div className="noise" style={{ opacity: activeDimension.atmosphere.grain }} />
      <div className="scanline" />

      {/* Dimensional Fog */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent, ${activeDimension.atmosphere.color})`,
          opacity: activeDimension.atmosphere.fog
        }}
      />
    </div>
  );
}
