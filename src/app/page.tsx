'use client';

import { useEffect, useState } from 'react';
import LoginTerminal from '@/components/auth/LoginTerminal';
import MainInterface from '@/components/layout/MainInterface';
import { useEnvironment } from '@/lib/environment/state';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { OnboardingBriefing } from '@/components/operator/OnboardingBriefing';

export default function Home() {
  const { isAuthenticated, role } = useEnvironment();
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'operator') {
        const hasOnboarded = localStorage.getItem('nexus_veil_onboarded');
        if (!hasOnboarded) {
          setShowOnboarding(true);
        } else {
          router.push('/operator');
        }
      }
    }
  }, [isAuthenticated, role, router]);

  if (!isClient || isAuthenticated === null) return <div className="min-h-screen bg-black" />;

  const handleOnboardingComplete = () => {
    localStorage.setItem('nexus_veil_onboarded', 'true');
    setShowOnboarding(false);
    router.push('/operator');
  };

  return (
    <div className="min-h-screen bg-cyber-black overflow-hidden relative">
      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <LoginTerminal />
          </motion.div>
        ) : (
          <motion.div
            key="auth-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full"
          >
            {role === 'operator' && showOnboarding ? (
              <OnboardingBriefing onComplete={handleOnboardingComplete} />
            ) : (
              <motion.div
                key="main"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full h-full"
              >
                <MainInterface />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Ambience Mockup */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
      </div>
    </div>
  );
}
