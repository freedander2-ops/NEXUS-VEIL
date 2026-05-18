'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Activity, Cpu, AlertTriangle } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { CyberNetwork } from './CyberNetwork';
import { useI18n } from '@/lib/i18n/I18nContext';

export default function CyberSection() {
  const { t } = useI18n();
  return (
    <div className="relative min-h-[calc(100vh-8rem)] w-full overflow-hidden">
      {/* 3D Background specifically for this section */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4] }}>
          <CyberNetwork />
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 grid grid-cols-12 gap-6 p-4">
        {/* Tactical Header */}
        <div className="col-span-12 flex items-center justify-between border-b border-cyber-red/20 pb-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-cyber-red/10 border border-cyber-red/30">
              <ShieldAlert className="text-cyber-red animate-pulse" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-[0.2em] text-cyber-red uppercase">{t.sections.cyber.title}</h1>
              <p className="text-[10px] text-cyber-red/50 font-mono tracking-widest uppercase">{t.sections.cyber.subtitle}</p>
            </div>
          </div>
          <div className="text-right font-mono text-[10px] text-cyber-red/60 space-y-1">
            <div>{t.sections.cyber.signal}: 98.4%</div>
            <div>{t.sections.cyber.threat_level}: ELEVATED</div>
          </div>
        </div>

        {/* Unstable UI Layers */}
        <div className="col-span-12 md:col-span-4 space-y-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="p-4 bg-cyber-red/5 border border-cyber-red/20 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity size={14} className="text-cyber-red" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Real-time Pulse</h3>
            </div>
            <div className="h-32 border-l border-b border-cyber-red/10 relative overflow-hidden">
              <motion.div
                animate={{ x: [0, 100], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-cyber-red/10 to-transparent"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                 <div className="w-full h-[1px] bg-cyber-red" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-4 bg-cyber-black/80 border border-cyber-red/40"
          >
            <div className="flex items-center gap-2 mb-4">
              <Cpu size={14} className="text-cyber-red" />
              <h3 className="text-xs font-bold uppercase tracking-widest">{t.sections.cyber.anomaly}</h3>
            </div>
            <div className="space-y-2 text-[10px] font-mono">
               <div className="flex justify-between p-2 bg-cyber-red/10 border border-cyber-red/20">
                 <span>ERR_INT_OVERFLOW</span>
                 <span className="text-cyber-red">ACTIVE</span>
               </div>
               <div className="flex justify-between p-2 bg-cyber-red/5 border border-cyber-red/10 opacity-60">
                 <span>GHOST_PKT_DETECTED</span>
                 <span>CLEAR</span>
               </div>
            </div>
          </motion.div>
        </div>

        <div className="col-span-12 md:col-span-8">
           <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-full min-h-[400px] border border-cyber-red/20 bg-cyber-red/5 backdrop-blur-sm relative"
          >
            <div className="absolute top-4 right-4 flex items-center gap-2 text-cyber-red text-[10px] font-mono">
              <AlertTriangle size={12} className="animate-bounce" />
              {t.sections.cyber.instability}
            </div>

            <div className="p-8">
               <div className="text-6xl font-black text-cyber-red/5 select-none pointer-events-none absolute bottom-8 right-8">
                 0xDE
               </div>
               <div className="space-y-4">
                 <div className="text-xs font-bold text-cyber-red/80 tracking-widest uppercase">{t.sections.cyber.terminal_title}</div>
                 <div className="space-y-2 max-w-lg">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="p-3 bg-cyber-black/40 border-l-2 border-cyber-red/60 text-[10px] font-mono leading-relaxed">
                        [TIMESTAMP: {new Date().toLocaleTimeString()}] // {t.sections.cyber.packet} // HEURISTIC MATCH: 89% // THREAT_ISOLATED
                      </div>
                    ))}
                 </div>
               </div>
            </div>

            {/* Tactical Grid Overlay */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-6 grid-rows-6 opacity-10">
              {Array.from({length: 36}).map((_, i) => (
                <div key={i} className="border border-cyber-red/30" />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Atmospheric Instability Overlay */}
      <motion.div
        animate={{ opacity: [0, 0.05, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute inset-0 bg-cyber-red pointer-events-none"
      />
    </div>
  );
}
