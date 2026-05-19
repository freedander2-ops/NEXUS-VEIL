export type EnvironmentAffinity = 'weather' | 'cyber' | 'github' | 'osint' | 'global';

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

export interface ContentRegistry {
  objects: KnowledgeObject[];
  version: string;
}
