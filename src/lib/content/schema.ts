export type EnvironmentAffinity = 'weather' | 'cyber' | 'github' | 'osint' | 'global';

export type RelationshipType = 'resonance' | 'corruption' | 'dependency' | 'monitoring' | 'interference';

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  strength: number; // 0 to 1
  metadata?: Record<string, string | number | boolean>;
}

export interface KnowledgeObject {
  id: string;
  label: string;
  value: string;
  status: string;
  environmentAffinity: EnvironmentAffinity;
  metadata: Record<string, string | number | boolean>;
  lastObserved: number;
  influence: {
    tension?: number;
    entropy?: number;
    anomaly?: number;
  };
}

export interface Scene {
  id: string;
  label: string;
  description: string;
  objectIds: string[];
  environmentalModifiers: {
    tensionMod?: number;
    entropyMod?: number;
    anomalyMod?: number;
    weatherLock?: string;
  };
  active: boolean;
}

export interface ContentRegistry {
  objects: KnowledgeObject[];
  relationships?: Relationship[];
  scenes?: Scene[];
  version: string;
}
