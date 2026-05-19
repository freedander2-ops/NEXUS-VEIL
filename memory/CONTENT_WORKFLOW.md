# Content Workflow

## Overview
The NEXUS VEIL content pipeline is transitioned from manual JSON editing to a browser-based ingestion system.

## Ingestion Pipeline
1. **Creator Layer**: Access `/operator` to open the operational interface.
2. **Signal Identification**: Paste a GitHub URL for auto-parsing or manually enter entity data.
3. **Environmental Tuning**: Adjust influence parameters (tension, entropy, anomaly) to define how the object affects the world.
4. **Validation**: Preview the object in its target dimension via the Live Preview tool.
5. **Injection**: Execute the protocol to update `registry.json` and inject the object into the runtime ecosystem.

## Knowledge Object Schema
Objects must adhere to the `src/lib/content/schema.ts` definition:
- `id`: Unique signal identifier.
- `affinity`: Target environment (OSINT, Cyber, GitHub, Global).
- `influence`: Systemic parameters for world-state mutation.
- `metadata`: Flexible key-value store for dimension-specific rendering.
