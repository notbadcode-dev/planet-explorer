---
title: "Persistencia local de progreso"
feature: "011-save-progress-local"
type: "implementation-plan"
version: "1.0"
created: "2026-08-21T18:30:00Z"
updated: "2026-08-22T00:00:00Z"
status: "Implemented"
spec: "./spec.md"
tags: ["progression", "data", "persistence", "storage", "game", "testing"]
dependencies: ["006-skill-progress-model", "008-moon-destination-counting"]
related_specs: ["012-player-name-identity", "030-security-and-privacy-baseline"]
---

# Plan de implementación: Persistencia local de progreso

**Rama**: `011-save-progress-local` | **Fecha**: 2026-08-21 | **Especificación**: [spec.md](./spec.md)

**Entrada**: Especificación de funcionalidad de `/specs/011-save-progress-local/spec.md`

**Nota**: Plan completado mediante `/speckit-plan` con 5 clarificaciones integradas en spec.md.

## Resumen

Implementar una capa de persistencia local (localStorage) que permita guardar y restaurar el progreso del jugador (niveles de habilidad y destinos completados) entre sesiones. La capa debe ser testeable sin dependencias del navegador, manejar fallos gracefully, incluir un esquema versionado para futuras migraciones, y usar un patrón de guardado automático asincrónico no-bloqueante en 3 eventos clave (completar reto, completar destino, cambio de habilidad). El enfoque técnico es localStorage con JSON serialización, validación de estructura/tipos (no rangos), y recuperación permisiva de datos parcialmente válidos.

## Contexto técnico

**Lenguaje/Versión**: TypeScript 5 (strict mode), compiled via Vite 8.2.1

**Dependencias principales**: Vitest 4.1.10 (testing), vanilla DOM (no framework)

**Almacenamiento**: localStorage (browser-side, MVP scope; backend/multi-device deferred to spec 030)

**Testing**: Vitest for unit tests (mocked storage, pure logic); Playwright E2E from spec 033+

**Plataforma objetivo**: Modern browsers (ES2020+), single-device/single-tab initially

**Tipo de proyecto**: Game library + progressive web app (Vite + Phaser 3 renderer)

**Objetivos de rendimiento**: Save/load cycle < 10ms; serialization < 50ms for typical data (~100KB max)

**Restricciones**: Offline-capable (no server dependency v1), localStorage quota (~5MB), GitHub Pages compatible

**Escala/Alcance**: Single player, single active session, ~10 skills max, ~20 destinations estimated

## Comprobación de la constitución

> **GATE**: Debe superarse antes de iniciar la Fase 0 de investigación. Debe volver a comprobarse después de la Fase 1 de diseño.

**✅ GATE PASSED** — Todas las comprobaciones superadas sin desviaciones.

| Principio | Estado | Detalles |
|-----------|--------|----------|
| **I. UX centrada en el niño** | ✅ Cumple | Auto-save es silencioso (no-bloqueante); no penaliza. Fallback transparente recupera progreso válido. |
| **IV. Progresión adaptativa** | ✅ Cumple | Persistencia de habilidades permite que dificultad adaptativa (spec 009) sea significativa entre sesiones. |
| **VI. Simplicidad primero** | ✅ Cumple | localStorage MVP es la solución más simple. No se introduce backend, encryption, o sync especulativa. |
| **VII. Separación lógica/renderizado** | ✅ Cumple | Capa de persistencia testeable sin navegador, DOM, o Phaser. Core logic separado de I/O. |
| **VIII. Desarrollo incremental** | ✅ Cumple | Feature es vertical slice funcional (load/save ciclo completo). Specs 012 (name), 030 (encryption) extienden sin rediseño. |
| **IX. Contenido dirigido por datos** | ✅ Cumple | Esquema versionado, JSON estructurado, sin datos hard-coded. Permite futuras migraciones. |
| **X. Cobertura exhaustiva testing** | ✅ Cumple | Unit tests obligatorios (mocked storage, puro TypeScript). E2E via spec 033+. Ambos cubiertos en strategy. |

## Investigación técnica

**N/A** — Todas las decisiones técnicas se derivaron directamente de `/speckit-clarify` (5 clarificaciones integradas). No hay ambigüedades remanentes que requieran investigación adicional.

Clarificaciones ejecutadas:
- Q1: Estructura JSON → Opción A (raíz única con `version`)
- Q2: Fallback → Opción B (estrategia permisiva, restaurar válidos + defaults)
- Q3: Eventos auto-save → Opción A (3 eventos: Challenge Completion, Destination Completion, Skill Level Change)
- Q4: Sincronía → Opción B (async non-blocking/fire-and-forget)
- Q5: Validación → Opción A (estructura + tipos, no rangos)

Dependencias (specs 006, 008) ya implementadas y estables.

## Decisiones técnicas

### D1. Estructura JSON raíz única (Schema A)

**Decisión**: Root-level `version` field con todos los datos anidados directamente.

```json
{
  "version": 1,
  "skills": { "skillId": { "skillLevel": 3, ... } },
  "destinations": { "destId": { "completed": true, ... } },
  "lastSavedTime": "2026-08-21T10:30:45Z"
}
```

**Motivo**: Simplicidad máxima para v1 (Principio VI). Escalable para nuevas secciones en futuras specs (012 player name). Compatible con localStorage's string-only values.

**Alternativas descartadas**: Wrapper structure (metadata/payload) → Added unnecessary nesting. Per-entity versioning → Overhead, complejo para futuras migraciones.

### D2. Estrategia permisiva de fallback

**Decisión**: Restaurar campos válidos, completar faltantes con defaults, registrar en logs. NO descartar todo ni ser extremadamente permisivo.

**Motivo**: Maximiza recuperación de progreso válido sin perder habilidades guardadas. Permite que spec 012 (player name) se añada después sin romper datos v1. Alineado con Principio I (no penalizar).

**Alternativas descartadas**: Descartar TODO → Pierde progreso válido. Permiso extremo → Datos ruidosos, falsos positivos.

### D3. Tres eventos exactos para auto-save

**Decisión**: Challenge Completion, Destination Completion, Skill Level Change. NO incluir Fail attempts, Navigation, Mission completion.

**Motivo**: Estos 3 corresponden a cambios de **progresión principal** observable. Fail attempts y navigation afectan gameplay pero no el modelo P1. Minimiza overhead I/O, maximiza claridad de scope.

**Alternativas descartadas**: 5-6 eventos → Guardados ruidosos, difícil de testear, overhead innecesario. Defer → Ya clarificado.

### D4. Auto-save asincrónica no-bloqueante

**Decisión**: Fire-and-forget async pattern. Iniciar save, no esperar completion, game loop continúa. Fallos logueados, recuperados en próximo evento.

**Motivo**: localStorage es típicamente < 1ms, pero fire-and-forget evita UI lag (Principio I). Alineado con child-first experience. Recuperación automática en próximo evento.

**Alternativas descartadas**: Sync blocking → Puede lagear UX en browsers lentos, violaría Principio I. Async esperada → Algún lag, más complejo.

### D5. Validación estructura + tipos (NO rangos)

**Decisión**: Validar JSON parseable, estructura (skills map exists), tipos (skillLevel is number, completed is boolean). NO validar rangos (0 ≤ skillLevel ≤ 10).

**Motivo**: Suficiente para v1. Rangos deferred a spec 030 (security-baseline). Alineado con Principio VI. Fácil de testear, permite recuperación de datos levemente corrupto.

**Alternativas descartadas**: Validación extrema → Especulativa, complexidad innecesaria. Cero validación → Ruidoso, falsos positivos.

## Estrategia de pruebas

* **Unit** (Vitest, mocked storage):
  - Load from empty/missing storage → default state
  - Load from corrupted data → fallback + log
  - Load from valid partial data → restore valid, complete faltantes
  - Serialization JSON structure → correct schema A
  - Deserialization round-trip → data consistency
  - Validation logic → structure + types accepted, invalid types rejected
  - Auto-save triggers → 3 events only fire persistence
  - Async fire-and-forget → non-blocking (no promise wait in game loop)
  - Edge cases: quota exceeded, version field present, new skills in future data
  - Target: ≥95% line coverage (excluding browser APIs which are mocked)

* **Integration**: N/A (v1 is single-player, single-storage, localStorage only)

* **Contract**: N/A (no external API contracts; localStorage is browser-provided)

* **E2E** (Playwright, from spec 033+):
  - Complete challenge → skill persists across browser restart
  - Complete destination → destination state persists across refresh
  - Auto-save → data saved before unload event
  - Multi-event scenario → multiple saves in one session
  - Corrupted data recovery → invalid JSON in localStorage doesn't crash on load
  - Spec 033 will provide exhaustive E2E coverage of all UI from specs 001-032

## Estructura del proyecto

### Documentación de esta funcionalidad

```text
specs/011-save-progress-local/
├── spec.md              # Especificación funcional (5 clarificaciones integradas)
├── plan.md              # Este fichero (/speckit-plan)
├── research.md          # Fase 0: N/A (no ambigüedades) 
├── data-model.md        # Fase 1: Entidades y esquema JSON detallado
├── quickstart.md        # Fase 1: Validation guide (load/save cycle)
├── contracts/           # Fase 1: N/A (no external contracts)
├── checklists/
│   └── requirements.md  # Quality checklist (4/4 categories passing)
└── tasks.md             # Fase 2 (/speckit-tasks) - PENDIENTE
```

### Código fuente (raíz del repositorio)

Estructura de librería para persistencia (nueva):

```text
libs/
└── persistence/                    # NEW LIBRARY
    ├── src/
    │   ├── index.ts               # Exports públicas
    │   ├── types/
    │   │   ├── PlayerProgress.ts  # Type definitions (version, skills, destinations)
    │   │   └── StorageAdapter.ts  # Interface de storage (abstracta, mockeable)
    │   ├── adapters/
    │   │   └── LocalStorageAdapter.ts  # Implementación concreta localStorage
    │   ├── core/
    │   │   ├── deserialize.ts     # Cargar desde JSON (con fallback permisivo)
    │   │   ├── serialize.ts       # Guardar a JSON (Schema A)
    │   │   ├── validate.ts        # Validación estructura + tipos
    │   │   └── fallback.ts        # Estrategia permisiva (Opción B)
    │   └── integration/
    │       └── PersistenceService.ts  # Coordina load/save con eventos (async non-blocking)
    ├── test/
    │   ├── unit/
    │   │   ├── deserialize.test.ts    # Carga correcta, corrupción, parcial
    │   │   ├── serialize.test.ts      # Estructura JSON, round-trip
    │   │   ├── validate.test.ts       # Tipos, estructura, casos límite
    │   │   ├── fallback.test.ts       # Permisive recovery
    │   │   └── edge-cases.test.ts     # Quota, version, nuevas habilidades
    │   └── fixtures/
    │       └── mock-storage-adapter.ts   # Mocking para tests (sin navegador)
    └── package.json
```

Integración con lógica existente (modificaciones mínimas):

```text
libs/components/   # No cambios (persistencia es ortogonal)
src/               # Juego principal
├── game-loop.ts       # Llamará a PersistenceService en 3 eventos (Opción D3)
├── events/
│   └── progression-events.ts  # Challenge Completion, Destination Completion, Skill Level Change
└── services/
    └── persistence.ts         # Inyecta PersistenceService (adapter pattern)
```

**Decisión de arquitectura**: Persistencia como librería separada (modular, testeable sin navegador). `StorageAdapter` interface permite mockear localStorage en tests. Lógica pura separada de I/O (Principio VII). PersistenceService coordina load al startup y save en 3 eventos clave, usando async fire-and-forget (Opción D4).

## Modelo de datos

### Cambios de modelo de datos

Nuevas entidades (abstractas en esta capa, implementadas en specs 006/008):

**SkillProgress**
- `skillId`: string (ej: "counting", "addition")
- `skillLevel`: number (0-∞, adaptive por spec 009)
- `failureCount`: number (acumulador para dificultad adaptativa)
- `lastUpdateTime`: ISO8601 string

**DestinationState**
- `destinationId`: string (ej: "moon", "mars")
- `completed`: boolean
- `missionsCompleted`: string[] (misión IDs)
- `lastVisitTime`: ISO8601 string

**PlayerProgress** (root aggregate)
- `version`: number (1 para v1.0, future: 2 para migrations)
- `skills`: Map<skillId, SkillProgress>
- `destinations`: Map<destId, DestinationState>
- `lastSavedTime`: ISO8601 string

Persistencia: localStorage bajo clave `planet-explorer:progress` (JSON string, Schema A)

Migraciones: Ningunas para v1. Spec 030 define estrategia v1→v2.

## Contratos e interfaces

**N/A** — No hay contratos públicos externos. Persistencia es capa interna (consumida por spec 004 game loop, spec 009 dificultad adaptativa, spec 012 player name). Contratos entre librerías internalizados en data-model.md.

## Riesgos, compromisos y notas de implementación

### Riesgos identificados

| Riesgo | Impacto | Mitigación |
|--------|--------|------------|
| Multi-tab conflict (fire-and-forget async) | Eventual inconsistency if user plays in 2 tabs | ACCEPTED: eventual consistency OK for MVP. Spec 029 multi-profile handles later. |
| localStorage quota exceeded (~5MB) | Save silently fails, next event retries. User might not notice. | Spec 030 adds quota monitoring + user warning. v1 logs error silently. |
| Browser doesn't support localStorage | Persistent layer unavailable | Graceful degradation: log error, game continues (progress lost on reload). Spec 030 adds feature detect + UX warning. |
| Corrupted data from browser bug or manual edit | Fallback kicks in, some data lost | Spec 030 adds validation/sanitization. v1 logs and recovers best-effort. |

### Compromisos aceptados

- **v1 MVP scope**: localStorage only. No backend, sync, encryption (future specs).
- **No value range validation**: Deferred to spec 030. v1 trusts data structure/types only.
- **Fire-and-forget saves**: No guarantee of completion. Next event auto-retries. Acceptable trade-off: UX over certainty.
- **Single-tab initially**: Multi-tab conflicts are eventual-consistent (OK for first release).
- **No migration logic v1→v2**: Will be added when schema evolves (spec 030 or later).

### Notas de implementación

- **Inyección de dependencias**: StorageAdapter interface permite mockear localStorage en tests sin shimming global.
- **Logging**: Todos los fallbacks registran errores para debugging (sin throwing).
- **Encoding**: JSON.stringify/parse (built-in, no external dependency).
- **Testing**: 100% of core logic testeable sin navegador. Mocking de localStorage es trivial (interface-based, no global shimming).

<!--
  Incluye únicamente riesgos técnicos o compromisos relevantes que puedan
  afectar al desarrollo, mantenimiento, rendimiento, seguridad o experiencia.

  Evita riesgos hipotéticos de baja probabilidad sin impacto real.

  Si no existen riesgos relevantes, indica N/A.
-->

* **[RISK]**: [Impact and mitigation]
* **[TRADE-OFF]**: [Accepted compromise and rationale]

## Seguimiento de complejidad

> **Completar SOLO si Constitution Check detecta violaciones que deban justificarse.**

<!--
  Cada violación de constitution.md debe:
  - Estar identificada explícitamente.
  - Tener una necesidad concreta.
  - Explicar por qué una alternativa más simple no es suficiente.

  Si no existen violaciones, elimina esta tabla o indica N/A.
-->

| Violación                  | Por qué es necesaria | Alternativa más simple rechazada porque |
| -------------------------- | -------------------- | --------------------------------------- |
| [e.g., 4th project]        | [current need]       | [why 3 projects are insufficient]       |
| [e.g., Repository pattern] | [specific problem]   | [why direct DB access is insufficient]  |
