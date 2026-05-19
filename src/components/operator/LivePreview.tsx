'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
import { KnowledgeObject } from '@/lib/content/schema';
import { DynamicEntity } from '@/components/common/DynamicEntity';
import { AtmosphericPanel } from '@/components/common/AtmosphericPanel';

interface LivePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  object: KnowledgeObject | null;
}

export default function LivePreview({ isOpen, onClose, object }: LivePreviewProps) {
  if (!object) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-cyber-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl bg-cyber-dark border border-cyber-blue/30 shadow-[0_0_50px_rgba(59,130,246,0.3)] overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 border-b border-cyber-blue/20 bg-cyber-blue/5">
              <div className="flex items-center gap-2">
                <Maximize2 size={14} className="text-cyber-cyan" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Dimension Preview // {object.environmentAffinity}</span>
              </div>
              <button onClick={onClose} className="hover:text-cyber-red transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-12 space-y-12">
              <div className="space-y-4">
                <label className="text-[10px] uppercase opacity-40 font-bold tracking-widest">Isolated Identity</label>
                <div className="max-w-md mx-auto">
                   <DynamicEntity object={object} />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase opacity-40 font-bold tracking-widest">Atmospheric Integration</label>
                <div className="grid grid-cols-2 gap-8">
                  <AtmosphericPanel title="CYBER_LENS" intensity={0.8} className="border-red-500/20 bg-red-950/5">
                    <div className="h-24 flex items-center justify-center text-[10px] text-red-500/40 uppercase">
                      Threat Context
                    </div>
                  </AtmosphericPanel>
                  <AtmosphericPanel title="OSINT_LENS" intensity={0.4} className="border-blue-500/20 bg-blue-950/5">
                    <div className="h-24 flex items-center justify-center text-[10px] text-blue-500/40 uppercase">
                      Spatial Context
                    </div>
                  </AtmosphericPanel>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-cyber-blue/20 bg-cyber-blue/5 flex justify-end">
              <div className="text-[9px] font-mono text-cyber-blue/40 uppercase italic">
                Awaiting final confirmation...
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
