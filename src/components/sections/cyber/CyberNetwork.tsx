'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

export function CyberNetwork() {
  const pointsRef = useRef<THREE.Points>(null!);
  const count = 200;

  const [positions, connections] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const conn: [number, number, number][][] = [];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 5;
      const y = (Math.random() - 0.5) * 5;
      const z = (Math.random() - 0.5) * 5;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Create some connections for a subset
      if (i < 20) {
        const localConn: [number, number, number][] = [[x, y, z]];
        for (let j = 0; j < 3; j++) {
          localConn.push([
            x + (Math.random() - 0.5) * 1,
            y + (Math.random() - 0.5) * 1,
            z + (Math.random() - 0.5) * 1
          ]);
        }
        conn.push(localConn);
      }
    }
    return [pos, conn];
  }, []);

  useFrame((state, delta) => {
    pointsRef.current.rotation.y += delta * 0.1;
    pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    // Add subtle scale jitter on render
    const jitter = 1 + Math.sin(state.clock.elapsedTime * 20) * 0.005;
    pointsRef.current.scale.set(jitter, jitter, jitter);
  });

  return (
    <group>
      <Points ref={pointsRef} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#ef4444"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      {connections.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#ef4444"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
    </group>
  );
}
