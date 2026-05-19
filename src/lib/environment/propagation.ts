import { KnowledgeObject, Relationship } from '../content/schema';

/**
 * Calculates the propagated influence from source objects to target objects
 * based on active relationships with loop prevention and decay.
 */
export function calculatePropagatedInfluence(
  objects: KnowledgeObject[],
  relationships: Relationship[]
) {
  const updates: Record<string, { tension: number; entropy: number; anomaly: number }> = {};

  // Track visited nodes per root propagation to prevent infinite loops in cycles
  // and limit depth to ensure performance/stability
  const visited = new Set<string>();

  const propagate = (id: string, depth: number, currentStrength: number) => {
    // 1. Recursion & Loop Protection
    if (depth > 5 || visited.has(id) || currentStrength < 0.01) return;
    visited.add(id);

    const source = objects.find((o) => o.id === id);
    if (!source) return;

    // 2. Find all outbound links from this source
    relationships.filter(rel => rel.sourceId === id).forEach((rel) => {
      const target = objects.find((o) => o.id === rel.targetId);
      if (!target) return;

      if (!updates[target.id]) {
        updates[target.id] = { tension: 0, entropy: 0, anomaly: 0 };
      }

      // 3. Apply Propagation Logic with Strength Decay
      const effectiveStrength = rel.strength * currentStrength;

      switch (rel.type) {
        case 'corruption':
          // Corruption aggressively spreads entropy and anomaly
          updates[target.id].entropy += (source.influence.entropy || 0) * effectiveStrength * 0.6;
          updates[target.id].anomaly += (source.influence.anomaly || 0) * effectiveStrength * 0.8;
          updates[target.id].tension += 0.1 * effectiveStrength;
          break;

        case 'resonance':
          // Resonance synchronizes tension and entropy (bi-directional feel but calculated one-way here)
          updates[target.id].tension += (source.influence.tension || 0) * effectiveStrength * 0.4;
          updates[target.id].entropy += (source.influence.entropy || 0) * effectiveStrength * 0.3;
          break;

        case 'dependency':
          // Target depends on source stability; if source is unstable, target destabilizes
          if ((source.influence.anomaly || 0) > 0.4 || (source.influence.entropy || 0) > 0.5) {
            updates[target.id].tension += 0.3 * effectiveStrength;
            updates[target.id].entropy += 0.2 * effectiveStrength;
          }
          break;

        case 'interference':
          // Interference creates localized chaos/noise
          updates[target.id].entropy += 0.2 * effectiveStrength;
          updates[target.id].anomaly += 0.1 * effectiveStrength;
          updates[target.id].tension += 0.05 * effectiveStrength;
          break;

        case 'monitoring':
          // Monitoring increases tension but slightly damps anomaly spread (implied by lower multipliers)
          updates[target.id].tension += 0.05 * effectiveStrength;
          break;
      }

      // 4. Recursive Propagation with Depth Decay
      propagate(target.id, depth + 1, effectiveStrength * 0.8);
    });
  };

  // 5. Trigger propagation from active nodes (nodes with significant anomaly/tension)
  objects.forEach(obj => {
    if ((obj.influence.anomaly || 0) > 0.1 || (obj.influence.tension || 0) > 0.3) {
      visited.clear(); // Reset visited for each root trigger
      propagate(obj.id, 0, 1.0);
    }
  });

  return updates;
}
