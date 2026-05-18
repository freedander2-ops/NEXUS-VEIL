"use client";

import React from "react";
import { motion } from "framer-motion";
import { useEnvironment } from "@/lib/environment/state";
import { OsintMap } from "./OsintMap";

const DataNode = ({ label, value, status }: { label: string, value: string, status: string }) => (
  <div className="border-l border-blue-500/20 pl-4 py-2 bg-blue-900/5 hover:bg-blue-800/10 transition-colors cursor-crosshair group relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
    <div className="relative z-10">
      <div className="text-[10px] uppercase tracking-widest text-blue-400/40 mb-1 group-hover:text-blue-300 transition-colors">
        {label}
      </div>
      <div className="font-mono text-sm text-blue-100/90 flex justify-between items-center">
        <span>{value}</span>
        <span className="text-[10px] text-blue-500/30 italic group-hover:text-blue-400/60">{status}</span>
      </div>
    </div>
  </div>
);

export const OsintSection = () => {
  const { intensity } = useEnvironment();

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col bg-[#010409]">
      {/* Background 3D Layer */}
      <OsintMap />

      {/* Parallax Fog Layer */}
      <div className="absolute inset-0 z-1 pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.1),transparent_70%)]" />
      </div>

      {/* Foreground UI Layers */}
      <div className="relative z-10 flex-1 grid grid-cols-12 gap-6 p-8">

        {/* Left Column: Investigation Stream */}
        <div className="col-span-4 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 border border-blue-900/30 bg-slate-950/60 backdrop-blur-xl shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-blue-600/50" />
              <h2 className="text-xl font-light tracking-[0.2em] text-blue-400/80 uppercase">
                Investigation // Deep Scan
              </h2>
            </div>

            <div className="space-y-4">
              <DataNode label="Target ID" value="SIG-X-992-B" status="MONITORING" />
              <DataNode label="Origin" value="AS-7712 // HK-CLUSTER" status="VERIFIED" />
              <DataNode label="Signal Type" value="ENCRYPTED_BURST" status="DECRYPTING" />
              <DataNode label="Confidence" value="94.2%" status="HIGH" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 border border-blue-900/30 bg-slate-950/60 backdrop-blur-xl flex-1 shadow-2xl"
          >
            <div className="text-[10px] uppercase tracking-widest text-blue-400/40 mb-4 flex justify-between">
              <span>Node Relationship Map</span>
              <span className="animate-pulse text-blue-500/60">Tracing Signal...</span>
            </div>

            {/* Minimalist Visual Representation of Nodes */}
            <div className="relative h-48 border border-blue-900/40 bg-blue-950/20 overflow-hidden group">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

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
          </motion.div>
        </div>

        {/* Right Column: Global Intelligence */}
        <div className="col-span-8 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 p-6 border border-blue-900/30 bg-slate-950/60 backdrop-blur-xl relative overflow-hidden shadow-2xl"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-sm font-mono text-blue-400/60 uppercase tracking-widest">Global Node Distribution</h3>
                <p className="text-[10px] text-blue-500/30 font-mono mt-1">SATELLITE DOWNLINK: ACTIVE // THRESHOLD: {intensity.toFixed(2)}</p>
              </div>
              <div className="text-right font-mono text-[10px] text-blue-400/40">
                TIME_SYNC: {new Date().toISOString().split('T')[1].split('.')[0]}
              </div>
            </div>

            {/* Bottom Overlay Info */}
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-4 gap-4">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="border-t border-blue-500/10 pt-2 group cursor-help">
                    <div className="text-[9px] text-blue-500/30 uppercase group-hover:text-blue-400/60 transition-colors">Channel 0{i}</div>
                    <div className="text-xs text-blue-100/60 font-mono group-hover:text-blue-100 transition-colors">LINK_STABLE</div>
                 </div>
               ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-32 p-4 border border-blue-900/30 bg-slate-950/60 backdrop-blur-xl flex items-center justify-center shadow-2xl"
          >
            <div className="text-center">
              <div className="text-[10px] text-blue-500/30 uppercase tracking-[0.3em] mb-4">Signal Resonance Hierarchy</div>
              <div className="flex gap-1.5 items-end h-8">
                 {[...Array(32)].map((_, i) => (
                   <motion.div
                    key={i}
                    animate={{
                      height: [
                        Math.random()*10 + 2,
                        Math.random()*32 + 5,
                        Math.random()*10 + 2
                      ],
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.05
                    }}
                    className="w-1 bg-blue-500/40 rounded-t-sm"
                   />
                 ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-blue-500/30 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-blue-500/30 pointer-events-none" />
    </div>
  );
};
