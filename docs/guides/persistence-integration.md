# Guía: integración de persistencia local en el juego

**Fuente**: [`specs/011-save-progress-local/`](../../specs/011-save-progress-local/)
(feature "Persistencia local de progreso").

Esta guía documenta cómo está conectada realmente la librería
[`@planet-explorer/persistence`](../../libs/persistence/) dentro de `src/game/`.
Para la API pública de la librería en sí (fuera del contexto del juego), ver
[`libs/persistence/INTEGRATION.md`](../../libs/persistence/INTEGRATION.md) y
[`libs/persistence/README.md`](../../libs/persistence/README.md).

> Esta guía sustituye a la fase 9 de
> [`specs/011-save-progress-local/tasks.md`](../../specs/011-save-progress-local/tasks.md),
> cuyas tareas T034-T036 se habían marcado `[x]` sin que el wiring descrito
> existiera realmente (hallazgo F1/F2 de `/speckit-converge`, tareas de
> convergencia T041-T043).

## Punto único de wiring: `src/services/persistence.ts`

`src/game/` (código de escenas Phaser) nunca importa
`@planet-explorer/persistence` directamente. Todo el acceso pasa por
[`src/services/persistence.ts`](../../src/services/persistence.ts), que:

1. Crea una única instancia de `LocalStorageAdapter` + `PersistenceService`
   (singleton de módulo).
2. Expone `loadSkillProgressState()`: carga el `PlayerProgress` persistido y lo
   traduce al `SkillProgressState` que consume el juego (ver
   [`docs/conventions/architecture/progress-persistence-model.md`](../conventions/architecture/progress-persistence-model.md)
   para el porqué de que ambos modelos no compartan la misma forma). Las
   habilidades sin datos guardados se rellenan con el estado inicial por
   defecto (`level: 1, failureCount: 0`).
3. Expone `getSaveCoordinator()`: devuelve el `EventSaveCoordinator`
   (autoguardado fire-and-forget), creado la primera vez a partir del progreso
   ya cargado.

Esta separación respeta el Principio VII de la constitución (lógica pura vs.
capas de presentación): `src/services/persistence.ts` es el único punto que
conoce tanto el modelo de dominio del juego (`SkillProgressState`) como el
modelo de persistencia (`PlayerProgress`).

## Carga al arrancar (`src/game/main.ts`)

`startGame()` llama a `loadSkillProgressState()` en vez de
`createInitialSkillProgressState()` al arrancar `MapScene` por primera vez, de
modo que una partida ya guardada continúa desde el progreso persistido en
lugar de reiniciar siempre en nivel 1.

## Autoguardado en destino (`src/game/scenes/DestinationScene.ts`)

El autoguardado se dispara desde `DestinationScene`, no desde los módulos
puros de `src/game/core/` — son las escenas (capa de presentación/orquestación)
las que conocen el momento exacto en que ocurre cada evento de juego:

* **Reto superado** (`handleAnswerSelected`, rama de éxito): tras
  `submitAnswer()`, se llama a
  `saveCoordinator.onChallengeCompleted(SKILL_ID_COUNTING, nuevoNivel)` con el
  nivel ya actualizado de la habilidad `counting`.
* **Reto fallado** (`handleAnswerSelected`, rama de reintento): se llama a
  `saveCoordinator.onSkillPracticed(SKILL_ID_COUNTING, failureCount)` con el
  contador de fallos actualizado.
* **Destino completado**: cuando `submitAnswer()` marca la visita como
  `VISIT_STATUS_COMPLETED`, se llama además a
  `saveCoordinator.onDestinationCompleted(destinationId)`.
* **Pista solicitada** (`handleRequestHint`): no dispara autoguardado, porque
  `updateSkillProgress()` con resultado `'hint-used'` no modifica ni el nivel
  ni el contador de fallos (sin cambio de estado, nada que persistir).

Todas las llamadas a `saveCoordinator` son fire-and-forget: `PersistenceService.save()`
nunca lanza excepciones (ver `libs/persistence/src/integration/PersistenceService.ts`),
así que un fallo de `localStorage` (cuota excedida, modo privado, etc.) no
interrumpe la partida.

## Limitación conocida (alcance actual)

Solo existe una habilidad jugable en el contenido actual (`counting`, destino
Luna), así que el wiring de eventos usa esa habilidad como constante
(`SKILL_ID_COUNTING` en
[`DestinationScene.constants.ts`](../../src/game/scenes/DestinationScene.constants.ts)).
Cuando se añadan destinos con otras habilidades (specs pendientes como
`013-mars-destination-addition`), este wiring debe generalizarse para leer el
`skillId` real asociado a cada reto en vez de asumir `counting`.
