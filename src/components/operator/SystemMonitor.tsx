'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, ShieldAlert, BarChart3 } from 'lucide-react';
import { useWorldState } from '@/lib/environment/WorldStateContext';
import { useContent } from '@/lib/content/ContentEngine';

export const SystemMonitor = () => {
  const { state, lastEvent } = useWorldState();
  const { objects, relationships, scenes } = useContent();

  const metrics = [
    { label: 'Tension', value: state.tension, icon: Activity, color: 'text-cyber-blue' },
    { label: 'Entropy', value: state.entropy, icon: Zap, color: 'text-amber-500' },
    { label: 'Anomaly', value: state.anomalyLevel, icon: ShieldAlert, color: 'text-cyber-red' },
    { label: 'Stability', value: state.stability, icon: BarChart3, color: 'text-cyber-emerald' },
  ];

  return (
    <div className="space-y-6 font-mono text-[10px] uppercase">
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="p-3 bg-cyber-black/60 border border-cyber-blue/10">
            <div className="flex justify-between items-center mb-2">
              <span className="opacity-40 flex items-center gap-2">
                <m.icon size={10} /> {m.label}
              </span>
              <span className={m.color}>{(m.value * 100).toFixed(1)}%</span>
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
        <div className="opacity-40 mb-3 border-b border-cyber-blue/10 pb-1 text-[8px]">Ecosystem Statistics</div>
        <div className="grid grid-cols-3 gap-2">
          <div>Nodes: {objects.length}</div>
          <div>Links: {relationships.length}</div>
          <div>Scenes: {scenes.length}</div>
        </div>
      </div>

      {lastEvent && (
        <div className="p-3 bg-cyber-red/5 border border-cyber-red/20">
          <div className="text-cyber-red mb-1 font-bold">Last System Event</div>
          <div className="flex justify-between">
            <span>{lastEvent.type}</span>
            <span className="opacity-40">{new Date(lastEvent.timestamp).toLocaleTimeString()}</span>
          </div>
          {!!lastEvent.payload?.origin && (
            <div className="opacity-40 text-[8px] mt-1">Origin: {String(lastEvent.payload.origin)}</div>
          )}
        </div>
      )}

      <div className="opacity-20 text-[8px] text-center italic tracking-widest">
        Atmospheric Diagnostic Stream // Active
      </div>
    </div>
  );
};
