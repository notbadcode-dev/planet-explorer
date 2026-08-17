---
title: "Convención: Contrato del motor de retos (challenge engine)"
type: "convention"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16"
status: "Draft"
source: "constitution.md (principio VII 'Separación entre lógica y renderizado'; principio IX 'Contenido dirigido por datos')"
tags: [architecture, game-engine, challenge-engine]
---

# Convención: Contrato del motor de retos (challenge engine)

**Fuente**: `constitution.md` (principio VII y principio IX).

> Documento de **decisión anticipada**: fija el contrato genérico antes de
> implementarlo, para que `specs_pending/007-challenge-engine-core.md` y todas las
> specs de tipos de reto (014 a 020, 053...) implementen exactamente esta interfaz en
> lugar de decidirla de forma distinta cada vez.

## Propósito

Fijar el contrato mínimo y estable que MUST cumplir el motor genérico de generación
y validación de retos, de forma que añadir un nuevo tipo de reto no requiera tocar
el motor ni las escenas de Phaser (principio IX), y que toda la lógica sea testeable
sin renderizar nada (principio VII).

## Reglas del contrato

* **R1**: El motor expone dos operaciones puras por tipo de reto: generar un reto a
  partir de una configuración (`ChallengeConfig` → `Challenge`) y validar una
  respuesta contra un reto ya generado (`Challenge` + respuesta → resultado).
  Ninguna de las dos operaciones MUST depender de Phaser ni de un DOM real.
* **R2**: Cada tipo de reto (`counting`, `addition`, `memory`, `logic`...) se registra
  en el motor mediante un patrón de registro (registry), no mediante una cadena
  creciente de `if`/`switch` en el núcleo del motor — el núcleo MUST NOT conocer el
  detalle interno de cada tipo concreto.
* **R3**: La configuración de dificultad (rangos, cantidad de elementos, etc.) que
  recibe la generación de un reto MUST proceder del módulo de dificultad adaptativa
  (`specs_pending/009-adaptive-difficulty-v1.md` / `042-difficulty-tuning-v2.md`),
  nunca hardcodeada por destino o por escena.
* **R4**: Un `Challenge` MAY exponer una lista ordenada de pistas progresivas
  opcionales. Solicitar una pista es una acción de primera clase que se registra
  como señal para el progreso/dificultad — MUST NOT tratarse como penalización
  (principio I, y `specs_pending/010-hints-and-retry-flow.md`).
* **R5**: El resultado de validar una respuesta MUST poder alimentar el modelo de
  progreso por habilidad (ver [`progress-persistence-model.md`](./progress-persistence-model.md))
  a través de una capa de coordinación explícita — el motor de retos MUST NOT
  importar directamente el modelo de progreso, para evitar acoplamiento circular
  entre módulos de `core/`.
* **R6**: Todo tipo de reto nuevo MUST incluir su propia configuración data-driven
  (`XChallengeConfig`) siguiendo el ejemplo de `AdditionChallengeConfig` de la
  constitución (principio IX) — nunca parámetros mágicos embebidos en el código de
  generación.

## Forma conceptual del contrato

```text
generateChallenge(type: SkillChallengeType, config: ChallengeConfig): Challenge
validateAnswer(challenge: Challenge, answer: PlayerAnswer): ChallengeResult
requestHint(challenge: Challenge, hintIndex: number): Hint | undefined
```

`ChallengeResult` conceptualmente distingue: correcto/incorrecto, número de intentos,
pistas usadas — datos suficientes para alimentar dificultad adaptativa y progreso,
sin incluir nunca tiempo de respuesta como criterio de dificultad (principio IV).

## Fuera de alcance

* La implementación de cada tipo de reto concreto (`counting`, `addition`,
  `subtraction`, `memory`, `sequences`, `logic`, `reading`, `spatialReasoning`) — cada
  una se define en su propia spec (`specs_pending/007`, `014`-`020`, `053`).
* La presentación visual del reto (Phaser) — ver
  [`game-engine-scenes.md`](./game-engine-scenes.md).
* El algoritmo concreto de dificultad adaptativa — ver
  `specs_pending/009-adaptive-difficulty-v1.md` / `042-difficulty-tuning-v2.md`.
* El esquema de `Mission`/`Destination` que agrupa estos retos — ver
  [`content-model.md`](./content-model.md).
