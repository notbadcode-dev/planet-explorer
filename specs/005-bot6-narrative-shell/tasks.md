---

title: "Cascarón narrativo de BOT-6"
feature: "005-bot6-narrative-shell"
type: "task-list"
version: "1.0"
created: "2026-08-18"
updated: "2026-08-19"
status: "Implemented"
spec: "./spec.md"
plan: "./plan.md"
tags: ["game", "narrative", "education"]
dependencies: ["004-core-game-loop"]
related_specs: []
------------------------------------------------------------

# Tareas: Cascarón narrativo de BOT-6

**Entrada**: Documentos de diseño de `/specs/005-bot6-narrative-shell/`

**Prerrequisitos**: `plan.md` y `spec.md` · `research.md`, `data-model.md`, `contracts/bot6-dialogue-contract.md` y `quickstart.md`.

**Organización**: Las tareas se agrupan por historia de usuario para permitir que cada historia pueda implementarse, probarse y validarse de forma independiente.

## Convenciones de rutas

* **Proyecto único**: `src/game/` (motor de juego, contenido y overlay), `libs/components/icon/` (componente reutilizado, ampliado con un icono nuevo).

## Estrategia de pruebas

Por decisión de `plan.md` (sección "Estrategia de pruebas"), la cobertura automatizada exigida en esta feature es unitaria: `src/game/core/content/bot6-messages.test.ts` (contenido) y un caso ampliado en `libs/components/icon/Icon.test.ts` (icono `robot`). No se generan tareas de integración/E2E automatizadas: la verificación de que las escenas consumen `createBot6Dialogue(...)` solo a través de su API pública se hace por revisión de código (Fase final), y la validación del flujo narrativo completo se hace manualmente vía `quickstart.md`.

---

## Fase 1: Setup

**Propósito**: Preparar dependencias y configuración necesarias antes de escribir código.

N/A — esta feature no añade ninguna dependencia de producción, configuración de test ni tooling nuevo (research.md no identifica ninguno; `Dialog`, `Icon`, `Phaser` y el `test.include` de `src/game/**/*.test.ts` ya existen desde 004-core-game-loop). No se generan tareas artificiales para esta fase.

---

## Fase 2: Foundational

**Propósito**: Implementar los prerrequisitos compartidos que bloquean ambas historias de usuario: el contenido de los mensajes de BOT-6, el icono de retrato y el componente de diálogo reutilizable (FR-003).

**Gate**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

* [X] T001 [P] Crear `src/game/core/content/bot6-messages.ts` con la interfaz `Bot6Message` (`id`, `text`) y su export (data-model.md)
* [X] T002 [P] Crear `src/game/core/content/bot6-messages.constants.ts` con `BOT6_MESSAGE_MAX_LENGTH` (80), `MAP_WELCOME_MESSAGE` y `DESTINATION_TRANSITION_MESSAGE` (data-model.md, research.md sección 5)
* [X] T003 [P] [FR-005] Crear `src/game/core/content/bot6-messages.test.ts` verificando que los textos no están vacíos, no superan `BOT6_MESSAGE_MAX_LENGTH` y que los `id` son únicos (depende de T001, T002)
* [X] T004 [P] Añadir `'robot'` a `APP_ICON_NAMES`/`APP_ICON_SVGS` en [libs/components/icon/Icon.constants.ts](../../libs/components/icon/Icon.constants.ts), importando `@phosphor-icons/core/duotone/robot-duotone.svg?raw` (research.md sección 2)
* [X] T005 [P] Añadir un caso de test para `'robot'` en [libs/components/icon/Icon.test.ts](../../libs/components/icon/Icon.test.ts), siguiendo el mismo patrón que el resto del catálogo (depende de T004)
* [X] T006 [P] Crear `src/game/overlay/bot6-dialogue.constants.ts` con el título fijo `'BOT-6'`, el `closeLabel` `'Continuar'`, el tamaño de `Dialog` (`'small'`) y el tamaño del icono de retrato (research.md secciones 6-7)
* [X] T007 [FR-003][FR-003a][FR-004][FR-006] Crear `src/game/overlay/bot6-dialogue.ts` implementando `createBot6Dialogue(props: Bot6DialogueProps): HTMLElement` según contracts/bot6-dialogue-contract.md (compone `createDialog` de `libs/components/dialog` y `createIcon` de `libs/components/icon` con `name: 'robot'`) (depende de T001, T004, T006)

**Checkpoint**: Contenido de mensajes testeado, icono `robot` disponible en `Icon`, y `createBot6Dialogue` listo para ser invocado por cualquier escena.

---

## Fase 3: Historia de usuario 1 - BOT-6 saluda al jugador en el mapa (Prioridad: P1)

**Objetivo**: Al entrar en la escena del mapa, el jugador ve un diálogo de BOT-6 con su retrato y un mensaje corto de bienvenida, que puede cerrar para seguir interactuando con normalidad.

**Prueba independiente**: Cargar el juego hasta el mapa y comprobar que aparece el diálogo de bienvenida de BOT-6; cerrarlo y comprobar que el mapa queda utilizable; volver a entrar en el mapa y comprobar que el mensaje se muestra de nuevo.

**Requisitos relacionados**: FR-001, FR-003a, FR-004, FR-005, FR-006

**Escenarios de aceptación relacionados**: Historia de usuario 1, escenarios 1-3 de spec.md

### Implementación de US1

* [X] T008 [US1] [FR-001] En [src/game/scenes/MapScene.ts](../../src/game/scenes/MapScene.ts), en `create()`, montar el diálogo de bienvenida llamando a `createBot6Dialogue({ message: MAP_WELCOME_MESSAGE, onClose: handleBot6DialogueClose })` y añadir el elemento devuelto como hermano del `<canvas>` (depende de T002, T007)
* [X] T009 [US1] [FR-004] Implementar `handleBot6DialogueClose` en [src/game/scenes/MapScene.ts](../../src/game/scenes/MapScene.ts) para retirar el elemento del diálogo del DOM al cerrarse, devolviendo la interacción normal del mapa al jugador (depende de T008)
* [X] T010 [US1] Extender `handleShutdown()` en [src/game/scenes/MapScene.ts](../../src/game/scenes/MapScene.ts) (actualmente solo retira el listener de `resize`) para retirar también el elemento del diálogo de BOT-6 si sigue montado al abandonar la escena (depende de T008)

**Checkpoint US1**:

* El diálogo de bienvenida de BOT-6 aparece en cada entrada al mapa (FR-001, FR-003a, Clarification Q1) y se cierra con una única acción (FR-004).
* El test de `bot6-messages.test.ts` (T003) y el de `Icon.test.ts` (T005) pasan.
* US1 funciona de forma independiente y constituye el MVP de esta feature (spec.md, Historia de usuario 1 = P1).

---

## Fase 4: Historia de usuario 2 - BOT-6 acompaña la entrada a un destino (Prioridad: P2)

**Objetivo**: Al entrar en la escena de destino, el jugador ve un diálogo de BOT-6 con un mensaje corto de transición, distinto del de bienvenida, sin interferir con el HUD ya existente (004-core-game-loop).

**Prueba independiente**: Entrar en el destino placeholder desde el mapa y comprobar que aparece un mensaje de BOT-6 distinto del de bienvenida, reutilizando el mismo componente de diálogo que US1; cerrarlo y comprobar que el HUD ("volver al mapa") sigue funcionando con normalidad.

**Requisitos relacionados**: FR-002, FR-003a, FR-004, FR-005, FR-006

**Escenarios de aceptación relacionados**: Historia de usuario 2, escenarios 1-2 de spec.md

**Nota de independencia**: A diferencia de 004-core-game-loop (donde US2 dependía de US1 porque `DestinationScene.ts` todavía no existía), aquí `MapScene.ts` y `DestinationScene.ts` ya existen desde 004; US1 y US2 solo comparten el prerrequisito Foundational `T007` (`createBot6Dialogue`) y pueden implementarse en cualquier orden o en paralelo tras Foundational. La expresión de spec.md "reutilizando el mismo componente de diálogo que la Historia 1" se refiere a la reutilización de diseño (el mismo `createBot6Dialogue`), no a una dependencia de orden de implementación.

### Implementación de US2

* [X] T011 [US2] [FR-002] En [src/game/scenes/DestinationScene.ts](../../src/game/scenes/DestinationScene.ts), en `create()`, montar el diálogo de transición llamando a `createBot6Dialogue({ message: DESTINATION_TRANSITION_MESSAGE, onClose: handleBot6DialogueClose })`, añadido junto al `hudElement` ya existente como hermano del `<canvas>` (depende de T002, T007)
* [X] T012 [US2] [FR-004] Implementar `handleBot6DialogueClose` en [src/game/scenes/DestinationScene.ts](../../src/game/scenes/DestinationScene.ts) para retirar el elemento del diálogo del DOM al cerrarse, sin interferir con el `hudElement` ya montado (depende de T011)
* [X] T013 [US2] Extender `handleShutdown()` en [src/game/scenes/DestinationScene.ts](../../src/game/scenes/DestinationScene.ts) (que ya retira `hudElement`) para retirar también el elemento del diálogo de transición de BOT-6 (depende de T011)

**Checkpoint US2**:

* El diálogo de transición de BOT-6 aparece en cada entrada al destino (FR-002) y se cierra sin bloquear el HUD (FR-004).
* Repetir el ciclo mapa→destino→mapa varias veces muestra ambos mensajes de nuevo cada vez, sin estado de "ya visto" (Historia de usuario 2, escenario 2).
* US2 funciona de forma independiente de US1 tras Foundational, sin duplicar la lógica de presentación del diálogo (SC-003).

---

## Fase final: Integración y aspectos transversales

**Propósito**: Validar que la implementación completa satisface `spec.md`, `plan.md` y `constitution.md`.

* [X] T014 [P] Verificar que [MapScene.ts](../../src/game/scenes/MapScene.ts) y [DestinationScene.ts](../../src/game/scenes/DestinationScene.ts) solo llaman a la API pública `createBot6Dialogue(...)` de contracts/bot6-dialogue-contract.md, sin acceder directamente a `createDialog`/`createIcon` (revisión de código)
* [X] T015 [P] [FR-007][SC-005] Verificar que ningún texto de [bot6-messages.constants.ts](../../src/game/core/content/bot6-messages.constants.ts) contiene datos astronómicos reales, audio/voz, ramificación de diálogo, personalización cosmética de BOT-6 ni interpolación del nombre del jugador (revisión de contenido)
* [X] T016 Ejecutar la validación manual de [quickstart.md](./quickstart.md) (SC-001 a SC-005: bienvenida, transición, mensaje único por evento, límite de 2 líneas visibles, sin datos reales mezclados)
* [X] T017 Ejecutar `npm run lint && npm test && npm run build` y confirmar que el gate de CI pasa incluyendo el nuevo contenido/overlay de `src/game/` y el icono `robot` de `libs/components/icon`
* [X] T018 Verificar que [src/game/core/content/bot6-messages.ts](../../src/game/core/content/bot6-messages.ts) y [bot6-messages.constants.ts](../../src/game/core/content/bot6-messages.constants.ts) no importan `phaser` (principio VII de la constitución / regla R1 de game-engine-scenes.md)

**Checkpoint final**: La funcionalidad completa satisface `spec.md`, `plan.md` y `constitution.md`.

---

## Dependencias y orden de ejecución

### Dependencias entre fases

* **Setup (Fase 1)**: N/A, sin tareas.
* **Foundational (Fase 2)**: Sin dependencias internas de la funcionalidad (reutiliza dependencias ya instaladas).
* **Historias de usuario (Fase 3+)**: Dependen únicamente de las tareas Foundational (T001-T007).
* **Integración y aspectos transversales (Fase final)**: Depende de US1 y US2 completas.

### Dependencias entre historias de usuario

* **US1 (P1)**: Ninguna tras Foundational.
* **US2 (P2)**: Ninguna tras Foundational — comparte con US1 únicamente el prerrequisito `T007` (`createBot6Dialogue`); ambas historias pueden implementarse en paralelo.

### Orden dentro de cada historia

1. Contenido y componente de diálogo ya resueltos en Foundational.
2. Conexión escena↔overlay mediante llamada explícita a `createBot6Dialogue`.
3. Manejo de cierre (`onClose`).
4. Limpieza en `handleShutdown()`.
5. Validación contra los escenarios de aceptación (Fase final).

## Oportunidades de paralelización

* T001, T002, T004 y T006 (Foundational) pueden ejecutarse en paralelo — ficheros distintos, sin dependencias entre sí.
* T003 y T005 (Foundational) pueden ejecutarse en paralelo entre sí una vez completadas sus dependencias respectivas (T001/T002 y T004) — ficheros distintos.
* US1 (T008-T010, `MapScene.ts`) y US2 (T011-T013, `DestinationScene.ts`) pueden ejecutarse en paralelo una vez completado T007 — ficheros distintos, sin dependencia real entre ambas historias.
* T014 y T015 (Fase final) pueden ejecutarse en paralelo — son revisiones de código/contenido, no modifican los mismos ficheros ni dependen entre sí.

## Ejemplo de paralelización: Foundational

```text
Task: "Crear src/game/core/content/bot6-messages.ts con la interfaz Bot6Message"
Task: "Añadir 'robot' a APP_ICON_NAMES/APP_ICON_SVGS en libs/components/icon/Icon.constants.ts"
Task: "Crear src/game/overlay/bot6-dialogue.constants.ts con título, closeLabel y tamaños"
```

```text
Task: "Crear src/game/core/content/bot6-messages.test.ts (depende de T001, T002)"
Task: "Añadir caso de test para 'robot' en libs/components/icon/Icon.test.ts (depende de T004)"
```

## Estrategia de implementación

### MVP primero

1. Completar Foundational (T001-T007).
2. Implementar US1 (T008-T010).
3. Validar US1 contra sus escenarios de aceptación (bienvenida en el mapa, cierre, repetición).
4. Ejecutar `bot6-messages.test.ts` e `Icon.test.ts`.
5. Detenerse aquí si se necesita entregar solo el MVP (bienvenida en el mapa, sin mensaje de transición todavía).

### Entrega incremental

1. Foundational.
2. US1 → validar → entregar (bienvenida en el mapa).
3. US2 → validar → entregar (bienvenida + transición al destino).
4. Fase final → validar spec.md/plan.md/constitution.md en su totalidad.
