'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, ChevronRight } from 'lucide-react';
import { useEnvironment } from '@/lib/environment/state';

export default function LoginTerminal() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bootText, setBootText] = useState<string[]>([]);
  const [isBooting, setIsBooting] = useState(true);
  const { setMood, setIntensity, login } = useEnvironment();

  useEffect(() => {
    const fullBootSequence = [
      'INITIALIZING NEXUS PROTOCOL...',
      'LOADING ADAPTIVE INTERFACE...',
      'ESTABLISHING SECURE TUNNEL...',
      'DECRYPTING ENVIRONMENTAL DATA...',
      'READY FOR ACCESS.'
    ];

    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < fullBootSequence.length) {
        setBootText(prev => [...prev, fullBootSequence[currentLine]]);
        currentLine++;
      } else {
        setIsBooting(false);
        clearInterval(interval);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((username === 'guest' && password === 'guest') || (username === 'admin' && password === 'admin')) {
      setMood('alert');
      setIntensity(0.5);
      login();
    } else {
      setMood('critical');
      setIntensity(0.8);
      setTimeout(() => {
        setMood('calm');
        setIntensity(0.2);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-cyber-dark/80 border border-cyber-blue/30 p-6 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.2)]"
      >
        <div className="flex items-center gap-2 mb-6 border-b border-cyber-blue/20 pb-4">
          <Terminal className="w-5 h-5 text-cyber-blue" />
          <h1 className="text-sm font-bold tracking-widest text-cyber-blue uppercase">Nexus Veil // Terminal Access</h1>
        </div>

        {isBooting ? (
          <div className="space-y-2 h-40 font-mono text-xs text-cyber-cyan/70">
            {bootText.map((line, i) => (
              <motion.div
                key={i}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                {line}
              </motion.div>
            ))}
            <motion.div
              animate={{ opacity: [0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-cyber-cyan/70 align-middle"
            />
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-tighter text-cyber-blue/60 font-bold">Identifier</label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-cyber-blue focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
                    placeholder="ENTER ID"
                  />
                  <ChevronRight className="absolute right-2 top-2.5 w-4 h-4 text-cyber-blue/30" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-tighter text-cyber-blue/60 font-bold">Passkey</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-cyber-blue focus:outline-none focus:border-cyber-cyan transition-colors font-mono"
                    placeholder="ENTER PASSKEY"
                  />
                  <Shield className="absolute right-2 top-2.5 w-4 h-4 text-cyber-blue/30" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-cyber-blue/10 border border-cyber-blue/50 p-3 text-cyber-blue font-bold tracking-[0.2em] uppercase text-xs hover:bg-cyber-blue hover:text-cyber-black transition-all group"
            >
              Authorize Session
            </button>

            <div className="mt-4 pt-4 border-t border-cyber-blue/10 flex justify-between text-[10px] text-cyber-blue/40 font-mono">
              <span>SYSTEM: ONLINE</span>
              <span>VER: 0.1.0-ALPHA</span>
            </div>
          </form>
        )}
      </motion.div>

      <div className="mt-8 text-[10px] text-cyber-blue/20 font-mono uppercase tracking-[0.3em]">
        Environmental monitoring active
      </div>
    </div>
  );
}
