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

# Operational Schema

Knowledge Objects are ecosystem entities driven by metadata.

Every object should support:

- id
- type
- title
- mood
- environmentAffinity
- signalStrength
- dangerLevel
- relationships
- worldStateInfluence
- renderProfile

---

# Example Object

```json
{
  "id": "naiveproxy",
  "type": "repository",
  "title": "NaiveProxy",
  "mood": "engineering",
  "environmentAffinity": ["github", "osint"],
  "signalStrength": 7,
  "dangerLevel": 2,
  "relationships": [],
  "worldStateInfluence": {
    "entropy": 1,
    "tension": 2
  }
}
