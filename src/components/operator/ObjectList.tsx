'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, Trash2, Edit3, Globe, ShieldAlert, GitBranch, Terminal } from 'lucide-react';
import { KnowledgeObject, EnvironmentAffinity } from '@/lib/content/schema';
import { EmptyState } from '@/components/common/EmptyState';
import { useAudio } from '@/lib/audio/AudioEngine';

interface ObjectListProps {
  objects: KnowledgeObject[];
  onEdit: (obj: KnowledgeObject) => void;
  onDelete: (id: string) => void;
  onPreview: (obj: KnowledgeObject) => void;
  onCreateRequested: () => void;
}

export const ObjectList = ({ objects, onEdit, onDelete, onPreview, onCreateRequested }: ObjectListProps) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<EnvironmentAffinity | 'all'>('all');
  const { playFeedback } = useAudio();

  const filtered = objects.filter(obj => {
    const matchesSearch = obj.label.toLowerCase().includes(search.toLowerCase()) ||
                         obj.id.toLowerCase().includes(search.toLowerCase()) ||
                         obj.value.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || obj.environmentAffinity === filter;
    return matchesSearch && matchesFilter;
  });

  const getAffinityIcon = (affinity: EnvironmentAffinity) => {
    switch (affinity) {
      case 'osint': return <Globe size={14} className="text-blue-400" />;
      case 'cyber': return <ShieldAlert size={14} className="text-red-400" />;
      case 'github': return <GitBranch size={14} className="text-purple-400" />;
      case 'weather': return <Terminal size={14} className="text-emerald-400" />;
      default: return <Terminal size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Toolbar */}
      <div className="flex gap-4 p-4 bg-cyber-blue/5 border border-cyber-blue/10">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 opacity-20" size={16} />
          <input
            type="text"
            placeholder="Search signals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-cyber-black border border-cyber-blue/20 p-2 pl-10 text-[10px] uppercase tracking-widest outline-none focus:border-cyber-cyan transition-all"
          />
        </div>
        <div className="flex items-center gap-2 border border-cyber-blue/20 px-3 bg-cyber-black">
          <Filter size={14} className="opacity-20" />
          <select
            value={filter}
            onChange={(e) => {
                setFilter(e.target.value as EnvironmentAffinity | 'all');
                playFeedback('hover');
            }}
            className="bg-transparent text-[10px] uppercase tracking-widest outline-none cursor-pointer py-2"
          >
            <option value="all">All Affinities</option>
            <option value="osint">OSINT</option>
            <option value="cyber">Cyber</option>
            <option value="github">GitHub</option>
            <option value="weather">Weather</option>
            <option value="global">Global</option>
          </select>
        </div>
      </div>

      {/* List Container */}
      <div className="grid gap-2 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
        <AnimatePresence mode="popLayout">
          {filtered.map((obj) => (
            <motion.div
              layout
              key={obj.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="group relative flex items-center justify-between p-4 bg-cyber-dark/40 border border-cyber-blue/10 hover:border-cyber-blue/40 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                  {getAffinityIcon(obj.environmentAffinity)}
                  <div className={`w-[2px] h-8 ${
                    obj.environmentAffinity === 'osint' ? 'bg-blue-500/40' :
                    obj.environmentAffinity === 'cyber' ? 'bg-red-500/40' :
                    obj.environmentAffinity === 'github' ? 'bg-purple-500/40' : 'bg-slate-500/40'
                  }`} />
                </div>
                <div>
                  <div className="text-[9px] text-cyber-blue/40 uppercase tracking-tighter mb-1 font-mono">
                    {obj.id} <span className="mx-2 opacity-20">|</span> {obj.status}
                  </div>
                  <div className="text-sm font-bold text-white uppercase tracking-wider">{obj.label}</div>
                  <div className="text-[10px] opacity-60 font-mono mt-1 text-cyber-cyan font-bold">{obj.value}</div>
                </div>
              </div>

              <div className="flex gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onPreview(obj)}
                  title="Preview Manifestation"
                  className="p-3 hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => onEdit(obj)}
                  title="Modify Registry"
                  className="p-3 hover:text-cyber-blue hover:bg-cyber-blue/10 transition-colors"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => onDelete(obj.id)}
                  title="Execute Deletion"
                  className="p-3 hover:text-cyber-red hover:bg-cyber-red/10 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <EmptyState
            message={search || filter !== 'all' ? "No entities match the current surveillance filters." : "Registry empty. No knowledge signals detected in the ecosystem."}
            actionLabel={search || filter !== 'all' ? undefined : "Initiate Injection"}
            onAction={search || filter !== 'all' ? undefined : onCreateRequested}
          />
        )}
      </div>
    </div>
  );
};
