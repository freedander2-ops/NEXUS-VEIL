'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ghost, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = ({ message, actionLabel, onAction, className }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex flex-col items-center justify-center py-20 px-6 border border-dashed border-cyber-blue/10 bg-cyber-blue/5 rounded-sm text-center",
        className
      )}
    >
      <div className="p-4 bg-cyber-blue/10 border border-cyber-blue/20 mb-6 relative">
        <Ghost size={32} className="text-cyber-blue/20" />
        <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 flex items-center justify-center"
        >
            <Ghost size={32} className="text-cyber-cyan/40" />
        </motion.div>
      </div>

      <p className="text-[10px] uppercase tracking-[0.4em] text-cyber-blue/40 font-mono mb-8 max-w-xs leading-relaxed">
        {message}
      </p>

      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="flex items-center gap-2 px-6 py-2 border border-cyber-cyan/40 bg-cyber-cyan/10 text-cyber-cyan text-[10px] uppercase font-bold hover:bg-cyber-cyan hover:text-cyber-black transition-all tracking-widest"
        >
          <Plus size={14} />
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};
