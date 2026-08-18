---
title: "Modelo de datos: Cascarón narrativo de BOT-6"
feature: "005-bot6-narrative-shell"
type: "data-model"
version: "1.0"
created: "2026-08-18"
updated: "2026-08-18"
status: "Draft"
---

# Modelo de datos: Cascarón narrativo de BOT-6

**Entrada**: [spec.md](./spec.md) (sección "Entidades clave") · [research.md](./research.md)

## Bot6Message

Mensaje corto de BOT-6 asociado a un punto de entrada de escena. Vive como datos
puros en `src/game/core/content/bot6-messages.ts`, sin ninguna dependencia de
Phaser (regla R1 de
[`game-engine-scenes.md`](../../docs/conventions/architecture/game-engine-scenes.md)).

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` | Identificador estable en kebab-case (`'map-welcome'` \| `'destination-transition'` en esta feature). |
| `text` | `string` | Texto corto en castellano mostrado junto al retrato de BOT-6. MUST NOT superar `BOT6_MESSAGE_MAX_LENGTH` caracteres (80, ver research.md §5). |

**Relaciones**: Ninguna. No referencia `NavigationState` ni `Destination`; cada
escena selecciona el registro correspondiente por su propio `id` de escena
(`MapScene` → `MAP_WELCOME_MESSAGE`, `DestinationScene` →
`DESTINATION_TRANSITION_MESSAGE`), sin ningún campo de enlace explícito en esta
feature (no hay todavía más de un destino, ver Suposiciones de spec.md).

**Ciclo de vida / estados**: N/A. Son registros estáticos e inmutables definidos en
build-time; no cambian en runtime ni tienen estados propios (a diferencia de
`NavigationState`, que sí es mutado por transiciones).

**Escala**: Dos registros en esta feature (`MAP_WELCOME_MESSAGE`,
`DESTINATION_TRANSITION_MESSAGE`), preparados como colección abierta —
`core/content/` MAY añadir más registros en features futuras (p. ej. un mensaje de
transición distinto por destino, cuando exista más de un destino real) sin cambiar
la forma del dato (principio IX).

**Persistencia**: N/A (datos estáticos embebidos en el bundle, no en storage; sin
relación con la futura persistencia de progreso de la spec 011).

## Sin cambios a `NavigationState` ni `Destination`

Esta feature no modifica el modelo de datos ya definido en
`specs/004-core-game-loop/data-model.md` (`NavigationState`, `Destination`). Las
escenas leen el `Bot6Message` correspondiente de forma independiente a en qué punto
del `NavigationState` se encuentren; no se añade ningún campo nuevo a
`NavigationState` para recordar si un mensaje ya se mostró (Clarification Q1 de
spec.md: se repite en cada visita, sin estado de sesión nuevo).
