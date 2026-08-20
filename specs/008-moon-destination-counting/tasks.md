---

title: "Destino: la Luna con retos de conteo"
feature: "008-moon-destination-counting"
type: "task-list"
version: "1.0"
created: "2026-08-20"
updated: "2026-08-20"
status: "Implemented"
spec: "./spec.md"
plan: "./plan.md"
tags: ["game", "education", "challenges", "narrative", "planets"]
dependencies: ["004-core-game-loop", "005-bot6-narrative-shell", "007-challenge-engine-core"]
related_specs: ["006-skill-progress-model"]
------------------------------------------------------------

# Tareas: Destino: la Luna con retos de conteo

**Entrada**: Documentos de diseño de `/specs/008-moon-destination-counting/`

**Prerrequisitos**: `plan.md` y `spec.md` · `research.md`, `data-model.md`, `contracts/destination-visit-contract.md` y `quickstart.md`.

**Organización**: Las tareas se agrupan por historia de usuario para permitir que cada historia pueda implementarse, probarse y validarse de forma independiente.

## Convenciones de rutas

* **Proyecto único**: `src/game/` (motor de juego, contenido y overlay), `libs/components/` (`Dialog`, `Icon`, `Button` — reutilizados sin cambios).

## Estrategia de pruebas

Por decisión de `plan.md` (sección "Estrategia de pruebas"), la cobertura automatizada exigida en esta feature es unitaria sobre el nuevo módulo `core/destination-visit/destination-visit-state.test.ts` (garantías G1-G6 de `contracts/destination-visit-contract.md`) y una extensión de `core/content/bot6-messages.test.ts` para los nuevos mensajes. `destinations.ts` no tiene test dedicado (dato trivial, mismo criterio ya aceptado desde `004`). No se generan tareas de integración/E2E automatizadas: la verificación de que `DestinationScene` consume `core/destination-visit` solo a través de su API pública se hace por revisión de código (Fase final), y la validación del flujo completo se hace manualmente vía `quickstart.md`.

---

## Fase 1: Setup

**Propósito**: Preparar dependencias y configuración necesarias antes de escribir código.

N/A — esta feature no añade ninguna dependencia de producción, configuración de test ni tooling nuevo (`research.md` no identifica ninguno; `Dialog`, `Icon`, `Button`, `Phaser` y el `test.include` de `src/game/**/*.test.ts` ya existen desde `004`/`005`). No se generan tareas artificiales para esta fase.

---

## Fase 2: Foundational

**Propósito**: Implementar los datos, tipos y el módulo puro de coordinación compartidos que bloquean las 3 historias de usuario: el contenido del destino Luna, los mensajes de BOT-6, el transporte del `SkillProgressState` entre escenas, el módulo `core/destination-visit/` y el overlay de reto.

**Gate**: Ninguna historia de usuario puede comenzar hasta completar esta fase.

* [X] T001 [P] En [src/game/core/content/destinations.ts](../../src/game/core/content/destinations.ts), añadir a `Destination` el campo opcional `challengeConfigs?: readonly CountingChallengeConfig[]` (importando el tipo desde `../challenge-engine/challenge-engine.type`) (data-model.md)
* [X] T002 [P] En [src/game/core/content/destinations.constants.ts](../../src/game/core/content/destinations.constants.ts), añadir `CHALLENGE_SEQUENCE_LENGTH = 3`, `MOON_COUNTING_MIN`, `MOON_COUNTING_MAX` y `MOON_DESTINATION_BACKGROUND_COLOR` (color hexadecimal para `Phaser.Cameras.Scene2D.Camera.setBackgroundColor`, FR-010), y poblar el registro `'moon'` de `DESTINATIONS` con `challengeConfigs`: un array de `CHALLENGE_SEQUENCE_LENGTH` entradas `{ type: 'counting', min: MOON_COUNTING_MIN, max: MOON_COUNTING_MAX }` (sin `difficulty`, research.md §1) (depende de T001)
* [X] T003 [P] En [src/game/core/content/bot6-messages.constants.ts](../../src/game/core/content/bot6-messages.constants.ts), añadir 5 nuevas constantes `Bot6Message` (≤ `BOT6_MESSAGE_MAX_LENGTH`, `id` únicos): `MOON_CHALLENGE_INTRO_MESSAGE`, `MOON_CHALLENGE_NEXT_MESSAGE`, `MOON_CHALLENGE_RETRY_MESSAGE`, `MOON_CHALLENGE_SUCCESS_MESSAGE`, `MOON_DESTINATION_COMPLETE_MESSAGE` (data-model.md)
* [X] T004 [P] [FR-002][FR-004][FR-009] En [src/game/core/content/bot6-messages.test.ts](../../src/game/core/content/bot6-messages.test.ts), añadir las 5 constantes nuevas al array `messages` y un bloque `describe`/`it` específico por constante, siguiendo el mismo patrón que `MAP_WELCOME_MESSAGE`/`DESTINATION_TRANSITION_MESSAGE` (depende de T003)
* [X] T005 [P] En [src/game/core/navigation/navigation-state.type.ts](../../src/game/core/navigation/navigation-state.type.ts), añadir a `SceneInitData` el campo `skillProgressState: SkillProgressState` (importando el tipo desde `../progress/skill-progress-state.type`) (data-model.md, plan.md sección "Ciclo de vida del `SkillProgressState` entre escenas")
* [X] T006 En [src/game/main.ts](../../src/game/main.ts), importar `createInitialSkillProgressState` de `./core/progress/skill-progress-state` e incluir `skillProgressState: createInitialSkillProgressState()` tanto en el `scene.start(SCENE_ID_MAP, ...)` inicial como en el `activeScene.scene.restart(...)` del listener de `popstate` (usando `activeScene.skillProgressState` en este último) (depende de T005)
* [X] T007 En [src/game/scenes/MapScene.ts](../../src/game/scenes/MapScene.ts) **y** en [src/game/scenes/DestinationScene.ts](../../src/game/scenes/DestinationScene.ts), guardar `data.skillProgressState` en un nuevo campo público `skillProgressState` en el `init()` de ambas escenas; reenviarlo en el `scene.start(SCENE_ID_DESTINATION, ...)` existente de `MapScene.ts` (junto a `navigationState`) **y** en el `scene.start(SCENE_ID_MAP, ...)` existente de `handleReturnToMap()` de `DestinationScene.ts` (junto a `navigationState`) — sin esta segunda actualización, `satisfies SceneInitData` dejaría de compilar en `handleReturnToMap()` al ser `skillProgressState` obligatorio (depende de T005)
* [X] T008 [P] Crear [src/game/core/destination-visit/destination-visit-state.type.ts](../../src/game/core/destination-visit/destination-visit-state.type.ts) con la interfaz `DestinationVisitState` (`destinationId`, `challenges`, `currentIndex`, `status`, `lastOutcome`) (data-model.md)
* [X] T009 Crear [src/game/core/destination-visit/destination-visit-state.constants.ts](../../src/game/core/destination-visit/destination-visit-state.constants.ts) con `NUM_ANSWER_OPTIONS = 4`, `VISIT_STATUS_IN_PROGRESS = 'in-progress'`, `VISIT_STATUS_COMPLETED = 'completed'`, offsets para la generación de distractores, y funciones factoría de mensajes de error (mismo patrón que `challenge-engine.constants.ts`) (depende de T008)
* [X] T010 [FR-002][FR-003][FR-004][FR-006][FR-007][FR-011][FR-013][FR-014] Crear [src/game/core/destination-visit/destination-visit-state.ts](../../src/game/core/destination-visit/destination-visit-state.ts) implementando `createDestinationVisit`, `getCurrentChallenge`, `getAnswerOptions` y `submitAnswer` según `contracts/destination-visit-contract.md` (G1-G6), reutilizando `generateChallenge`/`validateAnswer` de `../challenge-engine/challenge-engine` y `updateSkillProgress` de `../progress/skill-progress-state` (depende de T001, T002, T008, T009)
* [X] T011 [P] Crear [src/game/core/destination-visit/destination-visit-state.test.ts](../../src/game/core/destination-visit/destination-visit-state.test.ts) verificando G1-G6 del contrato: secuencia fija generada al crear la visita (G1), reintento sin regenerar el reto tras fallo (G2), avance de `currentIndex` solo tras acierto (G3), `status` pasa a `'completed'` tras el último acierto (G4), `updateSkillProgress` se invoca en cada intento con o sin acierto (G5), pureza/inmutabilidad (G6) (depende de T010)
* [X] T012 [P] Crear [src/game/overlay/challenge-dialogue.constants.ts](../../src/game/overlay/challenge-dialogue.constants.ts) con el título fijo `'BOT-6'`, el tamaño de `Dialog`, el nombre de icono `'star'` para los ítems a contar, y el `variant`/`size` de los `Button` de opciones de respuesta
* [X] T013 [FR-013] Crear [src/game/overlay/challenge-dialogue.ts](../../src/game/overlay/challenge-dialogue.ts) implementando `createChallengeDialogue(props): HTMLElement`, componiendo `createDialog` (`libs/components/dialog`) con `content` = un `createIcon({ name: 'star' })` por elemento del reto actual y `actions` = un `createButton(...)` por cada opción de `getAnswerOptions`, invocando `onSelect(option)` al pulsar (mismo patrón que `bot6-dialogue.ts`, research.md §3) (depende de T012)

**Checkpoint**: Datos del destino Luna y mensajes de BOT-6 listos, `SkillProgressState` hilvanado entre escenas, `core/destination-visit` testeado y `createChallengeDialogue` listo para ser invocado desde `DestinationScene`.

---

## Fase 3: Historia de usuario 1 - Resolver el primer reto de conteo narrativo (Prioridad: P1)

**Objetivo**: Al entrar en el destino Luna, el jugador ve el primer reto de conteo envuelto en un mensaje narrativo de BOT-6; al responder correctamente recibe feedback inmediato y avanza al siguiente reto.

**Prueba independiente**: Entrar en el destino Luna y comprobar que el primer reto aparece dentro de una frase narrativa de BOT-6 (no como operación aritmética aislada); responder correctamente y comprobar que aparece feedback de acierto y se muestra el siguiente reto de la secuencia.

**Requisitos relacionados**: FR-001, FR-002, FR-003, FR-008, FR-010, FR-013, FR-014

**Escenarios de aceptación relacionados**: Historia de usuario 1, escenarios 1-2 de spec.md

### Implementación de US1

* [X] T014 [US1] [FR-001][FR-002][FR-008][FR-010] En [src/game/scenes/DestinationScene.ts](../../src/game/scenes/DestinationScene.ts), en `create()`, buscar el destino activo en `DESTINATIONS` por `this.navigationState.selectedDestinationId`; si tiene `challengeConfigs`, sustituir el diálogo genérico `DESTINATION_TRANSITION_MESSAGE` por la creación de la visita (`createDestinationVisit(destination.id, destination.challengeConfigs, getSkillLevel(this.skillProgressState, 'counting'))`, guardada en un nuevo campo privado `destinationVisit`), aplicar `this.cameras.main.setBackgroundColor(MOON_DESTINATION_BACKGROUND_COLOR)` para distinguir visualmente la escena del placeholder vacío anterior (FR-010), y montar `createChallengeDialogue(...)` con `MOON_CHALLENGE_INTRO_MESSAGE`, el reto actual y sus opciones (depende de T002, T007, T010, T013)
* [X] T015 [US1] [FR-003][FR-013] Implementar `handleAnswerSelected(answer: number)` en [src/game/scenes/DestinationScene.ts](../../src/game/scenes/DestinationScene.ts): invocar `submitAnswer(this.destinationVisit, this.skillProgressState, answer)`, actualizar `destinationVisit`/`skillProgressState` con el resultado; en la rama `outcome === 'success'` con `status !== 'completed'`, retirar el diálogo de reto actual y montar uno nuevo con `MOON_CHALLENGE_NEXT_MESSAGE` y el siguiente reto/opciones (depende de T014)
* [X] T016 [US1] En [src/game/overlay/hud.ts](../../src/game/overlay/hud.ts)/[hud.constants.ts](../../src/game/overlay/hud.constants.ts), sustituir `PROGRESS_PLACEHOLDER_VALUE`/`PROGRESS_PLACEHOLDER_LABEL` por el progreso real de la secuencia (`currentIndex + 1` de `challenges.length`) cuando la escena tenga una visita activa, y actualizar `createHud`/su invocación en `DestinationScene.ts` para pasarlo tras cada respuesta (depende de T014, T015)

**Checkpoint US1**:

* El primer reto del destino Luna se presenta envuelto en narrativa de BOT-6 (FR-002, SC-002).
* Responder correctamente muestra feedback y avanza al siguiente reto (FR-003).
* El test `destination-visit-state.test.ts` (T011) y `bot6-messages.test.ts` (T004) pasan.
* US1 funciona de forma independiente y constituye el MVP de esta feature (spec.md, Historia de usuario 1 = P1).

---

## Fase 4: Historia de usuario 2 - Reintentar un reto tras un error, sin penalización (Prioridad: P1)

**Objetivo**: Si el jugador responde incorrectamente, el sistema muestra feedback de error inmediato, mantiene el mismo reto disponible para reintentar sin límite, y no aplica ninguna penalización de juego.

**Prueba independiente**: Responder incorrectamente a un reto del destino Luna y comprobar que (a) aparece feedback de error, (b) el mismo reto (misma ambientación narrativa) sigue disponible, y (c) no hay reducción de puntuación/vidas/tiempo; reintentar hasta acertar y comprobar el mismo feedback de éxito que a la primera.

**Requisitos relacionados**: FR-004, FR-005, FR-006, FR-007

**Escenarios de aceptación relacionados**: Historia de usuario 2, escenarios 1-3 de spec.md

**Nota de independencia**: Comparte con US1 la misma función `handleAnswerSelected` (T015) creada en `DestinationScene.ts`; US2 añade su rama `'failure'`. No puede implementarse antes de T014/T015 (mismo criterio que la dependencia US2→US1 ya documentada en `004-core-game-loop`/`005-bot6-narrative-shell` por compartir fichero de escena).

### Implementación de US2

* [X] T017 [US2] [FR-004][FR-005][FR-006][FR-007] En `handleAnswerSelected` de [src/game/scenes/DestinationScene.ts](../../src/game/scenes/DestinationScene.ts) (T015), añadir la rama `outcome === 'failure'`: retirar el diálogo de reto actual y montar uno nuevo con `MOON_CHALLENGE_RETRY_MESSAGE` y el **mismo** reto actual (`getCurrentChallenge`) con opciones recalculadas (`getAnswerOptions`), sin modificar ningún marcador de puntuación/vidas/tiempo (que no existen en este flujo) (depende de T015)

**Checkpoint US2**:

* Fallar un reto muestra feedback de error y mantiene el mismo reto disponible sin límite de reintentos (FR-004, FR-006, SC-003).
* Acertar tras uno o varios fallos muestra el mismo feedback de éxito que a la primera (Historia de usuario 2, escenario 3).
* `destination-visit-state.test.ts` (T011, garantía G2) cubre este comportamiento a nivel de módulo puro.

---

## Fase 5: Historia de usuario 3 - Completar el destino y ver reflejado el progreso en counting (Prioridad: P2)

**Objetivo**: Al resolver el último reto de la secuencia, BOT-6 confirma el cierre del destino y el jugador puede volver al mapa; el nivel de dominio de "counting" refleja los aciertos y fallos de la visita.

**Prueba independiente**: Completar la secuencia completa del destino Luna con una mezcla de aciertos y fallos, comprobar que aparece un mensaje de cierre de BOT-6 y se puede volver al mapa, y comparar el nivel de dominio de "counting" antes y después de la visita.

**Requisitos relacionados**: FR-003, FR-007, FR-009, FR-012

**Escenarios de aceptación relacionados**: Historia de usuario 3, escenarios 1-2 de spec.md

**Nota de independencia**: Extiende la rama `'success'` de `handleAnswerSelected` (T015) para el caso en que la visita queda `'completed'`; depende de T014/T015 por el mismo motivo que US2.

### Implementación de US3

* [X] T018 [US3] [FR-003][FR-009] En la rama `outcome === 'success'` de `handleAnswerSelected` (T015), cuando `destinationVisit.status === 'completed'` tras `submitAnswer`, retirar el diálogo de reto y montar `createBot6Dialogue({ message: MOON_DESTINATION_COMPLETE_MESSAGE, onClose: () => this.handleReturnToMap() })` en vez de mostrar un nuevo reto (depende de T015)
* [X] T019 [US3] [FR-012] Extender `handleShutdown()`/`handleReturnToMap()` en [src/game/scenes/DestinationScene.ts](../../src/game/scenes/DestinationScene.ts) para retirar también el nuevo campo `challengeDialogueElement` si sigue montado (además de `hudElement`/`bot6DialogueElement` ya existentes), de forma que abandonar el destino a mitad de la secuencia no deja nodos DOM huérfanos (depende de T014)

**Checkpoint US3**:

* Completar el último reto muestra el mensaje de cierre de BOT-6 y permite volver al mapa (FR-003, FR-009, SC-005).
* El nivel de "counting" tras la visita refleja los aciertos/fallos obtenidos (FR-007, SC-004), verificable comparando `getSkillLevel` antes/después vía `destination-visit-state.test.ts` (T011, garantía G5).
* Abandonar el destino en cualquier momento no deja la aplicación en un estado inconsistente (SC-005, caso límite de spec.md).

---

## Fase final: Integración y aspectos transversales

**Propósito**: Validar que la implementación completa satisface `spec.md`, `plan.md` y `constitution.md`.

* [X] T020 [P] Verificar que [DestinationScene.ts](../../src/game/scenes/DestinationScene.ts) solo llama a la API pública de `core/destination-visit` (`createDestinationVisit`, `getCurrentChallenge`, `getAnswerOptions`, `submitAnswer`) descrita en `contracts/destination-visit-contract.md`, sin invocar directamente `generateChallenge`/`validateAnswer`/`updateSkillProgress` (revisión de código, principio VII / regla R2 de `game-engine-scenes.md`)
* [X] T021 [P] Verificar que ninguno de los ficheros nuevos/modificados en `src/game/core/` (`destinations.ts`, `destinations.constants.ts`, `bot6-messages.constants.ts`, `destination-visit-state.ts`, `destination-visit-state.type.ts`, `destination-visit-state.constants.ts`) importa `phaser` (revisión de código, regla R1 de `game-engine-scenes.md`)
* [X] T022 [P] Ejecutar `node scripts/check-components.mjs` y confirmar que no hay literales mágicos sueltos en los ficheros nuevos/modificados fuera de sus `*.constants.ts`
* [X] T023 Ejecutar la validación manual de [quickstart.md](./quickstart.md) (pasos 1-7: narrativa envolvente, reintento sin penalización, avance, finalización, reinicio de secuencia al reentrar)
* [X] T024 Ejecutar `npm run lint && npm test && npm run build` y confirmar que el gate de CI pasa incluyendo el nuevo módulo `core/destination-visit/`, el overlay `challenge-dialogue` y las extensiones de `destinations`/`bot6-messages`/`navigation-state`/`main.ts`/`MapScene.ts`

**Checkpoint final**: La funcionalidad completa satisface `spec.md`, `plan.md` y `constitution.md`.

---

## Fase 6: Convergencia

**Propósito**: Tareas generadas por `/speckit-converge` tras detectar diferencias entre la implementación real y `spec.md`/`plan.md`/`tasks.md` (T001-T024 permanecen sin modificar).

* [X] T025 Corregir [DestinationScene.ts](../../src/game/scenes/DestinationScene.ts) para leer `this.navigationState.selectedDestinationId` en vez del campo inexistente `currentDestinationId` al buscar el destino actual; sin este fix la secuencia de retos del destino Luna nunca se activa en ejecución real per T014 (FR-001, FR-002, FR-014) (contradicts, CRÍTICA)
* [X] T026 Corregir los 13 literales mágicos detectados por `node scripts/check-components.mjs` (`destination-visit-state.ts`, `challenge-dialogue.ts`, `hud.ts`, `DestinationScene.ts`) y los 4 errores de `eslint .` (`no-useless-assignment` en `destination-visit-state.ts:132`; `@typescript-eslint/no-explicit-any` ×2 y `no-unused-vars` en `challenge-dialogue.ts:75`) para que `npm run lint` pase per T022/T024 (missing, CRÍTICA)
* [X] T027 Corregir `handleShutdown()` en [DestinationScene.ts](../../src/game/scenes/DestinationScene.ts) para invocar `this.hudElement?.element.remove()` en vez de `this.hudElement?.remove()` (método inexistente en `HudInstance`), evitando dejar el nodo del HUD huérfano en el DOM al salir de la escena per FR-012/T019 (partial, ALTA)
* [X] T028 Sustituir los strings narrativos improvisados en `handleChallengeIntroClose()`/`handleAnswerSelected()` de [DestinationScene.ts](../../src/game/scenes/DestinationScene.ts) por `MOON_CHALLENGE_NEXT_MESSAGE.text`, `MOON_CHALLENGE_RETRY_MESSAGE.text` y, si corresponde tras revisar FR-003, `MOON_CHALLENGE_SUCCESS_MESSAGE.text`, alineando con el patrón data-driven de `data-model.md` y con T014/T015/T017/T018 (contradicts, ALTA)
* [X] T029 Corregir el prop `size` pasado a `createIcon(...)` en [challenge-dialogue.ts](../../src/game/overlay/challenge-dialogue.ts) para usar un valor numérico conforme al contrato `IconProps.size: number` de `libs/components/icon`, en vez de la cadena `'medium'` per T013 (contradicts, ALTA)
* [X] T030 Reemplazar el cast `(challenge as any).items` en [challenge-dialogue.ts](../../src/game/overlay/challenge-dialogue.ts) por un estrechamiento de tipo (`challenge.type === 'counting'`) o por tipar `ChallengeDialogueProps.challenge` como `CountingChallenge`, eliminando los `any` y el parámetro `item` sin usar per T013 (partial, MEDIA)
* [X] T031 Ajustar los tipos de `getCurrentChallenge()` en [destination-visit-state.ts](../../src/game/core/destination-visit/destination-visit-state.ts) y el swap de `shuffleArray` para que sean coherentes con el acceso indexado estricto de TypeScript per T010 (partial, MEDIA)
* [X] T032 Extraer a `*.constants.ts` los literales `0`/`1` restantes (`destination-visit-state.ts:52`; `DestinationScene.ts:78,90`; `challenge-dialogue.ts:93`) y sustituir los template literals con texto entre expresiones en [hud.ts](../../src/game/overlay/hud.ts) (`${current}/${total}`, `${percentage}${...}`) por concatenación, per la convención "sin literales mágicos" y T022 (partial, BAJA)
* [X] T033 Eliminar el bloque de imports y el comentario JSDoc de cabecera duplicados en [hud.ts](../../src/game/overlay/hud.ts), residuo de una edición externa (unrequested, BAJA)

**Checkpoint de convergencia**: Tras completar T025-T033, volver a ejecutar `/speckit-converge` para confirmar que no quedan hallazgos pendientes antes de invocar `planet-finish-spec`.

---

## Dependencias y orden de ejecución

### Dependencias entre fases

* **Setup (Fase 1)**: N/A, sin tareas.
* **Foundational (Fase 2)**: Sin dependencias internas de la funcionalidad (reutiliza `004`/`005`/`006`/`007` ya implementadas).
* **Historias de usuario (Fase 3+)**: Dependen de las tareas Foundational (T001-T013); US2 y US3 dependen además de T014-T015 (US1) por compartir el fichero `DestinationScene.ts` y la función `handleAnswerSelected`.
* **Integración y aspectos transversales (Fase final)**: Depende de US1, US2 y US3 completas.

### Dependencias entre historias de usuario

* **US1 (P1)**: Ninguna tras Foundational.
* **US2 (P1)**: Depende de T014-T015 (US1) — comparte `handleAnswerSelected`; añade solo la rama de fallo.
* **US3 (P2)**: Depende de T014-T015 (US1) — extiende la rama de éxito para el caso de finalización; independiente de US2.

### Orden dentro de cada historia

1. Datos, tipos, transporte de `SkillProgressState` y módulo `core/destination-visit` ya resueltos en Foundational.
2. Conexión escena↔visita (`createDestinationVisit`, montaje del primer reto).
3. Manejo de respuesta (`handleAnswerSelected`): éxito (US1) → fallo (US2) → finalización (US3).
4. Limpieza en `handleShutdown()`/`handleReturnToMap()`.
5. Validación contra los escenarios de aceptación (Fase final).

## Oportunidades de paralelización

* T001, T003, T005, T008 y T012 (Foundational) pueden ejecutarse en paralelo — ficheros distintos, sin dependencias entre sí.
* T002 (depende de T001), T004 (depende de T003), T009 (depende de T008) pueden ejecutarse en paralelo entre sí una vez completadas sus dependencias respectivas.
* T011 (test, depende de T010) puede ejecutarse en paralelo con T012/T013 (overlay) una vez completado T010 — ficheros distintos.
* T020, T021 y T022 (Fase final) pueden ejecutarse en paralelo — son revisiones de código/herramienta, no modifican los mismos ficheros ni dependen entre sí.

## Ejemplo de paralelización: Foundational

```text
Task: "Añadir challengeConfigs opcional a Destination en destinations.ts"
Task: "Añadir 5 mensajes Bot6Message nuevos en bot6-messages.constants.ts"
Task: "Añadir skillProgressState a SceneInitData en navigation-state.type.ts"
Task: "Crear destination-visit-state.type.ts con DestinationVisitState"
Task: "Crear challenge-dialogue.constants.ts con título, tamaño e iconos"
```

## Estrategia de implementación

### MVP primero

1. Completar Foundational (T001-T013).
2. Implementar US1 (T014-T016).
3. Validar US1 contra sus escenarios de aceptación (narrativa, primer acierto, avance).
4. Ejecutar `destination-visit-state.test.ts` y `bot6-messages.test.ts`.
5. Detenerse aquí si se necesita entregar solo el MVP (primer reto jugable, sin reintento ni cierre todavía).

### Entrega incremental

1. Foundational.
2. US1 → validar → entregar (primer reto narrativo jugable).
3. US2 → validar → entregar (reintento sin penalización).
4. US3 → validar → entregar (cierre del destino + progreso de habilidad reflejado).
5. Fase final → validar `spec.md`/`plan.md`/`constitution.md` en su totalidad.

## Fase 7: Convergencia

**Propósito**: Tareas generadas por una segunda pasada de `/speckit-converge`, tras detectar nuevas diferencias entre la implementación real (posterior a T025-T033) y `spec.md`/`plan.md`/`data-model.md` (T001-T033 permanecen sin modificar).

* [X] T034 Mostrar `MOON_CHALLENGE_SUCCESS_MESSAGE.text` como feedback inmediato de acierto en la rama `outcome === 'success'` de `handleAnswerSelected()` en [DestinationScene.ts](../../src/game/scenes/DestinationScene.ts), antes de avanzar al siguiente reto o de mostrar el mensaje de finalización, per data-model.md (tabla de `Bot6Message`, "Tras una respuesta correcta, antes de avanzar") y FR-003 — actualmente `MOON_CHALLENGE_SUCCESS_MESSAGE` está definida y testeada (T003/T004) pero nunca se importa ni se usa (partial, ALTA)
* [X] T035 En `create()`/`handleChallengeIntroClose()` de [DestinationScene.ts](../../src/game/scenes/DestinationScene.ts), presentar el primer reto usando `MOON_CHALLENGE_INTRO_MESSAGE.text` como `description` del `challenge-dialogue` (tal y como especifica T014: "montar createChallengeDialogue(...) con MOON_CHALLENGE_INTRO_MESSAGE"), en vez del flujo actual (popup `Bot6Dialogue` separado con `MOON_CHALLENGE_INTRO_MESSAGE` seguido de un `challenge-dialogue` con la constante ad-hoc `CHALLENGE_INTRO_DESCRIPTION`, no descrita en `data-model.md` ni `tasks.md`) per T014, data-model.md (contradicts, ALTA)
* [X] T036 Eliminar en [hud.ts](../../src/game/overlay/hud.ts) el bloque de comentario JSDoc de cabecera duplicado y el `import './hud.css';` duplicado (la limpieza de T033 no se refleja en el fichero actual) per T033 (contradicts, BAJA)
* [X] T037 Eliminar las constantes sin uso `VISIT_STATUS_IN_PROGRESS_REF`/`VISIT_STATUS_COMPLETED_REF` de [DestinationScene.constants.ts](../../src/game/scenes/DestinationScene.constants.ts), duplicadas de `VISIT_STATUS_IN_PROGRESS`/`VISIT_STATUS_COMPLETED` (ya importadas de `destination-visit-state.constants.ts`) y no referenciadas en ningún fichero (unrequested, BAJA)

**Checkpoint de convergencia**: Tras completar T034-T037, volver a ejecutar `/speckit-converge` para confirmar que no quedan hallazgos pendientes antes de invocar `planet-finish-spec`.

## Fase 8: Convergencia

**Propósito**: Tareas generadas por una tercera pasada de `/speckit-converge`, tras detectar una regresión introducida por una edición externa al fichero posterior a T034 (T001-T037 permanecen sin modificar).

* [X] T038 Restaurar el import de `MOON_CHALLENGE_SUCCESS_MESSAGE` desde `../core/content/bot6-messages.constants` en [DestinationScene.ts](../../src/game/scenes/DestinationScene.ts) — el identificador se usa en las dos ramas de éxito de `handleAnswerSelected()` (líneas ~171 y ~186) pero ya no figura en el bloque de import, causando `TS2552: Cannot find name 'MOON_CHALLENGE_SUCCESS_MESSAGE'` (confirmado con `npx tsc --noEmit`) y un `ReferenceError` en tiempo de ejecución que rompe el feedback inmediato de acierto per FR-003 (missing, CRÍTICA)

**Checkpoint de convergencia**: Tras completar T038, volver a ejecutar `/speckit-converge` para confirmar que no quedan hallazgos pendientes antes de invocar `planet-finish-spec`.
