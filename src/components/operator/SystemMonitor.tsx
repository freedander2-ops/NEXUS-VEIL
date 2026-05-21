'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, ShieldAlert, BarChart3 } from 'lucide-react';
import { useWorldState } from '@/lib/environment/WorldStateContext';
import { useContent } from '@/lib/content/ContentEngine';
import { Tooltip } from '@/components/common/Tooltip';

export const SystemMonitor = () => {
  const { state, lastEvent } = useWorldState();
  const { objects, relationships, scenes } = useContent();

  const metrics = [
    {
        label: 'Tension',
        value: state.tension,
        icon: Activity,
        color: 'text-cyber-blue',
        desc: 'Global atmospheric pressure. High tension increases UI stiffness and reduces damping.'
    },
    {
        label: 'Entropy',
        value: state.entropy,
        icon: Zap,
        color: 'text-amber-500',
        desc: 'Systemic disorder. High entropy causes jitter, motion randomness, and visual noise.'
    },
    {
        label: 'Anomaly',
        value: state.anomalyLevel,
        icon: ShieldAlert,
        color: 'text-cyber-red',
        desc: 'Frequency of glitch events. Extreme anomaly levels trigger global environment flashes.'
    },
    {
        label: 'Stability',
        value: state.stability,
        icon: BarChart3,
        color: 'text-cyber-emerald',
        desc: 'Structural integrity of the ecosystem. Decreases during security breaches or corruption.'
    },
  ];

  return (
    <div className="space-y-6 font-mono text-[10px] uppercase">
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="p-3 bg-cyber-black/60 border border-cyber-blue/10 group">
            <div className="flex justify-between items-center mb-2">
              <span className="opacity-40 flex items-center gap-2 group-hover:opacity-100 transition-opacity">
                <m.icon size={10} /> {m.label}
              </span>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${m.color}`}>{(m.value * 100).toFixed(1)}%</span>
                <Tooltip content={m.desc} />
              </div>
            </div>
            <div className="h-1 bg-cyber-blue/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${m.value * 100}%` }}
                className={`h-full ${m.color.replace('text-', 'bg-')}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-cyber-black/60 border border-cyber-blue/10">
        <div className="opacity-40 mb-3 border-b border-cyber-blue/10 pb-1 text-[8px] flex justify-between items-center">
            <span>Ecosystem Statistics</span>
            <Tooltip content="Live count of registered entities, neural links, and clusters in the current session." />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col">
              <span className="text-white font-bold">{objects.length}</span>
              <span className="opacity-20 text-[7px]">Nodes</span>
          </div>
          <div className="flex flex-col">
              <span className="text-white font-bold">{relationships.length}</span>
              <span className="opacity-20 text-[7px]">Links</span>
          </div>
          <div className="flex flex-col">
              <span className="text-white font-bold">{scenes.length}</span>
              <span className="opacity-20 text-[7px]">Scenes</span>
          </div>
        </div>
      </div>

      {lastEvent && (
        <div className="p-3 bg-cyber-red/5 border border-cyber-red/20 relative overflow-hidden group">
          <div className="text-cyber-red mb-1 font-bold flex justify-between items-center relative z-10">
              <span>Last System Event</span>
              <Tooltip content="The most recent atmospheric mutation event detected by the ecosystem monitors." />
          </div>
          <div className="flex justify-between relative z-10">
            <span className="text-white/80 tracking-tighter">{lastEvent.type}</span>
            <span className="opacity-40">{new Date(lastEvent.timestamp).toLocaleTimeString()}</span>
          </div>
          {!!lastEvent.payload?.origin && (
            <div className="opacity-40 text-[8px] mt-1 relative z-10 italic">Source: {String(lastEvent.payload.origin)}</div>
          )}
          <div className="absolute top-0 right-0 w-8 h-8 bg-cyber-red/5 rotate-45 -mr-4 -mt-4" />
        </div>
      )}

      <div className="opacity-20 text-[8px] text-center italic tracking-[0.3em] font-bold">
        Atmospheric Diagnostic Stream // Active
      </div>
    </div>
  );
};
