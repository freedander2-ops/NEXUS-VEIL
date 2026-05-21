'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cloud, User, Database, Settings2 } from 'lucide-react';
import { useWorldState } from '@/lib/environment/WorldStateContext';
import { useEnvironment } from '@/lib/environment/state';
import { useContent } from '@/lib/content/ContentEngine';
import { cn } from '@/lib/utils';

export const StatusLayer = () => {
  const { state: worldState } = useWorldState();
  const { role } = useEnvironment();
  const { objects } = useContent();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const metrics = [
    { label: 'Tension', val: worldState.tension, color: 'text-cyber-blue' },
    { label: 'Entropy', val: worldState.entropy, color: 'text-amber-500' },
    { label: 'Anomaly', val: worldState.anomalyLevel, color: 'text-cyber-red' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 h-10 bg-cyber-black/90 border-t border-cyber-blue/20 backdrop-blur-md flex items-center px-6 gap-8 font-mono text-[9px] uppercase tracking-[0.2em] overflow-hidden">
      <div className="flex items-center gap-4 border-r border-cyber-blue/10 pr-6 h-full">
        <div className="flex items-center gap-2 text-cyber-cyan">
          <Activity size={12} className="animate-pulse" />
          <span className="font-bold">Ecosystem Status:</span>
          <span className={cn(
              "font-bold",
              worldState.stability > 0.7 ? "text-cyber-emerald" : "text-cyber-red"
          )}>
              {worldState.stability > 0.7 ? "Nominal" : "Unstable"}
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center gap-10 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6 border-r border-cyber-blue/5 pr-10">
            {metrics.map(m => (
                <div key={m.label} className="flex items-center gap-3">
                    <span className="opacity-30">{m.label}:</span>
                    <div className="w-16 h-1 bg-cyber-blue/5 rounded-full overflow-hidden">
                        <motion.div
                            animate={{ width: `${m.val * 100}%` }}
                            className={cn("h-full", m.color.replace('text-', 'bg-'))}
                        />
                    </div>
                </div>
            ))}
        </div>

        <div className="flex items-center gap-6 text-white/40">
            <div className="flex items-center gap-2">
                <Cloud size={10} className="text-cyber-blue" />
                <span>Weather Sync: <span className="text-cyber-cyan">Active</span></span>
            </div>
            <div className="flex items-center gap-2">
                <Database size={10} className="text-cyber-blue" />
                <span>Signals: <span className="text-white">{objects.length}</span></span>
            </div>
            <div className="flex items-center gap-2">
                <User size={10} className="text-cyber-blue" />
                <span>Operator: <span className="text-cyber-cyan">{role || 'Unauthenticated'}</span></span>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pl-6 border-l border-cyber-blue/10 h-full text-white/20">
          <Settings2 size={12} />
          <span>VEIL_OS_0.1.0</span>
      </div>

      {/* Tension Pulse Background */}
      <motion.div
        animate={{
            opacity: [0.05, 0.1, 0.05],
            x: ['-100%', '100%']
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-cyan/5 to-transparent pointer-events-none"
      />
    </footer>
  );
};
