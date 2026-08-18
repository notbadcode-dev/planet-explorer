---

title: "Modelo de progreso por habilidades"
feature: "006-skill-progress-model"
type: "task-list"
version: "1.0"
created: "2026-08-19"
updated: "2026-08-19"
status: "Draft"
spec: "./spec.md"
plan: "./plan.md"
tags: ["game", "progression", "data", "education"]
dependencies: ["004-core-game-loop"]
related_specs: []
------------------------------------------------------------

# Tareas: Modelo de progreso por habilidades

**Entrada**: Documentos de diseño de `/specs/006-skill-progress-model/`

**Prerrequisitos**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/skill-progress-contract.md`, `quickstart.md`.

**Organización**: Las tareas se agrupan por historia de usuario. Las tres historias (US1, US2, US3) comparten el mismo fichero de implementación (`skill-progress-state.ts`), por lo que las tareas que lo modifican son secuenciales entre sí aunque las historias sean funcionalmente independientes.

## Convenciones de rutas

* **Módulo**: `src/game/core/progress/` (hermano de `src/game/core/navigation/`, patrón ya validado en `004-core-game-loop`).
* Ficheros: `skill-progress-state.ts`, `skill-progress-state.type.ts`, `skill-progress-state.constants.ts`, `skill-progress-state.test.ts`.

## Fase 1: Setup

**Propósito**: Definir el catálogo cerrado de habilidades y los tipos base que consumirán todas las historias.

* [x] T001 [FR-001] Crear `src/game/core/progress/skill-progress-state.type.ts` con los tipos `SkillName`, `SkillUpdateResult`, `SkillDomain` y `SkillProgressState` (`Record<SkillName, SkillDomain>`) según [data-model.md](./data-model.md)
* [x] T002 [FR-001] Crear `src/game/core/progress/skill-progress-state.constants.ts` con `SUPPORTED_SKILL_NAMES` (las 7 habilidades), `SKILL_LEVEL_MIN=1`, `SKILL_LEVEL_MAX=10`, `SKILL_FAILURE_THRESHOLD=3`, `SUPPORTED_SKILL_UPDATE_RESULTS` (`'success' | 'failure' | 'hint-used'`) — sin literales mágicos dispersos en la lógica (depende de T001)

**Checkpoint**: El catálogo de habilidades y los límites de nivel/fallos están fijados como constantes; ninguna historia de usuario necesita redefinirlos.

---

## Fase 2: Foundational

**Propósito**: Implementar el estado inicial, prerrequisito compartido por las tres historias de usuario.

**Gate**: Ninguna historia de usuario puede comenzar hasta que `createInitialSkillProgressState()` exista y esté testeada.

* [x] T003 [FR-001] [FR-006] [FR-007] Implementar `createInitialSkillProgressState()` en `src/game/core/progress/skill-progress-state.ts`, devolviendo las 7 habilidades soportadas en `{ level: 1, failureCount: 0 }` (depende de T001, T002)

**Checkpoint**: `createInitialSkillProgressState()` está disponible; FR-007 (consultar el snapshot completo) queda satisfecho estructuralmente porque `SkillProgressState` es el propio objeto de estado — no requiere una función adicional en el contrato.

---

## Fase 3: Historia de usuario 1 - Lectura del progreso actual por habilidad (Prioridad: P1)

**Objetivo**: Permitir consultar el nivel de dominio de cualquier habilidad soportada de forma aislada y sin acoplamiento a destinos.

**Prueba independiente**: Crear un estado con `createInitialSkillProgressState()`, consultar varias habilidades con `getSkillLevel` y verificar valores independientes y consistentes; verificar que una clave no soportada lanza excepción.

**Requisitos relacionados**: FR-001, FR-002, FR-007, FR-008

**Escenarios de aceptación relacionados**: US1 escenarios 1-3 (spec.md)

### Implementación de US1

* [x] T004 [US1] [FR-002] [FR-005] [FR-008] Implementar `getSkillLevel(state, skill)` en `src/game/core/progress/skill-progress-state.ts`: devuelve `state[skill].level`; lanza `Error` si `skill` no pertenece a `SUPPORTED_SKILL_NAMES` (depende de T003)

### Pruebas de US1

* [x] T005 [US1] [FR-002] [FR-008] Añadir tests en `src/game/core/progress/skill-progress-state.test.ts` para: nivel inicial 1 en un jugador nuevo (escenario 1), lectura independiente de varias habilidades sin mezcla de valores (escenario 2), y excepción al consultar una habilidad no soportada (escenario 3) (depende de T004)

**Checkpoint US1**:

* `getSkillLevel` implementado y testeado.
* Escenarios de aceptación 1-3 de US1 validados.
* US1 funciona de forma independiente (solo depende de Foundational).

---

## Fase 4: Historia de usuario 2 - Actualización del dominio tras un resultado (Prioridad: P1)

**Objetivo**: Actualizar el nivel de dominio de una habilidad de forma determinista según el resultado de un reto (acierto/fallo/pista), con la mecánica de fallos acumulados (umbral 3) fijada en las clarificaciones Q2-Q4.

**Prueba independiente**: Invocar `updateSkillProgress` con distintas combinaciones de nivel/`failureCount`/resultado y verificar el nuevo estado devuelto, sin UI ni integración de escenas.

**Requisitos relacionados**: FR-003, FR-008, FR-009

**Escenarios de aceptación relacionados**: US2 escenarios 1-6 (spec.md)

### Implementación de US2

* [x] T006 [US2] [FR-003] [FR-005] [FR-008] [FR-009] Implementar `updateSkillProgress(state, skill, result)` en `src/game/core/progress/skill-progress-state.ts`: `'success'` → `level+1` (techo 10) y `failureCount` a 0; `'failure'` → `failureCount+1` si `failureCount < 2`, o `level-1` (suelo 1) y `failureCount` a 0 si ya era 2; `'hint-used'` → sin cambios; lanza `Error` si `skill` o `result` no son válidos (depende de T004, mismo fichero — no paralelizable con T004)

### Pruebas de US2

* [x] T007 [US2] [FR-003] [FR-008] [FR-009] Añadir tests en `src/game/core/progress/skill-progress-state.test.ts` para los 6 escenarios de aceptación de US2 (acierto +1, 1 fallo sin cambio de nivel, 3er fallo acumulado -1 nivel y reset, suelo en nivel 1, techo en nivel 10, pista sin efecto), para la excepción ante un `result` no soportado (FR-009), y para la excepción al invocar `updateSkillProgress` con una skill no soportada (FR-008) (depende de T006, mismo fichero de test — secuencial respecto a T005)

**Checkpoint US2**:

* `updateSkillProgress` implementado y testeado con la mecánica completa de fallos acumulados.
* Escenarios de aceptación 1-6 de US2 validados.
* US2 funciona de forma independiente de US1 salvo por compartir el mismo módulo (sin dependencia funcional entre ambas).

---

## Fase 5: Historia de usuario 3 - Progreso independiente por habilidad (Prioridad: P1)

**Objetivo**: Garantizar que actualizar una habilidad no afecta a ninguna otra, y que distintas instancias de `SkillProgressState` evolucionan sin interferencia mutua (principio IV de la constitución).

**Prueba independiente**: Crear un estado con varias habilidades en niveles distintos, actualizar una y verificar que el resto permanece exactamente igual (misma referencia o mismo valor); crear dos estados independientes y verificar que progresan sin contaminarse.

**Requisitos relacionados**: FR-004, SC-003

**Escenarios de aceptación relacionados**: US3 escenarios 1-2 (spec.md)

### Pruebas de US3

* [x] T008 [US3] [FR-004] Añadir tests en `src/game/core/progress/skill-progress-state.test.ts` verificando que `updateSkillProgress` sobre una habilidad (p. ej. `addition`) no modifica el resto de claves de `SkillProgressState` (escenario 1), y que dos instancias independientes de `SkillProgressState` divergen correctamente al actualizarse por separado (escenario 2) (depende de T006 y T007, mismo fichero de test — secuencial)

**Checkpoint US3**:

* Aislamiento entre habilidades verificado explícitamente (FR-004, SC-003).
* No se requiere código de implementación adicional: la garantía ya la proporciona el diseño inmutable de T006 (spread que solo toca la clave actualizada).

---

## Fase 6: Integración y aspectos transversales

**Propósito**: Validar la funcionalidad completa contra `spec.md`, `plan.md` y `constitution.md`.

* [x] T009 [P] Ejecutar `npm test -- src/game/core/progress` y confirmar que la suite cubre las garantías G1-G9 de [contracts/skill-progress-contract.md](./contracts/skill-progress-contract.md)
* [x] T010 Ejecutar el gate completo `npm run lint && npm test && npm run build` (igual que CI) y confirmar que pasa sin errores
* [x] T011 Verificar que los gates de la Comprobación de la constitución en [plan.md](./plan.md) (principios IV, VI, VII, IX) siguen satisfechos tras la implementación final; actualizar `plan.md` si aparece alguna desviación no anticipada

**Checkpoint final**: La funcionalidad completa satisface `spec.md`, `plan.md` y `constitution.md`.

---

## Dependencias y orden de ejecución

### Dependencias entre fases

* **Setup (Fase 1)**: Sin dependencias internas.
* **Foundational (Fase 2)**: Depende de Setup (T001, T002).
* **US1 (Fase 3)**, **US2 (Fase 4)**, **US3 (Fase 5)**: Dependen únicamente de Foundational (T003); no hay dependencia funcional entre ellas, aunque comparten fichero de implementación y de test (edición secuencial).
* **Integración y aspectos transversales (Fase 6)**: Depende de que US1, US2 y US3 estén completas.

### Dependencias entre historias de usuario

* **US1 (P1)**: Ninguna tras Foundational.
* **US2 (P1)**: Ninguna tras Foundational (funcionalmente independiente de US1; comparte fichero `skill-progress-state.ts` con US1, por lo que T006 se escribe después de T004 en la práctica).
* **US3 (P1)**: Ninguna tras Foundational funcionalmente; sus tests validan una propiedad ya garantizada por la implementación de US2 (T006), por lo que T008 requiere que T006 exista.

### Orden dentro de cada historia

1. Tipos y constantes (Setup).
2. Estado inicial (Foundational).
3. Implementación de la función pública de la historia.
4. Tests de los escenarios de aceptación de la historia.

## Oportunidades de paralelización

* T001 y T002 son secuenciales: T002 depende de los tipos exportados por T001 (`SkillName`), por eso ninguna de las dos se marca `[P]`.
* T008 (tests de US3) es secuencial respecto a T007 (tests de US2): ambas modifican el mismo fichero `skill-progress-state.test.ts`, por lo que no se marcan `[P]` entre sí; no existe dependencia funcional entre las historias, solo de fichero.
* T009 (quickstart) puede ejecutarse en paralelo con la redacción de documentación adicional, si la hubiera.
* No existen oportunidades de paralelización real entre T003, T004 y T006 porque cada una añade una función al mismo fichero `skill-progress-state.ts` y depende de la anterior.

## Estrategia de implementación

### MVP primero

1. Completar Setup (T001-T002).
2. Completar Foundational (T003).
3. Implementar y validar US1 (T004-T005) — ya constituye un incremento útil y consumible por `007-challenge-engine-core` para lectura de nivel.
4. Detenerse aquí si solo se necesita lectura de progreso; continuar con US2 para desbloquear la actualización.

### Entrega incremental

1. Setup + Foundational.
2. US1 → validar (`npm test -- src/game/core/progress`) → entregar.
3. US2 → validar → entregar (habilita la actualización de progreso completa).
4. US3 → validar (tests de aislamiento) → entregar.
5. Fase 6 (gate completo `npm run lint && npm test && npm run build`) antes de cerrar la feature.
