"use client";

import React from "react";
import { motion } from "framer-motion";
import { useEnvironment } from "@/lib/environment/state";
import { OsintMap } from "./OsintMap";
import { AtmosphericPanel } from "@/components/common/AtmosphericPanel";
import { DynamicEntity } from "@/components/common/DynamicEntity";
import { useContent } from "@/lib/content/ContentEngine";
import { useWorldState } from "@/lib/environment/WorldStateContext";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useInteraction } from "@/lib/environment/InteractionReactor";
import { EmptyState } from "@/components/common/EmptyState";

export const OsintSection = () => {
  const { intensity } = useEnvironment();
  const { cursor } = useInteraction();
  const { objects } = useContent();
  const {  /* state: worldState, mutateWorldState, emitWorldEvent */ } = useWorldState();
  const { t } = useI18n();

  const osintObjects = objects.filter(obj => obj.environmentAffinity === 'osint' || obj.environmentAffinity === 'global');

  return (
    <div className="relative min-h-full w-full flex flex-col bg-[#010409]">
      {/* Background 3D Layer */}
      <OsintMap />

      {/* Parallax Fog Layer */}
      <div className="absolute inset-0 z-1 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.1),transparent_70%)]" />
      </div>

      {osintObjects.length === 0 ? (
        <div className="relative z-10 p-12 max-w-4xl mx-auto w-full">
            <EmptyState
                message="Inject investigation nodes and neural relationships to construct an intelligence network in the OSINT dimension."
            />
        </div>
      ) : (
        <div className="relative z-10 flex-1 grid grid-cols-12 gap-6 p-8">
            {/* Left Column: Investigation Stream */}
            <motion.div
            animate={{
                x: (cursor.x - 0.5) * -20,
                y: (cursor.y - 0.5) * -20,
            }}
            transition={{ type: 'spring', stiffness: 20, damping: 40 }}
            className="col-span-4 flex flex-col gap-8"
            >
            <AtmosphericPanel title={t.sections.osint.title} intensity={0.5} className="border-blue-900/30">
                <div className="space-y-4">
                {osintObjects.map(obj => (
                    <DynamicEntity key={obj.id} object={obj} />
                ))}
                </div>
            </AtmosphericPanel>

            <AtmosphericPanel title={t.sections.osint.relationship} intensity={0.8} className="border-blue-900/30 flex-1">
                <div className="relative h-48 border border-blue-900/40 bg-blue-950/20 overflow-hidden group">
                {/* Procedural texture overlay */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:4px_4px]" />

                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#1e40af_1px,transparent_1px),linear-gradient(to_bottom,#1e40af_1px,transparent_1px)] bg-[size:20px_20px]" />

                {/* Scanning Line */}
                <motion.div
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-px bg-blue-500/30 z-10 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                />

                {/* Pseudo Nodes with connections */}
                <svg className="absolute inset-0 w-full h-full opacity-20">
                    <line x1="25%" y1="25%" x2="75%" y2="50%" stroke="#3b82f6" strokeWidth="0.5" />
                    <line x1="75%" y1="50%" x2="50%" y2="75%" stroke="#3b82f6" strokeWidth="0.5" />
                    <line x1="50%" y1="75%" x2="25%" y2="25%" stroke="#3b82f6" strokeWidth="0.5" />
                </svg>

                <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.6)]" />
                <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-blue-600 rounded-full opacity-40 hover:opacity-100 transition-opacity cursor-pointer" />
                <div className="absolute top-3/4 left-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                </div>
            </AtmosphericPanel>
            </motion.div>

            {/* Right Column: Global Intelligence */}
            <motion.div
            animate={{
                x: (cursor.x - 0.5) * -40,
                y: (cursor.y - 0.5) * -40,
            }}
            transition={{ type: 'spring', stiffness: 15, damping: 35 }}
            className="col-span-8 flex flex-col gap-8"
            >
            <AtmosphericPanel title={t.sections.osint.subtitle} intensity={0.3} className="flex-1 border-blue-900/30">
                <div className="flex justify-between items-start mb-8">
                <div>
                    <p className="text-[10px] text-blue-500/30 font-mono mt-1">{t.sections.osint.satellite}: {t.sections.osint.active} {"//"} {t.sections.osint.threshold}: {intensity.toFixed(2)}</p>
                </div>
                <div className="text-right font-mono text-[10px] text-blue-400/40">
                    TIME_SYNC: {new Date().toISOString().split('T')[1].split('.')[0]}
                </div>
                </div>

                <div className="h-64 border border-blue-500/5 relative overflow-hidden group">
                {/* Large fading map-like nodes or visuals */}
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.2),transparent_70%)]"
                />
                </div>

                {/* Bottom Overlay Info */}
                <div className="grid grid-cols-4 gap-4 mt-12">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-t border-blue-500/10 pt-4 group cursor-help">
                        <div className="text-[9px] text-blue-500/30 uppercase group-hover:text-blue-400/60 transition-colors">{t.sections.osint.channel} 0{i}</div>
                        <div className="text-xs text-blue-100/60 font-mono group-hover:text-blue-100 transition-colors">{t.sections.osint.link_stable}</div>
                    </div>
                ))}
                </div>
            </AtmosphericPanel>

            <AtmosphericPanel intensity={0.4} className="h-32 border-blue-900/30">
                <div className="flex flex-col items-center justify-center h-full">
                <div className="text-[10px] text-blue-500/30 uppercase tracking-[0.3em] mb-4">{t.sections.osint.resonance}</div>
                <div className="flex gap-1.5 items-end h-8">
                    {[...Array(32)].map((_, i) => {
                    const seed = i * 1.5;
                    return (
                    <motion.div
                        key={i}
                        animate={{
                        height: [
                            (Math.sin(seed) * 5 + 7),
                            (Math.cos(seed) * 15 + 20),
                            (Math.sin(seed) * 5 + 7)
                        ],
                        opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{
                        duration: 3 + (i % 5) * 0.4,
                        repeat: Infinity,
                        delay: i * 0.05
                        }}
                        className="w-1 bg-blue-500/40 rounded-t-sm"
                    />
                    )})}
                </div>
                </div>
            </AtmosphericPanel>
            </motion.div>
        </div>
      )}

      {/* Corner Accents */}
      <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-blue-500/30 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-blue-500/30 pointer-events-none" />
    </div>
  );
};
