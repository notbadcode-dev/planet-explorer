---

title: "Bucle de juego base"
feature: "004-core-game-loop"
type: "task-list"
version: "1.2"
created: "2026-08-17"
updated: "2026-08-17"
status: "Draft"
spec: "./spec.md"
plan: "./plan.md"
tags: ["game", "architecture"]
dependencies: ["001-component-library-architecture", "002-button-variants", "003-shared-components-base"]
related_specs: []
------------------------------------------------------------

# Tareas: Bucle de juego base

**Entrada**: Documentos de diseño de `/specs/004-core-game-loop/`

**Prerrequisitos**: `plan.md` y `spec.md` · `research.md`, `data-model.md`, `contracts/navigation-core-contract.md` y `quickstart.md`.

**Organización**: Las tareas se agrupan por historia de usuario para permitir que cada historia pueda implementarse, probarse y validarse de forma independiente.

## Convenciones de rutas

* **Proyecto único**: `src/game/` (motor de juego), `libs/components/` (componentes reutilizados en el overlay, sin cambios).

## Estrategia de pruebas

Por decisión de `plan.md` (sección "Estrategia de pruebas"), la única cobertura automatizada exigida en esta feature es la unitaria sobre `src/game/core/navigation/` (Vitest, sin `Phaser.Scene`), que cubre las garantías G1–G7 de `contracts/navigation-core-contract.md`. No se generan tareas de integración/contrato/E2E automatizadas: la validación de escenas y HUD se realiza manualmente vía `quickstart.md` (Fase final).

---

## Fase 1: Setup

**Propósito**: Preparar dependencias y configuración necesarias antes de escribir código de juego.

* [X] T001 Añadir `phaser: "^4.2.1"` como dependencia de producción en [package.json](../../package.json) (research.md, sección 1)
* [X] T002 Ampliar `test.include` en [vite.config.ts](../../vite.config.ts) de `['libs/**/*.test.ts']` a `['libs/**/*.test.ts', 'src/game/**/*.test.ts']` (research.md, sección 2)
* [X] T003 [P] Corregir la nota desactualizada sobre `tsconfig.json`/`src` en [docs/conventions/architecture/overview.md](../../docs/conventions/architecture/overview.md) (research.md, sección 3)

**Checkpoint**: Dependencias y configuración de test/documentación listas para empezar a escribir código de juego.

---

## Fase 2: Foundational

**Propósito**: Implementar la infraestructura compartida por las tres historias de usuario: el estado de navegación puro, el contenido placeholder y el bootstrap de Phaser.

**Gate**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

* [X] T004 [P] Crear `src/game/core/navigation/navigation-state.type.ts` con los tipos `SceneId` y `NavigationState` (data-model.md, contracts/navigation-core-contract.md)
* [X] T005 [P] Crear `src/game/core/navigation/navigation-state.constants.ts` con el estado inicial y los identificadores de escena (`'map'`, `'destination'`)
* [X] T006 [FR-001][FR-002][FR-004][FR-006][FR-007][FR-008][FR-009] Crear `src/game/core/navigation/navigation-state.ts` implementando `createInitialNavigationState`, `beginTransitionToDestination`, `beginTransitionToMap` y `completeTransition` según contracts/navigation-core-contract.md (depende de T004, T005)
* [X] T007 [P] [FR-006][FR-007][FR-008] Crear `src/game/core/navigation/navigation-state.test.ts` cubriendo las garantías G1–G7 del contrato (estado inicial, inicio/cierre de transición en ambos sentidos, guarda de activaciones redundantes, repetibilidad indefinida) (depende de T006)
* [X] T008 [P] Crear `src/game/core/content/destinations.ts` con el destino placeholder (`{ id: 'moon', name: 'Luna' }`) como colección abierta (data-model.md)
* [X] T009 [FR-011] Crear `src/game/main.ts` con el bootstrap de `Phaser.Game` (configuración de canvas/escala, registro de escenas vacío, y un indicador de carga simple reutilizando `Spinner` de `libs/components/spinner` mostrado hasta el evento `ready` de Phaser) (depende de T001)
* [X] T010 Actualizar [src/main.ts](../../src/main.ts) para eliminar la pantalla "en construcción" e iniciar el juego desde `src/game/main.ts` (depende de T009)

**Checkpoint**: Estado de navegación testeado, contenido placeholder y bootstrap de Phaser listos; las historias de usuario pueden empezar.

---

## Fase 3: Historia de usuario 1 - Navegar del mapa a un destino (Prioridad: P1)

**Objetivo**: El jugador ve un mapa con un destino seleccionable y, al seleccionarlo, transiciona a la escena de ese destino.

**Prueba independiente**: Cargar el juego, comprobar que el mapa muestra el destino, y que tocarlo/clicarlo dispara la transición a la escena de destino (incluyendo la guarda ante toques repetidos durante la transición).

**Requisitos relacionados**: FR-001, FR-002, FR-006, FR-007, FR-009

**Escenarios de aceptación relacionados**: Historia de usuario 1, escenarios 1–3 de spec.md

### Implementación de US1

* [X] T011 [US1] [FR-001] Crear `src/game/scenes/MapScene.ts` renderizando el destino placeholder (Game Objects nativos: círculo + texto) a partir de `src/game/core/content/destinations.ts` (depende de T008, T009)
* [X] T012 [US1] [FR-002][FR-007] En `src/game/scenes/MapScene.ts`, conectar la activación (pointerdown) del destino con `beginTransitionToDestination`/`completeTransition` de `core/navigation`, sin duplicar la guarda de activación redundante (depende de T006, T011)
* [X] T013 [US1] [FR-006][FR-009] Crear `src/game/scenes/DestinationScene.ts` como escena placeholder vacía que llama a `completeTransition` en su método `create()` (depende de T006)
* [X] T014 [US1] Registrar `MapScene` y `DestinationScene` en el listado de escenas de `src/game/main.ts` (depende de T011, T013)

**Checkpoint US1**: El recorrido mapa→destino funciona de extremo a extremo y constituye el MVP de esta feature.

---

## Fase 4: Historia de usuario 2 - Volver al mapa sin perder el estado (Prioridad: P2)

**Objetivo**: El jugador puede volver al mapa desde la escena de destino mediante un control del HUD, y el mapa se muestra como lo dejó, permitiendo repetir el bucle indefinidamente.

**Prueba independiente**: Entrar en la escena de destino, activar "volver al mapa", y comprobar que el mapa reaparece con el destino de nuevo seleccionable; repetir el ciclo varias veces sin errores.

**Requisitos relacionados**: FR-003, FR-004, FR-008

**Escenarios de aceptación relacionados**: Historia de usuario 2, escenarios 1–3 de spec.md

### Implementación de US2

* [X] T015 [US2] [FR-003][FR-004] Crear `src/game/overlay/hud.ts` con el control "volver al mapa" usando `Button` de `libs/components/button` (tamaño con `--size-touch-target-min`), conectado a `beginTransitionToMap`
* [X] T016 [US2] Montar/desmontar el elemento del overlay HUD como hermano DOM del `<canvas>` desde el ciclo de vida (`create`/`shutdown`) de `src/game/scenes/DestinationScene.ts` (depende de T013, T015)
* [X] T017 [US2] [FR-004][FR-008] Actualizar `src/game/scenes/DestinationScene.ts` para llamar a `completeTransition` e iniciar `MapScene` al volver, preservando el restablecimiento de `selectedDestinationId` a `null` (depende de T006, T013, T015)
* [X] T018 [US2] Actualizar `src/game/scenes/MapScene.ts` para volver a renderizar el destino como seleccionable tras regresar de la escena de destino (depende de T011, T017)

**Checkpoint US2**: El bucle mapa→destino→mapa se cierra sin residuo de estado y puede repetirse indefinidamente.

---

## Fase 5: Historia de usuario 3 - HUD mínimo dentro de la escena de destino (Prioridad: P3)

**Objetivo**: El jugador ve, dentro de la escena de destino, el control "volver al mapa" y un indicador de progreso en estado vacío/placeholder.

**Prueba independiente**: Entrar en la escena de destino y comprobar que el HUD muestra el control de retorno y el indicador de progreso placeholder, ambos identificables sin leer texto extenso.

**Requisitos relacionados**: FR-005

**Escenarios de aceptación relacionados**: Historia de usuario 3, escenarios 1–2 de spec.md

### Implementación de US3

* [X] T019 [US3] [FR-005] Añadir un indicador de progreso en estado vacío/placeholder a `src/game/overlay/hud.ts` usando `Progress` de `libs/components/progress`
* [X] T020 [US3] Mostrar el indicador de progreso junto al control "volver al mapa" cada vez que el HUD se monta en `src/game/scenes/DestinationScene.ts` (depende de T016, T019)

**Checkpoint US3**: El HUD mínimo cumple exactamente lo descrito en spec.md (control + indicador).

---

## Fase final: Integración y aspectos transversales

**Propósito**: Validar que la implementación completa satisface `spec.md`, `plan.md` y `constitution.md`.

* [X] T021 [P] Verificar que `MapScene.ts`, `DestinationScene.ts` y `hud.ts` solo llaman a la API pública de `core/navigation` (contracts/navigation-core-contract.md), sin leer/escribir campos de `NavigationState` directamente
* [X] T022 Ejecutar la validación manual de [quickstart.md](./quickstart.md) (SC-001 a SC-004: bucle sin bloqueos, transición ≤ 200 ms, cobertura de tests, repetibilidad sin errores en consola)
* [X] T023 Ejecutar `npm run lint && npm test && npm run build` y confirmar que el gate de CI pasa incluyendo el nuevo código de `src/game/`
* [X] T024 Verificar que `src/game/core/navigation/` no importa `phaser` (principio VII de la constitución / regla R1 de `game-engine-scenes.md`)
* [X] T025 [FR-012] Añadir un listener de `popstate` en `src/game/main.ts` que vuelva a renderizar la escena activa según `NavigationState` en vez de dejar una pantalla en blanco (depende de T009, T010)

**Checkpoint final**: La funcionalidad completa satisface `spec.md`, `plan.md` y `constitution.md`.

---

## Dependencias y orden de ejecución

### Dependencias entre fases

* **Setup (Fase 1)**: Sin dependencias internas de la funcionalidad.
* **Foundational (Fase 2)**: Depende de T001 (Setup) para poder importar `phaser` en T009.
* **Historias de usuario (Fase 3+)**: Dependen únicamente de las tareas Foundational (T004–T010).
* **Integración y aspectos transversales (Fase final)**: Depende de las tres historias de usuario completas.

### Dependencias entre historias de usuario

* **US1 (P1)**: Ninguna tras Foundational.
* **US2 (P2)**: Depende de US1 (reutiliza `MapScene.ts` y `DestinationScene.ts` creados en T011/T013) — no es independiente porque cierra el mismo bucle que US1 abre.
* **US3 (P3)**: Depende de US2 (añade el indicador de progreso al mismo `hud.ts` creado en T015 y al mismo punto de montaje de T016).

### Orden dentro de cada historia

1. Modelos/estado compartido ya resueltos en Foundational.
2. Escenas Phaser (presentación).
3. Conexión escena↔core/navigation mediante llamadas explícitas.
4. Overlay HUD (US2/US3).
5. Validación contra los escenarios de aceptación (Fase final).

## Oportunidades de paralelización

* T004 y T005 (Foundational) pueden ejecutarse en paralelo — ficheros distintos, sin dependencias entre sí.
* T007 y T008 (Foundational) pueden ejecutarse en paralelo una vez completado T006 — ficheros distintos.
* T003 (Setup, corrección de documentación) puede ejecutarse en paralelo con T001/T002 — fichero distinto, sin dependencia.
* T021 (Fase final) puede ejecutarse en paralelo con T022/T023/T024 — es una revisión de código, no modifica ficheros.

---

## Fase 6: Convergencia

**Propósito**: Cerrar los huecos detectados por `/speckit-converge` entre `spec.md`/`plan.md`/`tasks.md` y el estado real del código.

* [X] T026 Marcar T023 como completada (`[X]`) en [tasks.md](./tasks.md) tras confirmar que `npm run lint && npm test && npm run build` pasa sin errores per tasks.md T023 (partial)
* [X] T027 Actualizar la sección "Consumidores esperados" de [contracts/navigation-core-contract.md](./contracts/navigation-core-contract.md) para reflejar que `DestinationScene.ts` (no `MapScene.ts`) es quien llama a `completeTransition`, tanto al llegar en `create()` como al iniciar el regreso al mapa, per contracts/navigation-core-contract.md "Consumidores esperados" (contradicts)


## Ejemplo de paralelización: Foundational

```text
Task: "Crear src/game/core/navigation/navigation-state.type.ts con SceneId y NavigationState"
Task: "Crear src/game/core/navigation/navigation-state.constants.ts con el estado inicial"
```

```text
Task: "Crear src/game/core/navigation/navigation-state.test.ts cubriendo G1-G7"
Task: "Crear src/game/core/content/destinations.ts con el destino placeholder"
```

## Estrategia de implementación

### MVP primero

1. Completar Setup (T001–T003).
2. Completar Foundational (T004–T010).
3. Implementar US1 (T011–T014).
4. Validar US1 contra sus escenarios de aceptación (carga de mapa + transición a destino).
5. Detenerse aquí si se necesita entregar solo el MVP (mapa→destino sin retorno todavía).

### Entrega incremental

1. Setup + Foundational.
2. US1 → validar → entregar (mapa→destino).
3. US2 → validar → entregar (bucle completo mapa→destino→mapa).
4. US3 → validar → entregar (HUD mínimo completo).
5. Fase final → validar spec.md/plan.md/constitution.md en su totalidad.
