'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const DimensionalMorph = ({ isActive }: { isActive: boolean }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, times: [0, 0.5, 1] }}
          className="fixed inset-0 z-[100] pointer-events-none bg-white"
          style={{ mixBlendMode: 'exclusion' }}
        >
          <motion.div
            animate={{
              opacity: [0, 0.4, 0.2, 0.6, 0],
              x: [-2, 2, -1, 0]
            }}
            transition={{ duration: 0.4, ease: "linear" }}
            className="absolute inset-0 bg-cyber-cyan/10"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
