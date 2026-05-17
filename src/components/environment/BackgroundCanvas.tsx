'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useEnvironment } from '@/lib/environment/state';
import { getMoodParameters } from '@/lib/environment/moodLogic';

function StarField() {
  const ref = useRef<THREE.Points>(null!);
  const { mood, weather, intensity } = useEnvironment();
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
      ref.current.rotation.x += delta * params.rotationSpeed * 0.1;
      ref.current.rotation.y += delta * params.rotationSpeed * 0.15;

      // Add subtle glitch jump
      if (Math.random() < params.glitchFrequency * 0.01) {
        ref.current.position.x = (Math.random() - 0.5) * 0.1;
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
          color={params.accentColor}
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 -z-10 bg-cyber-black">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <StarField />
      </Canvas>
      <div className="noise" />
      <div className="scanline" />
    </div>
  );
}
