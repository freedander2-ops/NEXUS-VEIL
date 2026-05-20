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

  useEffect(() => {
    if (isAuthenticated) {
      if (role === 'operator') {
        const hasOnboarded = localStorage.getItem('nexus_veil_onboarded');
        if (!hasOnboarded) {
          setShowOnboarding(true);
        } else {
          router.push('/operator');
        }
      } else if (role === 'guest') {
        // Guests go straight to the ecosystem
        // Actually, we stay on this page which will render MainInterface
      }
    }
  }, [isAuthenticated, role, router]);

  if (isAuthenticated === null) return null;

  const handleOnboardingComplete = () => {
    localStorage.setItem('nexus_veil_onboarded', 'true');
    setShowOnboarding(false);
    router.push('/operator');
  };

  return (
    <div className="min-h-screen bg-cyber-black">
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
          <>
            {role === 'operator' && showOnboarding ? (
              <OnboardingBriefing onComplete={handleOnboardingComplete} />
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
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
