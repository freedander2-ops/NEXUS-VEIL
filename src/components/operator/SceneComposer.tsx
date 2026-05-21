'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, Trash2, Power, Settings2, Info, X, AlertTriangle } from 'lucide-react';
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
    playFeedback('success');
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

  const isDestabilizing =
    (newScene.environmentalModifiers?.tensionMod || 0) > 0.4 ||
    (newScene.environmentalModifiers?.anomalyMod || 0) > 0.3;

  return (
    <div className="space-y-10 font-mono">
      <div className="flex justify-between items-center border-b border-cyber-blue/10 pb-4">
        <div className="flex items-center gap-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyber-blue">
              <Layers size={16} className="text-cyber-cyan" /> Environmental Clusters
            </h3>
            <Tooltip content="Scenes allow you to group entities and apply persistent global atmospheric modifiers." />
        </div>
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
          className="p-2 bg-cyber-blue/10 border border-cyber-blue/20 hover:bg-cyber-blue/20 transition-all text-cyber-cyan flex items-center gap-2 px-4"
        >
          {isCreating ? <X size={16} /> : <Plus size={16} />}
          <span className="text-[9px] font-bold uppercase tracking-widest">{isCreating ? 'Cancel' : 'New Cluster'}</span>
        </button>
      </div>

      <AnimatePresence>
        {isCreating && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleCreate}
            className="p-8 bg-cyber-blue/5 border border-cyber-blue/20 space-y-8 overflow-hidden relative"
          >
            {isDestabilizing && (
                <div className="flex items-center gap-4 p-4 bg-cyber-red/10 border border-cyber-red/40 text-cyber-red text-[9px] uppercase tracking-widest font-bold mb-4">
                    <AlertTriangle size={18} />
                    <span>Extreme Cluster Modifiers: Activating this scene may cause systemic instability.</span>
                </div>
            )}

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[9px] uppercase opacity-40 font-bold tracking-widest">Cluster Label</label>
                  <input
                    type="text"
                    value={newScene.label || ''}
                    onChange={e => setNewScene({ ...newScene, label: e.target.value })}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-[10px] text-cyber-blue outline-none focus:border-cyber-cyan transition-all font-mono uppercase"
                    placeholder="E.G. DEEP_RESONANCE_ZONE"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] uppercase opacity-40 font-bold tracking-widest">Functional Context</label>
                  <input
                    type="text"
                    value={newScene.description || ''}
                    onChange={e => setNewScene({ ...newScene, description: e.target.value })}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-[10px] text-cyber-blue outline-none focus:border-cyber-cyan transition-all font-mono uppercase"
                    placeholder="E.G. ATMOSPHERIC DRIFT REGION"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <label className="text-[9px] uppercase opacity-40 font-bold tracking-widest">Entity Enrollment</label>
                    <Tooltip content="Entities grouped into this scene will share its environmental modifiers when active." />
                </div>
                <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto p-4 bg-cyber-black/40 border border-cyber-blue/10 custom-scrollbar">
                  {objects.map(obj => (
                    <button
                      key={obj.id}
                      type="button"
                      onClick={() => toggleObjectId(obj.id)}
                      className={`px-3 py-3 text-[8px] border transition-all text-left flex flex-col gap-1 ${newScene.objectIds?.includes(obj.id) ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]' : 'border-cyber-blue/10 opacity-30 hover:opacity-100 hover:border-cyber-blue/40'}`}
                    >
                      <span className="truncate font-bold uppercase">{obj.label}</span>
                      <span className="text-[6px] opacity-40 font-mono tracking-tighter">{obj.environmentAffinity} {"//"} {obj.id.slice(-6)}</span>
                    </button>
                  ))}
                  {objects.length === 0 && (
                      <div className="col-span-3 text-center py-10 opacity-20 text-[8px] uppercase tracking-[0.4em]">NO ENTITIES REGISTERED IN REGISTRY</div>
                  )}
                </div>
                <p className="text-[7px] opacity-30 italic uppercase tracking-widest">Selected Entities: {newScene.objectIds?.length || 0}</p>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-cyber-blue/10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="text-[9px] uppercase opacity-40 font-bold tracking-widest text-cyber-blue">Tension Mod</label>
                    <Tooltip content="Added to global tension when this scene is enabled. Rec: -0.1 to 0.2" />
                  </div>
                  <input type="number" step="0.01" value={newScene.environmentalModifiers?.tensionMod || 0}
                    onChange={e => setNewScene({ ...newScene, environmentalModifiers: { ...newScene.environmentalModifiers!, tensionMod: parseFloat(e.target.value) } })}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-[10px] text-cyber-blue outline-none focus:border-cyber-cyan transition-all" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="text-[9px] uppercase opacity-40 font-bold tracking-widest text-cyber-blue">Entropy Mod</label>
                    <Tooltip content="Added to global entropy when this scene is enabled. Rec: 0.0 to 0.15" />
                  </div>
                  <input type="number" step="0.01" value={newScene.environmentalModifiers?.entropyMod || 0}
                    onChange={e => setNewScene({ ...newScene, environmentalModifiers: { ...newScene.environmentalModifiers!, entropyMod: parseFloat(e.target.value) } })}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-[10px] text-cyber-blue outline-none focus:border-cyber-cyan transition-all" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <label className="text-[9px] uppercase opacity-40 font-bold tracking-widest text-cyber-blue">Anomaly Mod</label>
                    <Tooltip content="Added to anomaly level when this scene is enabled. Rec: 0.0 to 0.1" />
                  </div>
                  <input type="number" step="0.01" value={newScene.environmentalModifiers?.anomalyMod || 0}
                    onChange={e => setNewScene({ ...newScene, environmentalModifiers: { ...newScene.environmentalModifiers!, anomalyMod: parseFloat(e.target.value) } })}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-3 text-[10px] text-cyber-blue outline-none focus:border-cyber-cyan transition-all" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
                <div className="flex items-start gap-4 p-4 bg-cyber-blue/5 border border-cyber-blue/10">
                    <Info size={20} className="text-cyber-blue mt-0.5 shrink-0 opacity-40" />
                    <p className="text-[8px] opacity-40 leading-relaxed uppercase tracking-tighter">
                        Active clusters periodically pulse their modifiers into the world-state.
                        Enable a scene to begin environmental mutation.
                    </p>
                </div>
                <button type="submit" className="w-full py-5 bg-cyber-cyan/10 border border-cyber-cyan/40 text-cyber-cyan text-[10px] uppercase font-bold hover:bg-cyber-cyan hover:text-cyber-black transition-all tracking-[0.4em] shadow-[0_0_20px_rgba(6,182,212,0.1)] active:scale-[0.98]">
                    Initialize Scene Configuration
                </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
        {scenes.map(scene => (
          <div key={scene.id} className={`p-6 border transition-all relative overflow-hidden group ${scene.active ? 'border-cyber-cyan bg-cyber-cyan/5 shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-cyber-blue/10 bg-cyber-dark/40 opacity-60 hover:opacity-100 hover:border-cyber-blue/30'}`}>
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <h4 className={`text-xs font-bold uppercase tracking-[0.2em] ${scene.active ? 'text-cyber-cyan text-glow-cyan' : 'text-cyber-blue'}`}>{scene.label}</h4>
                <p className="text-[9px] opacity-40 mt-1 uppercase italic tracking-tighter font-mono">{scene.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setNewScene(scene);
                    setIsCreating(true);
                    playFeedback('click');
                  }}
                  title="Configure Scene"
                  className="p-2 border border-cyber-blue/20 text-cyber-blue/40 hover:text-cyber-blue hover:bg-cyber-blue/10 transition-all"
                >
                  <Settings2 size={14} />
                </button>
                <button
                  onClick={() => {
                    onToggle(scene.id);
                    playFeedback('click');
                  }}
                  title={scene.active ? "Deactivate Cluster" : "Activate Cluster"}
                  className={`p-2 border transition-all ${scene.active ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'border-cyber-blue/20 text-cyber-blue/40 hover:border-cyber-blue'}`}
                >
                  <Power size={14} />
                </button>
                <button
                  onClick={() => {
                    onDelete(scene.id);
                    playFeedback('click');
                  }}
                  title="Dissolve Cluster"
                  className="p-2 border border-cyber-red/20 text-cyber-red/40 hover:border-cyber-red hover:bg-cyber-red/10 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3 text-[8px] opacity-50 uppercase tracking-widest font-bold">
                <Settings2 size={12} className="text-cyber-cyan" />
                <span>MODS: T:{`${(scene.environmentalModifiers.tensionMod || 0) > 0 ? '+' : ''}${scene.environmentalModifiers.tensionMod || 0}`} E:{`${(scene.environmentalModifiers.entropyMod || 0) > 0 ? '+' : ''}${scene.environmentalModifiers.entropyMod || 0}`} A:{`${(scene.environmentalModifiers.anomalyMod || 0) > 0 ? '+' : ''}${scene.environmentalModifiers.anomalyMod || 0}`}</span>
              </div>
              <div className="flex items-center gap-3 text-[8px] opacity-50 uppercase tracking-widest font-bold">
                <Info size={12} className="text-cyber-blue" />
                <span>ENROLLED: {scene.objectIds.length} ENTITIES REGISTERED</span>
              </div>
            </div>

            {scene.active && (
              <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1], width: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mt-6 h-[1px] bg-cyber-cyan shadow-[0_0_15px_cyan] mx-auto opacity-20"
              />
            )}

            <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-blue/5 -mr-12 -mt-12 rotate-45 pointer-events-none group-hover:bg-cyber-cyan/5 transition-colors" />
          </div>
        ))}
      </div>

      {scenes.length === 0 && !isCreating && (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-cyber-blue/10 opacity-20 text-[10px] uppercase tracking-[0.5em] space-y-6 font-mono">
          <Layers size={40} className="opacity-10" />
          <span>No environmental clusters active {"//"} standby for composition</span>
        </div>
      )}
    </div>
  );
}
