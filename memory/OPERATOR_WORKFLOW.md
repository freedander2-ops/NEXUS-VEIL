# Operator Workflow

## Workflow Stages
1. **Access Phase**: Hardened authentication gate (Symbolic Login).
2. **Surveillance Phase**: Auditing the current state via `ObjectList` and `SystemMonitor`.
3. **Intervention Phase**:
   - **Creation**: Using `KnowledgeObjectForm` with templates.
   - **Linking**: Establishing neural links via `RelationshipMapper`.
   - **Composition**: Grouping entities into `Scenes`.
4. **Validation Phase**: Using `LivePreview` to verify atmospheric impact before final persistence.
5. **Persistence Phase**: Registry update via API.

## Ergonomics
- **Hotkeys**: (Future) Tactical shortcuts for common operator actions.
- **Layout**: Prioritize situational awareness. Monitor metrics while editing.
- **Stability**: Fallback mechanisms if the registry API is unresponsive.

## Safety Validation
- Prevent circular dependency loops in relationships.
- Block injection of malformed metadata keys.
- Ensure all orphaned links are cleaned on object deletion.
