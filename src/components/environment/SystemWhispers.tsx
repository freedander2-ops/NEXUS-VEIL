'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorldState } from '@/lib/environment/WorldStateContext';

const WHISPERS = [
  "PROTOCOL_X_LEAK_DETECTED",
  "NEURAL_PATH_UNSTABLE",
  "SIGNAL_RECOIL_ACTIVE",
  "THE_VEIL_IS_THINNING",
  "ECHO_IN_THE_GRID",
  "ANOMALY_CLUSTER_FORMING"
];

export const SystemWhispers = () => {
  const { state } = useWorldState();
  const [activeWhisper, setActiveWhisper] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Only whisper during high tension or anomaly
    if (state.tension > 0.7 || state.anomalyLevel > 0.5) {
      const interval = setInterval(() => {
        if (Math.random() > 0.8) {
          const randomWhisper = WHISPERS[Math.floor(Math.random() * WHISPERS.length)];
          setActiveWhisper(randomWhisper);
          setTimeout(() => setActiveWhisper(null), 1000);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [state.tension, state.anomalyLevel, isClient]);

  if (!isClient) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 pointer-events-none z-[110]">
      <AnimatePresence>
        {activeWhisper && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 0.3, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(5px)' }}
            className="text-[10px] font-mono text-cyber-cyan uppercase tracking-[1em] italic"
          >
            {activeWhisper}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
