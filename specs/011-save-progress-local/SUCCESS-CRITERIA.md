# SUCCESS-CRITERIA.md — Spec 011: Persistencia local de progreso

**Estado**: generado en la fase de convergencia (`/speckit-converge` → tarea
T044), sustituyendo al fichero homónimo que T038 marcaba `[x]` sin haber sido
creado realmente. Mapea cada criterio de éxito a la evidencia real que lo
verifica.

| Criterio | Cumplido | Evidencia |
|---|---|---|
| **SC-001** — Completar un reto, cerrar y reabrir el juego, y el nivel de habilidad coincide | ✅ | `libs/persistence/test/unit/auto-save-events.test.ts` ("[SC-001] should persist auto-save across load", simula una nueva sesión con una nueva instancia de `PersistenceService` sobre el mismo adapter). En el juego real: `src/game/main.ts` llama a `loadSkillProgressState()` al arrancar; `DestinationScene.ts` autoguarda en cada reto superado (ver `docs/guides/persistence-integration.md`). |
| **SC-002** — 100% de eventos de progresión disparan un save síncrono, sin cola ni retraso | ✅ | `EventSaveCoordinator` llama a `persistence.save()` de forma síncrona dentro del mismo manejador de evento (sin `setTimeout`/cola). Test: `auto-save-events.test.ts` ("[SC-002] should fire-and-forget", mide que 4 eventos combinados tardan < 100ms). |
| **SC-003** — Datos corruptos o ausentes no impiden el arranque | ✅ | `libs/persistence/test/unit/fallback.test.ts` y `deserialize.test.ts` (JSON malformado, campos ausentes/tipos inválidos → estado inicial limpio sin excepción). |
| **SC-004** — Ciclo persistencia/restauración < 50ms (medido en tests unitarios) | ✅ | [`libs/persistence/test/unit/performance.test.ts`](../../libs/persistence/test/unit/performance.test.ts) (añadido en T049/T050) mide de forma aislada un único `save()` (< 10ms), un único `load()` (< 10ms) y el ciclo completo save+load (< 50ms) sobre un `PlayerProgress` realista. |
| **SC-005** — Cobertura de tests de load/save ≥ 95% (excluyendo APIs de navegador mockeadas) | ⚠️ Parcial | Reporte generado en T046 (`libs/persistence/coverage/`, `npx vitest run --coverage` desde `libs/persistence/`): **98.44% de líneas**, 93.98% de sentencias, 91.11% de ramas, 100% de funciones sobre todo `libs/persistence/src/`. El criterio literal ("≥95%") se cumple para el métrica de líneas, que es la más citada en specs previas; sentencias/ramas quedan ligeramente por debajo. Huecos conocidos y no cubiertos por esta convergencia: algunas ramas de `validate.ts` (tipos inválidos poco comunes), `serialize.ts` (fallo interno de `JSON.stringify`) y `versioning.ts` (rama de migración futura, actualmente no implementada). |
| **SC-006** — El esquema incluye campo de versión y admite futuras migraciones sin pérdida de datos | ✅ | `PlayerProgress.version` + `libs/persistence/src/core/versioning.ts` (`detectVersion`, `migrateToCurrentVersion`, `getCurrentVersion`). Test: `libs/persistence/test/unit/versioning.test.ts`. La migración real entre versiones futuras no está implementada todavía (no hay una v2 del esquema), pero el mecanismo de detección/aviso existe. |

## Resumen

5 de 6 criterios cumplidos sin reservas (SC-001, SC-002, SC-003, SC-004, SC-006);
SC-005 cumplido con matiz de métrica (líneas ≥95%, sentencias/ramas ligeramente
por debajo). El gap de rendimiento aislado en SC-004 y el de tamaño de payload
en NFR-003 (`VALIDATION.md`) se cerraron en T049/T050 con
`libs/persistence/test/unit/performance.test.ts`. Las ramas residuales de
SC-005 quedan documentadas como deuda conocida en vez de darse por resueltas
silenciosamente.
