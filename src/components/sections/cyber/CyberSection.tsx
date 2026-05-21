'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { CyberNetwork } from './CyberNetwork';
import { useI18n } from '@/lib/i18n/I18nContext';
import { UnstableGrid } from './TacticalLayers';
import { AtmosphericPanel } from '@/components/common/AtmosphericPanel';
import { useContent } from '@/lib/content/ContentEngine';
import { DynamicEntity } from '@/components/common/DynamicEntity';
import { useWorldState } from '@/lib/environment/WorldStateContext';
import { EmptyState } from '@/components/common/EmptyState';

export default function CyberSection() {
  const { state: worldState } = useWorldState();
  const { t } = useI18n();
  const { objects } = useContent();

  const cyberObjects = objects.filter(obj => obj.environmentAffinity === 'cyber' || obj.environmentAffinity === 'global');

  return (
    <div className="relative min-h-screen w-full bg-cyber-black overflow-visible">
      <UnstableGrid />

      {/* 3D Background specifically for this section */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <CyberNetwork />
        </Canvas>
      </div>

      {/* Dimensional Content */}
      <motion.div
        animate={{
          x: worldState.tension > 0.7 ? [0, -2, 2, 0] : 0,
          filter: worldState.anomalyLevel > 0.4 ? ["hue-rotate(0deg)", "hue-rotate(90deg)", "hue-rotate(0deg)"] : "none"
        }}
        transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror" }}
        className="relative z-10 p-12"
      >
        <div className="flex flex-col gap-12 max-w-7xl mx-auto">

          {/* Unstable Tactical Header */}
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-start justify-between border-l-4 border-cyber-red p-8 bg-cyber-red/5 backdrop-blur-xl"
          >
            <div className="flex items-center gap-8">
              <div className="p-4 bg-cyber-red/20 border border-cyber-red/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <ShieldAlert className="text-cyber-red animate-pulse" size={48} />
              </div>
              <div className="space-y-2">
                <h1 className="text-5xl font-black tracking-tighter text-cyber-red uppercase italic">
                  {t.sections.cyber.title}
                </h1>
                <p className="text-xs text-cyber-red/60 font-mono tracking-[0.5em] uppercase">
                  {t.sections.cyber.subtitle} {"//"} 0xCC_ANOMALY_DETECTED
                </p>
              </div>
            </div>
            <div className="flex gap-12 font-mono text-sm text-cyber-red/80">
              <div className="space-y-1">
                <div className="text-[10px] opacity-40 uppercase">Strength</div>
                <div className="font-bold">98.4%</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] opacity-40 uppercase">Vector</div>
                <div className="font-bold text-white bg-cyber-red px-2">INBOUND</div>
              </div>
            </div>
          </motion.header>

          {cyberObjects.length === 0 ? (
              <EmptyState
                message="No threat intelligence loaded. Inject CVE feeds, anomaly signals, or security systems into the Cybersecurity dimension."
              />
          ) : (
            <div className="grid grid-cols-12 gap-8 items-start">
                {/* Left Column: Real-time Telemetry */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                <AtmosphericPanel title="HEURISTIC_PULSE_FEED" intensity={2} className="border-cyber-red/20 bg-cyber-red/5">
                    <div className="h-48 relative bg-cyber-black/40 border border-cyber-red/10 overflow-visible">
                    <div className="absolute inset-0 opacity-20">
                        <svg width="100%" height="100%" className="overflow-visible">
                        <motion.path
                            d="M 0 50 Q 50 10 100 50 T 200 50 T 300 50 T 400 50"
                            fill="none"
                            stroke="red"
                            strokeWidth="1"
                            animate={{ d: [
                            "M 0 50 Q 50 10 100 50 T 200 50 T 300 50 T 400 50",
                            "M 0 50 Q 50 90 100 50 T 200 50 T 300 50 T 400 50"
                            ]}}
                            transition={{ duration: 0.2, repeat: Infinity }}
                        />
                        </svg>
                    </div>
                    <div className="absolute bottom-4 left-4 text-[10px] font-mono text-cyber-red animate-pulse">
                        SIGNAL_VARIANCE_ELEVATED
                    </div>
                    </div>
                </AtmosphericPanel>

                <AtmosphericPanel title={t.sections.cyber.anomaly} intensity={1.5} className="border-cyber-red/20 bg-cyber-red/5">
                    <div className="space-y-3">
                    {cyberObjects.map((obj) => (
                        <DynamicEntity key={obj.id} object={obj} />
                    ))}
                    </div>
                </AtmosphericPanel>
                </div>

                {/* Right Column: Central Intelligence */}
                <div className="col-span-12 lg:col-span-8">
                <AtmosphericPanel title={t.sections.cyber.terminal_title} intensity={1} className="h-full border-cyber-red/20 bg-cyber-red/5">
                    <div className="space-y-6">
                    <div className="flex justify-between items-center opacity-40 text-[10px] font-mono">
                        <div className="flex items-center gap-2">
                        <Zap size={10} /> {t.sections.cyber.instability}
                        </div>
                        <div>FILTER_ACTIVE: INTRUSION_DETECTION</div>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-4 bg-cyber-red/5 border-l-2 border-cyber-red/40 text-xs font-mono group hover:bg-cyber-red/10 transition-colors"
                        >
                            <span className="text-cyber-red opacity-30 mr-4">0{i}</span>
                            <span className="text-cyber-red/80">[{new Date().toLocaleTimeString()}]</span>
                            <span className="mx-4 text-cyber-red/40">{"//"}</span>
                            <span className="text-white/80">{t.sections.cyber.packet}</span>
                            <span className="ml-4 text-cyber-red/40">{">>"}</span>
                            <span className="text-cyber-red ml-2 font-bold italic">ISOLATED</span>
                        </motion.div>
                        ))}
                    </div>

                    {/* Aggressive tactical feedback loop */}
                    {worldState.tension > 0.8 && (
                        <motion.div
                        animate={{ opacity: [0.2, 0.8, 0.2] }}
                        transition={{ duration: 0.1, repeat: Infinity }}
                        className="p-2 bg-cyber-red text-cyber-black text-[10px] font-black text-center"
                        >
                        CRITICAL_INSTABILITY_DETECTED // SYSTEM_RECOIL_ACTIVE
                        </motion.div>
                    )}

                    <div className="h-32 border border-cyber-red/10 flex items-center justify-center relative group">
                        <div className="text-[10px] font-mono text-cyber-red/20 group-hover:text-cyber-red/50 transition-colors tracking-[1em]">
                        SCANNING_VULNERABILITY_SURFACE
                        </div>
                        <motion.div
                        animate={{ left: ['0%', '100%', '0%'] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute top-0 bottom-0 w-[2px] bg-cyber-red shadow-[0_0_15px_red]"
                        />
                    </div>
                    </div>
                </AtmosphericPanel>
                </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Atmospheric Instability Overlay */}
      <motion.div
        animate={{ opacity: [0, 0.05, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute inset-0 bg-cyber-red pointer-events-none"
      />
    </div>
  );
}
