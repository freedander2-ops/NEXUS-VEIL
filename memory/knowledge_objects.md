# Knowledge Objects

## Atmospheric Entities
- A "Knowledge Object" is an interactive entity within the ecosystem (e.g., a Repository, a CVE feed, an OSINT target).
- They are NOT flat cards.
- **Properties**:
  - `identity`: visual signature within the current dimension.
  - `relationships`: connections to other objects in the space.
  - `depth`: nested layers of information revealed through interaction.
  - `reaction`: how the object responds to global environment states (weather, time, intensity).

## Injection
- The ecosystem supports dynamic injection of these objects into any environment.
- An object's appearance changes based on the dimension it currently resides in.
- **Workflow**: Creation via `/operator` -> API Sync -> `registry.json` update -> Runtime rendering.

## Influence
Every object carries an `influence` payload that mutates the global `WorldState`:
- `tension`: Increases atmospheric pressure.
- `entropy`: Drives system disorder.
- `anomaly`: Triggers visual glitches and rare states.
