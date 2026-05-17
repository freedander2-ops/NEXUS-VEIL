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
import { cn } from '@/lib/utils';
import SectionPlaceholder from '@/components/sections/SectionPlaceholder';

type Section = 'weather' | 'cyber' | 'github' | 'osint';

export default function MainInterface() {
  const { logout, mood, intensity } = useEnvironment();
  const [activeSection, setActiveSection] = useState<Section>('weather');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { id: 'weather', label: 'Digital Weather', icon: Cloud },
    { id: 'cyber', label: 'Cybersecurity', icon: ShieldAlert },
    { id: 'github', label: 'GitHub Signals', icon: GitBranch },
    { id: 'osint', label: 'OSINT Layer', icon: LocateFixed },
  ];

  return (
    <div className="flex h-screen overflow-hidden text-cyber-blue">
      {/* Sidebar Navigation */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="relative z-20 flex flex-col bg-cyber-dark/40 border-r border-cyber-blue/10 backdrop-blur-xl"
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
                onClick={() => setActiveSection(item.id as Section)}
                className={cn(
                  "w-full flex items-center gap-4 p-3 rounded-sm transition-all group relative overflow-hidden",
                  isActive ? "bg-cyber-blue/10 text-cyber-cyan" : "hover:bg-cyber-blue/5 text-cyber-blue/60"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-1 h-full bg-cyber-cyan"
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
                Pulse: {(intensity * 100).toFixed(0)}% // {mood}
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 p-3 text-cyber-red/60 hover:bg-cyber-red/10 hover:text-cyber-red transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-[10px] uppercase tracking-widest font-bold">Disconnect</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-auto">
        <header className="h-16 flex items-center px-8 border-b border-cyber-blue/5 bg-cyber-dark/20 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex-1">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-cyber-blue/40">
              Environment // <span className="text-cyber-blue">{navItems.find(i => i.id === activeSection)?.label}</span>
            </h2>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-mono opacity-40 uppercase">
            <span>Lat: 55.75 // Lon: 37.61</span>
            <span>Uptime: 00:04:12</span>
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
                <SectionPlaceholder
                  title="Digital Weather"
                  description="Real-time atmospheric synchronization and environmental mood parameters. Monitoring planetary digital pulse and network instability."
                />
              )}
              {activeSection === 'cyber' && (
                <SectionPlaceholder
                  title="Cybersecurity"
                  description="Threat landscape monitoring, CVE feed aggregation, and proactive anomaly detection in the global network infrastructure."
                />
              )}
              {activeSection === 'github' && (
                <SectionPlaceholder
                  title="GitHub Signals"
                  description="Pulse monitoring of the open-source ecosystem. Tracking trending repositories, security advisories, and emergent tech patterns."
                />
              )}
              {activeSection === 'osint' && (
                <SectionPlaceholder
                  title="OSINT Layer"
                  description="Public information exploration and network graph visualization. Lawful observation of internet nodes and metadata clusters."
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
