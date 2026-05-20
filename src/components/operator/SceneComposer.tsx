'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, Trash2, Power, Settings2, Info, X } from 'lucide-react';
import { useContent } from '@/lib/content/ContentEngine';
import { Scene } from '@/lib/content/schema';
import { Tooltip } from '@/components/common/Tooltip';
import { useAudio } from '@/lib/audio/AudioEngine';

interface SceneComposerProps {
  onSave: (scene: Scene) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const DEFAULT_MODS = {
  tensionMod: 0,
  entropyMod: 0,
  anomalyMod: 0
};

export default function SceneComposer({ onSave, onDelete, onToggle }: SceneComposerProps) {
  const { objects, scenes } = useContent();
  const { playFeedback } = useAudio();

  const [isCreating, setIsCreating] = useState(false);
  const [newScene, setNewScene] = useState<Partial<Scene>>({
    label: '',
    description: '',
    objectIds: [],
    environmentalModifiers: { ...DEFAULT_MODS },
    active: false
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScene.label) {
        playFeedback('anomaly');
        return;
    }

    const scene: Scene = {
      id: newScene.id || `scene-${Math.random().toString(36).substr(2, 9)}`,
      label: newScene.label || '',
      description: newScene.description || '',
      objectIds: newScene.objectIds || [],
      environmentalModifiers: newScene.environmentalModifiers || { ...DEFAULT_MODS },
      active: newScene.active || false
    };

    onSave(scene);
    setIsCreating(false);
    setNewScene({
      label: '',
      description: '',
      objectIds: [],
      environmentalModifiers: { ...DEFAULT_MODS },
      active: false
    });
    playFeedback('click');
  };

  const toggleObjectId = (id: string) => {
    const current = newScene.objectIds || [];
    if (current.includes(id)) {
      setNewScene({ ...newScene, objectIds: current.filter(oid => oid !== id) });
    } else {
      setNewScene({ ...newScene, objectIds: [...current, id] });
    }
    playFeedback('hover');
  };

  return (
    <div className="space-y-8 font-mono">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 opacity-60">
          <Layers size={14} /> Environmental Clusters
        </h3>
        <button
          onClick={() => {
            setIsCreating(!isCreating);
            if (!isCreating) setNewScene({
              label: '',
              description: '',
              objectIds: [],
              environmentalModifiers: { ...DEFAULT_MODS },
              active: false
            });
            playFeedback('click');
          }}
          className="p-2 bg-cyber-blue/10 border border-cyber-blue/20 hover:bg-cyber-blue/20 transition-all text-cyber-cyan"
        >
          {isCreating ? <X size={16} /> : <Plus size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleCreate}
            className="p-6 bg-cyber-blue/5 border border-cyber-blue/20 space-y-6 overflow-hidden"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase opacity-40 font-bold">Cluster Label</label>
                  <input
                    type="text"
                    value={newScene.label || ''}
                    onChange={e => setNewScene({ ...newScene, label: e.target.value })}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-[10px] text-cyber-blue outline-none focus:border-cyber-cyan"
                    placeholder="E.G. DEEP_RESONANCE_ZONE"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase opacity-40 font-bold">Context Description</label>
                  <input
                    type="text"
                    value={newScene.description || ''}
                    onChange={e => setNewScene({ ...newScene, description: e.target.value })}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-[10px] text-cyber-blue outline-none focus:border-cyber-cyan"
                    placeholder="E.G. ATMOSPHERIC DRIFT REGION"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <label className="text-[9px] uppercase opacity-40 font-bold">Entity Enrollment</label>
                    <Tooltip content="Entities grouped into this scene will share environmental modifiers." />
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 bg-cyber-black/40 border border-cyber-blue/10 custom-scrollbar">
                  {objects.map(obj => (
                    <button
                      key={obj.id}
                      type="button"
                      onClick={() => toggleObjectId(obj.id)}
                      className={`px-2 py-2 text-[8px] border transition-all text-left flex justify-between items-center ${newScene.objectIds?.includes(obj.id) ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan' : 'border-cyber-blue/10 opacity-40 hover:opacity-100 hover:border-cyber-blue/40'}`}
                    >
                      <span className="truncate mr-2 font-bold">{obj.label}</span>
                      <span className="text-[7px] opacity-40 font-mono">[{obj.id.slice(-4)}]</span>
                    </button>
                  ))}
                  {objects.length === 0 && (
                      <div className="col-span-2 text-center py-4 opacity-20 text-[8px]">NO ENTITIES REGISTERED</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-cyber-blue/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <label className="text-[8px] uppercase opacity-40 font-bold">Tension</label>
                    <Tooltip content="Added to global tension when active." />
                  </div>
                  <input type="number" step="0.01" value={newScene.environmentalModifiers?.tensionMod || 0}
                    onChange={e => setNewScene({ ...newScene, environmentalModifiers: { ...newScene.environmentalModifiers!, tensionMod: parseFloat(e.target.value) } })}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-[10px] text-cyber-blue outline-none focus:border-cyber-cyan" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <label className="text-[8px] uppercase opacity-40 font-bold">Entropy</label>
                    <Tooltip content="Added to global entropy when active." />
                  </div>
                  <input type="number" step="0.01" value={newScene.environmentalModifiers?.entropyMod || 0}
                    onChange={e => setNewScene({ ...newScene, environmentalModifiers: { ...newScene.environmentalModifiers!, entropyMod: parseFloat(e.target.value) } })}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-[10px] text-cyber-blue outline-none focus:border-cyber-cyan" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <label className="text-[8px] uppercase opacity-40 font-bold">Anomaly</label>
                    <Tooltip content="Added to anomaly level when active." />
                  </div>
                  <input type="number" step="0.01" value={newScene.environmentalModifiers?.anomalyMod || 0}
                    onChange={e => setNewScene({ ...newScene, environmentalModifiers: { ...newScene.environmentalModifiers!, anomalyMod: parseFloat(e.target.value) } })}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-[10px] text-cyber-blue outline-none focus:border-cyber-cyan" />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-cyber-blue/10 border border-cyber-blue/40 text-cyber-blue text-[10px] uppercase font-bold hover:bg-cyber-blue hover:text-cyber-black transition-all tracking-[0.2em]">
              Initialize Scene Configuration
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenes.map(scene => (
          <div key={scene.id} className={`p-4 border transition-all ${scene.active ? 'border-cyber-cyan bg-cyber-cyan/5 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-cyber-blue/10 bg-cyber-dark/40 opacity-60 hover:opacity-100 hover:border-cyber-blue/30'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className={`text-[11px] font-bold uppercase tracking-widest ${scene.active ? 'text-cyber-cyan' : 'text-cyber-blue'}`}>{scene.label}</h4>
                <p className="text-[9px] opacity-40 mt-1 uppercase italic tracking-tighter">{scene.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setNewScene(scene);
                    setIsCreating(true);
                    playFeedback('click');
                  }}
                  className="p-1.5 border border-cyber-blue/20 text-cyber-blue/40 hover:text-cyber-blue transition-all"
                  title="Edit Scene"
                >
                  <Settings2 size={12} />
                </button>
                <button onClick={() => {
                    onToggle(scene.id);
                    playFeedback('click');
                }} className={`p-1.5 border transition-all ${scene.active ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan' : 'border-cyber-blue/20 text-cyber-blue/40'}`}>
                  <Power size={12} />
                </button>
                <button onClick={() => {
                    onDelete(scene.id);
                    playFeedback('click');
                }} className="p-1.5 border border-cyber-red/20 text-cyber-red/40 hover:border-cyber-red hover:text-cyber-red transition-all">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[8px] opacity-40 uppercase tracking-widest">
                <Settings2 size={10} />
                MODS: T:{`${(scene.environmentalModifiers.tensionMod || 0) > 0 ? '+' : ''}${scene.environmentalModifiers.tensionMod || 0}`} E:{`${(scene.environmentalModifiers.entropyMod || 0) > 0 ? '+' : ''}${scene.environmentalModifiers.entropyMod || 0}`} A:{`${(scene.environmentalModifiers.anomalyMod || 0) > 0 ? '+' : ''}${scene.environmentalModifiers.anomalyMod || 0}`}
              </div>
              <div className="flex items-center gap-2 text-[8px] opacity-40 uppercase tracking-widest">
                <Info size={10} />
                ENROLLED: {scene.objectIds.length} ENTITIES
              </div>
            </div>

            {scene.active && (
              <motion.div
                animate={{ opacity: [0.2, 0.6, 0.2], width: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mt-4 h-[1px] bg-cyber-cyan shadow-[0_0_10px_cyan] mx-auto"
              />
            )}
          </div>
        ))}
      </div>

      {scenes.length === 0 && !isCreating && (
        <div className="text-center py-20 border border-dashed border-cyber-blue/10 opacity-20 text-[10px] uppercase tracking-[0.5em]">
          No active scenes // environmental default
        </div>
      )}
    </div>
  );
}
