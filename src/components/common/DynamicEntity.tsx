'use client';

import React from 'react';
import { KnowledgeObject } from '@/lib/content/schema';
import { useContent } from '@/lib/content/ContentEngine';
import { useAudio } from '@/lib/audio/AudioEngine';

interface DynamicEntityProps {
  object: KnowledgeObject;
}

export const DynamicEntity = ({ object }: DynamicEntityProps) => {
  const { triggerObjectInfluence } = useContent();
  const { playFeedback } = useAudio();

  const handleInteraction = () => {
      playFeedback('click');
      triggerObjectInfluence(object.id);
  };

  const getAffinityStyle = () => {
    switch(object.environmentAffinity) {
        case 'cyber': return 'border-cyber-red/20 bg-cyber-red/5 hover:bg-cyber-red/10 text-cyber-red/60';
        case 'github': return 'border-white/20 bg-white/5 hover:bg-white/10 text-white/60';
        default: return 'border-cyber-blue/20 bg-cyber-blue/5 hover:bg-cyber-blue/10 text-cyber-blue/60';
    }
  };

  return (
    <div
      onClick={handleInteraction}
      onMouseEnter={() => playFeedback('hover')}
      className={`border-l-2 pl-4 py-3 transition-all cursor-crosshair group relative overflow-hidden ${getAffinityStyle()}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700" />
      <div className="relative z-10">
        <div className="text-[9px] uppercase tracking-[0.2em] opacity-40 mb-1 group-hover:opacity-100 transition-opacity font-bold">
          {object.label}
        </div>
        <div className="font-mono text-xs text-white/80 flex justify-between items-center gap-4">
          <span className="truncate">{object.value}</span>
          <span className="text-[9px] italic opacity-40 group-hover:text-cyber-cyan transition-colors shrink-0">{object.status}</span>
        </div>
      </div>
    </div>
  );
};
