'use client';

import React from 'react';
import { KnowledgeObject } from '@/lib/content/schema';
import { useContent } from '@/lib/content/ContentEngine';

interface DynamicEntityProps {
  object: KnowledgeObject;
}

export const DynamicEntity = ({ object }: DynamicEntityProps) => {
  const { triggerObjectInfluence } = useContent();

  return (
    <div
      onClick={() => triggerObjectInfluence(object.id)}
      className="border-l border-blue-500/20 pl-4 py-2 bg-blue-900/5 hover:bg-blue-800/10 transition-colors cursor-crosshair group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
      <div className="relative z-10">
        <div className="text-[10px] uppercase tracking-widest text-blue-400/40 mb-1 group-hover:text-blue-300 transition-colors">
          {object.label}
        </div>
        <div className="font-mono text-sm text-blue-100/90 flex justify-between items-center">
          <span>{object.value}</span>
          <span className="text-[10px] text-blue-500/30 italic group-hover:text-blue-400/60">{object.status}</span>
        </div>
      </div>
    </div>
  );
};
