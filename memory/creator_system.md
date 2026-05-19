# Creator System

## Runtime Environment Editing
- The architecture must support modifying environment states without a page reload.
- Parameters to expose:
  - `atmosphere`: color, fog, density, grain.
  - `visuals`: shader parameters, geometry types, grid stability.
  - `motion`: speed, easing patterns, jitter/glitch levels.
  - `logic`: how objects react to input in that specific dimension.

## World Composition
- Users (or system events) can compose "scenes" by injecting knowledge objects and setting environmental parameters via the `/operator` workspace.
- Mutation: The ability for an environment to "infect" another (e.g., a cyber anomaly bleeding into the OSINT map).

## Operational Layer
The `/operator` route provides a hidden interface for:
- Registry management (Sync/Delete).
- Real-time entity injection.
- GitHub repository auto-parsing.
- Live dimensional preview.
