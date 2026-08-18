---
title: "Convención: Estructura de escenas Phaser y separación lógica/render"
type: "convention"
version: "1.2"
created: "2026-08-16"
updated: "2026-08-17"
status: "Draft"
source: "constitution.md (sección 'Arquitectura y tecnología' y principio VII 'Separación entre lógica y renderizado'); specs/004-core-game-loop/plan.md (primera implementación real)"
tags: [architecture, game-engine, phaser]
---

# Convención: Estructura de escenas Phaser y separación lógica/render

**Fuente**: `constitution.md` (principio VII, "Separación entre lógica y renderizado";
sección "Arquitectura y tecnología").

> Documento de **decisión anticipada**: fija la arquitectura que MUST seguir el motor
> de juego antes de que exista código, para que `/speckit-plan` de `specs_pending/004-core-game-loop.md`
> en adelante no tenga que re-decidir esta estructura. Se actualizará (nunca se
> contradirá silenciosamente) en cuanto la primera implementación real revele un
> ajuste necesario.

## Propósito

Fijar dónde vive el código del motor de juego dentro de `src/`, qué responsabilidad
tiene cada capa, y cómo se garantiza que la lógica educativa y de progresión pueda
testearse con Vitest sin instanciar ninguna `Phaser.Scene`, tal como exige el
principio VII.

## Layout propuesto

```text
src/
├── game/
│   ├── core/                # Lógica pura, sin import de Phaser. Testable con Vitest.
│   │   ├── navigation/      # Estado de navegación (destino activo, transiciones)
│   │   ├── challenges/      # Motor de retos: generación y validación (ver challenge-engine-contract.md)
│   │   ├── progress/        # Modelo de progreso por habilidad y persistencia (ver progress-persistence-model.md)
│   │   └── content/         # Datos de System/Destination/Expedition/Mission (ver content-model.md)
│   ├── scenes/               # Subclases de Phaser.Scene: presentación, input, sprites, audio, cámaras
│   ├── overlay/              # UI de overlay HTML (hermano del <canvas>): HUD, menús, diálogos — ver R8
│   └── main.ts                # Bootstrap de Phaser.Game, registro de escenas
└── styles/                    # (ya existente) tokens de diseño CSS
```

## Reglas de la convención

* **R1**: El código bajo `src/game/core/` MUST NOT importar `phaser` ni depender de
  ninguna `Phaser.Scene`. Debe poder ejecutarse y testearse en Node/Vitest de forma
  aislada.
* **R2**: Las escenas de Phaser (`src/game/scenes/`) SHOULD limitarse a: presentación,
  input, sprites, animaciones, audio, cámaras, partículas y coordinación — nunca
  generación de retos, cálculo de dificultad, validación de respuestas ni
  actualización directa del modelo de progreso (eso vive en `core/`).
* **R3**: Una escena se comunica con `core/` mediante llamadas explícitas a funciones
  puras o mediante un mecanismo de eventos definido, nunca incrustando la lógica
  dentro de la clase de la escena.
* **R4**: El estado de "qué destino/escena está activo" (navegación) MUST vivir en
  `core/navigation/` como módulo independiente, testable sin renderizar nada — es la
  base que debe existir antes de `specs_pending/004-core-game-loop.md`.
* **R5**: Añadir una nueva escena/destino MUST NOT requerir modificar el motor
  genérico de `core/challenges/` ni de `core/navigation/`; se resuelve añadiendo datos
  en `core/content/` (coherente con el principio IX, contenido dirigido por datos).
* **R6**: `tsconfig.json` MUST ampliar su `include` para compilar `src/game/` en
  cuanto exista el primer fichero de esta carpeta (ver también
  [`overview.md`](./overview.md), regla G4).
* **R7**: `libs/components/` (Button, Dialog, Toast, Card/Tile, etc.) MUST NOT
  usarse dentro de una `Phaser.Scene` ni de `core/` — son elementos DOM reales y
  Phaser renderiza sobre `<canvas>` (WebGL/Canvas2D), un contexto de dibujo
  ajeno al DOM. Su único uso válido en el motor de juego es como capa de overlay
  HTML independiente (ver sección siguiente).
* **R8** (añadida en `004-core-game-loop`, primera implementación real): El código
  de la capa de overlay MUST vivir en `src/game/overlay/`, hermano de `core/` y
  `scenes/`. MUST estar compuesto por HTML real fuera de cualquier `Phaser.Scene`,
  MAY reutilizar `libs/components/` (ver R7), y se comunica con `core/` mediante
  las mismas funciones puras que consultan las escenas de `scenes/` — nunca
  mediante una referencia directa a una instancia de escena Phaser ni viceversa.

## UI de overlay (DOM) vs. contenido del canvas (Phaser)

`src/game/` MUST distinguir dos capas de presentación, con una frontera clara y sin
mezclarlas dentro de una misma escena:

* **Contenido del canvas** (dentro de una `Phaser.Scene`, vía `this.add.image/
  text/sprite/particles`, etc.): mundo de juego, sprites, animaciones, HUD
  dibujado con Game Objects de Phaser. MUST NOT usar componentes de
  `libs/components/`.
* **UI de overlay** (HTML real, hermano del `<canvas>` en el DOM, posicionado con
  CSS por encima): menús, pantallas de selección de destino, diálogos de
  resultado, toasts de feedback, dashboard de padres (spec 028). SHOULD
  reutilizar `libs/components/` (`Dialog`, `Toast`, `Card/Tile`, `Button`...) en
  lugar de reimplementar UI equivalente dentro de una escena Phaser.
* La coordinación entre ambas capas (p. ej. abrir un `Dialog` de overlay al
  completar un reto dentro del canvas) pasa por `core/` (funciones puras que la
  escena y el código de overlay consultan), nunca por una referencia directa de
  una `Phaser.Scene` al DOM del overlay ni viceversa.

## Fuera de alcance

* El contrato interno del motor de retos (`core/challenges/`) — ver
  [`challenge-engine-contract.md`](./challenge-engine-contract.md).
* El esquema del modelo de contenido (`core/content/`) — ver
  [`content-model.md`](./content-model.md).
* El modelo de progreso y persistencia (`core/progress/`) — ver
  [`progress-persistence-model.md`](./progress-persistence-model.md).
* Decisiones específicas de una escena/destino concreto (ambientación, assets,
  animaciones) — viven en el `plan.md`/`contracts/` de cada spec de contenido.
* Integración de Three.js — ya cubierta por la constitución (sección "Arquitectura y
  tecnología", subsección "Three.js"); este documento no la repite.
