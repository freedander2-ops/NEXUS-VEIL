"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useEnvironment } from "@/lib/environment/state";
import { useWorldState } from "@/lib/environment/WorldStateContext";

const OsintNodes = () => {
  const { intensity } = useEnvironment();
  const { state } = useWorldState();
  const ref = useRef<THREE.Points>(null);

  // Memoize node positions to avoid regeneration on every render
  const { positions } = React.useMemo(() => {
    const count = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 10 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.2; // Flattened
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return { positions };
  }, []);

  useFrame((stateObj) => {
    if (ref.current) {
      const time = stateObj.clock.getElapsedTime();
      // Drift speed influenced by global entropy and local intensity
      const driftSpeed = 0.001 * intensity * (1 + state.entropy);
      ref.current.rotation.y += driftSpeed;

      // Add chaotic wobble if signal noise is high
      if (state.signalNoise > 0.4) {
        ref.current.position.x = Math.sin(time * 2) * state.signalNoise * 0.1;
        ref.current.position.z = Math.cos(time * 2) * state.signalNoise * 0.1;
      }
    }
  });

  const nodeColor = state.corruption > 0.5 ? "#4c1d95" : "#1e40af";

  return (
    <group>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={nodeColor}
          size={0.12 * (1 + state.anomalyLevel)}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.6}
        />
      </Points>
      {/* Add some "orbital" rings to suggest geospatial planes */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[15, 15.05 + state.signalNoise * 0.2, 64]} />
        <meshBasicMaterial
          color={state.tension > 0.7 ? "#991b1b" : "#1e3a8a"}
          transparent
          opacity={0.15 * (1 - state.entropy * 0.5)}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0.1, 0]}>
        <ringGeometry args={[25, 25.05, 64]} />
        <meshBasicMaterial color="#1e3a8a" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>

      {/* Add subtle spherical shell to give volume to the "globe" */}
      <mesh>
        <sphereGeometry args={[14.8, 32, 32]} />
        <meshBasicMaterial color="#1e3a8a" transparent opacity={0.03} wireframe />
      </mesh>
    </group>
  );
};

export const OsintMap = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 20, 40], fov: 45 }}>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.5} />
        <OsintNodes />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50 pointer-events-none" />
    </div>
  );
};
