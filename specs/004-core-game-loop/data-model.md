---
title: "Modelo de datos: Bucle de juego base"
feature: "004-core-game-loop"
type: "data-model"
version: "1.0"
created: "2026-08-17"
updated: "2026-08-17"
status: "Draft"
---

# Modelo de datos: Bucle de juego base

**Entrada**: [spec.md](./spec.md) (sección "Entidades clave") · [research.md](./research.md)

## NavigationState

Estado de navegación entre el mapa y la escena de destino. Vive en
`src/game/core/navigation/`, sin ninguna dependencia de Phaser (regla R1 de
[`game-engine-scenes.md`](../../docs/conventions/architecture/game-engine-scenes.md)).

| Campo | Tipo | Descripción |
|---|---|---|
| `activeScene` | `'map' \| 'destination'` | Escena actualmente activa. Inicial: `'map'`. |
| `pendingScene` | `'map' \| 'destination' \| null` | Escena destino de una transición en curso; `null` cuando no hay transición activa. |
| `selectedDestinationId` | `string \| null` | Id del destino seleccionado; `null` mientras el jugador está en el mapa sin selección. |
| `isTransitioning` | `boolean` | `true` mientras una transición de escena está en curso (guarda de FR-007). |

### Transiciones de estado válidas

```text
{ activeScene: 'map', pendingScene: null, isTransitioning: false }
  --beginTransitionToDestination(id)-->
{ activeScene: 'map', pendingScene: 'destination', selectedDestinationId: id, isTransitioning: true }
  --completeTransition()-->
{ activeScene: 'destination', pendingScene: null, selectedDestinationId: id, isTransitioning: false }
  --beginTransitionToMap()-->
{ activeScene: 'destination', pendingScene: 'map', selectedDestinationId: id, isTransitioning: true }
  --completeTransition()-->
{ activeScene: 'map', pendingScene: null, selectedDestinationId: null, isTransitioning: false }
```

### Reglas de validación

* **N1**: `beginTransitionToDestination`/`beginTransitionToMap` invocados mientras
  `isTransitioning === true` MUST devolver el mismo estado sin modificar (ignora la
  activación redundante — FR-007, SC-004).
* **N2**: `completeTransition` invocado mientras `isTransitioning === false` MUST
  devolver el mismo estado sin modificar (no hay transición pendiente que cerrar).
* **N3**: Al completar una transición hacia `'map'`, `selectedDestinationId` MUST
  restablecerse a `null` (el destino queda de nuevo disponible para selección desde
  cero — FR-004, FR-008).
* **N4**: El estado inicial (`createInitialNavigationState()`) MUST ser siempre
  `{ activeScene: 'map', pendingScene: null, selectedDestinationId: null,
  isTransitioning: false }`.

**Persistencia**: N/A (FR-010: sin persistencia entre sesiones en esta feature).

## Destination (placeholder)

Marcador visual seleccionable en el mapa. Vive como datos en
`src/game/core/content/` (regla R6 de `game-engine-scenes.md`), sin narrativa ni
datos astronómicos reales (Suposiciones de spec.md).

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Identificador estable en kebab-case (convención `content-model.md`, R1). |
| `name` | `string` | Nombre visible del destino en el mapa. |

**Relaciones**: Ninguna en esta feature. `content-model.md` define la jerarquía
completa `System > Destination > Expedition > Mission > Challenge`, pero se difiere
explícitamente a `specs_pending/021-expedition-mission-structure.md` (FR-010: sin
retos ni narrativa en este slice); introducir ya esos niveles sería anticipación
especulativa contraria al principio VI.

**Escala**: Un único registro en esta feature (`destinations: Destination[]` con
longitud 1), preparado como colección abierta para que features futuras añadan más
destinos sin cambiar la forma del dato (Suposiciones de spec.md; principio IX).

**Persistencia**: N/A (datos estáticos embebidos en el bundle, no en storage).
