'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const TacticalLayer = ({ children, className, title }: { children: React.ReactNode, className?: string, title?: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
    className={className}
    style={{ perspective: '1000px' }}
  >
    <div className="relative border border-cyber-red/30 bg-cyber-red/5 backdrop-blur-md overflow-hidden">
      {/* Moving scanline */}
      <motion.div
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="absolute left-0 w-full h-[2px] bg-cyber-red/20 z-0"
      />

      {title && (
        <div className="bg-cyber-red/10 border-b border-cyber-red/30 px-3 py-1 flex justify-between items-center">
          <span className="text-[10px] font-bold tracking-[0.2em] text-cyber-red uppercase">{title}</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-cyber-red" />
            <div className="w-1 h-1 bg-cyber-red/40" />
          </div>
        </div>
      )}

      <div className="relative z-10 p-4">
        {children}
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-cyber-red" />
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-cyber-red" />
    </div>
  </motion.div>
);

export const UnstableGrid = () => (
  <div className="absolute inset-0 pointer-events-none opacity-20">
    <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
      {Array.from({ length: 144 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.1, Math.random() * 0.3, 0.1],
            borderColor: Math.random() > 0.95 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.1)'
          }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
          className="border-[0.5px] border-cyber-red/10"
        />
      ))}
    </div>
  </div>
);
