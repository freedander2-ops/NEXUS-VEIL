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
          style={{ mixBlendingMode: 'exclusion' }}
        >
          <motion.div
            animate={{
              clipPath: [
                'inset(0 0 0 0)',
                'inset(40% 0 50% 0)',
                'inset(10% 0 80% 0)',
                'inset(0 0 0 0)'
              ],
              x: [-10, 10, -5, 0]
            }}
            transition={{ duration: 0.4, repeat: 2 }}
            className="absolute inset-0 bg-cyber-cyan/20"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
