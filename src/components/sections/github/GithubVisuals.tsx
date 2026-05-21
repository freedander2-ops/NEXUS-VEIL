"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useEnvironment } from "@/lib/environment/state";
import { useWorldState } from "@/lib/environment/WorldStateContext";

const StructuredGraph = () => {
  const { intensity } = useEnvironment();
  const { state } = useWorldState();
  const pointsRef = useRef<THREE.Points>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  // Create a structured lattice of points
  const [positions] = useMemo(() => {
    const side = 10;
    const count = side * side * side;
    const pos = new Float32Array(count * 3);
    let i = 0;
    for (let x = 0; x < side; x++) {
      for (let y = 0; y < side; y++) {
        for (let z = 0; z < side; z++) {
          pos[i * 3] = (x - side / 2) * 2;
          pos[i * 3 + 1] = (y - side / 2) * 2;
          pos[i * 3 + 2] = (z - side / 2) * 2;
          i++;
        }
      }
    }
    return [pos];
  }, []);

  useFrame((stateObj, delta) => {
    if (groupRef.current) {
      // Rotation speed influenced by synchronization and stability
      const rotationMultiplier = (0.5 + state.synchronization) * state.stability;
      groupRef.current.rotation.y += delta * 0.05 * rotationMultiplier;
      groupRef.current.rotation.z += delta * 0.02 * rotationMultiplier;

      // Add jitter if entropy is high
      if (state.entropy > 0.3) {
        groupRef.current.position.x = (Math.random() - 0.5) * state.entropy * 0.05;
        groupRef.current.position.y = (Math.random() - 0.5) * state.entropy * 0.05;
      }
    }

    // Subtle pulsing based on intensity and tension
    const time = stateObj.clock.getElapsedTime();
    if (pointsRef.current) {
      const pulseFactor = 1 + Math.sin(time * (0.5 + state.tension)) * 0.02 * intensity;
      pointsRef.current.scale.setScalar(pulseFactor);
    }
  });

  const pointColor = state.synchronization > 0.7 ? "#93c5fd" : "#ffffff";

  return (
    <group ref={groupRef}>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={pointColor}
          size={0.04 * (1 - state.signalNoise * 0.3)}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.3}
        />
      </Points>

      {/* Structural Lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
          <boxGeometry args={[20, 0.01, 0.01]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
        </mesh>
      ))}

      {/* Orbiting intelligent geometry */}
      <mesh position={[12, 0, 0]}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} wireframe />
      </mesh>
    </group>
  );
};

export const GithubVisuals = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [20, 10, 20], fov: 45 }}>
        <color attach="background" args={["#0a0a0c"]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffffff" />
        <StructuredGraph />
      </Canvas>
      {/* Vignette & Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(10,10,12,0.8)_100%)] pointer-events-none" />
    </div>
  );
};
