---

title: "Motor genérico de retos"
feature: "007-challenge-engine-core"
type: "task-list"
version: "1.0"
created: "2026-08-19"
updated: "2026-08-19"
status: "Draft"
spec: "./spec.md"
plan: "./plan.md"
tags: ["game", "challenges", "core", "data-driven", "education", "logic", "testing"]
dependencies: ["006-skill-progress-model"]
related_specs: []
------------------------------------------------------------

# Tareas: Motor genérico de retos

**Entrada**: Documentos de diseño de `/specs/007-challenge-engine-core/`

**Prerrequisitos**: `plan.md` y `spec.md` (obligatorios, presentes); `research.md`, `data-model.md`, `contracts/challenge-interface.md` y `quickstart.md` (presentes, todos aplican).

**Organización**: Las tareas se agrupan por historia de usuario para permitir que cada historia pueda implementarse, probarse y validarse de forma independiente. Las 3 historias de usuario de `spec.md` son todas P1 y se implementan en el orden en que aparecen en la especificación (generación → validación → integración), ya que cada una depende funcionalmente de la anterior (no se puede validar sin un reto generado, no se puede integrar con el progreso sin un resultado de validación).

## Convenciones de rutas

* **Módulo core**: `src/game/core/challenge-engine/` (patrón hermano de `src/game/core/progress/`, feature 006)
* **Tests**: co-localizados en el mismo módulo (`challenge-engine.test.ts`), Vitest

## Estrategia de pruebas

Según `plan.md` (sección "Estrategia de pruebas"): cobertura completa Unit obligatoria (constitución, principio VII: 100% testeable en Node.js sin Phaser) y test de Integration con `updateSkillProgress()` de 006. No se incluyen tests E2E (deferred) ni tests de contrato en fichero separado (el contrato se documenta en `contracts/challenge-interface.md`, pero se verifica mediante los mismos tests unitarios de tipos/estructura).

Todas las tareas de test se derivan directamente de los escenarios de aceptación Gherkin y de los casos límite de `spec.md`, y de los escenarios runnable de `quickstart.md`.

---

## Fase 1: Setup

**Propósito**: Preparar la estructura de ficheros del módulo `challenge-engine`.

- [X] T001 Crear estructura de directorio `src/game/core/challenge-engine/` con ficheros vacíos `challenge-engine.type.ts`, `challenge-engine.constants.ts`, `challenge-engine.ts`, `challenge-engine.test.ts` (patrón hermano de `src/game/core/progress/`)

**Checkpoint**: Estructura de ficheros lista para implementación.

---

## Fase 2: Foundational

**Propósito**: Definir los tipos e interfaces genéricas y las constantes compartidas que necesitan las 3 historias de usuario (US1 genera un `Challenge`, US2 valida contra ese `Challenge`, US3 consume el resultado tipado).

**Gate**: Ninguna historia de usuario puede comenzar hasta completar T002 y T003.

- [X] T002 [P] Definir tipos `Challenge`, `ChallengeConfig`, `CountingChallenge extends Challenge`, `CountingChallengeConfig extends ChallengeConfig` y reexportar `SkillUpdateResult` (importado de `src/game/core/progress/skill-progress-state.type.ts`) en `src/game/core/challenge-engine/challenge-engine.type.ts`, según `data-model.md`
- [X] T003 [P] Definir constantes `SUPPORTED_CHALLENGE_TYPES`, mensajes de error (`min` inválido, `min > max`, `difficulty` fuera de rango, tipo no soportado, respuesta `null`/`undefined`, respuesta no numérica), `DEFAULT_DIFFICULTY`, límites `MIN_DIFFICULTY`/`MAX_DIFFICULTY` en `src/game/core/challenge-engine/challenge-engine.constants.ts` (sin literales sueltos en `challenge-engine.ts`, `scripts/check-components.mjs` lo exige)

**Checkpoint**: Tipos y constantes listos; las 3 historias pueden comenzar.

---

## Fase 3: Historia de usuario 1 - Generación de un reto de conteo (Prioridad: P1)

**Objetivo**: Generar retos de tipo `counting` válidos a partir de una configuración data-driven (`CountingChallengeConfig`), de forma pseudoaleatoria sin semilla, sin dependencias de Phaser.

**Prueba independiente**: Invocar `generateChallenge()` con una `CountingChallengeConfig` y verificar la estructura del reto devuelto, sin ninguna dependencia de renderizado.

**Requisitos relacionados**: FR-001, FR-002, FR-004, FR-006, FR-008

**Escenarios de aceptación relacionados**: US1-1 (rango 1-10 genera reto válido), US1-2 (múltiples invocaciones, cada una válida e independiente), US1-3 (config inválida lanza excepción); casos límite: rango imposible (min > max)

### Tests de US1

- [X] T004 [US1] [FR-002] Añadir tests de generación válida en `src/game/core/challenge-engine/challenge-engine.test.ts`: estructura completa del reto (id único, type='counting', question no vacío, correctAnswer en rango [min,max], items.length === correctAnswer, difficulty en [1,10])
- [X] T005 [US1] [FR-002] Añadir test de variabilidad pseudoaleatoria en `src/game/core/challenge-engine/challenge-engine.test.ts`: múltiples invocaciones con la misma config producen al menos 2 valores distintos de `correctAnswer` (escenario 5 de `quickstart.md`)
- [X] T006 [US1] [FR-008] Añadir tests de configuración inválida en `src/game/core/challenge-engine/challenge-engine.test.ts`: `min < 1`, `min > max`, `difficulty` fuera de [1,10], `type` no soportado → todos lanzan excepción con mensaje claro

### Implementación de US1

- [X] T007 [US1] [FR-002] [FR-008] Implementar validación de `CountingChallengeConfig` (lanza excepciones según T006) en `src/game/core/challenge-engine/challenge-engine.ts`
- [X] T008 [US1] [FR-002] [FR-004] Implementar `generateChallenge(config)` para el tipo `counting`: generación pseudoaleatoria con `Math.random()` del `correctAnswer` en [min,max], construcción del array `items` (longitud = correctAnswer, cada elemento con `id` y `type` únicos), `question` descriptiva, `id` único del reto, en `src/game/core/challenge-engine/challenge-engine.ts` (depende de T007)
- [X] T009 [US1] [FR-006] Verificar que `challenge-engine.ts` no importa `Phaser` y que T004-T006 pasan en Vitest sin DOM (`npm test -- src/game/core/challenge-engine/challenge-engine.test.ts`)

**Checkpoint US1**: `generateChallenge()` genera retos de conteo válidos, rechaza configuraciones inválidas y es 100% testeable en Node.js. US1 es funcional de forma independiente (MVP).

---

## Fase 4: Historia de usuario 2 - Validación de la respuesta del jugador (Prioridad: P1)

**Objetivo**: Validar la respuesta del jugador contra un reto generado, devolviendo `'success'` o `'failure'`, sin mutar el reto ni el estado.

**Prueba independiente**: Invocar `validateAnswer()` con un reto generado por US1 y distintas respuestas, verificar el resultado sin efectos secundarios.

**Requisitos relacionados**: FR-003, FR-006, FR-009

**Escenarios de aceptación relacionados**: US2-1 (respuesta correcta → true/success), US2-2 (respuesta incorrecta → false/failure), US2-3 (respuesta inválida → excepción), US2-4 (validaciones independientes en secuencia); casos límite: respuesta `null`/`undefined`, valores fuera de rango (failure sin excepción)

### Tests de US2

- [X] T010 [US2] [FR-003] Añadir tests de validación correcta/incorrecta en `src/game/core/challenge-engine/challenge-engine.test.ts`: respuesta == correctAnswer → `'success'`; respuesta != correctAnswer (incluyendo fuera de rango) → `'failure'` sin excepción
- [X] T011 [US2] [FR-009] Añadir tests de respuesta inválida en `src/game/core/challenge-engine/challenge-engine.test.ts`: `null`, `undefined`, `string`, objeto, array → todos lanzan excepción con mensaje claro (escenario 4 de `quickstart.md`)
- [X] T012 [P] [US2] Añadir test de pureza en `src/game/core/challenge-engine/challenge-engine.test.ts`: el reto original no se muta tras llamar a `validateAnswer()`, y validaciones repetidas en secuencia con retos distintos son independientes entre sí

### Implementación de US2

- [X] T013 [US2] [FR-003] [FR-009] Implementar `validateAnswer(challenge, answer)` con validación de tipo de `answer` (excepción si `null`/`undefined`/no-numérico) y comparación pura contra `challenge.correctAnswer`, devolviendo `SkillUpdateResult` (`'success'` | `'failure'`) en `src/game/core/challenge-engine/challenge-engine.ts` (depende de T007)
- [X] T014 [US2] [FR-006] Verificar que T010-T012 pasan en Vitest sin DOM ni Phaser (`npm test -- src/game/core/challenge-engine/challenge-engine.test.ts`)

**Checkpoint US2**: `validateAnswer()` valida respuestas correctamente, rechaza tipos inválidos y es pura. US2 funciona de forma independiente sobre cualquier `Challenge` generado por US1.

---

## Fase 5: Historia de usuario 3 - Integración con el modelo de progreso (Prioridad: P1)

**Objetivo**: Garantizar que el resultado de `validateAnswer()` se integra directamente con `updateSkillProgress()` de feature 006 sin transformación de tipos.

**Prueba independiente**: Generar un reto, validar una respuesta, y pasar el resultado directamente a `updateSkillProgress()`, verificando que el estado de progreso se actualiza correctamente.

**Requisitos relacionados**: FR-005

**Escenarios de aceptación relacionados**: US3-1 (compatibilidad de tipos con `SkillUpdateResult`), US3-2 (acierto→'success', fallo→'failure'), US3-3 (integración end-to-end con `updateSkillProgress()`: nivel sube en acierto, failureCount sube en fallo)

### Tests de US3

- [X] T015 [US3] [FR-005] Añadir test de integración en `src/game/core/challenge-engine/challenge-engine.test.ts`: generar reto `counting` → validar respuesta correcta → pasar resultado a `updateSkillProgress()` (importado de `src/game/core/progress/skill-progress-state.ts`) → verificar que `level` de `counting` sube; repetir con respuesta incorrecta → verificar que `failureCount` sube (escenario 7 de `quickstart.md`)

### Implementación de US3

- [X] T016 [US3] [FR-005] Confirmar (sin cambios de código esperados, dado que `SkillUpdateResult` ya se reutiliza desde T002) que el tipo devuelto por `validateAnswer()` es asignable sin conversión al parámetro `result` de `updateSkillProgress()`; si TypeScript strict detecta alguna incompatibilidad, ajustar el tipo en `src/game/core/challenge-engine/challenge-engine.type.ts`

**Checkpoint US3**: El resultado de validación se integra con el modelo de progreso de 006 sin transformación. Las 3 historias de usuario (US1+US2+US3) constituyen el conjunto funcional completo del motor.

---

## Fase 6: Pulido y aspectos transversales

**Propósito**: Documentación del módulo y validación final de gates de calidad.

- [X] T017 [P] Crear `src/game/core/challenge-engine/README.md` documentando el propósito del módulo, `generateChallenge()`, `validateAnswer()`, tipos públicos y ejemplo de uso (referenciando `contracts/challenge-interface.md`)
- [X] T018 Ejecutar y validar todos los escenarios de `quickstart.md` manualmente contra la implementación final
- [X] T019 Verificar que `npm run lint && npm test && npm run build` pasan sin errores (gate real de CI, `npx tsc --noEmit` NO se usa como gate por el falso positivo TS2882 conocido)
- [X] T020 Verificar que los 5 principios de la constitución marcados en `plan.md` (VI, VII, IX, IV, II) siguen cumpliéndose en el código final
- [X] T021 [P] [FR-007] Añadir test de extensibilidad en `src/game/core/challenge-engine/challenge-engine.test.ts`: definir localmente un tipo simulado `AdditionChallenge extends Challenge` (o similar) y verificar en tiempo de compilación/test que es asignable sin modificar `challenge-engine.type.ts` ni `challenge-engine.ts` existentes (valida FR-007/SC-004)

**Checkpoint final**: La funcionalidad completa satisface `spec.md`, `plan.md` y `constitution.md`.

---

## Dependencias y orden de ejecución

### Dependencias entre fases

* **Setup (Fase 1)**: Sin dependencias.
* **Foundational (Fase 2)**: Depende de T001.
* **US1 (Fase 3)**: Depende de Foundational (T002, T003).
* **US2 (Fase 4)**: Depende de Foundational y de la implementación de generación de US1 (T007, T008), porque necesita un `Challenge` generado para validar contra él.
* **US3 (Fase 5)**: Depende de US2 (T013), porque necesita un `SkillUpdateResult` producido por `validateAnswer()`.
* **Pulido (Fase 6)**: Depende de US1, US2 y US3 completas.

### Dependencias entre historias de usuario

* **US1 (P1)**: Ninguna tras Foundational.
* **US2 (P1)**: Depende de la función `generateChallenge()` de US1 (T007/T008) para tener un `Challenge` sobre el que validar; no depende de que US1 esté "cerrada" como checkpoint, solo de esas dos tareas concretas.
* **US3 (P1)**: Depende de `validateAnswer()` de US2 (T013) para obtener un `SkillUpdateResult`.

Esta cadena de dependencias es inherente al dominio (generar → validar → integrar) y está documentada explícitamente en `spec.md` (US3 depende del resultado producido por US2, que a su vez opera sobre el reto producido por US1).

### Orden dentro de cada historia

1. Tests (derivados de escenarios de aceptación).
2. Implementación de validación/generación.
3. Verificación de ejecución de tests (gate de Phaser-free, Node-testable).

## Oportunidades de paralelización

* T002 y T003 (Foundational) pueden ejecutarse en paralelo: ficheros distintos (`challenge-engine.type.ts` vs `challenge-engine.constants.ts`), sin dependencia mutua.
* T012 (test de pureza en US2) puede ejecutarse en paralelo con T010/T011 si se escribe en un bloque `describe` independiente del mismo fichero de test, siempre que no se edite la misma sección simultáneamente.
* T017 (README) puede ejecutarse en paralelo con T018-T021 (ficheros distintos, salvo T021 que comparte fichero de test con tareas ya completadas en fases anteriores).
* Las tareas de implementación (T007, T008, T013) son secuenciales entre sí porque modifican el mismo fichero `challenge-engine.ts`.

## Ejemplo de paralelización: Foundational

```text
Task: "Definir tipos Challenge, ChallengeConfig, CountingChallenge, CountingChallengeConfig en src/game/core/challenge-engine/challenge-engine.type.ts"
Task: "Definir constantes SUPPORTED_CHALLENGE_TYPES, mensajes de error, DEFAULT_DIFFICULTY en src/game/core/challenge-engine/challenge-engine.constants.ts"
```

## Estrategia de implementación

### MVP primero

1. Completar Setup (T001).
2. Completar Foundational (T002, T003).
3. Implementar US1 completa (T004-T009).
4. Validar US1 contra sus escenarios de aceptación (generación de retos válidos, rechazo de config inválida).
5. Ejecutar los tests de US1.
6. **US1 por sí sola no es un MVP jugable** (no hay forma de saber si el jugador acertó), pero es el primer incremento verificable. El MVP real del motor requiere US1+US2 como mínimo (generar y validar); US3 (integración con 006) completa el ciclo pero podría diferirse si 006 aún no estuviera disponible (no es el caso: ya está mergeado en `develop`).

### Entrega incremental

1. Setup + Foundational.
2. US1 → validar → entregar (generación funcional, testeable de forma aislada).
3. US2 → validar → entregar (validación funcional sobre retos de US1).
4. US3 → validar → entregar (integración completa con progreso de 006).
5. Pulido (README, quickstart, gates de CI).

### Ejecución paralela

Dada la cadena de dependencias funcional (generar → validar → integrar), US1/US2/US3 **no** son paralelizables entre sí a pesar de compartir prioridad P1. El paralelismo real se limita a tareas dentro de Foundational (T002/T003) y a la documentación final (T017 vs T018-T021).
