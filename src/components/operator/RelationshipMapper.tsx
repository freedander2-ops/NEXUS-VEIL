'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Trash2, Plus, Zap, ShieldAlert, Activity, GitBranch, AlertTriangle, Info } from 'lucide-react';
import { useContent } from '@/lib/content/ContentEngine';
import { Relationship, RelationshipType } from '@/lib/content/schema';
import { Tooltip } from '@/components/common/Tooltip';
import { useAudio } from '@/lib/audio/AudioEngine';

interface RelationshipMapperProps {
  onSave: (rel: Relationship) => void;
  onDelete: (id: string) => void;
}

export default function RelationshipMapper({ onSave, onDelete }: RelationshipMapperProps) {
  const { objects, relationships } = useContent();
  const { playFeedback } = useAudio();

  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [type, setType] = useState<RelationshipType>('resonance');
  const [strength, setStrength] = useState(0.4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) {
        playFeedback('anomaly');
        return;
    }

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
    playFeedback('success');
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

  const getRelDescription = (type: RelationshipType) => {
    switch (type) {
      case 'resonance': return 'Mutual amplification. Tension and Anomaly signals are shared and boosted.';
      case 'corruption': return 'Destabilizing path. Influence from origin causes entropy spikes in destination.';
      case 'dependency': return 'Structural reliance. Destination stability is directly tied to origin status.';
      case 'monitoring': return 'Observation link. Low-impact data sync with minimal world-state distortion.';
      case 'interference': return 'Systemic friction. Opposing signals cause increased noise and jitter.';
    }
  };

  const existingRel = relationships.find(r =>
    (r.sourceId === sourceId && r.targetId === targetId) ||
    (r.sourceId === targetId && r.targetId === sourceId)
  );

  return (
    <div className="space-y-10 font-mono">
      {/* Creation UI */}
      <form onSubmit={handleSubmit} className="p-8 bg-cyber-blue/5 border border-cyber-blue/20 space-y-8">
        <div className="flex justify-between items-center border-b border-cyber-blue/10 pb-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-3 text-cyber-blue">
                <Link2 size={16} className="text-cyber-cyan" /> Establish Neural Link
            </h3>
            <Tooltip content="Links define how environmental influence propagates between entities in the ecosystem graph." />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
                <label className="text-[9px] uppercase opacity-40 font-bold tracking-widest">Origin Node</label>
                <Tooltip content="The source of atmospheric influence. Changes here propagate to the target." />
            </div>
            <select
              value={sourceId}
              onChange={e => setSourceId(e.target.value)}
              className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-[10px] text-cyber-blue outline-none focus:border-cyber-cyan transition-all cursor-pointer uppercase tracking-widest"
            >
              <option value="">SELECT ORIGIN</option>
              {objects.map(obj => (
                <option key={obj.id} value={obj.id}>{obj.label} {"//"} {obj.id.slice(-6)}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
                <label className="text-[9px] uppercase opacity-40 font-bold tracking-widest">Destination Node</label>
                <Tooltip content="The entity receiving the propagated influence." />
            </div>
            <select
              value={targetId}
              onChange={e => setTargetId(e.target.value)}
              className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-[10px] text-cyber-blue outline-none focus:border-cyber-cyan transition-all cursor-pointer uppercase tracking-widest"
            >
              <option value="">SELECT DESTINATION</option>
              {objects.filter(obj => obj.id !== sourceId).map(obj => (
                <option key={obj.id} value={obj.id}>{obj.label} {"//"} {obj.id.slice(-6)}</option>
              ))}
            </select>
          </div>
        </div>

        {existingRel && (
            <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[9px] uppercase tracking-widest font-bold"
            >
                <AlertTriangle size={18} />
                <span>Conflict: A neural link already exists between these entities. Duplicate mapping blocked.</span>
            </motion.div>
        )}

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
                <label className="text-[9px] uppercase opacity-40 font-bold tracking-widest">Link Modality</label>
                <Tooltip content="Determines the semantic behavior and visual language of the propagation." />
            </div>
            <select
              value={type}
              onChange={e => setType(e.target.value as RelationshipType)}
              className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-[10px] text-cyber-blue outline-none focus:border-cyber-cyan cursor-pointer uppercase tracking-widest"
            >
              <option value="resonance">RESONANCE (AMPLIFICATION)</option>
              <option value="corruption">CORRUPTION (DECAY)</option>
              <option value="dependency">DEPENDENCY (HIERARCHY)</option>
              <option value="monitoring">MONITORING (PASSIVE)</option>
              <option value="interference">INTERFERENCE (NOISE)</option>
            </select>
            <p className="text-[8px] opacity-30 italic leading-relaxed uppercase tracking-tighter">
                {getRelDescription(type)}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                  <label className="text-[9px] uppercase opacity-40 font-bold tracking-widest">Propagation Strength</label>
                  <Tooltip content="Controls how strongly influence is carried across this path. Rec: 0.2 - 0.6" />
              </div>
              <span className="text-cyber-cyan font-bold font-mono">{(strength * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.05" max="1" step="0.05"
              value={strength}
              onChange={e => setStrength(parseFloat(e.target.value))}
              className="w-full accent-cyber-cyan"
            />
            <div className="flex justify-between text-[7px] opacity-20 uppercase font-bold tracking-widest">
                <span>Minimal</span>
                <span>Maximum Influence</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-cyber-blue/10 flex flex-col gap-4">
            <div className="flex items-start gap-4 p-4 bg-cyber-blue/5 border border-cyber-blue/10">
                <Info size={20} className="text-cyber-blue mt-0.5 shrink-0 opacity-40" />
                <p className="text-[8px] opacity-40 leading-relaxed uppercase tracking-tighter">
                    Established links are bi-directional in the propagation graph but directional in semantic logic.
                    Propagation factor estimated at 0.8x depth decay.
                </p>
            </div>

            <button
                type="submit"
                disabled={!sourceId || !targetId || !!existingRel}
                className="w-full py-5 bg-cyber-cyan/10 border border-cyber-cyan/40 text-cyber-cyan text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-cyber-cyan hover:text-cyber-black transition-all flex items-center justify-center gap-4 disabled:opacity-10 disabled:grayscale disabled:cursor-not-allowed shadow-[0_0_20px_rgba(6,182,212,0.1)] active:scale-[0.98]"
            >
                <Plus size={20} /> Initialize Neural Link Protocol
            </button>
        </div>
      </form>

      {/* Active Links List */}
      <div className="space-y-5 px-1">
        <div className="flex items-center gap-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Active Ecosystem Paths</h3>
            <div className="h-[1px] flex-1 bg-cyber-blue/10" />
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar">
          <AnimatePresence initial={false} mode="popLayout">
            {relationships.map((rel) => {
              const source = getObjectById(rel.sourceId);
              const target = getObjectById(rel.targetId);
              if (!source || !target) return null;

              return (
                <motion.div
                  key={rel.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-5 bg-cyber-dark/40 border border-cyber-blue/10 hover:border-cyber-blue/30 transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center gap-6 text-[10px] relative z-10 w-full">
                    <div className="flex flex-col items-end w-40">
                      <span className={`font-bold ${getAffinityColor(source.environmentAffinity)}`}>{source.label}</span>
                      <span className="opacity-20 text-[8px] font-mono tracking-tighter uppercase">{source.id.slice(0, 12)}</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="flex items-center gap-3">
                          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-cyber-blue/20 to-cyber-blue/40" />
                          {getRelIcon(rel.type)}
                          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent via-cyber-blue/20 to-cyber-blue/40" />
                      </div>
                      <div className="w-full h-1 bg-cyber-blue/5 rounded-full relative overflow-hidden">
                        <motion.div
                          animate={{ left: ['-20%', '120%'] }}
                          transition={{ duration: 3 / Math.max(0.1, rel.strength), repeat: Infinity, ease: "linear" }}
                          className="absolute top-0 w-8 h-full bg-gradient-to-r from-transparent via-cyber-cyan/40 to-transparent"
                        />
                      </div>
                      <span className="text-[7px] uppercase tracking-[0.3em] font-bold text-cyber-blue/60">{rel.type} {"//"} {(rel.strength * 100).toFixed(0)}%</span>
                    </div>

                    <div className="flex flex-col items-start w-40">
                      <span className={`font-bold ${getAffinityColor(target.environmentAffinity)}`}>{target.label}</span>
                      <span className="opacity-20 text-[8px] font-mono tracking-tighter uppercase">{target.id.slice(0, 12)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                        onDelete(rel.id);
                        playFeedback('click');
                    }}
                    title="Terminate Neural Path"
                    className="p-3 text-cyber-red/40 hover:text-cyber-red hover:bg-cyber-red/10 transition-all opacity-0 group-hover:opacity-100 relative z-20 border border-transparent hover:border-cyber-red/20 ml-4"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="absolute top-0 right-0 w-16 h-16 bg-cyber-blue/5 -mr-8 -mt-8 rotate-45 pointer-events-none group-hover:bg-cyber-cyan/5 transition-colors" />
                </motion.div>
              );
            })}
          </AnimatePresence>
          {relationships.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-cyber-blue/10 opacity-20 text-[10px] uppercase tracking-[0.5em] font-mono space-y-4">
              <Link2 size={32} className="opacity-20" />
              <span>No neural links detected {"//"} ecosystem is currently isolated</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
