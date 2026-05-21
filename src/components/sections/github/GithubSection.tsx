"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitBranch, GitCommit, Database, Cpu, Activity, LucideIcon } from "lucide-react";
import { useEnvironment } from "@/lib/environment/state";
import { useWorldState } from "@/lib/environment/WorldStateContext";
import { GithubVisuals } from "./GithubVisuals";
import { AtmosphericPanel } from "@/components/common/AtmosphericPanel";
import { TactileButton } from "@/components/common/TactileButton";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useContent } from "@/lib/content/ContentEngine";
import { EmptyState } from "@/components/common/EmptyState";

const MetricNode = ({ icon: Icon, label, value, trend }: { icon: LucideIcon, label: string, value: string, trend?: string }) => (
  <div className="p-4 border border-slate-800 bg-slate-900/40 backdrop-blur-md group hover:border-slate-600 transition-colors">
    <div className="flex items-center gap-3 mb-3">
      <Icon size={14} className="text-slate-400 group-hover:text-white transition-colors" />
      <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</span>
    </div>
    <div className="flex justify-between items-end">
      <div className="text-xl font-light text-slate-200 group-hover:text-white transition-colors font-mono">{value}</div>
      {trend && <div className="text-[9px] text-emerald-500/70 font-mono mb-1">{trend}</div>}
    </div>
  </div>
);

const CommitStream = () => (
  <div className="space-y-3">
    {[
      { id: '0xAF12', msg: 'Merge pull request #442 from dev/feat-engine', repo: 'nexus-core', time: '2m ago' },
      { id: '0xBF44', msg: 'Optimize shader compilation pipeline', repo: 'veil-render', time: '5m ago' },
      { id: '0xCC89', msg: 'Update dependency tree for adaptive-ui', repo: 'nexus-veil', time: '12m ago' },
      { id: '0xDA01', msg: 'Fix memory leak in environmental-state', repo: 'nexus-veil', time: '18m ago' },
    ].map((commit, i) => (
      <motion.div
        key={commit.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
        className="flex items-start gap-4 p-3 border-l border-slate-800 hover:bg-white/5 transition-colors group"
      >
        <div className="mt-1">
          <GitCommit size={14} className="text-slate-600 group-hover:text-slate-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">{commit.repo} {"//"} {commit.id}</span>
            <span className="text-[9px] text-slate-600 italic">{commit.time}</span>
          </div>
          <p className="text-xs text-slate-300 truncate font-light leading-relaxed group-hover:text-white transition-colors">
            {commit.msg}
          </p>
        </div>
      </motion.div>
    ))}
  </div>
);

export const GithubSection = () => {
  const { intensity } = useEnvironment();
  const { state: worldState } = useWorldState();
  const { t } = useI18n();
  const { objects } = useContent();

  const githubObjects = objects.filter(obj => obj.environmentAffinity === 'github' || obj.environmentAffinity === 'global');

  // Ensuring rhythmic precision driven by world entropy
  const pulseDuration = 2 / (1 + worldState.entropy);

  return (
    <div className="relative min-h-full w-full flex flex-col bg-[#0a0a0c] text-slate-300">
      {/* Background Engineered Visuals */}
      <GithubVisuals />

      {/* Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 flex-1 flex flex-col p-8">
        {/* Header: High Precision */}
        <header className="flex justify-between items-end mb-10 border-b border-slate-800/50 pb-6">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 border border-slate-700 flex items-center justify-center bg-slate-900/50">
              <GitBranch className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-light tracking-[0.3em] text-white uppercase">{t.sections.github.title}</h2>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-1">{t.sections.github.subtitle}</p>
            </div>
          </div>
          <div className="flex gap-8 text-[10px] font-mono text-slate-500 uppercase tracking-widest pb-1">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               NODE_STABLE
             </div>
             <div>LATENCY: 12ms</div>
             <div>SYNC: {intensity.toFixed(4)}</div>
          </div>
        </header>

        {githubObjects.length === 0 ? (
            <div className="max-w-4xl mx-auto w-full">
                <EmptyState
                    message="No repositories injected. Add engineering systems, frameworks, or infrastructure tools to activate the GitHub dimension."
                />
            </div>
        ) : (
            <motion.div
            animate={{ opacity: [0.95, 1, 0.95] }}
            transition={{
                duration: pulseDuration,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1]
            }}
            className="flex-1 grid grid-cols-12 gap-8"
            >
            {/* Left Column: Metrics & Architecture */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                <div className="grid grid-cols-3 gap-6">
                    <MetricNode icon={Database} label={t.sections.github.objects} value="1.2M+" trend="+12.4k" />
                    <MetricNode icon={Cpu} label={t.sections.github.load} value="22.4%" trend="-2.1%" />
                    <MetricNode icon={Activity} label={t.sections.github.threads} value="8,442" trend="+412" />
                </div>

                <AtmosphericPanel title="Infrastructure Logic Map" intensity={0.2} className="flex-1 border-slate-800">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[80%] h-[1px] bg-slate-800 opacity-20" />
                    <div className="h-[80%] w-[1px] bg-slate-800 opacity-20" />
                    </div>
                </AtmosphericPanel>
            </div>

            {/* Right Column: Activity Stream */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                <AtmosphericPanel title={t.sections.github.stream_title} intensity={0.4} className="flex-1 border-slate-800">
                    <CommitStream />

                    <div className="mt-8 pt-6 border-t border-slate-800">
                    <TactileButton className="w-full">
                        {t.sections.github.documentation}
                    </TactileButton>
                    </div>
                </AtmosphericPanel>

                <AtmosphericPanel intensity={0.1} className="h-24 border-slate-800/50">
                    <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-[8px] uppercase tracking-widest text-slate-600 mb-2 font-mono">System Integrity Verified</div>
                    <div className="flex gap-1">
                        {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-3 h-1 bg-slate-800" />
                        ))}
                    </div>
                    </div>
                </AtmosphericPanel>
            </div>
            </motion.div>
        )}
      </div>
    </div>
  );
};
