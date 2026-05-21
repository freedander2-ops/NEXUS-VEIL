'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInteraction } from '@/lib/environment/InteractionReactor';
import { useWorldState } from '@/lib/environment/WorldStateContext';
import { cn } from '@/lib/utils';

interface AtmosphericPanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  intensity?: number;
}

export const AtmosphericPanel = ({ children, title, className, intensity = 1 }: AtmosphericPanelProps) => {
  const { cursor } = useInteraction();
  const { state } = useWorldState();

  // Combined effect of local intensity and world state tension/stability
  const effectiveIntensity = intensity * (0.5 + state.tension * 1.5);
  const stabilityFactor = 1.0 - (state.entropy * 0.5);

  // Reduced perspective shift for atmospheric restraint
  const rotateX = (cursor.y - 0.5) * -4 * effectiveIntensity * stabilityFactor;
  const rotateY = (cursor.x - 0.5) * 4 * effectiveIntensity * stabilityFactor;

  return (
    <motion.div
      style={{
        perspective: '2000px', // Increased perspective for more subtle shift
      }}
      className={cn("group", className)}
    >
      <motion.div
        animate={{
          rotateX,
          rotateY,
        }}
        // Smooth transition for reduced jitter
        transition={{ type: 'spring', stiffness: 40 * stabilityFactor, damping: 20 }}
        className={cn(
          "relative border transition-colors duration-1000 overflow-hidden h-full",
          state.tension > 0.6 ? "border-red-500/20 bg-red-950/10" : "border-white/10 bg-black/40",
          "backdrop-blur-xl shadow-2xl"
        )}
      >
        {/* Layered Depth: Shadow and Highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

        {title && (
          <div className="px-4 py-2 border-b border-white/5 flex items-center justify-between bg-white/5">
            <span className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-50">{title}</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-white/20" />
              <div className="w-1 h-1 bg-white/10" />
            </div>
          </div>
        )}

        <div className="p-6 relative z-10">
          {children}
        </div>

        {/* Static Subtle Shadow - Removing dynamic box-shadow for better performance and restraint */}
        <div className="absolute inset-0 pointer-events-none opacity-20 shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]" />
      </motion.div>
    </motion.div>
  );
};
