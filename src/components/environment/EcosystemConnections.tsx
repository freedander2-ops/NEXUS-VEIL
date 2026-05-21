'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/lib/content/ContentEngine';
import { useWorldState } from '@/lib/environment/WorldStateContext';

export const EcosystemConnections = () => {
  const { relationships, objects } = useContent();
  const { state } = useWorldState();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const visibleLinks = useMemo(() => {
    if (!isClient) return [];
    if (state.tension < 0.3 && state.anomalyLevel < 0.1) return [];

    return relationships.slice(0, 5).map(rel => {
      const source = objects.find(o => o.id === rel.sourceId);
      const target = objects.find(o => o.id === rel.targetId);
      if (!source || !target) return null;
      return { ...rel, source, target };
    }).filter((link): link is NonNullable<typeof link> => link !== null);
  }, [relationships, objects, state.tension, state.anomalyLevel, isClient]);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-5">
      <svg className="w-full h-full">
        <AnimatePresence>
          {visibleLinks.map((link) => (
            <motion.line
              key={link.id}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: 0.2, pathLength: 1 }}
              exit={{ opacity: 0 }}
              x1="50%" y1="50%"
              x2="40%" y2="40%"
              stroke={state.corruption > 0.5 ? '#ef4444' : '#06b6d4'}
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          ))}
        </AnimatePresence>
      </svg>
    </div>
  );
};
