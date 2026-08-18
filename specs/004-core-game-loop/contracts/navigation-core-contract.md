---
title: "Contrato: API de core/navigation"
feature: "004-core-game-loop"
type: "contract"
version: "1.0"
created: "2026-08-17"
updated: "2026-08-17"
status: "Draft"
---

# Contrato: API pública de `src/game/core/navigation/`

**Entrada**: [data-model.md](../data-model.md) · [research.md](../research.md)

## Propósito

Fijar la API pública del módulo de estado de navegación para que las escenas de
Phaser (`src/game/scenes/`) y la capa de overlay (`src/game/overlay/`) la consuman
de forma consistente, y para que sea el contrato que features futuras de contenido
(destinos, expediciones) reutilicen sin modificarlo (regla R5 de
`game-engine-scenes.md`: añadir un destino no debe requerir tocar el motor de
navegación genérico).

## Restricción de dependencia (R1)

Este módulo MUST NOT importar `phaser` ni ningún tipo de `Phaser.Scene`. Todas las
funciones son puras: reciben el estado actual y devuelven un nuevo estado, sin
efectos secundarios ni mutación del argumento recibido.

## API pública

```ts
type SceneId = 'map' | 'destination';

interface NavigationState {
  activeScene: SceneId;
  pendingScene: SceneId | null;
  selectedDestinationId: string | null;
  isTransitioning: boolean;
}

function createInitialNavigationState(): NavigationState;

function beginTransitionToDestination(
  state: NavigationState,
  destinationId: string,
): NavigationState;

function beginTransitionToMap(state: NavigationState): NavigationState;

function completeTransition(state: NavigationState): NavigationState;
```

## Garantías de comportamiento

* **G1 — Estado inicial determinista**: `createInitialNavigationState()` siempre
  devuelve `{ activeScene: 'map', pendingScene: null, selectedDestinationId: null,
  isTransitioning: false }` (FR-001).
* **G2 — Selección inicia transición, no la completa**: `beginTransitionToDestination`
  con `isTransitioning === false` devuelve `pendingScene: 'destination'`,
  `selectedDestinationId: destinationId`, `isTransitioning: true`, y **mantiene**
  `activeScene` sin cambiar hasta que se llame a `completeTransition` (FR-002).
* **G3 — Retorno al mapa inicia transición, no la completa**:
  `beginTransitionToMap` con `isTransitioning === false` devuelve
  `pendingScene: 'map'`, `isTransitioning: true`, y mantiene `activeScene` sin
  cambiar hasta `completeTransition` (FR-004).
* **G4 — Activaciones redundantes ignoradas**: `beginTransitionToDestination` y
  `beginTransitionToMap` invocados con `isTransitioning === true` MUST devolver el
  mismo objeto de estado recibido, sin ninguna modificación (FR-007, escenario de
  aceptación 3 de la Historia de usuario 1).
* **G5 — Cierre de transición**: `completeTransition` con `isTransitioning === true`
  devuelve `activeScene = pendingScene`, `pendingScene: null`,
  `isTransitioning: false`; si el nuevo `activeScene` es `'map'`,
  `selectedDestinationId` se restablece a `null` (FR-004, FR-008).
* **G6 — Cierre sin transición pendiente**: `completeTransition` con
  `isTransitioning === false` MUST devolver el mismo objeto de estado recibido, sin
  ninguna modificación.
* **G7 — Repetible indefinidamente**: encadenar
  `beginTransitionToDestination` → `completeTransition` →
  `beginTransitionToMap` → `completeTransition` un número arbitrario de veces MUST
  converger siempre al mismo estado inicial (`createInitialNavigationState()`),
  sin acumular estado residual (FR-008, SC-004).

## Consumidores esperados

* **`src/game/scenes/MapScene.ts`**: llama a `beginTransitionToDestination` al
  activar el destino visible. No llama a `completeTransition`.
* **`src/game/scenes/DestinationScene.ts`**: llama a `completeTransition` en su
  método `create()` para cerrar la transición mapa→destino que `MapScene.ts` inició;
  llama a `beginTransitionToMap` y, a continuación, a `completeTransition` en su
  propio manejador de retorno al mapa (antes de iniciar `MapScene`), cerrando así
  también la transición destino→mapa.
* **`src/game/overlay/`**: el control "volver al mapa" invoca el manejador de
  retorno de `DestinationScene.ts` descrito arriba; el overlay en sí no llama
  directamente a ninguna función de `core/navigation`.

Ninguno de estos consumidores MUST leer ni escribir campos de `NavigationState`
directamente fuera de estas cuatro funciones (evita lógica de navegación duplicada
fuera de `core/`).

## Fuera de alcance

* La representación visual de la transición (animación, duración, easing) — es
  responsabilidad de `src/game/scenes/`, no de este contrato.
* El contenido del destino (`id`/`name`) — ver [data-model.md](../data-model.md),
  sección "Destination (placeholder)".
* El motor de retos y el modelo de progreso — no aplican a esta feature (FR-010).
