'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Terminal, Activity, ChevronRight } from 'lucide-react';
import { TactileButton } from '@/components/common/TactileButton';
import { useAudio } from '@/lib/audio/AudioEngine';

interface OnboardingBriefingProps {
  onComplete: () => void;
}

export const OnboardingBriefing = ({ onComplete }: OnboardingBriefingProps) => {
  const [step, setStep] = useState(0);
  const { playFeedback } = useAudio();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const steps = [
    {
      title: 'Operational Access Verified',
      icon: Shield,
      content: 'Welcome, Operator. You have been granted direct access to the NEXUS VEIL ecosystem manipulation layer. This interface allows you to inject knowledge signals and tune the atmospheric world-state.',
      details: [
        'Registry: Manage all active knowledge entities.',
        'Injection: Create new signals or sync with GitHub.',
        'Neural Mapping: Define influence propagation.',
        'Composition: Group entities into environmental clusters.'
      ]
    },
    {
      title: 'Environmental Dimensions',
      icon: Terminal,
      content: 'The ecosystem is divided into four primary dimensions. Every entity you inject must have an Affinity for a specific space.',
      details: [
        'Weather: The global atmospheric core.',
        'Cyber: Tactical threat-space (Aggressive/Jittery).',
        'GitHub: Technical infrastructure (Precise/Rhythmic).',
        'OSINT: Investigation surface (Drifting/Flowing).'
      ]
    },
    {
      title: 'Atmospheric Mutation',
      icon: Activity,
      content: 'Injected objects carry Influence. Increasing these parameters will physically mutate the ecosystem dimensions in real-time.',
      details: [
        'Tension: Affects visual stiffness and UI damping.',
        'Entropy: Drives randomness, jitter, and noise.',
        'Anomaly: Frequency of rare glitch and flash events.'
      ]
    }
  ];

  if (!isClient) return null;

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-cyber-black border border-cyber-blue/30 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="p-8 space-y-8">
          <div className="flex items-center gap-4 border-b border-cyber-blue/10 pb-6">
            <div className="p-3 bg-cyber-blue/10 border border-cyber-blue/40">
              <currentStep.icon className="text-cyber-cyan" size={24} />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-cyber-blue">Protocol // Onboarding</h2>
              <p className="text-[9px] opacity-40 uppercase font-mono tracking-tighter">Step {step + 1} of {steps.length}: {currentStep.title}</p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-[11px] uppercase tracking-widest leading-relaxed text-cyber-blue/80 font-mono">
              {currentStep.content}
            </p>

            <div className="grid grid-cols-1 gap-3">
              {currentStep.details.map((detail, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-cyber-blue/5 border border-cyber-blue/10 text-[9px] uppercase tracking-tighter opacity-60"
                >
                  <ChevronRight size={12} className="text-cyber-cyan mt-0.5" />
                  {detail}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-cyber-blue/10">
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className={`w-8 h-1 ${i === step ? 'bg-cyber-cyan shadow-[0_0_10px_cyan]' : i < step ? 'bg-cyber-blue/40' : 'bg-cyber-blue/10'}`} />
              ))}
            </div>

            <TactileButton
              onClick={() => {
                playFeedback('click');
                if (step < steps.length - 1) setStep(step + 1);
                else onComplete();
              }}
              className="px-10"
            >
              {step < steps.length - 1 ? 'Acknowledge' : 'Initialize Session'}
            </TactileButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
