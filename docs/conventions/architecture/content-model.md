---
title: "Convención: Modelo de contenido System > Destination > Expedition > Mission > Challenge"
type: "convention"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16"
status: "Draft"
source: "constitution.md (principio V 'Destinos, expediciones, misiones, retos y rejugabilidad'; principio IX 'Contenido dirigido por datos')"
tags: [architecture, game-engine, content-model]
---

# Convención: Modelo de contenido System > Destination > Expedition > Mission > Challenge

**Fuente**: `constitution.md` (principio V y principio IX).

> Documento de **decisión anticipada**: fija la forma del esquema de contenido antes
> de que exista implementación, para que `specs_pending/021-expedition-mission-structure.md`
> (y todas las specs de destinos que dependen de ella) tengan un esquema base ya
> acordado en lugar de decidirlo desde cero. `specs_pending/045-data-driven-content-pipeline.md`
> es responsable de formalizar la validación automática de este esquema; este
> documento fija únicamente su forma conceptual.

## Propósito

Fijar la jerarquía de datos `System > Destination > Expedition > Mission > Challenge`
exigida por el principio V, cómo se referencian sus niveles entre sí, y cómo se
mantiene el contenido como datos (principio IX) en lugar de quedar embebido en
escenas o en el motor de retos.

## Reglas de la convención

* **R1**: Cada nivel de la jerarquía (`System`, `Destination`, `Expedition`,
  `Mission`) se identifica mediante un `id` string estable en kebab-case (p. ej.
  `"moon"`, `"moon-sample-collection"`), nunca por índice de array. El progreso
  persistido (ver [`progress-persistence-model.md`](./progress-persistence-model.md))
  referencia estos ids, no posiciones.
* **R2**: Un `System` contiene una lista de `Destination`; un `Destination` contiene
  una lista de `Expedition`; una `Expedition` contiene una lista de `Mission`. Ningún
  nivel MUST asumir un único hijo — todos son colecciones abiertas a crecer
  (principio V: un destino no se agota tras una única actividad).
* **R3**: Una `Mission` referencia una lista de configuraciones de reto (`ChallengeConfig`,
  ver [`challenge-engine-contract.md`](./challenge-engine-contract.md)) por tipo +
  parámetros — nunca instancias de reto ya generadas. El reto concreto se genera en
  tiempo de ejecución mediante el motor de retos.
* **R4**: Una `Mission` MAY combinar tipos de reto de distintas habilidades
  (principio II: "un mismo destino MAY contener retos de diferentes materias y
  habilidades"). El esquema MUST NOT forzar un único tipo de reto por misión.
* **R5**: La habilidad (`skill`) es un atributo del tipo de reto (`ChallengeConfig`),
  nunca del `Destination` ni de la `Mission` en sí — la dificultad se asocia a la
  habilidad, no al destino (principio IV).
* **R6**: El contenido (instancias de `System`/`Destination`/`Expedition`/`Mission`)
  MUST vivir como datos en `src/game/core/content/` (ver
  [`game-engine-scenes.md`](./game-engine-scenes.md)), nunca embebido dentro de una
  clase de escena Phaser ni dentro del motor genérico de retos.
* **R7**: Cada `Destination` MAY incluir una referencia a su ficha astronómica real
  (ver `specs_pending/023-astronomy-facts-module.md`) como un campo de datos
  independiente del contenido narrativo/ficticio, nunca mezclado en el mismo texto.

## Campos mínimos por nivel (conceptual, sin tipos concretos)

* `System`: `id`, `name`, lista de `destinations`.
* `Destination`: `id`, `name`, lista de `expeditions`, referencia opcional a ficha
  astronómica.
* `Expedition`: `id`, `name`, lista de `missions`.
* `Mission`: `id`, `name`, lista de `challengeConfigs` (tipo + parámetros por reto).

## Fuera de alcance

* Los tipos/interfaces TypeScript concretos y su validación automática — se definen
  en el `data-model.md`/`contracts/` de `specs_pending/021-expedition-mission-structure.md`
  y se formalizan con herramientas en `specs_pending/045-data-driven-content-pipeline.md`.
* La generación procedural de variantes de misión — ver
  `specs_pending/043-mission-variability-engine.md`.
* El contrato interno del motor de retos — ver
  [`challenge-engine-contract.md`](./challenge-engine-contract.md).
* Las reglas de rejugabilidad (estrellas pendientes, mejores resultados) — ver
  `specs_pending/022-destination-replayability.md`.
