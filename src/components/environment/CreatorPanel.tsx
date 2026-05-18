'use client';

import React, { useState } from 'react';
import { useCreator, defaultDimensions } from '@/lib/environment/creatorState';
import { Settings, X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CreatorPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeDimension, updateDimension, setDimension } = useCreator();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-2 bg-cyber-dark/80 border border-cyber-blue/30 text-cyber-blue hover:text-cyber-cyan transition-colors backdrop-blur-md"
      >
        <Settings size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="fixed top-0 right-0 h-full w-80 bg-cyber-black/95 border-l border-cyber-blue/20 z-[60] p-6 text-cyber-blue overflow-y-auto backdrop-blur-2xl"
          >
            <div className="flex justify-between items-center mb-8 border-b border-cyber-blue/10 pb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest">Dimension Creator</h3>
              <button onClick={() => setIsOpen(false)} className="hover:text-cyber-red"><X size={16} /></button>
            </div>

            <div className="space-y-8">
              {/* Preset Selector */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Presets</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(defaultDimensions).map(id => (
                    <button
                      key={id}
                      onClick={() => setDimension(id)}
                      className="px-2 py-1 text-[8px] border border-cyber-blue/20 hover:border-cyber-blue/50 uppercase"
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Atmosphere */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Atmosphere</label>
                <div className="space-y-3">
                  <div className="flex justify-between text-[9px] uppercase">
                    <span>Fog Density</span>
                    <span>{activeDimension.atmosphere.fog.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.01"
                    value={activeDimension.atmosphere.fog}
                    onChange={(e) => updateDimension({ atmosphere: { ...activeDimension.atmosphere, fog: parseFloat(e.target.value) } })}
                    className="w-full accent-cyber-blue"
                  />

                  <div className="flex justify-between text-[9px] uppercase">
                    <span>Grain</span>
                    <span>{activeDimension.atmosphere.grain.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0" max="0.5" step="0.01"
                    value={activeDimension.atmosphere.grain}
                    onChange={(e) => updateDimension({ atmosphere: { ...activeDimension.atmosphere, grain: parseFloat(e.target.value) } })}
                    className="w-full accent-cyber-blue"
                  />
                </div>
              </div>

              {/* Visuals */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Visuals</label>
                <div className="space-y-3">
                  <div className="flex justify-between text-[9px] uppercase">
                    <span>Grid Stability</span>
                    <span>{activeDimension.visuals.gridStability.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.01"
                    value={activeDimension.visuals.gridStability}
                    onChange={(e) => updateDimension({ visuals: { ...activeDimension.visuals, gridStability: parseFloat(e.target.value) } })}
                    className="w-full accent-cyber-blue"
                  />
                </div>
              </div>

              {/* Motion */}
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-bold opacity-40 tracking-widest">Motion</label>
                <div className="space-y-3">
                  <div className="flex justify-between text-[9px] uppercase">
                    <span>Pulse Speed</span>
                    <span>{activeDimension.motion.speed.toFixed(1)}</span>
                  </div>
                  <input
                    type="range" min="0.1" max="5" step="0.1"
                    value={activeDimension.motion.speed}
                    onChange={(e) => updateDimension({ motion: { ...activeDimension.motion, speed: parseFloat(e.target.value) } })}
                    className="w-full accent-cyber-blue"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-cyber-blue/10">
              <button
                onClick={() => setDimension(activeDimension.id)}
                className="w-full flex items-center justify-center gap-2 py-2 border border-cyber-blue/20 text-[9px] uppercase hover:bg-cyber-blue/5"
              >
                <RotateCcw size={12} /> Reset to Default
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
