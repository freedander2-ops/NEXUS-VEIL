'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { KnowledgeObject, Relationship, Scene, ContentRegistry } from './schema';
import registryData from '@/content/registry.json';
import { useWorldState } from '@/lib/environment/WorldStateContext';
import { calculatePropagatedInfluence } from '../environment/propagation';
import { useAudio } from '@/lib/audio/AudioEngine';

interface ContentContextType {
  objects: KnowledgeObject[];
  relationships: Relationship[];
  scenes: Scene[];
  addObject: (obj: KnowledgeObject) => void;
  removeObject: (id: string) => void;
  addRelationship: (rel: Relationship) => void;
  removeRelationship: (id: string) => void;
  addScene: (scene: Scene) => void;
  removeScene: (id: string) => void;
  toggleScene: (id: string) => void;
  triggerObjectInfluence: (id: string) => void;
  refreshRegistry: () => Promise<void>;
  isSynchronizing: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [objects, setObjects] = useState<KnowledgeObject[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isSynchronizing, setIsSynchronizing] = useState(false);
  const { state: worldState, mutateWorldState, emitWorldEvent } = useWorldState();
  const { playFeedback } = useAudio();

  useEffect(() => {
    const loadRegistry = async () => {
      try {
        const response = await fetch('/api/registry');
        if (response.ok) {
          const data: ContentRegistry = await response.json();
          setObjects(data.objects);
          setRelationships(data.relationships || []);
          setScenes(data.scenes || []);
        } else {
          const staticData = registryData as unknown as ContentRegistry;
          setObjects(staticData.objects);
          setRelationships(staticData.relationships || []);
          setScenes(staticData.scenes || []);
        }
      } catch (error) {
        console.error('Failed to load registry via API, using fallback', error);
        const staticData = registryData as unknown as ContentRegistry;
        setObjects(staticData.objects);
        setRelationships(staticData.relationships || []);
        setScenes(staticData.scenes || []);
      }
    };

    loadRegistry();
  }, []);

  const addObject = (obj: KnowledgeObject) => {
    setObjects(prev => {
      const existing = prev.findIndex(o => o.id === obj.id);
      if (existing > -1) {
        const updated = [...prev];
        updated[existing] = obj;
        return updated;
      }
      return [...prev, obj];
    });
  };

  const removeObject = (id: string) => {
    setObjects(prev => prev.filter(o => o.id !== id));
    setRelationships(prev => prev.filter(r => r.sourceId !== id && r.targetId !== id));
  };

  const addRelationship = (rel: Relationship) => {
    const source = objects.find(o => o.id === rel.sourceId);
    const target = objects.find(o => o.id === rel.targetId);
    if (!source || !target) {
      console.warn('Attempted to create relationship between orphaned entities', rel);
      return;
    }
    setRelationships(prev => [...prev, rel]);
  };

  const removeRelationship = (id: string) => {
    setRelationships(prev => prev.filter(r => r.id !== id));
  };

  const addScene = (scene: Scene) => {
    setScenes(prev => {
      const existing = prev.findIndex(s => s.id === scene.id);
      if (existing > -1) {
        const updated = [...prev];
        updated[existing] = scene;
        return updated;
      }
      return [...prev, scene];
    });
  };

  const removeScene = (id: string) => {
    setScenes(prev => prev.filter(s => s.id !== id));
  };

  const toggleScene = (id: string) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const refreshRegistry = async () => {
    setIsSynchronizing(true);
    try {
      const response = await fetch('/api/registry');
      if (response.ok) {
        const data: ContentRegistry = await response.json();
        setObjects(data.objects);
        setRelationships(data.relationships || []);
        setScenes(data.scenes || []);
        playFeedback('success');
      }
    } catch (error) {
      console.error('Failed to refresh registry', error);
      playFeedback('anomaly');
    } finally {
      setIsSynchronizing(false);
    }
  };

  useEffect(() => {
    const activeScenes = scenes.filter(s => s.active);
    if (activeScenes.length === 0) return;

    const interval = setInterval(() => {
      activeScenes.forEach(scene => {
        const validObjects = scene.objectIds.filter(id => objects.some(o => o.id === id));
        if (validObjects.length === 0 && scene.objectIds.length > 0) return;

        mutateWorldState({
          tension: worldState.tension + (scene.environmentalModifiers.tensionMod || 0) * 0.005,
          entropy: worldState.entropy + (scene.environmentalModifiers.entropyMod || 0) * 0.005,
          anomalyLevel: worldState.anomalyLevel + (scene.environmentalModifiers.anomalyMod || 0) * 0.005
        });
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [scenes, objects, worldState.tension, worldState.entropy, worldState.anomalyLevel, mutateWorldState]);

  const triggerObjectInfluence = (id: string) => {
    const obj = objects.find(o => o.id === id);
    if (!obj) return;

    const propagationUpdates = calculatePropagatedInfluence(objects, relationships);
    const targetUpdate = propagationUpdates[id] || { tension: 0, entropy: 0, anomaly: 0 };

    if (obj.influence.anomaly && obj.influence.anomaly > 0.1) {
      emitWorldEvent({ type: 'anomaly', payload: { origin: obj.id } });
    }

    mutateWorldState({
      tension: (obj.influence.tension || 0) + targetUpdate.tension,
      entropy: (obj.influence.entropy || 0) + targetUpdate.entropy,
      anomalyLevel: (obj.influence.anomaly || 0) + targetUpdate.anomaly
    });
  };

  return (
    <ContentContext.Provider value={{
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
      triggerObjectInfluence,
      refreshRegistry,
      isSynchronizing
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
