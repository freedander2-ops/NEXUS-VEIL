'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/lib/audio/AudioEngine';
import { useWorldState } from '@/lib/environment/WorldStateContext';
import { useInteraction } from '@/lib/environment/InteractionReactor';
import { cn } from '@/lib/utils';

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'danger' | 'ghost';
}

export const TactileButton = ({ children, variant = 'primary', className, onClick, ...props }: TactileButtonProps) => {
  const { playFeedback } = useAudio();
  const { state } = useWorldState();
  const { disturbance } = useInteraction();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleMouseEnter = () => playFeedback('hover');
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playFeedback('click');
    if (onClick) onClick(e);
  };

  if (!isClient) {
      return (
          <button
            className={cn(
                "px-6 py-3 font-bold tracking-[0.2em] uppercase text-[10px]",
                className
            )}
            {...props}
          >
              {children}
          </button>
      );
  }

  const springConfig = {
    type: 'spring',
    stiffness: (300 - state.tension * 100) * (1 - disturbance * 0.2),
    damping: 20 + disturbance * 10,
    mass: 1 + state.tension * 0.5
  };

  return (
    <motion.button
      style={{ transformStyle: 'preserve-3d' }}
      whileHover={{
        y: -4,
        scale: 1.02,
        z: 10,
      }}
      whileTap={{
        y: 1,
        scale: 0.98,
        z: -5
      }}
      transition={springConfig}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={cn(
        "relative group px-6 py-3 font-bold tracking-[0.2em] uppercase text-[10px] overflow-hidden",
        variant === 'primary' && "bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue hover:border-cyber-cyan hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]",
        variant === 'danger' && "bg-cyber-red/10 border border-cyber-red/30 text-cyber-red hover:border-cyber-red hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]",
        variant === 'ghost' && "bg-transparent border border-transparent text-cyber-blue/60 hover:text-cyber-blue",
        className
      )}
      {...Object.fromEntries(Object.entries(props).filter(([key]) => !key.startsWith('on')))}
    >
      <span className="relative z-10">{children}</span>

      {/* Cinematic reflection layer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
      />

      {/* Cursor-reactive glow diffusion */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 70%)`
        }}
      />
    </motion.button>
  );
};
