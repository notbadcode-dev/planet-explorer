---
title: "Contrato: API de core/progress"
feature: "006-skill-progress-model"
type: "contract"
version: "1.0"
created: "2026-08-19"
updated: "2026-08-19"
status: "Draft"
---

# Contrato: API pública de `src/game/core/progress/`

**Entrada**: [data-model.md](../data-model.md) · [research.md](../research.md)

## Propósito

Fijar la API pública del módulo de progreso por habilidad para que futuras
features (`007-challenge-engine-core`, `009-adaptive-difficulty-v1`,
`011-save-progress-local`, `028-parental-dashboard`) la consuman de forma
consistente sin re-decidir su forma ni duplicar lógica de actualización.

## Restricción de dependencia (R1)

Este módulo MUST NOT importar `phaser` ni ningún tipo de `Phaser.Scene`. Todas las
funciones son puras: reciben el estado actual y devuelven un nuevo estado (o
lanzan una excepción), sin efectos secundarios ni mutación del argumento recibido.

## API pública

```ts
type SkillName =
  | 'counting'
  | 'addition'
  | 'memory'
  | 'logic'
  | 'reading'
  | 'spatialReasoning'
  | 'astronomy';

type SkillUpdateResult = 'success' | 'failure' | 'hint-used';

interface SkillDomain {
  level: number;
  failureCount: number;
}

type SkillProgressState = Record<SkillName, SkillDomain>;

function createInitialSkillProgressState(): SkillProgressState;

function getSkillLevel(state: SkillProgressState, skill: SkillName): number;

function updateSkillProgress(
  state: SkillProgressState,
  skill: SkillName,
  result: SkillUpdateResult,
): SkillProgressState;
```

## Garantías de comportamiento

* **G0 — Snapshot completo sin función adicional (FR-007)**: `SkillProgressState`
  es en sí mismo el snapshot completo del jugador; no existe una función
  `getSkillProgressSnapshot()` separada porque el propio objeto de estado ya
  cumple ese requisito.
* **G1 — Estado inicial determinista**: `createInitialSkillProgressState()`
  siempre devuelve las 7 habilidades soportadas con `{ level: 1, failureCount: 0
  }` (FR-006, N7).
* **G2 — Lectura independiente**: `getSkillLevel(state, skill)` devuelve
  `state[skill].level` sin efectos secundarios; el mismo `state` consultado varias
  veces siempre devuelve el mismo valor para la misma habilidad (FR-002).
* **G3 — Actualización determinista**: `updateSkillProgress(state, skill, result)`
  con la misma terna de entrada siempre devuelve el mismo nuevo estado (FR-003).
* **G4 — Aislamiento entre habilidades**: `updateSkillProgress` MUST devolver un
  nuevo objeto en el que únicamente `state[skill]` cambia; el resto de claves de
  `SkillProgressState` MUST ser referencialmente idéntico al estado de entrada
  (FR-004, N5).
* **G5 — Progresión por acierto**: `result === 'success'` incrementa `level` en 1
  (con techo en 10) y reinicia `failureCount` a 0 (N1, N2).
* **G6 — Progresión por fallo con contador**: `result === 'failure'` incrementa
  `failureCount` en 1 mientras sea menor que 2; al alcanzar 2, la siguiente llamada
  con `'failure'` decrementa `level` en 1 (con suelo en 1) y reinicia
  `failureCount` a 0 (N1, N2, N3).
* **G7 — Pista sin efecto en progreso**: `result === 'hint-used'` MUST devolver
  el mismo `level` y `failureCount` para esa habilidad (N4).
* **G8 — Fallo ante entrada inválida**: `getSkillLevel`/`updateSkillProgress`
  invocados con una `skill` fuera de `SkillName`, o `updateSkillProgress` invocado
  con un `result` fuera de `SkillUpdateResult`, MUST lanzar una excepción (`throw`)
  en lugar de devolver `undefined` o un valor por defecto (N6).
* **G9 — Estado no mutado**: Ninguna función MUST mutar el objeto `state` recibido
  como argumento; siempre se devuelve un objeto nuevo (o, en el caso de
  `getSkillLevel`, un valor primitivo derivado sin modificar `state`).

## Consumidores esperados

* **`007-challenge-engine-core`**: consulta `getSkillLevel` para calibrar la
  dificultad de un reto generado, e invoca `updateSkillProgress` al resolverse el
  reto (acierto/fallo/pista).
* **`009-adaptive-difficulty-v1` / `042-difficulty-tuning-v2`**: consumen
  `SkillProgressState` como entrada de solo lectura para su algoritmo de
  dificultad; no MUST modificar el estado directamente fuera de
  `updateSkillProgress`.
* **`011-save-progress-local`**: serializa `SkillProgressState` (objeto plano,
  JSON-compatible) para persistencia local; no MUST transformar su forma antes de
  guardarlo.
* **`028-parental-dashboard`**: consulta `SkillProgressState` completo (vía la
  variable de estado ya cargada) para visualización agregada, sin invocar
  `updateSkillProgress`.

Ninguno de estos consumidores MUST leer ni escribir campos de `SkillDomain`
directamente fuera de estas tres funciones (evita lógica de progresión duplicada
fuera de `core/progress/`).
