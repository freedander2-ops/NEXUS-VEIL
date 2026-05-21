'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AtmosphericPanel } from '@/components/common/AtmosphericPanel';
import { useI18n } from '@/lib/i18n/I18nContext';

export default function WeatherSection({ title, description }: { title: string, description: string }) {
  const { language } = useI18n();

  return (
    <div className="space-y-12 p-8">
      <header className="max-w-4xl">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-5xl font-light tracking-[0.4em] text-cyber-blue mb-6 uppercase"
        >
          {title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xs text-cyber-blue/40 leading-relaxed uppercase tracking-[0.3em] max-w-2xl"
        >
          {description}
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <AtmosphericPanel
            key={i}
            title={`ATMOSPHERE // 0${i}`}
            intensity={0.2}
            className="h-96 border-cyber-blue/10"
          >
            <div className="h-full flex flex-col justify-between py-4">
              <div className="space-y-6">
                <div className="h-0.5 w-1/4 bg-cyber-blue/20" />
                <div className="space-y-3">
                  <div className="h-1 w-full bg-cyber-blue/10" />
                  <div className="h-1 w-5/6 bg-cyber-blue/5" />
                  <div className="h-1 w-4/6 bg-cyber-blue/5" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-cyber-blue/5 pb-2">
                   <span className="text-[10px] font-mono text-cyber-blue/20">STABILITY</span>
                   <span className="text-xs font-mono text-cyber-blue/60">0.992</span>
                </div>
                <div className="flex justify-between items-end border-b border-cyber-blue/5 pb-2">
                   <span className="text-[10px] font-mono text-cyber-blue/20">RESONANCE</span>
                   <span className="text-xs font-mono text-cyber-blue/60">ACTIVE</span>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div className="text-[9px] uppercase tracking-widest text-cyber-blue/40 font-bold">
                  {language === 'en' ? 'Synchronizing...' : 'Синхронизация...'}
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                />
              </div>
            </div>
          </AtmosphericPanel>
        ))}
      </div>

      {/* Environmental Feed */}
      <AtmosphericPanel title="Global Atmospheric Feed" intensity={0.1} className="border-cyber-blue/5">
        <div className="grid grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-2">
              <div className="text-[8px] text-cyber-blue/20 uppercase tracking-widest font-mono">Stream 0{i}</div>
              <div className="h-1 w-full bg-cyber-blue/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.random() * 60 + 20}%` }}
                  transition={{ duration: 2, delay: i * 0.2 }}
                  className="h-full bg-cyber-blue/20"
                />
              </div>
            </div>
          ))}
        </div>
      </AtmosphericPanel>
    </div>
  );
}
