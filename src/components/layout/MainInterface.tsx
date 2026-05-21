'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud,
  ShieldAlert,
  GitBranch,
  LocateFixed,
  LogOut,
  Activity,
  Menu,
  X,
  Info,
  ChevronRight
} from 'lucide-react';
import { useEnvironment } from '@/lib/environment/state';
import { useWorldState } from '@/lib/environment/WorldStateContext';
import { useCreator } from '@/lib/environment/creatorState';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useAudio } from '@/lib/audio/AudioEngine';
import { cn } from '@/lib/utils';
import WeatherSection from '@/components/sections/WeatherSection';
import CyberSection from '@/components/sections/cyber/CyberSection';
import { OsintSection } from '@/components/sections/osint/OsintSection';
import { GithubSection } from '@/components/sections/github/GithubSection';
import { CreatorPanel } from '@/components/environment/CreatorPanel';
import { DimensionalMorph } from '@/components/environment/DimensionalMorph';
import { StatusLayer } from '@/components/environment/StatusLayer';

type Section = 'weather' | 'cyber' | 'github' | 'osint';

export default function MainInterface() {
  const { logout, mood, intensity, role } = useEnvironment();
  const { mutateWorldState, state: worldState } = useWorldState();
  const { setDimension } = useCreator();
  const { t, language, setLanguage } = useI18n();
  const { playFeedback } = useAudio();

  const [activeSection, setActiveSection] = useState<Section>('weather');
  const [isMorphing, setIsMorphing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showGuidance, setShowGuidance] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const navItems = [
    { id: 'weather', label: t.nav.weather, icon: Cloud, description: 'Global atmospheric core monitoring planetary digital pulse.' },
    { id: 'cyber', label: t.nav.cyber, icon: ShieldAlert, description: 'Tactical threat-space for intrusion detection and anomaly visualization.' },
    { id: 'github', label: t.nav.github, icon: GitBranch, description: 'Technical infrastructure monitoring code evolution and repository health.' },
    { id: 'osint', label: t.nav.osint, icon: LocateFixed, description: 'Investigation surface for geographical node mapping and node relationship discovery.' },
  ];

  const isCyberDimension = activeSection === 'cyber';

  const handleSectionChange = (id: Section) => {
    if (activeSection === id) return;
    playFeedback('click');
    setIsMorphing(true);
    mutateWorldState({ tension: 0.8 });

    setTimeout(() => {
      setActiveSection(id);
      setDimension(id);
      setTimeout(() => mutateWorldState({ tension: 0.3 }), 400);
    }, 400);

    setTimeout(() => setIsMorphing(false), 1200);
  };

  if (!isClient) return null;

  return (
    <motion.div
      animate={{
        backgroundColor: worldState.anomalyLevel > 0.8 ? ['#000', '#fff', '#000'] : (isCyberDimension ? '#050505' : '#0a0a0a'),
      }}
      transition={{
        duration: 0.1,
        repeat: worldState.anomalyLevel > 0.9 ? Infinity : 0
      }}
      className={cn(
        "flex h-screen overflow-hidden transition-colors duration-1000",
        isCyberDimension ? "text-cyber-red" : "text-cyber-blue"
      )}
    >
      {/* Sidebar Navigation */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? 280 : 80,
          borderColor: isCyberDimension ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.1)'
        }}
        className={cn(
          "relative z-20 flex flex-col border-r backdrop-blur-xl transition-colors duration-1000",
          isCyberDimension ? "bg-cyber-red/5" : "bg-cyber-dark/40"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs font-bold tracking-[0.4em] uppercase text-glow-cyan"
              >
                Nexus Veil
              </motion.span>
            )}
          </AnimatePresence>
          <button onClick={() => {
              setIsSidebarOpen(!isSidebarOpen);
              playFeedback('click');
          }} className="hover:text-cyber-cyan transition-colors">
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id as Section)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-sm transition-all group relative overflow-hidden",
                  isActive
                    ? (isCyberDimension ? "bg-cyber-red/20 text-cyber-red" : "bg-cyber-blue/10 text-cyber-cyan")
                    : (isCyberDimension ? "hover:bg-cyber-red/10 text-cyber-red/40" : "hover:bg-cyber-blue/5 text-cyber-blue/60")
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className={cn(
                      "absolute left-0 w-1 h-full",
                      isCyberDimension ? "bg-cyber-red shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "bg-cyber-cyan shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                    )}
                  />
                )}
                <Icon size={20} className={cn("shrink-0", isActive ? "text-cyber-cyan" : "group-hover:text-cyber-blue")} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="flex flex-col items-start overflow-hidden"
                    >
                      <span className="text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">
                        {item.label}
                      </span>
                      {isActive && (
                          <span className="text-[7px] uppercase tracking-tighter opacity-40 mt-1 truncate w-full">
                              Active Dimension
                          </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-cyber-blue/10 space-y-4 mb-10">
          <div className="flex items-center gap-4 px-2 py-1">
            <Activity size={14} className="text-cyber-cyan animate-pulse" />
            {isSidebarOpen && (
              <div className="text-[8px] uppercase tracking-tighter opacity-40 font-mono">
                {t.common.pulse}: {(intensity * 100).toFixed(0)}% // {t.common[mood as keyof typeof t.common]}
              </div>
            )}
          </div>

          <button
            onClick={() => {
                logout();
                playFeedback('click');
                window.location.href = '/';
            }}
            className="w-full flex items-center gap-4 p-3 text-cyber-red/60 hover:bg-cyber-red/10 hover:text-cyber-red transition-all border border-transparent hover:border-cyber-red/20"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-[10px] uppercase tracking-widest font-bold">{t.nav.disconnect}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col min-h-screen">
        <header className={cn(
          "h-16 flex items-center px-8 border-b backdrop-blur-sm sticky top-0 z-10 transition-colors duration-1000",
          isCyberDimension ? "border-cyber-red/10 bg-cyber-red/5" : "border-cyber-blue/5 bg-cyber-dark/20"
        )}>
          <div className="flex-1 flex items-center gap-6">
            <h2 className={cn(
              "text-[10px] uppercase tracking-[0.4em] font-bold transition-colors duration-1000",
              isCyberDimension ? "text-cyber-red/40" : "text-cyber-blue/40"
            )}>
              Environment // <span className={isCyberDimension ? "text-cyber-red" : "text-cyber-blue"}>{navItems.find(i => i.id === activeSection)?.label}</span>
            </h2>

            <button
                onClick={() => {
                    setShowGuidance(!showGuidance);
                    playFeedback('click');
                }}
                className={cn(
                    "p-1.5 border transition-all",
                    showGuidance ? "bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan" : "border-white/10 text-white/20 hover:text-white/40"
                )}
            >
                <Info size={14} />
            </button>
          </div>

          <div className="flex items-center gap-8">
            {role === 'operator' && (
                <button
                    onClick={() => {
                        playFeedback('click');
                        window.location.href = '/operator';
                    }}
                    className="px-4 py-1.5 border border-cyber-cyan/30 bg-cyber-cyan/5 text-cyber-cyan text-[9px] font-bold uppercase tracking-widest hover:bg-cyber-cyan hover:text-cyber-black transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                >
                    Operator Mode
                </button>
            )}

            <div className="flex border border-cyber-blue/20 rounded overflow-hidden bg-black/40">
              <button
                onClick={() => {
                    setLanguage('en');
                    playFeedback('hover');
                }}
                className={cn(
                  "px-3 py-1.5 text-[8px] font-bold transition-colors",
                  language === 'en' ? "bg-cyber-blue/20 text-cyber-cyan" : "text-cyber-blue/40 hover:text-cyber-blue"
                )}
              >
                EN
              </button>
              <button
                onClick={() => {
                    setLanguage('ru');
                    playFeedback('hover');
                }}
                className={cn(
                  "px-3 py-1.5 text-[8px] font-bold transition-colors",
                  language === 'ru' ? "bg-cyber-blue/20 text-cyber-cyan" : "text-cyber-blue/40 hover:text-cyber-blue"
                )}
              >
                RU
              </button>
            </div>

            <div className="flex items-center gap-6 text-[9px] font-mono opacity-40 uppercase tracking-tighter">
              <span>55.75 // 37.61</span>
              <span className="w-24">UP: 00:04:12</span>
            </div>
          </div>
        </header>

        <div className="flex-1 relative overflow-auto pb-20 custom-scrollbar">
            <AnimatePresence>
                {showGuidance && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-cyber-cyan/5 border-b border-cyber-cyan/20 overflow-hidden"
                    >
                        <div className="p-8 max-w-4xl">
                            <div className="flex items-start gap-6">
                                <div className="p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 mt-1">
                                    <Info className="text-cyber-cyan" size={20} />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-cyber-cyan">Dimensional Context: {navItems.find(i => i.id === activeSection)?.label}</h3>
                                        <button onClick={() => setShowGuidance(false)} className="text-white/20 hover:text-white/60"><X size={14} /></button>
                                    </div>
                                    <p className="text-[11px] uppercase tracking-widest leading-relaxed text-white/60 font-mono">
                                        {navItems.find(i => i.id === activeSection)?.description}
                                    </p>
                                    <div className="grid grid-cols-2 gap-6 pt-2">
                                        <div className="space-y-2">
                                            <h4 className="text-[9px] font-bold text-cyber-cyan/40 uppercase tracking-widest flex items-center gap-2">
                                                <ChevronRight size={10} /> Atmospheric Profile
                                            </h4>
                                            <p className="text-[9px] text-white/40 uppercase leading-relaxed font-mono">
                                                Motion profiles, shader complexity, and pulse frequencies are uniquely tuned for this dimension.
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-[9px] font-bold text-cyber-cyan/40 uppercase tracking-widest flex items-center gap-2">
                                                <ChevronRight size={10} /> Entity Manifestation
                                            </h4>
                                            <p className="text-[9px] text-white/40 uppercase leading-relaxed font-mono">
                                                Only entities with affinity for this dimension or global affinity will be rendered here.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeSection === 'weather' && (
                    <WeatherSection
                      title={t.nav.weather}
                      description={t.nav.weather_desc}
                    />
                  )}
                  {activeSection === 'cyber' && (
                    <CyberSection />
                  )}
                  {activeSection === 'github' && (
                    <GithubSection />
                  )}
                  {activeSection === 'osint' && (
                    <OsintSection />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
        </div>

        <StatusLayer />
      </main>

      <DimensionalMorph isActive={isMorphing} />
      <CreatorPanel />
    </motion.div>
  );
}
