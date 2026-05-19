# CONTENT WORKFLOW

## Core Principle

Content inside NEXUS VEIL is not static UI data.

Every entity becomes part of the ecosystem:
- repository
- signal
- investigation
- anomaly
- scene
- world event

Content must remain:
- modular
- metadata-driven
- dynamically renderable
- environment-aware

---

# Content Structure

/content
│
├── repositories
├── osint
├── investigations
├── anomalies
├── scenes
├── signals
└── world_events

---

# Adding Content

## Recommended Method

Use Creator Mode.

Creator systems should:
- generate objects automatically
- validate metadata
- connect relationships
- inject entities into environments

---

## Manual Method

Objects may also be added manually as JSON files.

Example:

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
  "links": []
}
