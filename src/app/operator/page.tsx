'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Terminal as TerminalIcon, Activity, Eye, Info, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEnvironment } from '@/lib/environment/state';
import { useContent } from '@/lib/content/ContentEngine';
import { KnowledgeObject, Relationship, Scene } from '@/lib/content/schema';
import { AtmosphericPanel } from '@/components/common/AtmosphericPanel';
import KnowledgeObjectForm from '@/components/operator/KnowledgeObjectForm';
import RelationshipMapper from '@/components/operator/RelationshipMapper';
import SceneComposer from '@/components/operator/SceneComposer';
import LivePreview from '@/components/operator/LivePreview';
import { ObjectList } from '@/components/operator/ObjectList';
import { SystemMonitor } from '@/components/operator/SystemMonitor';
import { useAudio } from '@/lib/audio/AudioEngine';

export default function OperatorWorkspace() {
  const { isAuthenticated, role, logout } = useEnvironment();
  const router = useRouter();
  const { playFeedback } = useAudio();
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
    toggleScene,
  } = useContent();

  const [activeTab, setActiveTab] = useState<'registry' | 'create' | 'links' | 'scenes'>('registry');
  const [editingObject, setEditingObject] = useState<KnowledgeObject | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(true);

  useEffect(() => {
    if (isAuthenticated === false || (isAuthenticated && role !== 'operator')) {
      router.push('/');
    }
  }, [isAuthenticated, role, router]);

  if (isAuthenticated !== true || role !== 'operator') return null;

  const saveRegistry = async (
    updatedObjects: KnowledgeObject[],
    updatedRelationships: Relationship[],
    updatedScenes: Scene[]
  ) => {
    try {
      const response = await fetch('/api/registry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-nexus-auth': 'active-operator-session'
        },
        body: JSON.stringify({
          version: '1.0.0',
          objects: updatedObjects,
          relationships: updatedRelationships,
          scenes: updatedScenes
        }),
      });
      if (response.ok) {
        playFeedback('click');
      }
    } catch (error) {
      console.error('Failed to save registry', error);
      playFeedback('anomaly');
    }
  };

  const handleCreate = (obj: KnowledgeObject) => {
    addObject(obj);
    const existingIndex = objects.findIndex(o => o.id === obj.id);
    let updatedObjects;
    if (existingIndex > -1) {
       updatedObjects = [...objects];
       updatedObjects[existingIndex] = obj;
    } else {
       updatedObjects = [...objects, obj];
    }
    saveRegistry(updatedObjects, relationships, scenes);
    setEditingObject(null);
    setActiveTab('registry');
  };

  const handleDelete = (id: string) => {
    removeObject(id);
    saveRegistry(
      objects.filter(o => o.id !== id),
      relationships.filter(r => r.sourceId !== id && r.targetId !== id),
      scenes.map(s => ({ ...s, objectIds: s.objectIds.filter(oid => oid !== id) }))
    );
    playFeedback('click');
  };

  const handleSaveRelationship = (rel: Relationship) => {
    addRelationship(rel);
    saveRegistry(objects, [...relationships, rel], scenes);
  };

  const handleSaveScene = (scene: Scene) => {
    addScene(scene);
    const existingIndex = scenes.findIndex(s => s.id === scene.id);
    let updatedScenes;
    if (existingIndex > -1) {
       updatedScenes = [...scenes];
       updatedScenes[existingIndex] = scene;
    } else {
       updatedScenes = [...scenes, scene];
    }
    saveRegistry(objects, relationships, updatedScenes);
  };

  const handleDeleteScene = (id: string) => {
    removeScene(id);
    saveRegistry(objects, relationships, scenes.filter(s => s.id !== id));
    playFeedback('click');
  };

  const handleToggleScene = (id: string) => {
    toggleScene(id);
    saveRegistry(objects, relationships, scenes.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleDeleteRelationship = (id: string) => {
    removeRelationship(id);
    saveRegistry(objects, relationships.filter(r => r.id !== id), scenes);
    playFeedback('click');
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    playFeedback('hover');
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
            <p className="text-[10px] text-cyber-blue/40 uppercase mt-1 tracking-widest font-bold font-mono text-glow-cyan">Protocol Level 04 Access</p>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <button
            onClick={() => {
                setShowDiagnostics(!showDiagnostics);
                playFeedback('click');
            }}
            title="Toggle Live Diagnostics"
            className={`mr-4 p-2 border transition-all ${showDiagnostics ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'border-cyber-blue/20 opacity-40 hover:opacity-100 hover:border-cyber-blue/50'}`}
          >
            <Activity size={18} />
          </button>

          {[
            { id: 'registry', label: 'Entity Registry' },
            { id: 'create', label: 'Injection' },
            { id: 'links', label: 'Neural Links' },
            { id: 'scenes', label: 'Composition' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as "registry" | "create" | "links" | "scenes")}
              className={`px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold border transition-all ${activeTab === tab.id ? 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-cyber-blue/20 text-cyber-blue/60 hover:border-cyber-blue/50 hover:text-cyber-blue'}`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={() => {
                logout();
                router.push('/');
            }}
            className="ml-6 p-3 border border-cyber-red/20 text-cyber-red/40 hover:bg-cyber-red/5 hover:text-cyber-red hover:border-cyber-red/40 transition-all flex items-center gap-2"
          >
            <LogOut size={16} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Disconnect</span>
          </button>
        </nav>
      </header>

      <div className="grid grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="col-span-12 lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeTab === 'registry' ? (
              <motion.div
                key="registry"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <ObjectList
                  objects={objects}
                  onEdit={(obj) => {
                    setEditingObject(obj);
                    setActiveTab('create');
                    playFeedback('click');
                  }}
                  onDelete={handleDelete} onCreateRequested={() => setActiveTab("create")}
                  onPreview={(obj) => {
                    setEditingObject(obj);
                    setIsPreviewOpen(true);
                    playFeedback('click');
                  }}
                />
              </motion.div>
            ) : activeTab === 'create' ? (
              <motion.div
                key="create"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AtmosphericPanel title={editingObject ? "Modification Sequence" : "Injection Protocol"} intensity={0.5}>
                  <KnowledgeObjectForm
                    onSubmit={handleCreate}
                    initialData={editingObject}
                    onCancel={() => {
                        setEditingObject(null);
                        setActiveTab('registry');
                        playFeedback('click');
                    }}
                  />
                </AtmosphericPanel>
              </motion.div>
            ) : activeTab === 'links' ? (
              <motion.div
                key="links"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AtmosphericPanel title="Relationship Mapping" intensity={0.6}>
                  <RelationshipMapper onSave={handleSaveRelationship} onDelete={handleDeleteRelationship} />
                </AtmosphericPanel>
              </motion.div>
            ) : (
              <motion.div
                key="scenes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AtmosphericPanel title="Environment Scene Composition" intensity={0.7}>
                  <SceneComposer
                    onSave={handleSaveScene}
                    onDelete={handleDeleteScene}
                    onToggle={handleToggleScene}
                  />
                </AtmosphericPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info / Status Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <AnimatePresence>
            {showDiagnostics && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <AtmosphericPanel title="Live Diagnostics" intensity={0.5} className="border-cyber-cyan/20">
                  <SystemMonitor />
                </AtmosphericPanel>
              </motion.div>
            )}
          </AnimatePresence>

          <AtmosphericPanel title="Operator Briefing" intensity={0.2}>
            <div className="space-y-6 text-[10px] uppercase tracking-widest leading-relaxed">
              <div className="p-4 bg-cyber-blue/5 border border-cyber-blue/10 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-3 text-cyber-cyan">
                  <Info size={16} />
                  <span className="font-bold font-mono text-[11px]">System Status: Nominal</span>
                </div>
                <p className="opacity-60 font-mono leading-relaxed">
                    Ecosystem expansion mode active.
                    Current objective: Maintain stability thresholds below 0.8 during injection phase.
                </p>
                <div className="absolute top-0 right-0 w-16 h-16 bg-cyber-cyan/5 -mr-8 -mt-8 rotate-45 pointer-events-none" />
              </div>

              <div className="space-y-4 px-2">
                <div className="flex justify-between items-center border-b border-cyber-blue/5 pb-2">
                    <span className="opacity-40">Access Role</span>
                    <span className="text-cyber-cyan font-bold font-mono underline decoration-cyber-cyan/30 underline-offset-4">{role}</span>
                </div>
                <div className="flex justify-between items-center border-b border-cyber-blue/5 pb-2">
                    <span className="opacity-40">Registry Sync</span>
                    <span className="text-cyber-emerald font-bold font-mono">Persistent</span>
                </div>
                <div className="flex justify-between items-center border-b border-cyber-blue/5 pb-2">
                    <span className="opacity-40">Nodes Active</span>
                    <span className="text-white font-bold font-mono">{objects.length} UNITS</span>
                </div>
              </div>

              <div className="pt-6">
                <button
                    onClick={() => {
                        playFeedback('click');
                        router.push('/weather');
                    }}
                    className="w-full py-4 border border-cyber-blue/20 bg-cyber-blue/5 hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5 transition-all flex items-center justify-center gap-3 group"
                >
                    <Eye size={16} className="group-hover:text-cyber-cyan group-hover:scale-110 transition-transform" />
                    <span className="font-bold">Enter Public Viewport</span>
                </button>
              </div>
            </div>
          </AtmosphericPanel>

          <AtmosphericPanel title="Core Buffer" intensity={0.1}>
            <div className="h-40 border border-cyber-blue/10 bg-cyber-black/40 flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,#3b82f6_1px,transparent_1px)] [background-size:12px_12px] group-hover:opacity-20 transition-opacity" />
               <TerminalIcon className="text-cyber-blue/20 group-hover:text-cyber-cyan/30 transition-colors" size={56} />
               <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-[1px] bg-cyber-cyan/40 shadow-[0_0_15px_cyan]"
               />
               <div className="absolute bottom-2 right-2 text-[7px] opacity-20 font-mono tracking-widest uppercase">
                   Signal_Buffer_Active
               </div>
            </div>
          </AtmosphericPanel>
        </div>
      </div>

      <LivePreview
        isOpen={isPreviewOpen}
        onClose={() => {
            setIsPreviewOpen(false);
            setEditingObject(null);
            playFeedback('click');
        }}
        object={editingObject}
      />
    </div>
  );
}
