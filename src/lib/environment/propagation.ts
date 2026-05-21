import { KnowledgeObject, Relationship } from '../content/schema';

export interface PropagatedInfluence {
  tension: number;
  entropy: number;
  anomaly: number;
}

/**
 * Calculates systemic influence propagation across the ecosystem network.
 * Uses a recursive traversal with depth limiting and decay to ensure stability.
 */
export function calculatePropagatedInfluence(
  objects: KnowledgeObject[],
  relationships: Relationship[],
  maxDepth = 5
): Record<string, PropagatedInfluence> {
  const influenceMap: Record<string, PropagatedInfluence> = {};

  // Initialize map
  objects.forEach(obj => {
    influenceMap[obj.id] = { tension: 0, entropy: 0, anomaly: 0 };
  });


  function propagate(
    sourceId: string,
    baseInfluence: PropagatedInfluence,
    depth: number,
    path: string[]
  ) {
    if (depth >= maxDepth || path.includes(sourceId)) return;

    const sourceRels = relationships.filter(r => r.sourceId === sourceId);

    sourceRels.forEach(rel => {
      const targetId = rel.targetId;
      if (!influenceMap[targetId]) return;

      // Decay factor: influence weakens as it spreads
      // Propagation strength is 0.8x of relationship strength per hop
      const strengthFactor = rel.strength * 0.8;

      const delta = {
        tension: baseInfluence.tension * strengthFactor,
        entropy: baseInfluence.entropy * strengthFactor,
        anomaly: baseInfluence.anomaly * strengthFactor
      };

      influenceMap[targetId].tension += delta.tension;
      influenceMap[targetId].entropy += delta.entropy;
      influenceMap[targetId].anomaly += delta.anomaly;

      propagate(targetId, delta, depth + 1, [...path, sourceId]);
    });
  }

  // Seed propagation from each object's base influence
  objects.forEach(obj => {
    const base = {
      tension: obj.influence.tension || 0,
      entropy: obj.influence.entropy || 0,
      anomaly: obj.influence.anomaly || 0
    };
    propagate(obj.id, base, 0, []);
  });

  return influenceMap;
}
