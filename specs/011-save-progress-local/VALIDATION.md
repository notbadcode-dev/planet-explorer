# VALIDATION.md — Spec 011: Persistencia local de progreso

**Estado**: generado en la fase de convergencia (`/speckit-converge` → tarea
T044), sustituyendo al fichero homónimo que T037 marcaba `[x]` sin haber sido
creado realmente. Mapea cada requisito funcional/no-funcional a la evidencia
real que lo verifica en el código actual del repositorio.

## Requisitos funcionales (FR-001 a FR-010)

| Requisito | Evidencia |
|---|---|
| **FR-001** — Cargar progreso persistido al arrancar | [`src/services/persistence.ts`](../../src/services/persistence.ts) (`loadSkillProgressState()`), llamado desde [`src/game/main.ts`](../../src/game/main.ts). Test: [`src/services/persistence.test.ts`](../../src/services/persistence.test.ts) ("returns the default state when nothing is persisted", "restores a previously auto-saved skill level on the next load"). |
| **FR-002** — Estado inicial limpio si los datos faltan/están corruptos | [`libs/persistence/src/core/deserialize.ts`](../../libs/persistence/src/core/deserialize.ts) + [`fallback.ts`](../../libs/persistence/src/core/fallback.ts). Tests: `libs/persistence/test/unit/deserialize.test.ts`, `fallback.test.ts`, `first-session.test.ts`. |
| **FR-003** — Persistir nivel de habilidad al completar un reto | [`DestinationScene.ts`](../../src/game/scenes/DestinationScene.ts) `handleAnswerSelected()` (rama de éxito) llama a `saveCoordinator.onChallengeCompleted(...)`. Tests: `libs/persistence/test/unit/skill-save.test.ts`, `auto-save-events.test.ts`. |
| **FR-004** — Persistir destino completado | `DestinationScene.ts` `handleAnswerSelected()` llama a `saveCoordinator.onDestinationCompleted(...)` cuando `updatedVisit.status === VISIT_STATUS_COMPLETED`. Test: `libs/persistence/test/unit/auto-save-events.test.ts` ("should auto-save on destination completion event"). |
| **FR-005** — Autoguardado fire-and-forget en eventos de progresión | `EventSaveCoordinator` (`libs/persistence/src/integration/EventSaveCoordinator.ts`) — cada `onX()` llama a `persistence.save()` sin `await`. Wired en `DestinationScene.ts` (T042). Test: `auto-save-events.test.ts` ("[SC-002] should fire-and-forget"). |
| **FR-006** — Campo de versión en el esquema persistido | `PlayerProgress.version` (`libs/persistence/src/types/PlayerProgress.ts`); gestionado por `libs/persistence/src/core/versioning.ts`. Test: `libs/persistence/test/unit/versioning.test.ts`. |
| **FR-007** — Serializar/deserializar en formato estructurado (JSON) | `libs/persistence/src/core/serialize.ts` / `deserialize.ts`. Tests: `serialize.test.ts`, `deserialize.test.ts`. |
| **FR-008** — Fallback permisivo ante esquema inválido/parcial | `libs/persistence/src/core/validate.ts` + `fallback.ts` (valida estructura y tipos, no rangos). Tests: `validate.test.ts`, `fallback.test.ts`. |
| **FR-009** — No fallar si `localStorage` no está disponible o excede cuota | `LocalStorageAdapter.checkAvailability()` + captura de excepciones en `getItem/setItem/removeItem/clear` (`libs/persistence/src/adapters/LocalStorageAdapter.ts`). Test: [`libs/persistence/test/unit/LocalStorageAdapter.test.ts`](../../libs/persistence/test/unit/LocalStorageAdapter.test.ts) (añadido en T046 — cubre las ramas "unavailable" y de error de cada método). |
| **FR-010** — Capa de persistencia testeable sin navegador | `MockStorageAdapter` (`libs/persistence/test/fixtures/MockStorageAdapter.ts`) + `vitest.config.ts` propio de `libs/persistence` con `environment: 'node'`. |

## Requisitos no funcionales (NFR-001 a NFR-003)

| Requisito | Evidencia |
|---|---|
| **NFR-001** — Save/load < 10ms, no bloqueante | `PersistenceService.save()`/`load()` son síncronos sobre `localStorage` (operación nativa, sub-milisegundo para el tamaño de dato manejado) y nunca usan `await`; medido indirectamente por `auto-save-events.test.ts` ("[SC-002]... duration < 100ms" para 4 eventos combinados). |
| **NFR-002** — Progreso sobrevive a reinicios/cierres de pestaña | Se apoya en la persistencia real del navegador vía `window.localStorage` (no hay caché en memoria que sustituya la fuente de verdad); verificado en `auto-save-events.test.ts` ("[SC-001] should persist auto-save across load", que crea una nueva instancia de `PersistenceService` para simular una nueva sesión). |
| **NFR-003** — Tamaño serializado < ~100KB | [`libs/persistence/test/unit/performance.test.ts`](../../libs/persistence/test/unit/performance.test.ts) (añadido en T049/T050) serializa un `PlayerProgress` realista (7 habilidades + 10 destinos) y verifica que el tamaño en bytes se mantiene por debajo de 100KB. |

## Notas de alcance

* La integración descrita en FR-003/FR-004/FR-005 solo cubre la habilidad
  `counting` y el destino Luna (único contenido jugable existente). Ver la
  limitación documentada en
  [`docs/guides/persistence-integration.md`](../../docs/guides/persistence-integration.md).
* Esta tabla refleja el estado del código en la fecha de creación de este
  fichero (tarea de convergencia T044). Si se añaden nuevos destinos/
  habilidades (specs `013-mars-destination-addition` y similares), debe
  revisarse si el wiring de `DestinationScene.ts` sigue siendo válido o
  necesita generalizarse.
