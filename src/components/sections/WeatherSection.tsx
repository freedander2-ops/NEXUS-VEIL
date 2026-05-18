'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function WeatherSection({ title, description }: { title: string, description: string }) {
  return (
    <div className="space-y-8 p-12">
      <header className="max-w-2xl">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-light tracking-[0.4em] text-cyber-blue mb-4 uppercase"
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xs text-cyber-blue/40 leading-relaxed uppercase tracking-[0.2em]"
        >
          {description}
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-12">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative h-96 bg-cyber-blue/5 border border-cyber-blue/10 backdrop-blur-md overflow-hidden p-8 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
               <span className="text-[10px] font-mono text-cyber-blue/30 tracking-[0.3em]">ATMOSPHERE // 0{i}</span>
               <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue/20 animate-pulse" />
            </div>

            <div className="space-y-6">
               <div className="h-0.5 w-1/4 bg-cyber-blue/20" />
               <div className="space-y-2">
                 <div className="h-1.5 w-full bg-cyber-blue/10" />
                 <div className="h-1.5 w-5/6 bg-cyber-blue/5" />
                 <div className="h-1.5 w-4/6 bg-cyber-blue/5" />
               </div>
            </div>

            <div className="flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <div className="text-[9px] uppercase tracking-widest text-cyber-blue/40 font-bold">Synchronizing...</div>
               <div className="text-[9px] uppercase tracking-widest text-cyber-cyan font-bold">Details</div>
            </div>

            {/* Subtle glow */}
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyber-blue/5 blur-3xl rounded-full pointer-events-none group-hover:bg-cyber-blue/10 transition-colors" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
