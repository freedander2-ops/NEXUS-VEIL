'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Trash2, Plus, Zap, ShieldAlert, Activity, GitBranch } from 'lucide-react';
import { useContent } from '@/lib/content/ContentEngine';
import { Relationship, RelationshipType } from '@/lib/content/schema';

interface RelationshipMapperProps {
  onSave: (rel: Relationship) => void;
  onDelete: (id: string) => void;
}

export default function RelationshipMapper({ onSave, onDelete }: RelationshipMapperProps) {
  const { objects, relationships } = useContent();
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [type, setType] = useState<RelationshipType>('resonance');
  const [strength, setStrength] = useState(0.5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) return;

    const newRel: Relationship = {
      id: `rel-${Math.random().toString(36).substr(2, 9)}`,
      sourceId,
      targetId,
      type,
      strength,
    };
    onSave(newRel);
    setSourceId('');
    setTargetId('');
  };

  const getObjectById = (id: string) => objects.find(o => o.id === id);

  const getAffinityColor = (affinity?: string) => {
    switch (affinity) {
      case 'osint': return 'text-blue-400';
      case 'cyber': return 'text-red-400';
      case 'github': return 'text-purple-400';
      case 'global': return 'text-emerald-400';
      default: return 'text-cyber-blue';
    }
  };

  const getRelIcon = (type: RelationshipType) => {
    switch (type) {
      case 'corruption': return <ShieldAlert size={14} className="text-red-500" />;
      case 'resonance': return <Activity size={14} className="text-blue-500" />;
      case 'dependency': return <Link2 size={14} className="text-emerald-500" />;
      case 'interference': return <Zap size={14} className="text-amber-500" />;
      case 'monitoring': return <GitBranch size={14} className="text-purple-500" />;
    }
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Creation UI */}
      <form onSubmit={handleSubmit} className="p-6 bg-cyber-blue/5 border border-cyber-blue/20 space-y-6">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 opacity-60">
          <Link2 size={14} /> Establish Neural Link
        </h3>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] uppercase opacity-40">Source Entity</label>
            <select
              value={sourceId}
              onChange={e => setSourceId(e.target.value)}
              className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-[10px] text-cyber-blue outline-none focus:border-cyber-cyan"
            >
              <option value="">SELECT SOURCE</option>
              {objects.map(obj => (
                <option key={obj.id} value={obj.id}>{obj.label} {"//"} {obj.id}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] uppercase opacity-40">Target Entity</label>
            <select
              value={targetId}
              onChange={e => setTargetId(e.target.value)}
              className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-[10px] text-cyber-blue outline-none focus:border-cyber-cyan"
            >
              <option value="">SELECT TARGET</option>
              {objects.filter(obj => obj.id !== sourceId).map(obj => (
                <option key={obj.id} value={obj.id}>{obj.label} {"//"} {obj.id}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[9px] uppercase opacity-40">Link Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as RelationshipType)}
              className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-[10px] text-cyber-blue outline-none focus:border-cyber-cyan"
            >
              <option value="resonance">RESONANCE</option>
              <option value="corruption">CORRUPTION</option>
              <option value="dependency">DEPENDENCY</option>
              <option value="monitoring">MONITORING</option>
              <option value="interference">INTERFERENCE</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-[9px] uppercase opacity-40">
              <span>Link Strength</span>
              <span>{(strength * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0" max="1" step="0.05"
              value={strength}
              onChange={e => setStrength(parseFloat(e.target.value))}
              className="w-full accent-cyber-cyan"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!sourceId || !targetId}
          className="w-full py-3 bg-cyber-cyan/10 border border-cyber-cyan/40 text-cyber-cyan text-[10px] font-bold uppercase tracking-widest hover:bg-cyber-cyan hover:text-cyber-black transition-all flex items-center justify-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <Plus size={14} /> Initialize Link Protocol
        </button>
      </form>

      {/* Active Links List */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Active Ecosystem Links</h3>
        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence initial={false}>
            {relationships.map((rel) => {
              const source = getObjectById(rel.sourceId);
              const target = getObjectById(rel.targetId);
              if (!source || !target) return null;

              return (
                <motion.div
                  key={rel.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between p-3 bg-cyber-dark/40 border border-cyber-blue/10 hover:border-cyber-blue/30 transition-all group"
                >
                  <div className="flex items-center gap-4 text-[10px]">
                    <div className="flex flex-col items-end w-32">
                      <span className={getAffinityColor(source.environmentAffinity)}>{source.label}</span>
                      <span className="opacity-20 text-[8px]">{source.id}</span>
                    </div>

                    <div className="flex flex-col items-center gap-1 opacity-60">
                      {getRelIcon(rel.type)}
                      <div className="w-12 h-[1px] bg-cyber-blue/20 relative">
                        <motion.div
                          animate={{ left: ['0%', '100%'] }}
                          transition={{ duration: 2 / rel.strength, repeat: Infinity, ease: "linear" }}
                          className="absolute top-[-1px] w-1 h-1 bg-cyber-cyan rounded-full"
                        />
                      </div>
                      <span className="text-[8px] uppercase tracking-tighter">{rel.type}</span>
                    </div>

                    <div className="flex flex-col items-start w-32">
                      <span className={getAffinityColor(target.environmentAffinity)}>{target.label}</span>
                      <span className="opacity-20 text-[8px]">{target.id}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDelete(rel.id)}
                    className="p-2 text-cyber-red/40 hover:text-cyber-red hover:bg-cyber-red/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {relationships.length === 0 && (
            <div className="text-center py-12 border border-dashed border-cyber-blue/10 opacity-20 text-[10px] uppercase tracking-[0.3em]">
              No links detected // ecosystem isolated
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
