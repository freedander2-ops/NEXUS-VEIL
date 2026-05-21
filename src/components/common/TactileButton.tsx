'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAudio } from '@/lib/audio/AudioEngine';
import { cn } from '@/lib/utils';

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'danger' | 'ghost';
}

export const TactileButton = ({ children, variant = 'primary', className, onClick, ...props }: TactileButtonProps) => {
  const { playFeedback } = useAudio();

  const handleMouseEnter = () => playFeedback('hover');
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playFeedback('click');
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ y: 2, scale: 0.98 }}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={cn(
        "relative group px-6 py-3 font-bold tracking-[0.2em] uppercase text-[10px] transition-all duration-300 overflow-hidden",
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
