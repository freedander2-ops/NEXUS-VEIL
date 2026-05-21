'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const DimensionalMorph = ({ isActive }: { isActive: boolean }) => {
  const [shards, setShards] = useState<number[]>([]);

  useEffect(() => {
    setShards(Array.from({ length: 12 }, (_, i) => i));
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, times: [0, 0.4, 1] }}
          className="fixed inset-0 z-[100] pointer-events-none bg-white"
          style={{ mixBlendMode: 'exclusion' }}
        >
          {/* Shattering shards */}
          <div className="absolute inset-0 overflow-hidden">
            {shards.map((i) => (
              <motion.div
                key={i}
                initial={{
                  x: (i % 3 * 30 - 30) + '%',
                  y: (Math.floor(i / 3) * 20 - 40) + '%',
                  rotate: 0,
                  scale: 0,
                  opacity: 0
                }}
                animate={{
                  x: [null, (i % 3 * 60 - 60) + '%'],
                  y: [null, (Math.floor(i / 3) * 40 - 80) + '%'],
                  rotate: [0, i * 45],
                  scale: [0, 2, 0],
                  opacity: [0, 0.8, 0]
                }}
                transition={{ duration: 1, ease: "circOut", delay: i * 0.05 }}
                className="absolute w-64 h-64 border border-black/20 bg-black/5"
                style={{
                  clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                  left: '50%',
                  top: '50%',
                }}
              />
            ))}
          </div>

          <motion.div
            animate={{
              opacity: [0, 0.4, 0.2, 0.6, 0],
              x: [-10, 10, -5, 0],
              filter: ["blur(0px)", "blur(10px)", "blur(0px)"]
            }}
            transition={{ duration: 0.6, ease: "linear" }}
            className="absolute inset-0 bg-cyber-cyan/20"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
