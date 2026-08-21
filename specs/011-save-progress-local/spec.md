---
title: "Persistencia local de progreso"
feature: "011-save-progress-local"
type: "feature-spec"
version: "1.0"
created: "2026-08-21T18:30:00Z"
updated: "2026-08-22T00:00:00Z"
status: "Implemented"
priority: "P1"
tags: ["progression", "data", "persistence", "storage", "game"]
dependencies: ["006-skill-progress-model", "008-moon-destination-counting"]
related_specs: ["012-player-name-identity"]
Testing:
  unit:
    - libs/persistence/test/unit/deserialize.test.ts
    - libs/persistence/test/unit/serialize.test.ts
    - libs/persistence/test/unit/validate.test.ts
    - libs/persistence/test/unit/fallback.test.ts
    - libs/persistence/test/unit/versioning.test.ts
    - libs/persistence/test/unit/first-session.test.ts
    - libs/persistence/test/unit/skill-save.test.ts
    - libs/persistence/test/unit/destination-save.test.ts
    - libs/persistence/test/unit/auto-save-events.test.ts
    - libs/persistence/test/unit/LocalStorageAdapter.test.ts
    - libs/persistence/test/unit/PersistenceService.test.ts
    - libs/persistence/test/unit/performance.test.ts
    - src/services/persistence.test.ts
  e2e: [] # N/A — anterior a spec 033
  coverage_logic: "98.44% lines / 93.98% statements / 91.11% branches / 100% functions (libs/persistence, ver SUCCESS-CRITERIA.md SC-005)"
  coverage_ui: "N/A — anterior a spec 033"
---

# Especificación de funcionalidad: Persistencia local de progreso

**Rama de la funcionalidad**: `011-persistir-progreso-del`

**Creado**: 2026-08-21

**Estado**: Draft

**Entrada**: Persistir el progreso del jugador (dominio por habilidad y destinos completados) en almacenamiento local del navegador, con un esquema versionado y carga/guardado testeables.

---

## Clarifications

### Session 2026-08-21

- Q: ¿Debe la raíz del objeto PlayerProgress anidar todos los datos bajo un campo único `version`, o utilizar una estructura envuelta con secciones separadas de `metadata` y `payload`? → A: Opción A (raíz única con `version` al nivel superior). Más simple para v1 y se alinea con Principio VI. La versión puede evolucionar gracefully en futuras migraciones.

- Q: Cuando se cargan datos parcialmente válidos (ej: existen habilidades pero faltan destinos), ¿debería descartar TODO, conservar válidos con defaults, o aplicar estrategia por sección? → A: Opción B (estrategia permisiva). Conservar campos válidos y completar faltantes con defaults. Maximiza recuperación de progreso válido (P1) y es escalable para nuevos campos en futuras specs (012).

- Q: ¿Debería el sistema guardarse solo en 3 eventos específicos (Challenge Completion, Destination Completion, Level Up) o también incluir Fail attempts, Mission completion, Navigation? → A: Opción A (solo 3 eventos). Estos corresponden a cambios de progresión observable (P1). Fail attempts y navigation afectan gameplay pero no el modelo de progreso. Minimiza overhead y acoplamiento.

- Q: ¿Debería el auto-save ser sincrónica/bloqueante, asincrónica no-bloqueante, o asincrónica esperada? → A: Opción B (asincrónica no-bloqueante/fire-and-forget). localStorage es local (típicamente < 1ms), pero fire-and-forget evita lag UX (Principio I). Fallos silenciosos se recuperan en próximo evento. Mejor experiencia para el jugador.

- Q: En la estrategia permisiva, ¿qué criterios de validación aplican: solo estructura JSON, tipos de datos, o también rangos de valores? → A: Opción A (solo estructura + tipos). Suficiente para v1. Spec 030 valida rangos después. Fácil de testear, alineado con Principio VI (simplicidad primero).

---

## Escenarios de usuario y pruebas

### Historia de usuario 1 — Primera sesión (Prioridad: P1)

El jugador abre el juego por primera vez. No existe estado guardado. El juego debe iniciar con un estado limpio (sin progreso previo, todas las habilidades en dominio 0, sin destinos completados) sin errores de lectura.

**Por qué tiene esta prioridad**: El arranque sin errores es precondición para cualquier sesión. Sin esto, el juego no funciona.

**Prueba independiente**: Puede probarse aisladamente limpiando localStorage, cerrando el navegador/pestaña y verificando que el juego arranque correctamente sin errores de parsing.

**Escenarios de aceptación**:

1. **Given** localStorage no contiene datos guardados de Explorador Espacial, **When** el juego inicia, **Then** se crea un estado inicial con todas las habilidades en dominio 0 y sin destinos completados
2. **Given** localStorage contiene datos corruptos bajo la clave de juego, **When** el juego inicia, **Then** se ignoran los datos corruptos y se usa estado inicial limpio sin throwing error

---

### Historia de usuario 2 — Guardar progreso de reto (Prioridad: P1)

El jugador completa un reto en una misión de Luna. Su dominio en la habilidad correspondiente aumenta. Cuando cierra y reabre el juego, ese progreso persiste.

**Por qué tiene esta prioridad**: Guardar cambios de habilidad es el caso de uso fundamental. Sin esto, cada sesión es aislada y la dificultad adaptativa no tiene sentido.

**Prueba independiente**: Puede probarse completando un reto (validando que `skillLevel` aumenta en memoria), guardando, limpiando memoria, rehydratando desde storage, y verificando que el nivel persiste.

**Escenarios de aceptación**:

1. **Given** un juego en sesión con `skillLevel` de conteo = 3, **When** se completa un reto que incrementa conteo a 4, **Then** localStorage se actualiza reflejando la nueva habilidad
2. **Given** se guardó progreso en storage, **When** se abre una nueva sesión, **Then** las habilidades se restauran exactamente como se guardaron
3. **Given** se han guardado cambios en múltiples habilidades, **When** se recarga la sesión, **Then** todas las habilidades restauran sus valores individuales sin mezcla

---

### Historia de usuario 3 — Guardar destinos completados (Prioridad: P1)

El jugador completa todas las misiones de un destino (ej: Luna). El destino se marca como completado. Al reabrir el juego, Luna aparece como completada.

**Por qué tiene esta prioridad**: La persistencia de destinos desbloqueados es fundamental para la rejugabilidad y estructura de contenido (spec 021).

**Prueba independiente**: Puede probarse completando un destino, guardando, limpiando, rehydratando, y verificando que `destination.completed` refleja el estado guardado.

**Escenarios de aceptación**:

1. **Given** una sesión con destino Luna no completado, **When** se completan todas las misiones de Luna, **Then** el estado de Luna se marca como completado y se persiste en localStorage
2. **Given** múltiples destinos con estados diferentes (Luna completado, Marte no), **When** se guarda y rehydrata, **Then** cada destino restaura su estado correcto sin confusiones

---

### Historia de usuario 4 — Guardar tras evento clave (Prioridad: P2)

Los eventos de progreso significativo disparan guardar automáticamente: fin de reto, fin de destino, avance de nivel. No hay guardar manual explícito.

**Por qué tiene esta prioridad**: La persistencia automática en eventos mejora la experiencia (no hay que pensar en guardar), pero es secundaria si los escenarios 1-3 funcionan.

**Prueba independiente**: Puede probarse completando un reto, sin cerrar sesión, y verificando que localStorage fue actualizado en el evento (no solo al cerrar).

**Escenarios de aceptación**:

1. **Given** un reto se completa correctamente, **When** se actualiza el dominio de habilidad, **Then** localStorage se persiste automáticamente sin intervención del usuario
2. **Given** se está jugando en una sesión, **When** el jugador navega fuera sin cerrar, **Then** el último estado persisted es reciente (dentro del evento más reciente, no antiguo)

---

### Historia de usuario 5 — Esquema versionado (Prioridad: P2)

El esquema de datos incluye un número de versión. En futuras specs, si el modelo de progreso cambia, la versión se incrementa. Datos de versiones anteriores pueden migrarse o descartarse de forma controlada.

**Por qué tiene esta prioridad**: Facilita evolución futura sin romper datos antiguos, pero no es urgente si no existen cambios de esquema planeados.

**Prueba independiente**: Puede probarse verificando que los datos guardados incluyen un campo de versión, y que múltiples sesiones leen/respetan ese campo.

**Escenarios de aceptación**:

1. **Given** se guardan datos en localStorage, **When** se inspeccionan, **Then** incluyen un campo `version` con valor numérico
2. **Given** datos de versión antigua, **When** se cargan en una sesión, **Then** se aplica estrategia definida (migración, descarte, error controlado)

---

### Casos límite

* ¿Qué sucede si localStorage alcanza su límite de capacidad (tipicamente ~5MB)? → Sistema debe advertir o manejar gracefully, no fallar
* ¿Qué sucede si el jugador borra manualmente localStorage mientras juega? → Al siguiente evento de guardar, se recrea el almacén
* ¿Qué sucede si múltiples pestañas intentan guardar simultáneamente? → Una debe ser source of truth; comportamiento eventual consistent aceptable
* ¿Qué sucede si se importan datos de otra sesión (esquema igual pero valores dispares)? → Debe aceptar sin validar corrección de datos (se asume input válido)
* ¿Qué sucede con habilidades nuevas añadidas en specs futuras que no existen en datos antiguos? → Inicializar con dominio 0, no error
* ¿Qué sucede si los datos en localStorage son parcialmente válidos (ej: `skills` existe pero `destinations` falta)? → Restaurar campos válidos, inicializar campos faltantes con defaults, registrar en logs. Maximiza recuperación sin perder progreso válido. (Clarification Q2: Opción B)

---

## Requisitos

### Requisitos funcionales

**FR-001**: The system MUST load persisted player progress (skill levels and completed destinations) from localStorage on game startup.

**FR-002**: IF persisted data is missing or corrupted, THEN the system MUST initialize a clean initial state (all skills at level 0, no destinations completed) without throwing an error.

**FR-003**: WHEN a challenge is completed and a skill level changes, THEN the system MUST persist the updated skill level to localStorage.

**FR-004**: WHEN a destination is marked as completed, THEN the system MUST persist the completed destination to localStorage.

**FR-005**: WHILE a game session is active, WHEN a significant progression event occurs, THEN the system MUST automatically save to localStorage using fire-and-forget async pattern (initiate save, do not block game loop). Significant progression events are: (1) Challenge Completion (challenge finishes, skill level may change), (2) Destination Completion (all missions in destination done, destination marked complete), (3) Skill Level Change (any skill increments, e.g., after mastery threshold reached). Save failures are logged but do not interrupt game flow; recovery occurs on next event.

**FR-006**: The persisted data schema MUST include a version field to enable future data migrations.

**FR-007**: The system MUST serialize and deserialize player progress in a structured format (e.g., JSON) that preserves all required state.

**FR-008**: WHERE the persisted data schema is invalid or partially missing, the system MUST apply a permissive fallback strategy: (1) Validate structure (JSON parseable, has `skills` map, `destinations` map) and types (skillLevel is number, completed is boolean), (2) Restore all fields that pass validation, (3) Initialize missing or invalid sections with defaults, (4) Log validation failures for debugging. Do NOT validate value ranges (defer to spec 030). This allows data recovery without losing valid player progress.

**FR-009**: WHEN localStorage is unavailable or quota exceeded, the system MUST not crash but handle gracefully with logging.

**FR-010**: The persistence layer MUST be testeable without a browser (mock storage possible for unit tests).

### Requisitos no funcionales

**NFR-001**: Persistence operations (save/load) MUST complete in < 10ms for typical player progress data. Saves are non-blocking (fire-and-forget async); game loop continues immediately without waiting for storage write completion.

**NFR-002**: Player progress must survive browser restarts, tab closures, and accidental page refreshes.

**NFR-003**: The serialized data size should not exceed ~100KB for single-player progress (well under typical localStorage limits).

### Entidades clave

* **SkillProgress**: Represents mastery level of a single skill (e.g., counting, addition)
  - Attributes: `skillId`, `skillLevel` (numeric), `failureCount`, `lastUpdateTime`
  - Lifecycle: initialized at 0, increments on challenge completion or skill update events
  
* **DestinationState**: Represents completion status of a destination
  - Attributes: `destinationId`, `completed` (boolean), `missionsCompleted` (list), `lastVisitTime`
  - Lifecycle: created when destination first visited, marked completed when all missions done
  
* **PlayerProgress**: Root entity aggregating all player state
  - Attributes: `version` (schema version, numeric), `skills` (map of skillId → SkillProgress), `destinations` (map of destId → DestinationState), `lastSavedTime`
  - Lifecycle: created on first session, persisted after major events
  - **JSON serialization structure (Clarification: Schema A)**: Root-level version field with all data nested below
    ```json
    {
      "version": 1,
      "skills": {
        "counting": { "skillId": "counting", "skillLevel": 3, "failureCount": 2, "lastUpdateTime": "2026-08-21T10:30:00Z" },
        "addition": { "skillId": "addition", "skillLevel": 1, "failureCount": 5, "lastUpdateTime": "2026-08-21T09:15:00Z" }
      },
      "destinations": {
        "moon": { "destinationId": "moon", "completed": true, "missionsCompleted": ["mission_1", "mission_2", "mission_3"], "lastVisitTime": "2026-08-21T10:00:00Z" },
        "mars": { "destinationId": "mars", "completed": false, "missionsCompleted": ["mission_1"], "lastVisitTime": "2026-08-21T08:00:00Z" }
      },
      "lastSavedTime": "2026-08-21T10:30:45Z"
    }
    ```

---

## Criterios de éxito

### Resultados medibles

**SC-001**: Player can complete a challenge, close the game, reopen it, and verify their skill level matches what they left.

**SC-002**: 100% of significant progression events (Challenge Completion, Destination Completion, Skill Level Change) trigger a persist to localStorage within the same event handler (no delay or queue). No events missed, no out-of-order saves.

**SC-003**: Corrupted or missing data does not prevent game startup — clean initial state is created automatically.

**SC-004**: Persistence/restore cycle completes in < 50ms for typical progress data (measured in unit tests).

**SC-005**: Unit test coverage of load/save logic reaches ≥ 95% (excluding browser APIs where mocked).

**SC-006**: Schema includes version field and can be updated in future specs without data loss or errors.

---

## Suposiciones

* **Storage technology**: localStorage is the persistent storage backend (sufficient for single-player, single-device MVP). Multi-device sync or server-side backup are explicitly out of scope (future spec).

* **Data format**: JSON serialization is used for storage (compatible with localStorage's string-only values).

* **Browser context**: Game runs in a single browser tab per device initially (multi-tab conflicts are not a priority for v1).

* **Data validation**: Player progress data loaded from storage is validated for JSON structure and type correctness (e.g., skillLevel is number, completed is boolean), but NOT for value ranges (e.g., 0 ≤ skillLevel ≤ 10). Range validation deferred to 030-security-baseline. This allows graceful recovery of partially corrupted data while keeping v1 simple.

* **Initial state**: First session always starts with clean state (no pre-filled progress), using defaults from 006-skill-progress-model.

* **Dependency on 006 & 008**: SkillProgress model (006) and DestinationVisitState (008) are stable and won't break during this spec's implementation.

* **No migration v1→v0**: This is the first version of the schema (v1.0). No migration from older schemas exists yet (will be added when schema evolves).

---

## Alcance incluido / excluido

### Incluido en esta spec

* localStorage persistence layer for player progress
* Serialization/deserialization logic
* Load on startup, save on significant events
* Handling missing/corrupted data
* Version field for future migrations
* Unit test coverage (mocked storage)

### Explícitamente excluido

* Multi-device synchronization (future spec)
* Server-side backup or cloud save (future spec, separate authentication spec)
* Multiple player profiles (spec 029)
* Player name/identity persistence (spec 012 extends this same storage layer)
* Data encryption (spec 030-security-baseline)
* Advanced conflict resolution (v2+)

---

## Alineación con la constitución

* **Principio IV (Progresión adaptativa)**: El progreso por habilidad debe sobrevivir entre sesiones para mantener sentido. Sin persistencia, cada sesión restartea la dificultad adaptativa.

* **Principio VI (Simplicidad primero)**: `localStorage` es la solución más simple antes de introducir backend. Evita infraestructura especulativa.

* **Principio IX (Contenido dirigido por datos)**: El modelo de datos es explícito (SkillProgress, DestinationState), versionado, y testeable independientemente de UI.

---

## Notas para el planning y tasks

* **Testing strategy**: Core logic (serialization, versioning) must be unit-testeable with mocked storage. Playwright E2E (spec 033+) will validate full flow.

* **Dependency order**: Requires 006 (SkillProgress model) and 008 (DestinationVisitState). Can proceed after both are merged to develop.

* **Future extension point**: Spec 012 (player name) will extend this same persistence layer with an additional field (`playerName`). Design should allow easy addition of new fields.

* **Debt reference**: Spec 030 (security baseline) will add validation/sanitization of loaded data. For now, assume valid input.
