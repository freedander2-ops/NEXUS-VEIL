'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/lib/content/ContentEngine';
import { Relationship, RelationshipType } from '@/lib/content/schema';
import { useWorldState } from '@/lib/environment/WorldStateContext';

interface EcosystemLinkProps {
  relationship: Relationship;
}

const getLinkColor = (type: RelationshipType) => {
  switch (type) {
    case 'corruption': return 'stroke-red-500';
    case 'resonance': return 'stroke-blue-400';
    case 'dependency': return 'stroke-emerald-400';
    case 'interference': return 'stroke-amber-400';
    case 'monitoring': return 'stroke-purple-400';
    default: return 'stroke-blue-500/30';
  }
};

const LinkVisual = ({ relationship }: EcosystemLinkProps) => {
  const isCorruption = relationship.type === 'corruption';

  return (
    <div className="h-4 flex items-center gap-2 overflow-hidden px-2">
      <div className={`w-1 h-1 rounded-full bg-current shrink-0 ${isCorruption ? 'animate-pulse text-red-500' : ''}`} />
      <div className="flex-1 h-[1px] bg-white/5 relative">
        <motion.div
          initial={{ left: '-20%' }}
          animate={{ left: '120%' }}
          transition={{
            duration: 1.5 / relationship.strength,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2
          }}
          className={`absolute top-0 h-full w-1/4 bg-gradient-to-r from-transparent via-current to-transparent opacity-40 ${getLinkColor(relationship.type).replace('stroke-', 'text-')}`}
        />
        {isCorruption && (
          <motion.div
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-red-500/10 blur-[1px]"
          />
        )}
      </div>
      <div className={`w-1 h-1 rounded-full border border-current shrink-0 ${isCorruption ? 'border-red-500' : ''}`} />
    </div>
  );
};

export const EcosystemConnections = ({ affinity }: { affinity: string }) => {
  const { objects, relationships } = useContent();
  const { state: worldState } = useWorldState();

  // Reveal threshold: connections only appear if global tension is high or specific relationship types
  // Corruption is always slightly visible, others reveal as tension rises
  const revealThreshold = 0.35;

  const filteredRelationships = relationships.filter(rel => {
    const source = objects.find(o => o.id === rel.sourceId);
    const target = objects.find(o => o.id === rel.targetId);
    if (!source || !target) return false;

    const isRelevant = source.environmentAffinity === affinity || target.environmentAffinity === affinity;
    if (!isRelevant) return false;

    // Atmospheric visibility logic
    if (rel.type === 'corruption') return true;
    return worldState.tension > revealThreshold || rel.strength > 0.8;
  });

  if (filteredRelationships.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-2 py-4 border-t border-white/5 mt-4"
    >
      <div className="flex justify-between items-center mb-2 px-1">
        <div className="text-[8px] uppercase tracking-[0.2em] opacity-30 font-bold">Neural Link Layer</div>
        <div className="text-[7px] font-mono opacity-20">SYNC_ID: {affinity.toUpperCase()}</div>
      </div>
      <div className="grid grid-cols-1 gap-1">
        <AnimatePresence>
          {filteredRelationships.slice(0, 5).map(rel => ( // Limit density for restraint
            <motion.div
              key={rel.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col group"
            >
              <div className="flex justify-between items-center text-[7px] uppercase tracking-tighter opacity-40 group-hover:opacity-60 transition-opacity px-1 font-mono">
                <span>{objects.find(o => o.id === rel.sourceId)?.label}</span>
                <span className={`${getLinkColor(rel.type).replace('stroke-', 'text-')} text-[6px]`}>{rel.type}</span>
                <span>{objects.find(o => o.id === rel.targetId)?.label}</span>
              </div>
              <LinkVisual relationship={rel} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
