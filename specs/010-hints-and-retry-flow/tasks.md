---

title: "Pistas y reintento sin penalización"
feature: "010-hints-and-retry-flow"
type: "task-list"
version: "1.0"
created: "2026-08-21"
updated: "2026-08-21"
status: "Draft"
spec: "./spec.md"
plan: "./plan.md"
tags: ["game", "education", "challenges", "hints", "retry"]
dependencies: ["007-challenge-engine-core", "008-moon-destination-counting", "006-skill-progress-model"]
related_specs: ["009-adaptive-difficulty-v1"]
------------------------------------------------------------

# Tareas: Pistas y reintento sin penalización

**Entrada**: Documentos de diseño de `/specs/010-hints-and-retry-flow/`

**Prerrequisitos**: `plan.md` y `spec.md` · `research.md`, `data-model.md`, `contracts/hint-contract.md` y `quickstart.md`.

**Organización**: Las tareas se agrupan por historia de usuario para permitir que cada historia pueda implementarse, probarse y validarse de forma independiente.

## Convenciones de rutas

* **Proyecto único**: `src/game/core/` (módulos puros, sin Phaser); `src/game/overlay/` y `src/game/scenes/` (presentación); `docs/conventions/architecture/` (documentación técnica actualizada al cierre).

## Estrategia de pruebas

Por decisión de `plan.md` (sección "Estrategia de pruebas"), la cobertura automatizada de esta feature es unitaria (Vitest, sin Phaser/DOM): extensión de dos ficheros de test ya existentes
([challenge-engine.test.ts](../../src/game/core/challenge-engine/challenge-engine.test.ts) y
[destination-visit-state.test.ts](../../src/game/core/destination-visit/destination-visit-state.test.ts)),
sin fichero de test nuevo (no se crea ningún módulo `core/` nuevo). No hay tests de integración/E2E dedicados: la verificación del flujo completo en `DestinationScene`/`challenge-dialogue` se hace por revisión de código y `quickstart.md`.

---

## Fase 1: Setup

**Propósito**: Preparar dependencias y configuración necesarias antes de escribir código.

N/A — esta feature no añade ninguna dependencia de producción, configuración de test ni tooling nuevo (`research.md` no identifica ninguno; se reutilizan `libs/components/button`, `libs/components/dialog`, `libs/components/icon` y Vitest ya configurados desde `004`/`008`). No se generan tareas artificiales para esta fase.

---

## Fase 2: Foundational

**Propósito**: Extender el contrato de `Challenge` (007) con pistas, implementar la función pura genérica `requestHint()` en el motor de retos, y extender `DestinationVisitState` (008) con el tracking de pistas reveladas y la función `requestNextHint()`. Bloquea US2 (necesita mostrar pistas) y US3 (necesita verificar la neutralidad de `requestNextHint()`); US1 solo se ve afectada tangencialmente (el nuevo campo `hintsRevealedCount` no debe alterar el comportamiento de reintento ya existente).

**Gate**: US2 y US3 no pueden comenzar hasta completar esta fase.

* [ ] T001 [P] [FR-001][FR-002] En [src/game/core/challenge-engine/challenge-engine.type.ts](../../src/game/core/challenge-engine/challenge-engine.type.ts), añadir `export interface Hint { readonly id: string; readonly order: number; readonly text: string; }` y el campo opcional `readonly hints?: readonly Hint[];` en `Challenge` (data-model.md)
* [ ] T002 [P] [FR-002][NFR-001] En [src/game/core/challenge-engine/challenge-engine.constants.ts](../../src/game/core/challenge-engine/challenge-engine.constants.ts), añadir `COUNTING_HINT_1_TEXT = 'Señala cada estrella con el dedo y cuenta de una en una.'`, `COUNTING_HINT_2_TEXT = 'Agrupa las estrellas de dos en dos: así cuentas más rápido.'`, `COUNTING_HINT_1_ID = 'counting-hint-1'`, `COUNTING_HINT_2_ID = 'counting-hint-2'`, `COUNTING_HINT_ORDER_FIRST = 1`, `COUNTING_HINT_ORDER_SECOND = 2`, y `COUNTING_HINTS: readonly Hint[]` construida a partir de esas constantes (research.md §3, importar `Hint` de `./challenge-engine.type`)
* [ ] T003 [FR-001][FR-002] En [src/game/core/challenge-engine/challenge-engine.ts](../../src/game/core/challenge-engine/challenge-engine.ts), modificar `generateCountingChallenge()` para adjuntar siempre `hints: COUNTING_HINTS` (T002) al `CountingChallenge` devuelto (depende de T001, T002)
* [ ] T004 [FR-009] En [src/game/core/challenge-engine/challenge-engine.ts](../../src/game/core/challenge-engine/challenge-engine.ts), añadir la función pura y genérica `export function requestHint(challenge: Challenge, hintIndex: number): Hint | undefined { return challenge.hints?.[hintIndex]; }` — sin patrón de registro por tipo (research.md §1, contracts/hint-contract.md H1-H2, depende de T001)
* [ ] T005 [P] En [src/game/core/challenge-engine/challenge-engine.test.ts](../../src/game/core/challenge-engine/challenge-engine.test.ts), añadir casos que confirmen: un `CountingChallenge` generado por `generateChallenge()` incluye `hints` con 2 elementos y `order` estrictamente creciente (1, 2); `requestHint(challenge, 0)`/`requestHint(challenge, 1)` devuelven la `Hint` esperada; `requestHint(challenge, 2)` devuelve `undefined` sin lanzar excepción (H2) (depende de T003, T004)
* [ ] T006 [P] [FR-001] En [src/game/core/destination-visit/destination-visit-state.type.ts](../../src/game/core/destination-visit/destination-visit-state.type.ts), añadir el campo `readonly hintsRevealedCount: number;` a `DestinationVisitState` (data-model.md)
* [ ] T007 [FR-005][FR-010] En [src/game/core/destination-visit/destination-visit-state.ts](../../src/game/core/destination-visit/destination-visit-state.ts), inicializar `hintsRevealedCount: 0` en `createDestinationVisit()`, y en `submitAnswer()` reiniciar `hintsRevealedCount` a `0` cuando el `outcome` es `'success'` y avanza `currentIndex` (H6), preservando su valor sin cambios cuando el `outcome` es `'failure'` (H5) (depende de T006)
* [ ] T008 [FR-006][FR-007] En [src/game/core/destination-visit/destination-visit-state.ts](../../src/game/core/destination-visit/destination-visit-state.ts), añadir `export function requestNextHint(visit: DestinationVisitState, skillState: SkillProgressState): { visit: DestinationVisitState; skillState: SkillProgressState; hint: Hint | undefined }` que llama a `requestHint(getCurrentChallenge(visit), visit.hintsRevealedCount)` (T004); si devuelve una `Hint`, invoca `updateSkillProgress(skillState, SKILL_COUNTING_ID, 'hint-used')` e incrementa `hintsRevealedCount` en el `visit` devuelto; si devuelve `undefined`, devuelve `visit`/`skillState` sin cambios y no llama a `updateSkillProgress` (H2, H4, contracts/hint-contract.md, depende de T004, T007)
* [ ] T009 [P] En [src/game/core/destination-visit/destination-visit-state.test.ts](../../src/game/core/destination-visit/destination-visit-state.test.ts), añadir casos que confirmen: `requestNextHint()` devuelve la primera pista e incrementa `hintsRevealedCount` a 1; una segunda llamada devuelve la segunda pista e incrementa a 2; una tercera llamada devuelve `hint: undefined` sin incrementar más (H3); y que la suite existente de garantías G1-G6 (`destination-visit-contract.md`, 008) sigue pasando sin cambios tras añadir `hintsRevealedCount` (depende de T007, T008)

**Checkpoint**: `Challenge`/`CountingChallenge` (007) incluyen pistas; `requestHint()` genérico implementado y testeado; `DestinationVisitState` (008) trackea pistas reveladas con reinicio/preservación correctos; `requestNextHint()` implementado y testeado a nivel de módulo, listo para conectarse a la UI.

---

## Fase 3: Historia de usuario 1 - Reintentar sin penalización tras error (Prioridad: P1)

**Objetivo**: Un jugador que falla un reto puede reintentarlo de inmediato, sin ninguna penalización de juego, tantas veces como necesite.

**Prueba independiente**: Responder incorrectamente a un reto de conteo existente y verificar que (a) aparece feedback de error claro, (b) el mismo reto sigue disponible, (c) no hay reducción de puntuación ni vidas, (d) el jugador puede reintentarlo inmediatamente.

**Requisitos relacionados**: FR-010

**Escenarios de aceptación relacionados**: Historia de usuario 1, escenarios 1-4 de spec.md

**Nota de independencia**: El reintento sin penalización ya está implementado por `008` (garantías G2/G4 de `destination-visit-contract.md`) y no requiere código nuevo; esta historia se valida como regresión frente al campo `hintsRevealedCount` añadido en la Fase 2.

### Implementación de US1

* [ ] T010 [US1] [FR-010] En [src/game/core/destination-visit/destination-visit-state.test.ts](../../src/game/core/destination-visit/destination-visit-state.test.ts), añadir un caso que confirme que, tras una respuesta incorrecta, `currentIndex`, `status` y `hintsRevealedCount` permanecen sin cambios respecto al estado previo (H5, regresión explícita de G2/G4 de 008 combinada con el nuevo campo) (depende de T009)
* [ ] T011 [US1] Revisar [src/game/scenes/DestinationScene.ts](../../src/game/scenes/DestinationScene.ts) (rama de fallo de `handleAnswerSelected`, ya existente desde 008) y confirmar por lectura de código que el reintento sigue mostrando `MOON_CHALLENGE_RETRY_MESSAGE` sin ningún elemento de penalización — no requiere cambios de código en esta historia, solo verificación

**Checkpoint US1**:

* El reintento sin penalización sigue funcionando exactamente igual que en `008` (regresión verificada).
* El nuevo campo `hintsRevealedCount` no altera `currentIndex`/`status` en un fallo (H5).
* US1 funciona de forma independiente y constituye el MVP ya entregado por `008`.

---

## Fase 4: Historia de usuario 2 - Solicitar y recibir una pista progresiva (Prioridad: P1)

**Objetivo**: Tras fallar un reto con pistas definidas, el jugador puede pedir ayuda progresiva de forma amable, integrada en la narrativa de BOT-6, sin sentir que es un castigo.

**Prueba independiente**: Fallar un reto de conteo, pedir una pista, verificar que (a) aparece de forma clara e integrada en el diálogo de BOT-6, (b) no se muestra como un "castigo", (c) el jugador puede seguir reintentando, (d) pedir una segunda pista muestra la siguiente en la secuencia, y una tercera muestra un mensaje amable de agotamiento.

**Requisitos relacionados**: FR-003, FR-004, FR-005, FR-008, FR-009, FR-010

**Escenarios de aceptación relacionados**: Historia de usuario 2, escenarios 1-4 de spec.md

### Implementación de US2

* [ ] T012 [P] [US2] [FR-003][NFR-001] En [src/game/overlay/challenge-dialogue.constants.ts](../../src/game/overlay/challenge-dialogue.constants.ts), añadir `CHALLENGE_DIALOGUE_HINT_BUTTON_VARIANT = 'secondary' as const`, `CHALLENGE_DIALOGUE_HINT_BUTTON_SIZE = 'medium' as const`, `CHALLENGE_DIALOGUE_HINT_BUTTON_LABEL = 'Pedir pista'`, y `CHALLENGE_DIALOGUE_NO_MORE_HINTS_TEXT = '¡Esas son todas las pistas que tengo por ahora!'` (research.md §4, nunca variante `'danger'`)
* [ ] T013 [US2] [FR-003][FR-004][FR-005][FR-010] En [src/game/overlay/challenge-dialogue.ts](../../src/game/overlay/challenge-dialogue.ts), extender `ChallengeDialogueProps` con `hints?: readonly Hint[]`, `hintsRevealedCount?: number` y `onRequestHint?: () => void`; cuando `onRequestHint` está presente y `hints` tiene elementos, renderizar las pistas ya reveladas (`hints.slice(0, hintsRevealedCount)`) como contenido de texto adicional del diálogo, y añadir a `actions` un botón `createButton({ label: CHALLENGE_DIALOGUE_HINT_BUTTON_LABEL, variant: CHALLENGE_DIALOGUE_HINT_BUTTON_VARIANT, size: CHALLENGE_DIALOGUE_HINT_BUTTON_SIZE, onClick: onRequestHint })` mientras `hintsRevealedCount < hints.length`, sustituyéndolo por el texto `CHALLENGE_DIALOGUE_NO_MORE_HINTS_TEXT` (T012) cuando se agotan (depende de T001, T012)
* [ ] T014 [US2] [FR-003][FR-004] En [src/game/scenes/DestinationScene.ts](../../src/game/scenes/DestinationScene.ts), en la rama de fallo de `handleAnswerSelected` (ya existente), pasar `hints: currentChallenge.hints`, `hintsRevealedCount: updatedVisit.hintsRevealedCount` y `onRequestHint: () => this.handleRequestHint()` a `createChallengeDialogue`; nunca pasar estas props en el primer intento (edge case de spec.md) (depende de T013)
* [ ] T015 [US2] [FR-004][FR-005] En [src/game/scenes/DestinationScene.ts](../../src/game/scenes/DestinationScene.ts), añadir el método privado `handleRequestHint()` que llama a `requestNextHint(this.destinationVisitState, this.skillProgressState)` (T008), actualiza `this.destinationVisitState`/`this.skillProgressState`, elimina el `challengeDialogueElement` actual y vuelve a crear el diálogo (mismo patrón que `handleAnswerSelected`) con las props actualizadas de T014 (depende de T008, T014)
* [ ] T016 [P] [US2] [FR-005] En [src/game/core/destination-visit/destination-visit-state.test.ts](../../src/game/core/destination-visit/destination-visit-state.test.ts), añadir un caso que confirme que llamadas sucesivas a `requestNextHint()` nunca repiten la misma `Hint` mientras existan pistas no reveladas (H3, complementa T009) (depende de T009)
* [ ] T017 [US2] [FR-008] Revisar [src/game/scenes/DestinationScene.ts](../../src/game/scenes/DestinationScene.ts) (rama de éxito de `handleAnswerSelected`, mensaje `MOON_CHALLENGE_SUCCESS_MESSAGE`) y confirmar por lectura de código que el feedback de acierto no cambia ni añade ningún indicador negativo cuando `hintsRevealedCount > 0` al momento de acertar — no requiere cambios de código, solo verificación (FR-008)

**Checkpoint US2**:

* El botón "Pedir pista" aparece solo tras un fallo, con variante `'secondary'` (nunca `'danger'`).
* Las pistas se muestran progresivamente, sin repetición, integradas en el diálogo de BOT-6 (FR-004/FR-010).
* Al agotarse las pistas, se muestra un mensaje amable en vez de hacer desaparecer el botón sin explicación (FR-005).
* El feedback de acierto no cambia por haber usado pistas (FR-008).
* US2 funciona de forma independiente de US1 (reutiliza su UI de reintento sin modificarla).

---

## Fase 5: Historia de usuario 3 - El uso de pistas queda registrado de forma neutra, sin afectar la dificultad (Prioridad: P2)

**Objetivo**: Solicitar pistas se registra vía `'hint-used'` (006) sin modificar `level`/`failureCount` de la habilidad ni la dificultad adaptativa (009).

**Prueba independiente**: Completar un reto de conteo usando una o más pistas, comparar el nivel de dominio de la habilidad antes y después, y verificar que permanece igual (salvo por los efectos ya existentes de la respuesta final).

**Requisitos relacionados**: FR-006, FR-007

**Escenarios de aceptación relacionados**: Historia de usuario 3, escenarios 1-3 de spec.md

**Nota de independencia**: Reutiliza `requestNextHint()` ya implementado en la Fase 2 (T008); esta historia añade la verificación explícita de neutralidad que la Fase 2 no cubre en detalle.

### Implementación de US3

* [ ] T018 [US3] [FR-006][FR-007] En [src/game/core/destination-visit/destination-visit-state.test.ts](../../src/game/core/destination-visit/destination-visit-state.test.ts), añadir un caso que capture `skillState.counting.level`/`failureCount` antes de llamar a `requestNextHint()`, y confirme que ambos valores permanecen idénticos después de una o más llamadas (regla N4 de `006`, H4 de `contracts/hint-contract.md`) (depende de T008)
* [ ] T019 [US3] [FR-007] En el mismo fichero, añadir un caso que confirme que llamar a `requestNextHint()` una o más veces antes de `submitAnswer()` no cambia el `outcome` (`'success'`/`'failure'`) que `submitAnswer()` habría devuelto sin haber pedido pistas, para la misma respuesta (independencia de la validación final, FR-007) (depende de T008)
* [ ] T020 [US3] Ejecutar manualmente el paso 3 de [quickstart.md](./quickstart.md) (verificación de neutralidad de `requestNextHint()`) y confirmar que el resultado observado coincide con lo documentado

**Checkpoint US3**:

* `level`/`failureCount` de la habilidad `counting` no cambian por pedir pistas (H4, regla N4 de 006).
* La validación de la respuesta final no se ve alterada por haber pedido pistas previamente (FR-007).
* US3 funciona de acuerdo con su prueba independiente, sin introducir ningún cambio en las reglas de `006`/`009`.

---

## Fase final: Integración y aspectos transversales

**Propósito**: Validar que la implementación completa satisface `spec.md`, `plan.md` y `constitution.md`, y cerrar la documentación de convenciones que ya anticipaba este contrato.

* [ ] T021 [P] Verificar que [challenge-engine.ts](../../src/game/core/challenge-engine/challenge-engine.ts), [challenge-engine.type.ts](../../src/game/core/challenge-engine/challenge-engine.type.ts), [challenge-engine.constants.ts](../../src/game/core/challenge-engine/challenge-engine.constants.ts), [destination-visit-state.ts](../../src/game/core/destination-visit/destination-visit-state.ts) y [destination-visit-state.type.ts](../../src/game/core/destination-visit/destination-visit-state.type.ts) no importan `phaser` ni acceden al DOM (revisión de código, regla R1 de `game-engine-scenes.md`)
* [ ] T022 [P] Ejecutar `node scripts/check-components.mjs` y confirmar que no hay literales mágicos sueltos en los ficheros nuevos/modificados fuera de sus `*.constants.ts`
* [ ] T023 Actualizar [docs/conventions/architecture/challenge-engine-contract.md](../../docs/conventions/architecture/challenge-engine-contract.md) para marcar la regla R4 (pistas progresivas como acción de primera clase) como implementada por `010`, referenciando `contracts/hint-contract.md`
* [ ] T024 [P] Añadir una nota breve al inicio de [specs/008-moon-destination-counting/contracts/destination-visit-contract.md](../../specs/008-moon-destination-counting/contracts/destination-visit-contract.md) indicando que `DestinationVisitState` fue ampliado por `010` con `hintsRevealedCount` y la función `requestNextHint()`, sin reescribir el resto del contrato histórico de `008` (mismo tratamiento ya aplicado por `009`)
* [ ] T025 Ejecutar la validación manual completa de [quickstart.md](./quickstart.md) (pasos 1-5: pistas adjuntas, `requestHint()` puro, `requestNextHint()` y neutralidad, reinicio al avanzar, preservación en reintento)
* [ ] T026 Ejecutar `npm run lint && npm test && npm run build` y confirmar que el gate de CI pasa incluyendo las extensiones de `challenge-engine`, `destination-visit-state`, `challenge-dialogue` y `DestinationScene`
* [ ] T027 Verificar que los 9 principios de la Comprobación de la constitución en `plan.md` siguen satisfechos tras la implementación completa (re-chequeo post-diseño exigido por el propio `plan.md`)

**Checkpoint final**: La funcionalidad completa satisface `spec.md`, `plan.md` y `constitution.md`; la documentación de convenciones que ya anticipaba el contrato de pistas (R4) queda marcada como implementada, y el contrato histórico de `008` queda anotado para evitar confusiones futuras sobre el estado vigente de `DestinationVisitState`.

---

## Dependencias y orden de ejecución

### Dependencias entre fases

* **Setup (Fase 1)**: N/A, sin tareas.
* **Foundational (Fase 2)**: Sin dependencias externas nuevas (reutiliza `006`/`007`/`008` ya implementadas). T001-T005 (motor de retos) son independientes de T006-T009 (visita al destino) salvo por T008, que depende de T004 (`requestHint`); ambos bloques deben completarse antes de que US2/US3 puedan comenzar.
* **Historias de usuario (Fase 3+)**: US1 depende únicamente de T007/T009 (Foundational). US2 depende de T001, T004, T008 y T012-T015 (UI). US3 depende únicamente de T008 (Foundational).
* **Integración y aspectos transversales (Fase final)**: Depende de US1, US2 y US3 completas.

### Dependencias entre historias de usuario

* **US1 (P1)**: Ninguna tras Foundational — regresión sobre comportamiento ya existente de `008`.
* **US2 (P1)**: Ninguna funcional tras Foundational; comparte fichero de test (`destination-visit-state.test.ts`) con US1/US3 por edición secuencial, no por acoplamiento.
* **US3 (P2)**: Ninguna funcional tras Foundational; se beneficia de que US2 ya haya ejercitado `requestNextHint()` desde la UI, pero puede validarse igualmente solo con los tests unitarios de Foundational.

### Orden dentro de cada historia

1. Modelos y contratos necesarios (Foundational, ya completado antes de Fase 3).
2. Pruebas unitarias específicas de la historia.
3. Implementación de UI/integración cuando aplique (solo US2).
4. Verificación de escenarios de aceptación (revisión de código o test).

## Oportunidades de paralelización

* T001, T002 (Foundational) son paralelas: ficheros distintos (`challenge-engine.type.ts`, `challenge-engine.constants.ts`).
* T005, T006 son paralelas entre sí: `challenge-engine.test.ts` (motor de retos) vs `destination-visit-state.type.ts` (visita al destino).
* T009 y T016 no son paralelas entre sí (mismo fichero `destination-visit-state.test.ts`, edición secuencial).
* T021, T022, T024 (Fase final) son paralelas: revisión de imports, linter de literales mágicos y nota de contrato son independientes entre sí.

## Ejemplo de paralelización: Foundational

```text
Task: "En challenge-engine.type.ts, añadir interfaz Hint y Challenge.hints?"
Task: "En challenge-engine.constants.ts, añadir COUNTING_HINT_1_TEXT/COUNTING_HINT_2_TEXT/COUNTING_HINTS"
```

```text
Task: "En destination-visit-state.type.ts, añadir hintsRevealedCount"
Task: "En challenge-engine.test.ts, cubrir hints adjuntos y requestHint()"
```

## Estrategia de implementación

### MVP primero

1. Completar la Fase 2 (Foundational): `Hint`, `requestHint()`, `hintsRevealedCount`, `requestNextHint()`.
2. Validar US1 (regresión de reintento sin penalización, ya entregado por `008`).
3. Detenerse aquí si el MVP definido por `spec.md` es solo "reintento sin penalización" (ya en producción desde `008`); en la práctica, el valor nuevo de esta feature requiere completar también US2.

### Entrega incremental

1. Setup (N/A) + Foundational.
2. US1 → validar (regresión) → entregar.
3. US2 → validar (flujo de pistas end-to-end) → entregar.
4. US3 → validar (neutralidad) → entregar.
5. Fase final de integración y cierre de documentación de convenciones.

### Ejecución paralela

US1 (regresión) y las tareas Foundational de `challenge-engine` (T001-T005) pueden avanzar en paralelo con las de `destination-visit-state` (T006-T009) salvo por la dependencia puntual de T008 sobre T004. US2 y US3 solo pueden comenzar una vez cerrada toda la Fase 2, pero entre sí no tienen dependencia funcional y podrían implementarse en paralelo por dos desarrolladores distintos.
