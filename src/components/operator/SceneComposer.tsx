'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, Trash2, Power, Settings2, Info } from 'lucide-react';
import { useContent } from '@/lib/content/ContentEngine';
import { Scene } from '@/lib/content/schema';

export default function SceneComposer() {
  const { objects, scenes, addScene, removeScene, toggleScene } = useContent();
  const [isCreating, setIsCreating] = useState(false);
  const [newScene, setNewScene] = useState<Partial<Scene>>({
    label: '',
    description: '',
    objectIds: [],
    environmentalModifiers: { tensionMod: 0, entropyMod: 0, anomalyMod: 0 },
    active: false
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScene.label) return;

    const scene: Scene = {
      id: `scene-${Math.random().toString(36).substr(2, 9)}`,
      label: newScene.label,
      description: newScene.description || '',
      objectIds: newScene.objectIds || [],
      environmentalModifiers: newScene.environmentalModifiers || {},
      active: false
    };

    addScene(scene);
    setIsCreating(false);
    setNewScene({
      label: '',
      description: '',
      objectIds: [],
      environmentalModifiers: { tensionMod: 0, entropyMod: 0, anomalyMod: 0 },
      active: false
    });
  };

  const toggleObjectId = (id: string) => {
    const current = newScene.objectIds || [];
    if (current.includes(id)) {
      setNewScene({ ...newScene, objectIds: current.filter(oid => oid !== id) });
    } else {
      setNewScene({ ...newScene, objectIds: [...current, id] });
    }
  };

  return (
    <div className="space-y-8 font-mono">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2 opacity-60">
          <Layers size={14} /> Environmental Clusters
        </h3>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="p-2 bg-cyber-blue/10 border border-cyber-blue/20 hover:bg-cyber-blue/20 transition-all text-cyber-cyan"
        >
          <Plus size={16} />
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
                  <label className="text-[9px] uppercase opacity-40">Cluster Label</label>
                  <input
                    type="text"
                    value={newScene.label}
                    onChange={e => setNewScene({ ...newScene, label: e.target.value })}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-[10px] text-cyber-blue outline-none"
                    placeholder="E.G. DEEP_RESONANCE_ZONE"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase opacity-40">Context Description</label>
                  <input
                    type="text"
                    value={newScene.description}
                    onChange={e => setNewScene({ ...newScene, description: e.target.value })}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-2 text-[10px] text-cyber-blue outline-none"
                    placeholder="E.G. ATMOSPHERIC DRIFT REGION"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase opacity-40">Entity Enrollment</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-cyber-black/40 border border-cyber-blue/10">
                  {objects.map(obj => (
                    <button
                      key={obj.id}
                      type="button"
                      onClick={() => toggleObjectId(obj.id)}
                      className={`px-2 py-1 text-[8px] border transition-all ${newScene.objectIds?.includes(obj.id) ? 'border-cyber-cyan bg-cyber-cyan/20 text-cyber-cyan' : 'border-cyber-blue/20 opacity-40'}`}
                    >
                      {obj.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-cyber-blue/10">
                <div className="space-y-1">
                  <label className="text-[8px] uppercase opacity-40">Tension Mod</label>
                  <input type="number" step="0.05" value={newScene.environmentalModifiers?.tensionMod}
                    onChange={e => setNewScene({ ...newScene, environmentalModifiers: { ...newScene.environmentalModifiers!, tensionMod: parseFloat(e.target.value) } })}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-1 text-[10px] text-cyber-blue" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] uppercase opacity-40">Entropy Mod</label>
                  <input type="number" step="0.05" value={newScene.environmentalModifiers?.entropyMod}
                    onChange={e => setNewScene({ ...newScene, environmentalModifiers: { ...newScene.environmentalModifiers!, entropyMod: parseFloat(e.target.value) } })}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-1 text-[10px] text-cyber-blue" />
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] uppercase opacity-40">Anomaly Mod</label>
                  <input type="number" step="0.05" value={newScene.environmentalModifiers?.anomalyMod}
                    onChange={e => setNewScene({ ...newScene, environmentalModifiers: { ...newScene.environmentalModifiers!, anomalyMod: parseFloat(e.target.value) } })}
                    className="w-full bg-cyber-black border border-cyber-blue/20 p-1 text-[10px] text-cyber-blue" />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-cyber-blue/10 border border-cyber-blue/40 text-cyber-blue text-[10px] uppercase font-bold hover:bg-cyber-blue hover:text-cyber-black transition-all">
              Initialize Scene Configuration
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenes.map(scene => (
          <div key={scene.id} className={`p-4 border transition-all ${scene.active ? 'border-cyber-cyan/40 bg-cyber-cyan/5' : 'border-cyber-blue/10 bg-cyber-dark/40 opacity-60'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className={`text-[11px] font-bold uppercase tracking-widest ${scene.active ? 'text-cyber-cyan' : 'text-cyber-blue'}`}>{scene.label}</h4>
                <p className="text-[9px] opacity-40 mt-1 uppercase italic">{scene.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleScene(scene.id)} className={`p-1.5 border transition-all ${scene.active ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan' : 'border-cyber-blue/20 text-cyber-blue/40'}`}>
                  <Power size={12} />
                </button>
                <button onClick={() => removeScene(scene.id)} className="p-1.5 border border-cyber-red/20 text-cyber-red/40 hover:border-cyber-red hover:text-cyber-red transition-all">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[8px] opacity-40">
                <Settings2 size={10} />
                MODIFIERS: T:{scene.environmentalModifiers.tensionMod} E:{scene.environmentalModifiers.entropyMod} A:{scene.environmentalModifiers.anomalyMod}
              </div>
              <div className="flex items-center gap-2 text-[8px] opacity-40">
                <Info size={10} />
                ENROLLED: {scene.objectIds.length} ENTITIES
              </div>
            </div>

            {scene.active && (
              <motion.div
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mt-4 h-[1px] bg-cyber-cyan shadow-[0_0_10px_cyan]"
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
