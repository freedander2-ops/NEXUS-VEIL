'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Activity, Zap, ShieldAlert, Sliders } from 'lucide-react';
import { useWorldState } from '@/lib/environment/WorldStateContext';
import { useEnvironment } from '@/lib/environment/state';

export const CreatorPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { state, mutateWorldState } = useWorldState();
  const { role } = useEnvironment();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || role !== 'operator') return null;

  return (
    <div className="fixed bottom-14 right-8 z-[150] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-72 bg-cyber-black/90 border border-cyber-blue/30 backdrop-blur-xl p-6 shadow-2xl space-y-6"
          >
            <div className="flex justify-between items-center border-b border-cyber-blue/10 pb-3">
              <div className="flex items-center gap-2">
                <Sliders size={16} className="text-cyber-cyan" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyber-blue">World Mutator</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase opacity-40">
                  <span className="flex items-center gap-2"><Activity size={10} /> Tension</span>
                  <span className="text-cyber-cyan">{(state.tension * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0" max="1" step="0.01"
                  value={state.tension}
                  onChange={(e) => mutateWorldState({ tension: parseFloat(e.target.value) })}
                  className="w-full accent-cyber-cyan"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase opacity-40">
                  <span className="flex items-center gap-2"><Zap size={10} /> Entropy</span>
                  <span className="text-cyber-cyan">{(state.entropy * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0" max="1" step="0.01"
                  value={state.entropy}
                  onChange={(e) => mutateWorldState({ entropy: parseFloat(e.target.value) })}
                  className="w-full accent-cyber-cyan"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase opacity-40">
                  <span className="flex items-center gap-2"><ShieldAlert size={10} /> Anomaly</span>
                  <span className="text-cyber-cyan">{(state.anomalyLevel * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0" max="1" step="0.01"
                  value={state.anomalyLevel}
                  onChange={(e) => mutateWorldState({ anomalyLevel: parseFloat(e.target.value) })}
                  className="w-full accent-cyber-cyan"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-cyber-blue/10">
                <p className="text-[8px] opacity-20 uppercase tracking-tighter leading-relaxed">
                    Changes applied here are ephemeral but physically mutate the active session dimensions.
                </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full border transition-all duration-500 ${
          isOpen ? 'bg-cyber-cyan text-cyber-black border-cyber-cyan' : 'bg-cyber-dark/80 text-cyber-blue border-cyber-blue/30 hover:border-cyber-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]'
        }`}
      >
        {isOpen ? <X size={24} /> : <Settings size={24} className="animate-spin-slow" />}
      </button>
    </div>
  );
};
