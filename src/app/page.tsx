'use client';

import LoginTerminal from '@/components/auth/LoginTerminal';
import MainInterface from '@/components/layout/MainInterface';
import { useEnvironment } from '@/lib/environment/state';
import { AnimatePresence, motion } from 'framer-motion';

export default function Home() {
  const { isAuthenticated } = useEnvironment();

  if (isAuthenticated === null) return null;

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoginTerminal />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <MainInterface />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
