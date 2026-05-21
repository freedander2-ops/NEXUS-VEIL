'use client';

import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useWorldState } from '@/lib/environment/WorldStateContext';

export const BackgroundCanvas = ({ children }: { children: React.ReactNode }) => {
  const { state } = useWorldState();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="fixed inset-0 bg-cyber-black" />;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={['#000', 5, 15 + (state.stability * 10)]} />
        <ambientLight intensity={0.2 + (state.tension * 0.3)} />
        <pointLight position={[10, 10, 10]} intensity={state.anomalyLevel * 2} color="#06b6d4" />
        {children}
      </Canvas>
    </div>
  );
};
