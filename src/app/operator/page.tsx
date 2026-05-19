'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Terminal as TerminalIcon, Eye, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEnvironment } from '@/lib/environment/state';
import { useContent } from '@/lib/content/ContentEngine';
import { KnowledgeObject, Relationship, Scene } from '@/lib/content/schema';
import { AtmosphericPanel } from '@/components/common/AtmosphericPanel';
import KnowledgeObjectForm from '@/components/operator/KnowledgeObjectForm';
import RelationshipMapper from '@/components/operator/RelationshipMapper';
import SceneComposer from '@/components/operator/SceneComposer';
import LivePreview from '@/components/operator/LivePreview';

export default function OperatorWorkspace() {
  const { isAuthenticated } = useEnvironment();
  const router = useRouter();
  const {
    objects,
    relationships,
    scenes,
    addObject,
    removeObject,
    addRelationship,
    removeRelationship,
    addScene,
    removeScene,
    toggleScene
  } = useContent();
  const [activeTab, setActiveTab] = useState<'registry' | 'create' | 'links' | 'scenes'>('registry');
  const [editingObject, setEditingObject] = useState<KnowledgeObject | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const saveRegistry = async (
    updatedObjects: KnowledgeObject[],
    updatedRelationships: Relationship[],
    updatedScenes: Scene[]
  ) => {
    try {
      const response = await fetch('/api/registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: '1.0.0',
          objects: updatedObjects,
          relationships: updatedRelationships,
          scenes: updatedScenes
        }),
      });
      if (response.ok) {
        console.log('Registry updated successfully');
      }
    } catch (error) {
      console.error('Failed to save registry', error);
    }
  };

  const handleCreate = (obj: KnowledgeObject) => {
    addObject(obj);
    saveRegistry([...objects, obj], relationships, scenes);
    setActiveTab('registry');
  };

  const handleDelete = (id: string) => {
    removeObject(id);
    saveRegistry(
      objects.filter(o => o.id !== id),
      relationships.filter(r => r.sourceId !== id && r.targetId !== id),
      scenes.map(s => ({ ...s, objectIds: s.objectIds.filter(oid => oid !== id) }))
    );
  };

  const handleSaveRelationship = (rel: Relationship) => {
    addRelationship(rel);
    saveRegistry(objects, [...relationships, rel], scenes);
  };

  const handleDeleteRelationship = (id: string) => {
    removeRelationship(id);
    saveRegistry(objects, relationships.filter(r => r.id !== id), scenes);
  };

  const handleSaveScene = (scene: Scene) => {
    addScene(scene);
    saveRegistry(objects, relationships, [...scenes, scene]);
  };

  const handleDeleteScene = (id: string) => {
    removeScene(id);
    saveRegistry(objects, relationships, scenes.filter(s => s.id !== id));
  };

  const handleToggleScene = (id: string) => {
    toggleScene(id);
    saveRegistry(objects, relationships, scenes.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-blue p-8 font-mono">
      <header className="flex justify-between items-center mb-12 border-b border-cyber-blue/20 pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyber-blue/10 border border-cyber-blue/40">
            <Shield className="text-cyber-cyan" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-[0.4em] uppercase">Operator // Workspace</h1>
            <p className="text-[10px] text-cyber-blue/40 uppercase mt-1">Direct Ecosystem Manipulation Layer</p>
          </div>
        </div>

        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-6 py-2 text-[10px] uppercase tracking-widest border transition-all ${activeTab === 'registry' ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan' : 'border-cyber-blue/20 hover:border-cyber-blue/50'}`}
          >
            Entity Registry
          </button>
          <button
            onClick={() => { setActiveTab('create'); setEditingObject(null); }}
            className={`px-6 py-2 text-[10px] uppercase tracking-widest border transition-all ${activeTab === 'create' ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan' : 'border-cyber-blue/20 hover:border-cyber-blue/50'}`}
          >
            Create Signal
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`px-6 py-2 text-[10px] uppercase tracking-widest border transition-all ${activeTab === 'links' ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan' : 'border-cyber-blue/20 hover:border-cyber-blue/50'}`}
          >
            Neural Links
          </button>
          <button
            onClick={() => setActiveTab('scenes')}
            className={`px-6 py-2 text-[10px] uppercase tracking-widest border transition-all ${activeTab === 'scenes' ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan' : 'border-cyber-blue/20 hover:border-cyber-blue/50'}`}
          >
            Scene Composer
          </button>
        </nav>
      </header>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeTab === 'registry' ? (
              <motion.div
                key="registry"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {objects.map((obj) => (
                  <div key={obj.id} className="group relative flex items-center justify-between p-4 bg-cyber-dark/40 border border-cyber-blue/10 hover:border-cyber-blue/40 transition-all">
                    <div className="flex items-center gap-6">
                      <div className={`w-1 h-12 ${obj.environmentAffinity === 'osint' ? 'bg-blue-500' : obj.environmentAffinity === 'cyber' ? 'bg-red-500' : 'bg-slate-400'}`} />
                      <div>
                        <div className="text-[10px] text-cyber-blue/40 uppercase tracking-tighter mb-1">{obj.id} {"//"} {obj.environmentAffinity}</div>
                        <div className="text-sm font-bold text-white uppercase">{obj.label}</div>
                        <div className="text-[10px] opacity-60 font-mono mt-1">{obj.value}</div>
                      </div>
                    </div>

                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingObject(obj); setIsPreviewOpen(true); }}
                        className="p-2 hover:text-cyber-cyan"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(obj.id)}
                        className="p-2 hover:text-cyber-red"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {objects.length === 0 && (
                  <div className="text-center py-20 border border-dashed border-cyber-blue/20 opacity-20 uppercase tracking-[0.5em] text-xs">
                    Registry Empty // Awaiting Injection
                  </div>
                )}
              </motion.div>
            ) : activeTab === 'create' ? (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AtmosphericPanel title="Injection Protocol" intensity={0.5}>
                  <KnowledgeObjectForm onSubmit={handleCreate} initialData={editingObject} />
                </AtmosphericPanel>
              </motion.div>
            ) : activeTab === 'links' ? (
              <motion.div
                key="links"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AtmosphericPanel title="Relationship Mapping" intensity={0.6}>
                  <RelationshipMapper onSave={handleSaveRelationship} onDelete={handleDeleteRelationship} />
                </AtmosphericPanel>
              </motion.div>
            ) : (
              <motion.div
                key="scenes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AtmosphericPanel title="Environment Scene Composition" intensity={0.7}>
                  <SceneComposer />
                </AtmosphericPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info / Status Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <AtmosphericPanel title="System Status" intensity={0.2}>
            <div className="space-y-4 text-[10px] uppercase tracking-widest">
              <div className="flex justify-between">
                <span className="opacity-40">Registry Sync</span>
                <span className="text-cyber-emerald">Operational</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-40">Active Nodes</span>
                <span>{objects.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-40">Last Injection</span>
                <span>Just Now</span>
              </div>
            </div>
          </AtmosphericPanel>

          <AtmosphericPanel title="Live Buffer" intensity={0.1}>
            <div className="h-48 border border-cyber-blue/10 bg-cyber-black/40 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,#3b82f6_1px,transparent_1px)] [background-size:10px_10px]" />
               <TerminalIcon className="text-cyber-blue/20" size={48} />
               <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-[1px] bg-cyber-cyan/30 shadow-[0_0_10px_cyan]"
               />
            </div>
          </AtmosphericPanel>
        </div>
      </div>

      <LivePreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        object={editingObject}
      />
    </div>
  );
}
