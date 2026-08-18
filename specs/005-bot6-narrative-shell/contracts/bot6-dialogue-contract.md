---
title: "Contrato: API de overlay/bot6-dialogue"
feature: "005-bot6-narrative-shell"
type: "contract"
version: "1.0"
created: "2026-08-18"
updated: "2026-08-18"
status: "Draft"
---

# Contrato: API pública de `src/game/overlay/bot6-dialogue.ts`

**Entrada**: [data-model.md](../data-model.md) · [research.md](../research.md)

## Propósito

Fijar la API pública del helper de overlay que muestra un mensaje de BOT-6, para
que `src/game/scenes/MapScene.ts` y `src/game/scenes/DestinationScene.ts` lo
consuman de forma consistente, sin acceder directamente a los internos de `Dialog`
ni de `Icon` (regla R7/R8 de `game-engine-scenes.md`).

## Restricción de dependencia (R7)

Este módulo MUST NOT importar `phaser`. Compone exclusivamente `createDialog`
(`libs/components/dialog`) y `createIcon` (`libs/components/icon`); no añade
ningún estado propio ni temporizador.

## API pública

```ts
interface Bot6DialogueProps {
  message: Bot6Message; // { id: string; text: string } — ver data-model.md
  onClose: () => void;
}

function createBot6Dialogue(props: Bot6DialogueProps): HTMLElement;
```

## Garantías de comportamiento

* **G1 — Título fijo de personaje**: el elemento devuelto usa siempre
  `title: 'BOT-6'` en el `Dialog` interno, independientemente del `message`
  recibido (FR-006, Clarification Q3: el nombre del personaje es la marca de
  narrativa ficticia).
* **G2 — Un único mensaje, sin secuencia**: `createBot6Dialogue` no encadena ni
  muestra más de un `message` por llamada; mostrar un segundo mensaje requiere una
  nueva llamada explícita desde la escena (FR-003a).
* **G3 — Retrato como contenido del diálogo**: el `content` del `Dialog` interno es
  siempre un `Icon` con `name: 'robot'` (FR-006).
* **G4 — Cierre mediante una única acción**: `onClose` se invoca exactamente una
  vez cuando el jugador cierra el diálogo (clic en el botón de cierre, tecla
  Escape, o clic en el fondo si `Dialog` lo soporta) — mismo comportamiento ya
  garantizado por `Dialog` (FR-004). `createBot6Dialogue` no introduce ningún
  cierre automático por temporizador (Suposición de spec.md).
* **G5 — Sin estado ni persistencia**: dos llamadas sucesivas a
  `createBot6Dialogue` con el mismo `message` producen el mismo resultado; no hay
  memoria de si el mensaje ya se mostró antes (Clarification Q1 — se repite en cada
  visita).
* **G6 — Elemento listo para montar**: el `HTMLElement` devuelto no se auto-monta
  en el DOM; el consumidor (la escena) MUST añadirlo explícitamente como hermano
  del `<canvas>` y retirarlo en su manejador de `SHUTDOWN`, igual patrón que
  `createHud(...)` en `DestinationScene.ts` (004-core-game-loop).

## Consumidores esperados

* **`src/game/scenes/MapScene.ts`**: llama a `createBot6Dialogue({ message:
  MAP_WELCOME_MESSAGE, onClose })` dentro de `create()`, en cada entrada a la
  escena (Clarification Q1); retira el elemento en `handleShutdown()`.
* **`src/game/scenes/DestinationScene.ts`**: llama a `createBot6Dialogue({
  message: DESTINATION_TRANSITION_MESSAGE, onClose })` dentro de `create()`,
  además del `createHud(...)` ya existente; retira ambos elementos en
  `handleShutdown()`.

Ninguno de estos consumidores MUST acceder directamente a `createDialog` ni a
`createIcon` para construir el mensaje de BOT-6 (evita lógica de composición
duplicada fuera de este módulo).

## Fuera de alcance

* El contenido exacto de los mensajes (`MAP_WELCOME_MESSAGE`,
  `DESTINATION_TRANSITION_MESSAGE`) — ver
  [data-model.md](../data-model.md), sección "Bot6Message".
* Persistencia de si un mensaje ya se mostró — diferido explícitamente a
  `specs_pending/011-save-progress-local.md` (fuera de alcance de esta spec).
* Personalización cosmética de BOT-6, audio/voz o interpolación del nombre del
  jugador — fuera de alcance (FR-007 de spec.md).
