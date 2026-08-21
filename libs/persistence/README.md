# @planet-explorer/persistence

Persistence layer for player progress using localStorage.

## Overview

Provides a modular, testable persistence layer for saving and restoring player progress (skill levels, destination completion) in the planet-explorer game.

### Architecture

- **types/**: Core data models (PlayerProgress, SkillProgress, DestinationState) and StorageAdapter interface
- **core/**: Pure logic functions (validate, serialize, deserialize, fallback) — testeable without browser
- **adapters/**: Storage implementations (LocalStorageAdapter, MockStorageAdapter)
- **integration/**: PersistenceService and event coordination (game loop wiring)
- **test/**: Unit tests (Vitest, ≥95% coverage) and test fixtures

### Key Features

- **Zero external dependencies (v1)**: localStorage MVP, no backend required
- **Testeable without browser**: StorageAdapter interface enables mocking in Node.js
- **Graceful fallback**: Permissive recovery on corrupted data (restore valid fields, use defaults for missing)
- **Async non-blocking**: Fire-and-forget saves (no blocking on game loop)
- **Versioned schema**: Foundation for future migrations (spec 030+)

## Usage

### Basic Setup

```typescript
import { PersistenceService } from '@planet-explorer/persistence/integration';
import { LocalStorageAdapter } from '@planet-explorer/persistence/adapters';

const adapter = new LocalStorageAdapter();
const persistence = new PersistenceService(adapter);

// Load progress on game start
const playerProgress = persistence.load();

// Save on events (non-blocking)
persistence.save(playerProgress);
```

### Testing

```typescript
import { PersistenceService } from '@planet-explorer/persistence/integration';
import { MockStorageAdapter } from '@planet-explorer/persistence/test/fixtures';

const adapter = new MockStorageAdapter();
const persistence = new PersistenceService(adapter);

// No browser required — all tests pass in Vitest
```

## Testing

Run tests:
```bash
npm test
```

Run tests with watch mode:
```bash
npm run test:watch
```

## Build

```bash
npm run build
```

Output goes to `dist/` directory.

## Data Model

See `../../specs/011-save-progress-local/data-model.md` for complete entity definitions and JSON schema.

- **PlayerProgress**: Root aggregate with version, skills map, destinations map, lastSavedTime
- **SkillProgress**: skillId, skillLevel, failureCount, lastUpdateTime
- **DestinationState**: destinationId, completed, missionsCompleted[], lastVisitTime

## Specifications

- Spec 011: [Persistencia local de progreso](../../specs/011-save-progress-local/)
- Spec 012: [Player name identity](../../specs_pending/012-player-name-identity.md) — Extends with playerName field
- Spec 030: [Security and privacy baseline](../../specs_pending/030-security-and-privacy-baseline.md) — Adds encryption, range validation

## Constitution Alignment

✅ **Principle I (UX centrada en el niño)**: Auto-save is silent, non-blocking (no lag for player)
✅ **Principle IV (Progresión adaptativa)**: Persistence enables meaningful progression across sessions
✅ **Principle VI (Simplicidad)**: localStorage MVP, zero external dependencies
✅ **Principle VII (Separación lógica/renderizado)**: Core logic testeable without browser/Phaser/DOM
✅ **Principle VIII (Desarrollo incremental)**: Vertical slice; extensions via specs 012, 030 without redesign
✅ **Principle IX (Contenido dirigido por datos)**: Versionable JSON schema, no hard-coded values
✅ **Principle X (Testing exhaustivo)**: Unit tests mandatory (Vitest ≥95% coverage), E2E via spec 033+
