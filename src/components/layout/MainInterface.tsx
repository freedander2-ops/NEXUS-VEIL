'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud,
  ShieldAlert,
  GitBranch,
  LocateFixed,
  LogOut,
  Activity,
  Menu,
  X
} from 'lucide-react';
import { useEnvironment } from '@/lib/environment/state';
import { useCreator } from '@/lib/environment/creatorState';
import { useI18n } from '@/lib/i18n/I18nContext';
import { cn } from '@/lib/utils';
import WeatherSection from '@/components/sections/WeatherSection';
import CyberSection from '@/components/sections/cyber/CyberSection';
import { OsintSection } from '@/components/sections/osint/OsintSection';
import { GithubSection } from '@/components/sections/github/GithubSection';
import { CreatorPanel } from '@/components/environment/CreatorPanel';
import { DimensionalMorph } from '@/components/environment/DimensionalMorph';

type Section = 'weather' | 'cyber' | 'github' | 'osint';

export default function MainInterface() {
  const { logout, mood, intensity } = useEnvironment();
  const { setDimension } = useCreator();
  const { t, language, setLanguage } = useI18n();
  const [activeSection, setActiveSection] = useState<Section>('weather');
  const [isMorphing, setIsMorphing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'weather', label: t.nav.weather, icon: Cloud },
    { id: 'cyber', label: t.nav.cyber, icon: ShieldAlert },
    { id: 'github', label: t.nav.github, icon: GitBranch },
    { id: 'osint', label: t.nav.osint, icon: LocateFixed },
  ];

  const isCyberDimension = activeSection === 'cyber';

  return (
    <div className={cn(
      "flex h-screen overflow-hidden transition-colors duration-1000",
      isCyberDimension ? "text-cyber-red bg-cyber-black" : "text-cyber-blue"
    )}>
      {/* Sidebar Navigation */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? 260 : 80,
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
                className="text-xs font-bold tracking-[0.3em] uppercase"
              >
                Nexus Veil
              </motion.span>
            )}
          </AnimatePresence>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hover:text-cyber-cyan transition-colors">
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
                onClick={() => {
                  if (activeSection === item.id) return;
                  setIsMorphing(true);
                  setTimeout(() => {
                    setActiveSection(item.id as Section);
                    setDimension(item.id);
                  }, 400);
                  setTimeout(() => setIsMorphing(false), 800);
                }}
                className={cn(
                  "w-full flex items-center gap-4 p-3 rounded-sm transition-all group relative overflow-hidden",
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
                      isCyberDimension ? "bg-cyber-red shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "bg-cyber-cyan"
                    )}
                  />
                )}
                <Icon size={20} className={cn("shrink-0", isActive ? "text-cyber-cyan" : "group-hover:text-cyber-blue")} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-[10px] uppercase tracking-widest font-bold whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-cyber-blue/10 space-y-4">
          <div className="flex items-center gap-4 px-2 py-1">
            <Activity size={14} className="text-cyber-cyan animate-pulse" />
            {isSidebarOpen && (
              <div className="text-[8px] uppercase tracking-tighter opacity-40">
                {t.common.pulse}: {(intensity * 100).toFixed(0)}% // {t.common[mood as keyof typeof t.common]}
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 p-3 text-cyber-red/60 hover:bg-cyber-red/10 hover:text-cyber-red transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-[10px] uppercase tracking-widest font-bold">{t.nav.disconnect}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-auto">
        <header className={cn(
          "h-16 flex items-center px-8 border-b backdrop-blur-sm sticky top-0 z-10 transition-colors duration-1000",
          isCyberDimension ? "border-cyber-red/10 bg-cyber-red/5" : "border-cyber-blue/5 bg-cyber-dark/20"
        )}>
          <div className="flex-1">
            <h2 className={cn(
              "text-[10px] uppercase tracking-[0.4em] font-bold transition-colors duration-1000",
              isCyberDimension ? "text-cyber-red/40" : "text-cyber-blue/40"
            )}>
              Environment // <span className={isCyberDimension ? "text-cyber-red" : "text-cyber-blue"}>{navItems.find(i => i.id === activeSection)?.label}</span>
            </h2>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex border border-cyber-blue/20 rounded overflow-hidden">
              <button
                onClick={() => setLanguage('en')}
                className={cn(
                  "px-2 py-1 text-[8px] font-bold transition-colors",
                  language === 'en' ? "bg-cyber-blue/20 text-cyber-cyan" : "text-cyber-blue/40 hover:text-cyber-blue"
                )}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ru')}
                className={cn(
                  "px-2 py-1 text-[8px] font-bold transition-colors",
                  language === 'ru' ? "bg-cyber-blue/20 text-cyber-cyan" : "text-cyber-blue/40 hover:text-cyber-blue"
                )}
              >
                RU
              </button>
            </div>

            <div className="flex items-center gap-6 text-[10px] font-mono opacity-40 uppercase">
              <span>Lat: 55.75 // Lon: 37.61</span>
              <span>Uptime: 00:04:12</span>
            </div>
          </div>
        </header>

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
      </main>

      <DimensionalMorph isActive={isMorphing} />
      <CreatorPanel />
    </div>
  );
}
