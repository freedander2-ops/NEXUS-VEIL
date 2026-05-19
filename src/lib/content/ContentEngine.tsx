'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { KnowledgeObject, ContentRegistry } from './schema';
import registryData from '@/content/registry.json';
import { useWorldState } from '@/lib/environment/WorldStateContext';

interface ContentContextType {
  objects: KnowledgeObject[];
  addObject: (obj: KnowledgeObject) => void;
  removeObject: (id: string) => void;
  triggerObjectInfluence: (id: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [objects, setObjects] = useState<KnowledgeObject[]>([]);
  const { mutateWorldState, emitWorldEvent } = useWorldState();

  useEffect(() => {
    // Initial load from registry
    const initialObjects = (registryData as ContentRegistry).objects;
    setObjects(initialObjects);
  }, []);

  const addObject = (obj: KnowledgeObject) => {
    setObjects(prev => [...prev, obj]);
  };

  const removeObject = (id: string) => {
    setObjects(prev => prev.filter(o => o.id !== id));
  };

  const triggerObjectInfluence = (id: string) => {
    const obj = objects.find(o => o.id === id);
    if (!obj) return;

    if (obj.influence.anomaly && obj.influence.anomaly > 0.1) {
      emitWorldEvent({ type: 'anomaly', payload: { origin: obj.id } });
    }

    mutateWorldState({
      tension: obj.influence.tension || 0,
      entropy: obj.influence.entropy || 0,
      anomalyLevel: obj.influence.anomaly || 0
    });
  };

  return (
    <ContentContext.Provider value={{ objects, addObject, removeObject, triggerObjectInfluence }}>
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
