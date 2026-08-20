---

title: "Dificultad adaptativa v1"
feature: "009-adaptive-difficulty-v1"
type: "task-list"
version: "1.0"
created: "2026-08-20"
updated: "2026-08-20"
status: "Draft"
spec: "./spec.md"
plan: "./plan.md"
tags: ["game", "education", "progression", "challenges"]
dependencies: ["006-skill-progress-model", "007-challenge-engine-core"]
related_specs: ["008-moon-destination-counting"]
------------------------------------------------------------

# Tareas: Dificultad adaptativa v1

**Entrada**: Documentos de diseño de `/specs/009-adaptive-difficulty-v1/`

**Prerrequisitos**: `plan.md` y `spec.md` · `research.md`, `data-model.md`, `contracts/difficulty-contract.md` y `quickstart.md`.

**Organización**: Las tareas se agrupan por historia de usuario para permitir que cada historia pueda implementarse, probarse y validarse de forma independiente.

## Convenciones de rutas

* **Proyecto único**: `src/game/core/` (módulos puros, sin Phaser); `docs/conventions/architecture/` (documentación técnica actualizada al cierre).

## Estrategia de pruebas

Por decisión de `plan.md` (sección "Estrategia de pruebas"), la cobertura automatizada de esta feature es unitaria (Vitest, sin Phaser/DOM): un fichero nuevo `core/difficulty/difficulty.test.ts` que cubre las tres historias de usuario sobre la misma función pura (`getDifficultyConfig`), y la actualización de dos ficheros de test ya existentes (`challenge-engine.test.ts` para las correcciones R2/R5, `destination-visit-state.test.ts` para el nuevo rango derivado). No hay tests de integración/E2E dedicados: la verificación de que `createDestinationVisit` (008) consume `getDifficultyConfig` correctamente se hace vía `destination-visit-state.test.ts` y `quickstart.md`.

---

## Fase 1: Setup

**Propósito**: Preparar dependencias y configuración necesarias antes de escribir código.

N/A — esta feature no añade ninguna dependencia de producción, configuración de test ni tooling nuevo (`research.md` no identifica ninguno; Vitest y el `test.include` de `src/game/**/*.test.ts` ya existen desde `004`). No se generan tareas artificiales para esta fase.

---

## Fase 2: Foundational

**Propósito**: Crear el nuevo módulo puro `core/difficulty/`, corregir la deuda técnica de la retrospectiva R001 en `challenge-engine.ts` (R2: registro por tipo; R5: sin acoplamiento directo con `progress/`), e integrar ambos con `core/destination-visit/` (008) sustituyendo el rango fijo del destino Luna. Bloquea las 3 historias de usuario: todas verifican comportamiento de la misma función `getDifficultyConfig`.

**Gate**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

* [ ] T001 [P] [FR-002][FR-009] Crear [src/game/core/difficulty/difficulty.type.ts](../../src/game/core/difficulty/difficulty.type.ts) con el alias `type DifficultyConfigBuilder = (skillLevel: number) => ChallengeConfig;` (importando `ChallengeConfig` desde `../challenge-engine/challenge-engine.type`) (data-model.md)
* [ ] T002 [P] [FR-002][FR-009][FR-009a] Crear [src/game/core/difficulty/difficulty.constants.ts](../../src/game/core/difficulty/difficulty.constants.ts) con `DIFFICULTY_LEVEL_MIN = 1`, `DIFFICULTY_LEVEL_MAX = 10`, `DIFFICULTY_COUNTING_MIN_VALUE = 1`, `DIFFICULTY_COUNTING_MAX_BASE = 3`, `DIFFICULTY_COUNTING_MAX_STEP = 1`, y las factorías de error `makeInvalidSkillLevelError(skillLevel: number): Error` y `makeUnsupportedChallengeTypeForDifficultyError(challengeType: string): Error` (mismo patrón que `challenge-engine.constants.ts`) (research.md §1)
* [ ] T003 [FR-001][FR-002][FR-002a][FR-007][FR-009][FR-009a][FR-010] Crear [src/game/core/difficulty/difficulty.ts](../../src/game/core/difficulty/difficulty.ts) implementando `getDifficultyConfig(challengeType: string, skillLevel: number): ChallengeConfig` según `contracts/difficulty-contract.md` (G1-G5): valida `skillLevel` (1-10, si no lanza `makeInvalidSkillLevelError`), busca en un registro interno `Record<string, DifficultyConfigBuilder>` (una entrada `CHALLENGE_TYPE_COUNTING` → `buildCountingDifficultyConfig`, importando `CHALLENGE_TYPE_COUNTING` desde `../challenge-engine/challenge-engine.constants`; si no hay entrada, lanza `makeUnsupportedChallengeTypeForDifficultyError`), y devuelve `{ type, min: DIFFICULTY_COUNTING_MIN_VALUE, max: DIFFICULTY_COUNTING_MAX_BASE + (skillLevel - 1) * DIFFICULTY_COUNTING_MAX_STEP, difficulty: skillLevel }` para `counting` (depende de T001, T002)
* [ ] T004 [P] En [src/game/core/challenge-engine/challenge-engine.constants.ts](../../src/game/core/challenge-engine/challenge-engine.constants.ts), añadir `CHALLENGE_RESULT_SUCCESS = 'success'` y `CHALLENGE_RESULT_FAILURE = 'failure'` (preparación de la corrección R5, research.md §3)
* [ ] T005 (corrige R2 de la retrospectiva R001) En [src/game/core/challenge-engine/challenge-engine.ts](../../src/game/core/challenge-engine/challenge-engine.ts), sustituir el `if (config.type === CHALLENGE_TYPE_COUNTING) {...}` de `generateChallenge()` por un registro `Record<string, (config: ChallengeConfig) => Challenge>` (`CHALLENGE_GENERATORS`, una entrada `CHALLENGE_TYPE_COUNTING` → `generateCountingChallenge`); `generateChallenge()` busca el generador por `config.type` y lanza `makeUnsupportedChallengeTypeError` si no existe (research.md §2, sin cambiar la firma pública)
* [ ] T006 (corrige R5 de la retrospectiva R001) En [src/game/core/challenge-engine/challenge-engine.ts](../../src/game/core/challenge-engine/challenge-engine.ts), eliminar el import de `SKILL_UPDATE_RESULT_SUCCESS`/`SKILL_UPDATE_RESULT_FAILURE` desde `../progress/skill-progress-state.constants` en `validateAnswer()` y usar en su lugar `CHALLENGE_RESULT_SUCCESS`/`CHALLENGE_RESULT_FAILURE` de `challenge-engine.constants.ts` (T004); confirmar que `challenge-engine.ts` no importa nada de `../progress/` tras este cambio (research.md §3, depende de T004)
* [ ] T007 [P] Actualizar [src/game/core/challenge-engine/challenge-engine.test.ts](../../src/game/core/challenge-engine/challenge-engine.test.ts): añadir un caso que confirme que `generateChallenge()` sigue generando retos `counting` correctamente tras el cambio a registro (T005), un caso de tipo de reto no registrado que confirme el mismo error que antes, y un caso que confirme que `validateAnswer()` sigue devolviendo `'success'`/`'failure'` correctamente tras dejar de importar `progress/` (T006) (depende de T005, T006)
* [ ] T008 [FR-008] En [src/game/core/destination-visit/destination-visit-state.ts](../../src/game/core/destination-visit/destination-visit-state.ts), cambiar la firma de `createDestinationVisit` de `challengeConfigs: readonly CountingChallengeConfig[]` a `challengeConfigs: readonly ChallengeConfig[]`, e importar `getDifficultyConfig` de `../difficulty/difficulty` para sustituir `generateChallenge({ ...config, [CHALLENGE_DIFFICULTY_FIELD]: skillLevel })` por `generateChallenge(getDifficultyConfig(config.type, skillLevel))` (research.md §4, depende de T003)
* [ ] T009 [FR-008] En [src/game/core/content/destinations.constants.ts](../../src/game/core/content/destinations.constants.ts), simplificar `createMoonChallengeConfigs()` para devolver únicamente `{ type: CHALLENGE_TYPE_COUNTING }` por entrada (sin `min`/`max`) y eliminar las constantes `MOON_COUNTING_MIN`/`MOON_COUNTING_MAX`, ya sin uso (data-model.md, depende de T008)
* [ ] T010 [P] [FR-008][SC-005] Actualizar [src/game/core/destination-visit/destination-visit-state.test.ts](../../src/game/core/destination-visit/destination-visit-state.test.ts) para reflejar el rango `min`/`max` derivado de `getDifficultyConfig()` en vez del fijo `2`/`8` anterior, verificando además que dos visitas creadas con niveles de dominio distintos (p. ej. 1 y 10) producen retos con `max` distinto (depende de T008, T009)

**Checkpoint**: `core/difficulty/` implementado y testeado a nivel de módulo; deuda técnica R2/R5 de `challenge-engine.ts` corregida sin cambios de contrato público; `core/destination-visit/` (008) integrado con la nueva configuración derivada, con `destinations.constants.ts` ya sin rango fijo.

---

## Fase 3: Historia de usuario 1 - Los retos se vuelven más difíciles cuando el jugador domina una habilidad (Prioridad: P1)

**Objetivo**: Al subir el nivel de dominio de una habilidad, la configuración de dificultad del siguiente reto de ese tipo es estrictamente más exigente que la del nivel anterior.

**Prueba independiente**: Invocar `getDifficultyConfig('counting', level)` con niveles crecientes (1, 5, 10) y comprobar que el rango numérico devuelto es cada vez más exigente, sin necesidad de Phaser ni de una sesión de juego real.

**Requisitos relacionados**: FR-001, FR-002, FR-002a, FR-003, FR-007

**Escenarios de aceptación relacionados**: Historia de usuario 1, escenarios 1-2 de spec.md

### Implementación de US1

* [ ] T011 [US1] [FR-001][FR-002][FR-002a][FR-003][FR-009][FR-009a] En [src/game/core/difficulty/difficulty.test.ts](../../src/game/core/difficulty/difficulty.test.ts), crear el fichero y añadir un bloque `describe('getDifficultyConfig')` con casos que verifiquen: `max` estrictamente creciente entre niveles consecutivos 1-10 para `'counting'` (SC-001), `difficulty === skillLevel` en cada caso (FR-002a), que `getDifficultyConfig('counting', 0)` y `getDifficultyConfig('counting', 11)` lanzan `makeInvalidSkillLevelError` (FR-009), y que `getDifficultyConfig('memory', 3)` (tipo sin mapeo) lanza `makeUnsupportedChallengeTypeForDifficultyError` (FR-009a) (depende de T003)
* [ ] T012 [US1] [FR-007] En el mismo fichero [difficulty.test.ts](../../src/game/core/difficulty/difficulty.test.ts), añadir un caso que pase el resultado de `getDifficultyConfig('counting', 5)` directamente a `generateChallenge()` (007) y confirme que no lanza ningún error de validación y que `challenge.difficulty === 5` (depende de T011, T005, T006)

**Checkpoint US1**:

* `max` crece estrictamente con el nivel de dominio para `'counting'` (SC-001).
* `difficulty` del `ChallengeConfig` devuelto coincide siempre con el nivel solicitado (FR-002a).
* El resultado es aceptado directamente por `generateChallenge()` sin transformación (FR-007).
* US1 funciona de forma independiente y constituye el MVP de esta feature (spec.md, Historia de usuario 1 = P1).

---

## Fase 4: Historia de usuario 2 - Los retos se vuelven más asequibles cuando el jugador acumula fallos, sin comunicarlo como un castigo (Prioridad: P1)

**Objetivo**: Al bajar el nivel de dominio de una habilidad, la configuración de dificultad del siguiente reto es más asequible que la del nivel anterior, y ningún elemento visible del juego comunica esa bajada como un fracaso.

**Prueba independiente**: Invocar `getDifficultyConfig('counting', level)` con niveles decrecientes (p. ej. 6 y 5) y comprobar que el rango es más asequible; revisar el contenido narrativo ya existente (`bot6-messages.constants.ts`) para confirmar que ninguno referencia una "bajada de nivel" como evento negativo.

**Requisitos relacionados**: FR-004, FR-005, FR-006, FR-010

**Escenarios de aceptación relacionados**: Historia de usuario 2, escenarios 1-2 de spec.md

**Nota de independencia**: Comparte con US1 el mismo fichero [difficulty.test.ts](../../src/game/core/difficulty/difficulty.test.ts) (T011); US2 añade sus propios casos al mismo `describe`, por lo que T013 depende de T011/T012 por edición secuencial del mismo fichero, no por acoplamiento funcional real.

### Implementación de US2

* [ ] T013 [US2] [FR-004][FR-010] En [difficulty.test.ts](../../src/game/core/difficulty/difficulty.test.ts), añadir un caso que confirme que el nivel 5 produce una configuración más asequible (`max` menor) que el nivel 6 (FR-004), y un caso que confirme que niveles 1 y 10 devuelven siempre la misma configuración ante llamadas repetidas, sin error ni parámetros fuera de los límites soportados (FR-010) (depende de T011)
* [ ] T014 [US2] [FR-006] Revisar [src/game/core/content/bot6-messages.constants.ts](../../src/game/core/content/bot6-messages.constants.ts) y los overlays existentes (`src/game/overlay/`) y confirmar, por lectura de código, que ninguno de los mensajes o elementos visuales ya existentes referencia una bajada de nivel de dominio como fracaso o penalización — esta feature no añade ningún mensaje ni elemento de UI nuevo (Suposiciones de spec.md), por lo que no hay código que modificar, solo confirmar la ausencia

**Checkpoint US2**:

* La configuración de dificultad es estrictamente más asequible en niveles más bajos (SC-002).
* Los límites 1 y 10 producen una configuración estable sin errores (FR-010).
* Ningún mensaje ni elemento visual existente comunica una bajada de nivel como un castigo (FR-006, revisión de código).

---

## Fase 5: Historia de usuario 3 - El tiempo de respuesta nunca influye en la dificultad (Prioridad: P2)

**Objetivo**: La configuración de dificultad depende únicamente del nivel de dominio de la habilidad, nunca del tiempo que tarda el jugador en responder.

**Prueba independiente**: Confirmar que la firma de `getDifficultyConfig` solo acepta `challengeType` y `skillLevel` (ningún parámetro de tiempo), y que invocaciones repetidas con los mismos argumentos devuelven siempre el mismo resultado.

**Requisitos relacionados**: FR-005

**Escenarios de aceptación relacionados**: Historia de usuario 3, escenario 1 de spec.md

**Nota de independencia**: Depende de que US1/US2 ya existan para poder observar que el resultado no cambia (spec.md, "Por qué tiene esta prioridad"); añade sus casos al mismo [difficulty.test.ts](../../src/game/core/difficulty/difficulty.test.ts) (T011/T013).

### Implementación de US3

* [ ] T015 [US3] [FR-005] En [difficulty.test.ts](../../src/game/core/difficulty/difficulty.test.ts), añadir un caso que confirme que `getDifficultyConfig('counting', skillLevel)` devuelve exactamente el mismo resultado en dos invocaciones consecutivas con los mismos argumentos (determinismo, SC-003), y verificar por inspección de la firma de tipos de `getDifficultyConfig` (T003) que no existe ningún tercer parámetro de tiempo de respuesta (depende de T013)

**Checkpoint US3**:

* `getDifficultyConfig` es determinista: mismos argumentos, mismo resultado (SC-003).
* La firma de la función no admite tiempo de respuesta como entrada (FR-005).

---

## Fase final: Integración y aspectos transversales

**Propósito**: Validar que la implementación completa satisface `spec.md`, `plan.md` y `constitution.md`, y cerrar la deuda documental pendiente de la retrospectiva R001.

* [ ] T016 [P] Verificar que [difficulty.ts](../../src/game/core/difficulty/difficulty.ts), [difficulty.type.ts](../../src/game/core/difficulty/difficulty.type.ts) y [difficulty.constants.ts](../../src/game/core/difficulty/difficulty.constants.ts) no importan `phaser` ni acceden al DOM (revisión de código, regla R1 de `game-engine-scenes.md`, NFR-001)
* [ ] T017 [P] Ejecutar `node scripts/check-components.mjs` y confirmar que no hay literales mágicos sueltos en los ficheros nuevos/modificados fuera de sus `*.constants.ts`
* [ ] T018 Actualizar [docs/conventions/architecture/challenge-engine-contract.md](../../docs/conventions/architecture/challenge-engine-contract.md) para reflejar que R2 (registro por tipo) y R5 (sin import directo de `progress/`) ya están corregidas en la implementación, y que R3 (la configuración de dificultad procede de un módulo dedicado) se satisface mediante `core/difficulty/` (cierre del hallazgo de R001, sección "Contratos compartidos")
* [ ] T019 Actualizar [docs/conventions/architecture/game-engine-scenes.md](../../docs/conventions/architecture/game-engine-scenes.md) para incluir `core/difficulty/` en el listado de módulos puros de `core/` (cierre del hallazgo de R001, sección "Decisiones arquitectónicas transversales")
* [ ] T020 Ejecutar la validación manual de [quickstart.md](./quickstart.md) (pasos 1-4: mapeo nivel→rango, uso directo en `generateChallenge()`, errores esperados, integración con el destino Luna)
* [ ] T021 Ejecutar `npm run lint && npm test && npm run build` y confirmar que el gate de CI pasa incluyendo el nuevo módulo `core/difficulty/`, las correcciones R2/R5 de `challenge-engine.ts` y las extensiones de `destination-visit-state.ts`/`destinations.constants.ts`
* [ ] T022 [P] Añadir una nota breve al inicio de [specs/008-moon-destination-counting/contracts/destination-visit-contract.md](../../specs/008-moon-destination-counting/contracts/destination-visit-contract.md) indicando que la firma de `createDestinationVisit` fue ampliada por 009 (`CountingChallengeConfig[]` → `ChallengeConfig[]`), sin reescribir el resto del contrato histórico de 008

**Checkpoint final**: La funcionalidad completa satisface `spec.md`, `plan.md` y `constitution.md`; la deuda técnica y documental de R001 queda cerrada, y el contrato de 008 queda anotado para evitar confusiones futuras sobre la firma vigente.

---

## Dependencias y orden de ejecución

### Dependencias entre fases

* **Setup (Fase 1)**: N/A, sin tareas.
* **Foundational (Fase 2)**: Sin dependencias externas nuevas (reutiliza `006`/`007`/`008` ya implementadas); T005/T006 (R2/R5) son independientes de T001-T003 (nuevo módulo) pero ambas deben completarse antes de T007 (test de regresión) y antes de que US1 pueda validar FR-007 (T012).
* **Historias de usuario (Fase 3+)**: Dependen de las tareas Foundational (T001-T010). US2 y US3 dependen además de los casos de test añadidos por US1/US2 en el mismo fichero `difficulty.test.ts` (T011, T013), por edición secuencial, no por acoplamiento funcional.
* **Integración y aspectos transversales (Fase final)**: Depende de US1, US2 y US3 completas.

### Dependencias entre historias de usuario

* **US1 (P1)**: Ninguna tras Foundational.
* **US2 (P1)**: Depende de T011 (US1) — añade casos al mismo `describe` de `difficulty.test.ts`; sin acoplamiento funcional real (la función ya soporta ambas direcciones desde T003).
* **US3 (P2)**: Depende de T013 (US2) por el mismo motivo de fichero compartido; conceptualmente depende de que US1/US2 ya demuestren que el resultado varía con el nivel, para poder demostrar que NO varía con el tiempo (spec.md).

### Orden dentro de cada historia

1. Módulo `core/difficulty/` y correcciones R2/R5 ya resueltos en Foundational.
2. Casos de test de US1 (subida de nivel → más exigente, `difficulty` = nivel, uso directo en `generateChallenge()`).
3. Casos de test de US2 (bajada de nivel → más asequible, estabilidad en límites, revisión de ausencia de mensajes de penalización).
4. Casos de test de US3 (determinismo, ausencia de parámetro de tiempo).
5. Validación contra los escenarios de aceptación y cierre documental (Fase final).

## Oportunidades de paralelización

* T001, T002 y T004 (Foundational) pueden ejecutarse en paralelo — ficheros distintos, sin dependencias entre sí.
* T005 y T006 modifican el mismo fichero (`challenge-engine.ts`) y no son paralelizables entre sí, pero pueden empezar en paralelo con T001/T002/T003 (módulo `core/difficulty/` nuevo, fichero distinto).
* T007 y T010 (tests de regresión) pueden ejecutarse en paralelo entre sí una vez completadas sus dependencias respectivas (ficheros distintos).
* T016 y T017 (Fase final) pueden ejecutarse en paralelo — son revisiones de código/herramienta, no modifican los mismos ficheros ni dependen entre sí.
* T022 (Fase final) es independiente del resto de la Fase final — solo añade una nota a un fichero de la spec 008, sin dependencias funcionales.

## Ejemplo de paralelización: Foundational

```text
Task: "Crear difficulty.type.ts con el alias DifficultyConfigBuilder"
Task: "Crear difficulty.constants.ts con las constantes de la fórmula y las factorías de error"
Task: "Añadir CHALLENGE_RESULT_SUCCESS/FAILURE en challenge-engine.constants.ts"
```

## Estrategia de implementación

### MVP primero

1. Completar Foundational (T001-T010): módulo `core/difficulty/`, correcciones R2/R5, integración con `008`.
2. Implementar US1 (T011-T012).
3. Validar US1 contra sus escenarios de aceptación (subida de nivel, campo `difficulty`, uso directo en `generateChallenge()`).
4. Ejecutar `difficulty.test.ts`.
5. Detenerse aquí si se necesita entregar solo el MVP (dificultad adaptativa ascendente, sin bajada ni verificación explícita de independencia del tiempo todavía).

### Entrega incremental

1. Foundational.
2. US1 → validar → entregar (dificultad sube con el nivel de dominio).
3. US2 → validar → entregar (dificultad baja sin penalización comunicada).
4. US3 → validar → entregar (independencia del tiempo de respuesta confirmada).
5. Fase final → validar `spec.md`/`plan.md`/`constitution.md` en su totalidad y cerrar la deuda documental de R001.
