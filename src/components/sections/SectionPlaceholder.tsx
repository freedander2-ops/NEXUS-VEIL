'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function SectionPlaceholder({ title, description }: { title: string, description: string }) {
  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold tracking-[0.2em] text-cyber-blue mb-2"
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xs text-cyber-blue/60 leading-relaxed uppercase tracking-widest"
        >
          {description}
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative h-64 bg-cyber-dark/40 border border-cyber-blue/10 p-6 overflow-hidden"
          >
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyber-blue/20" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyber-blue/20" />

            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-mono text-cyber-cyan/50 tracking-tighter">NODE_{i.toString().padStart(3, '0')}</span>
                <div className="w-2 h-2 rounded-full bg-cyber-blue/20 animate-pulse" />
              </div>

              <div className="flex-1 space-y-4">
                <div className="h-2 w-2/3 bg-cyber-blue/10" />
                <div className="h-2 w-full bg-cyber-blue/5" />
                <div className="h-2 w-1/2 bg-cyber-blue/5" />

                <div className="pt-4 flex gap-2">
                  {[1, 2, 3, 4].map(j => (
                    <div key={j} className="h-8 flex-1 bg-cyber-blue/5 border border-cyber-blue/10" />
                  ))}
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-[8px] uppercase font-bold text-cyber-blue/40">Data Stream Active</div>
                <button className="text-[8px] uppercase font-bold text-cyber-cyan hover:underline underline-offset-4">Inspect</button>
              </div>
            </div>

            {/* Glitch overlay on hover */}
            <div className="absolute inset-0 bg-cyber-cyan/5 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
