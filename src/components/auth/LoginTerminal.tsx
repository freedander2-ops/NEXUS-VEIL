'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, ChevronRight, User, Key, Eye } from 'lucide-react';
import { useEnvironment } from '@/lib/environment/state';
import { useWorldState } from '@/lib/environment/WorldStateContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useAudio } from '@/lib/audio/AudioEngine';

export default function LoginTerminal() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bootText, setBootText] = useState<string[]>([]);
  const [isBooting, setIsBooting] = useState(true);
  const [hasAgreed, setHasAgreed] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);

  const { setMood, setIntensity, login } = useEnvironment();
  const { state: worldState, mutateWorldState, emitWorldEvent } = useWorldState();
  const { t } = useI18n();
  const { playFeedback } = useAudio();

  useEffect(() => {
    const fullBootSequence = t.terminal.boot;
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < fullBootSequence.length) {
        setBootText(prev => [...prev, fullBootSequence[currentLine]]);
        currentLine++;
      } else {
        setIsBooting(false);
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [t.terminal.boot]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasAgreed) {
        playFeedback('anomaly');
        return;
    }

    if (username === 'admin' && password === 'admin') {
      document.cookie = "nexus_veil_auth_proxy=active; path=/; max-age=3600";
      setMood('alert');
      setIntensity(0.5);
      emitWorldEvent({ type: 'system_sync' });
      mutateWorldState({ synchronization: worldState.synchronization + 0.1 });
      login('operator');
      playFeedback('success');
    } else if (username === 'guest' && password === 'guest') {
      setMood('calm');
      setIntensity(0.3);
      login('guest');
      playFeedback('success');
    } else {
      setMood('critical');
      setIntensity(0.8);
      emitWorldEvent({ type: 'security_breach' });
      mutateWorldState({
        tension: worldState.tension + 0.1,
        entropy: worldState.entropy + 0.05
      });
      playFeedback('anomaly');
      setTimeout(() => {
        setMood('calm');
        setIntensity(0.2);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-cyber-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-cyber-dark/80 border border-cyber-blue/30 p-8 backdrop-blur-md shadow-[0_0_50px_rgba(59,130,246,0.1)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-cyan" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-cyan" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyber-cyan" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-cyan" />

        <div className="flex items-center gap-3 mb-8 border-b border-cyber-blue/10 pb-6">
          <div className="p-2 bg-cyber-blue/10 border border-cyber-blue/30">
            <Terminal className="w-5 h-5 text-cyber-cyan" />
          </div>
          <div>
            <h1 className="text-xs font-bold tracking-[0.4em] text-cyber-blue uppercase">{t.terminal.title}</h1>
            <p className="text-[8px] opacity-40 uppercase tracking-widest mt-1">Ecosystem Authentication Protocol</p>
          </div>
        </div>

        {isBooting ? (
          <div className="space-y-3 h-48 font-mono text-[10px] text-cyber-cyan/60 overflow-hidden">
            {bootText.map((line, i) => (
              <motion.div
                key={i}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-2"
              >
                <span className="opacity-20">[{i.toString().padStart(2, '0')}]</span>
                {line}
              </motion.div>
            ))}
            <motion.div
              animate={{ opacity: [0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-3 bg-cyber-cyan/70 align-middle ml-7"
            />
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-cyber-blue/60 font-bold flex items-center gap-2">
                        <User size={10} /> {t.terminal.identifier}
                    </label>
                    <span className="text-[7px] opacity-20 uppercase font-mono">[GUEST / ADMIN]</span>
                </div>
                <div className="relative">
                  <input
                    autoFocus
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            passwordRef.current?.focus();
                            playFeedback('hover');
                        }
                    }}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-[10px] text-cyber-blue focus:outline-none focus:border-cyber-cyan transition-all font-mono uppercase tracking-widest"
                    placeholder={t.terminal.placeholder_id}
                  />
                  <ChevronRight className="absolute right-3 top-3.5 w-4 h-4 text-cyber-blue/20" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-cyber-blue/60 font-bold flex items-center gap-2">
                        <Key size={10} /> {t.terminal.passkey}
                    </label>
                    <span className="text-[7px] opacity-20 uppercase font-mono">[GUEST / ADMIN]</span>
                </div>
                <div className="relative">
                  <input
                    ref={passwordRef}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-[10px] text-cyber-blue focus:outline-none focus:border-cyber-cyan transition-all font-mono tracking-widest"
                    placeholder={t.terminal.placeholder_pass}
                  />
                  <Shield className="absolute right-3 top-3.5 w-4 h-4 text-cyber-blue/20" />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-cyber-blue/5 border border-cyber-blue/10 group cursor-pointer" onClick={() => {
                setHasAgreed(!hasAgreed);
                playFeedback('hover');
            }}>
              <div className={`w-4 h-4 mt-0.5 border flex items-center justify-center transition-all ${hasAgreed ? 'border-cyber-cyan bg-cyber-cyan/20' : 'border-cyber-blue/30 group-hover:border-cyber-blue'}`}>
                  {hasAgreed && <div className="w-1.5 h-1.5 bg-cyber-cyan shadow-[0_0_5px_cyan]" />}
              </div>
              <label className="text-[8px] text-cyber-blue/50 leading-relaxed uppercase tracking-widest cursor-pointer select-none">
                I acknowledge that this ecosystem observes digital patterns for atmospheric simulation.
                All data is handled according to international privacy principles.
              </label>
            </div>

            <button
              type="submit"
              disabled={!hasAgreed}
              className="w-full bg-cyber-cyan/10 border border-cyber-cyan/30 p-4 text-cyber-cyan font-bold tracking-[0.4em] uppercase text-[10px] enabled:hover:bg-cyber-cyan enabled:hover:text-cyber-black transition-all group disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <Eye size={16} />
              {t.terminal.authorize}
            </button>

            <div className="mt-6 pt-6 border-t border-cyber-blue/10 flex justify-between text-[8px] text-cyber-blue/30 font-mono tracking-[0.2em] uppercase">
              <span>{t.terminal.status}</span>
              <span>{t.terminal.version}</span>
            </div>
          </form>
        )}
      </motion.div>

      <div className="mt-12 text-[8px] text-cyber-blue/10 font-mono uppercase tracking-[0.5em] animate-pulse">
        {t.terminal.monitoring}
      </div>
    </div>
  );
}
