'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Activity, ShieldAlert, Globe, Link2 } from 'lucide-react';
import { KnowledgeObject } from '@/lib/content/schema';
import { DynamicEntity } from '@/components/common/DynamicEntity';
import { AtmosphericPanel } from '@/components/common/AtmosphericPanel';
import { useContent } from '@/lib/content/ContentEngine';

interface LivePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  object: KnowledgeObject | null;
}

export default function LivePreview({ isOpen, onClose, object }: LivePreviewProps) {
  const { relationships, objects } = useContent();

  if (!object) return null;

  const objectRelationships = relationships.filter(r => r.sourceId === object.id || r.targetId === object.id);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-cyber-black border border-cyber-blue/30 shadow-2xl overflow-hidden"
          >
            {/* Background Atmosphere Mockup */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <header className="relative z-10 flex justify-between items-center p-6 border-b border-cyber-blue/20 bg-cyber-blue/5">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-cyber-blue/20 border border-cyber-blue/40">
                  <Globe className="text-cyber-cyan" size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-cyber-blue">Dimensional Preview</h3>
                  <p className="text-[9px] opacity-40 uppercase font-mono tracking-tighter">Target: {object.environmentAffinity} {"//"} Type: {String(object.metadata.renderProfile || 'default')}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-cyber-red/10 text-cyber-red/60 hover:text-cyber-red transition-all border border-transparent hover:border-cyber-red/20"
              >
                <X size={20} />
              </button>
            </header>

            <div className="relative z-10 p-8 grid grid-cols-12 gap-8">
                {/* Left: Atmospheric Panel Mockup */}
                <div className="col-span-12 md:col-span-7">
                    <label className="text-[8px] uppercase opacity-40 font-bold mb-4 block tracking-widest uppercase">Atmospheric Manifestation</label>
                    <AtmosphericPanel title="Neural_Data_Node" intensity={1} className="h-80">
                        <div className="flex flex-col items-center justify-center h-full gap-8">
                            <DynamicEntity object={object} />

                            {/* Simple Visual Connections Mockup */}
                            <div className="relative w-full h-24 flex items-center justify-center">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {objectRelationships.length > 0 && [...Array(3)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.1, 0.3, 0.1]
                                            }}
                                            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                                            className="absolute w-24 h-24 border border-cyber-cyan/20 rounded-full"
                                        />
                                    ))}
                                </div>
                                <div className="text-[7px] text-cyber-cyan/40 uppercase tracking-[0.5em] mt-16 font-mono">
                                    {objectRelationships.length} ACTIVE NEURAL LINKS
                                </div>
                            </div>
                        </div>
                    </AtmosphericPanel>
                </div>

                {/* Right: Technical Influence */}
                <div className="col-span-12 md:col-span-5 space-y-6">
                    <div className="space-y-4">
                        <label className="text-[8px] uppercase opacity-40 font-bold block tracking-widest">Environmental Footprint</label>
                        <div className="space-y-3">
                            {[
                                { label: 'Tension', val: object.influence.tension || 0, icon: Activity, color: 'text-cyber-blue' },
                                { label: 'Entropy', val: object.influence.entropy || 0, icon: Zap, color: 'text-amber-500' },
                                { label: 'Anomaly', val: object.influence.anomaly || 0, icon: ShieldAlert, color: 'text-cyber-red' }
                            ].map(item => (
                                <div key={item.label} className="p-3 bg-cyber-dark border border-cyber-blue/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[9px] uppercase flex items-center gap-2 opacity-60">
                                            <item.icon size={10} /> {item.label}
                                        </span>
                                        <span className={`text-[9px] font-bold ${item.color}`}>{(item.val * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="h-0.5 bg-white/5 overflow-hidden">
                                        <div className={`h-full ${item.color.replace('text-', 'bg-')}`} style={{ width: `${item.val * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[8px] uppercase opacity-40 font-bold block tracking-widest">Propagation Influence</label>
                        <div className="max-h-32 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                            {objectRelationships.map(rel => {
                                const otherId = rel.sourceId === object.id ? rel.targetId : rel.sourceId;
                                const other = objects.find(o => o.id === otherId);
                                return (
                                    <div key={rel.id} className="p-2 border border-cyber-blue/5 bg-cyber-blue/5 flex items-center justify-between text-[8px] uppercase">
                                        <div className="flex items-center gap-2">
                                            <Link2 size={10} className="opacity-40" />
                                            <span className="opacity-60">{other?.label || otherId}</span>
                                        </div>
                                        <div className="text-cyber-cyan font-mono">{(rel.strength * 0.8 * 100).toFixed(0)}% EST.</div>
                                    </div>
                                );
                            })}
                            {objectRelationships.length === 0 && (
                                <div className="text-center py-4 border border-dashed border-cyber-blue/10 opacity-20 text-[8px]">
                                    NO PROPAGATION PATHS
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 border border-dashed border-cyber-blue/20 bg-cyber-blue/5">
                        <h4 className="text-[9px] font-bold uppercase text-cyber-blue/60 mb-2">Operational Note</h4>
                        <p className="text-[8px] opacity-40 leading-relaxed uppercase">
                            Injection will cause a persistent {`${object.environmentAffinity}`} mutation.
                            Propagation factor estimated at 0.8x depth.
                        </p>
                    </div>
                </div>
            </div>

            <footer className="relative z-10 p-4 border-t border-cyber-blue/10 bg-cyber-black flex justify-center">
                <div className="text-[8px] opacity-20 uppercase tracking-[0.4em] font-mono">
                    {"//"} Ready for Ecosystem Integration {"//"}
                </div>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
