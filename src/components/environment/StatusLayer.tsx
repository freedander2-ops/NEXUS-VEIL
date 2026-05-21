'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cloud, User, Database, Settings2 } from 'lucide-react';
import { useWorldState } from '@/lib/environment/WorldStateContext';
import { useEnvironment } from '@/lib/environment/state';
import { useContent } from '@/lib/content/ContentEngine';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/common/Tooltip';
import { useAudio } from '@/lib/audio/AudioEngine';

export const StatusLayer = () => {
  const { state: worldState } = useWorldState();
  const { role, mood, intensity } = useEnvironment();
  const { objects } = useContent();
  const { playFeedback } = useAudio();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const metrics = [
    { label: 'Tension', val: worldState.tension, color: 'text-cyber-blue', desc: 'Atmospheric pressure. Rec: 0.1 - 0.7' },
    { label: 'Entropy', val: worldState.entropy, color: 'text-amber-500', desc: 'Systemic randomness and jitter level.' },
    { label: 'Anomaly', val: worldState.anomalyLevel, color: 'text-cyber-red', desc: 'Frequency of glitch events.' },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 h-12 bg-cyber-black/95 border-t border-cyber-blue/20 backdrop-blur-md flex items-center px-8 gap-10 font-mono text-[9px] uppercase tracking-[0.2em] overflow-hidden group">
      <div className="flex items-center gap-5 border-r border-cyber-blue/10 pr-10 h-full">
        <div className="flex items-center gap-3 text-cyber-cyan">
          <Activity size={14} className="animate-pulse" />
          <span className="font-bold whitespace-nowrap">Ecosystem Status:</span>
          <span className={cn(
              "font-bold px-2 py-0.5 bg-opacity-10 rounded-sm",
              worldState.stability > 0.7 ? "text-cyber-emerald bg-cyber-emerald" : "text-cyber-red bg-cyber-red"
          )}>
              {worldState.stability > 0.7 ? "Nominal" : "Unstable"}
          </span>
          <Tooltip content={`Mood: ${mood} // Pulse: ${(intensity * 100).toFixed(0)}%`} />
        </div>
      </div>

      <div className="flex-1 flex items-center gap-12 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-8 border-r border-cyber-blue/5 pr-12 shrink-0">
            {metrics.map(m => (
                <div key={m.label} className="flex items-center gap-4 group/metric cursor-help" onMouseEnter={() => playFeedback('hover')}>
                    <span className="opacity-30 group-hover/metric:opacity-60 transition-opacity">{m.label}:</span>
                    <div className="w-20 h-1 bg-cyber-blue/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            animate={{ width: `${m.val * 100}%` }}
                            className={cn("h-full shadow-[0_0_10px_currentColor]", m.color.replace('text-', 'bg-'))}
                        />
                    </div>
                    <Tooltip content={m.desc} />
                </div>
            ))}
        </div>

        <div className="flex items-center gap-8 text-white/40 shrink-0">
            <div className="flex items-center gap-2 group/info" onMouseEnter={() => playFeedback('hover')}>
                <Cloud size={10} className="text-cyber-blue group-hover/info:text-cyber-cyan transition-colors" />
                <span>Weather Sync: <span className="text-cyber-cyan font-bold">Active</span></span>
            </div>
            <div className="flex items-center gap-2 group/info" onMouseEnter={() => playFeedback('hover')}>
                <Database size={10} className="text-cyber-blue group-hover/info:text-cyber-cyan transition-colors" />
                <span>Signals: <span className="text-white font-bold">{objects.length}</span></span>
            </div>
            <div className="flex items-center gap-2 group/info" onMouseEnter={() => playFeedback('hover')}>
                <User size={10} className="text-cyber-blue group-hover/info:text-cyber-cyan transition-colors" />
                <span>Role: <span className="text-cyber-cyan font-bold font-mono tracking-tighter">{role || 'GUEST'}</span></span>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-5 pl-10 border-l border-cyber-blue/10 h-full text-white/10 shrink-0 font-bold">
          <Settings2 size={14} className="group-hover:text-cyber-cyan transition-colors" />
          <span className="tracking-[0.3em]">VEIL_CORE_v0.1.0</span>
      </div>

      {/* Atmospheric Scanning Beam */}
      <motion.div
        animate={{
            opacity: [0.03, 0.08, 0.03],
            x: ['-100%', '100%']
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyber-cyan/15 to-transparent pointer-events-none"
      />
    </footer>
  );
};
