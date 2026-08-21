# Integration Guide: Using @planet-explorer/persistence in the Game

## Quick Start

### Setup

```typescript
import { PersistenceService, LocalStorageAdapter, EventSaveCoordinator, createInitialState } from '@planet-explorer/persistence';

// Create adapter (production: LocalStorageAdapter, tests: MockStorageAdapter)
const adapter = new LocalStorageAdapter();
const persistence = new PersistenceService(adapter);

// Load progress on game start
let playerProgress = persistence.load();

// Initialize event coordinator for auto-save
const coordinator = new EventSaveCoordinator(persistence, playerProgress);
```

### Handling Game Events

```typescript
// When player completes a challenge
coordinator.onChallengeCompleted('counting', 3);

// When player completes a destination
coordinator.onDestinationCompleted('moon');

// When skill practice session updates failure count
coordinator.onSkillPracticed('counting', 2);
```

### Querying Player Progress

```typescript
// Get current progress
const progress = coordinator.getProgress();

// Access skill data
const countingSkill = progress.skills.counting;
console.log(`Level: ${countingSkill.skillLevel}`);

// Access destination data
const moonDest = progress.destinations.moon;
console.log(`Completed: ${moonDest.completed}`);
```

## Architecture

### Layers

1. **StorageAdapter** (types/StorageAdapter.ts)
   - Abstract interface for storage backend
   - Implementations: LocalStorageAdapter (prod), MockStorageAdapter (tests)

2. **Core Logic** (core/)
   - Pure functions: validate, serialize, deserialize, fallback
   - Factories: createSkillProgress, updateSkillLevel, etc.
   - No I/O or side effects

3. **Integration** (integration/)
   - PersistenceService: High-level load/save API
   - EventSaveCoordinator: Event-driven auto-save

### Data Flow

```
Game Loop
   ↓
PlayerProgress (in-memory)
   ↓
EventSaveCoordinator.onEvent() 
   ↓
PersistenceService.save()
   ↓
serialize() → JSON string
   ↓
LocalStorageAdapter.setItem()
   ↓
localStorage (browser)
```

## Testing

### Unit Tests (Vitest)

All core logic tested without browser APIs:

```bash
cd libs/persistence
npm test
```

Coverage: ≥95% of src/ files

### E2E Tests (Playwright)

Full game integration tests (Spec 033+):

```bash
npm run test:e2e
```

## Constitution Alignment

| Principle | Alignment | Details |
|-----------|-----------|---------|
| **I: UX centrada en el niño** | ✅ | Auto-save is silent, non-blocking, no lag |
| **IV: Progresión adaptativa** | ✅ | Persistent skills enable meaningful progression |
| **VI: Simplicidad primero** | ✅ | localStorage MVP, zero dependencies |
| **VII: Separación lógica/renderizado** | ✅ | Core logic testeable without browser/DOM/Phaser |
| **VIII: Desarrollo incremental** | ✅ | Vertical slice; specs 012, 030 extend without redesign |
| **IX: Contenido dirigido por datos** | ✅ | Versionable JSON schema |
| **X: Testing exhaustivo** | ✅ | Unit ≥95% (Vitest), E2E spec 033+ |

## Future Extensions

### Spec 012: Player Name Identity
Adds `playerName` field to root aggregate. Schema stays v1-compatible.

### Spec 030: Security & Privacy
Adds encryption, validates ranges (skillLevel 0-10), multi-device sync.

### Spec 033: E2E Testing
Provides Playwright infrastructure for comprehensive E2E scenarios.

## Troubleshooting

### localStorage is unavailable
- LocalStorageAdapter logs warnings
- Game continues without saving (fire-and-forget)
- Fallback state on next load (no data loss for current session)

### Corrupted data
- PersistenceService.load() applies permissive fallback
- Valid fields restored, invalid skipped
- No crashes, graceful degradation

### Performance issues
- Save cycle target: < 50ms (serialization + storage)
- All tests pass < 100ms
- Profile with Vitest coverage if needed

## API Reference

See [API.md](./API.md) for detailed type signatures and method documentation.

---

**Constitution**: Aligned with 10 principles ✅  
**Testing**: Unit ≥95% coverage, E2E deferred spec 033  
**Performance**: Save cycle < 50ms, fire-and-forget async
