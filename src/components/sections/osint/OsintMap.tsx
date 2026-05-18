"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Line } from "@react-three/drei";
import * as THREE from "three";
import { useEnvironment } from "@/lib/environment/state";

const OsintNodes = () => {
  const { intensity } = useEnvironment();
  const ref = useRef<THREE.Points>(null);

  // Generate some nodes in a circular/geospatial pattern
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

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.001 * intensity;
    }
  });

  return (
    <group>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#1e40af"
          size={0.12}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.6}
        />
      </Points>
      {/* Add some "orbital" rings to suggest geospatial planes */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[15, 15.05, 64]} />
        <meshBasicMaterial color="#1e3a8a" transparent opacity={0.15} side={THREE.DoubleSide} />
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
