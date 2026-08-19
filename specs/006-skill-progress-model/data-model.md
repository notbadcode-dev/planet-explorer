---
title: "Modelo de datos: Progreso por habilidades"
feature: "006-skill-progress-model"
type: "data-model"
version: "1.0"
created: "2026-08-19"
updated: "2026-08-19"
status: "Draft"
---

# Modelo de datos: Progreso por habilidades

**Entrada**: [spec.md](./spec.md) (sección "Entidades clave") · [research.md](./research.md)

## SkillName

Catálogo cerrado de habilidades soportadas en esta feature (subconjunto de la lista
completa de `constitution.md`, principio IV):

```ts
type SkillName =
  | 'counting'
  | 'addition'
  | 'memory'
  | 'logic'
  | 'reading'
  | 'spatialReasoning'
  | 'astronomy';
```

## SkillUpdateResult

Resultado de un reto que afecta al dominio de una habilidad:

```ts
type SkillUpdateResult = 'success' | 'failure' | 'hint-used';
```

## SkillDomain

Estado de dominio de una única habilidad. Vive en `src/game/core/progress/`, sin
ninguna dependencia de Phaser (regla R1 de
[`game-engine-scenes.md`](../../docs/conventions/architecture/game-engine-scenes.md)).

| Campo | Tipo | Descripción |
|---|---|---|
| `level` | `number` | Nivel de dominio actual, rango `1-10` (clarificación Q1). Inicial: `1`. |
| `failureCount` | `number` | Contador de fallos acumulados al nivel actual, rango `0-2` (clarificación Q2). Inicial: `0`. |

## PlayerSkillState (SkillProgressState)

Estado completo del jugador: un `SkillDomain` por cada `SkillName` soportado.

```ts
type SkillProgressState = Record<SkillName, SkillDomain>;
```

Ejemplo:

```ts
{
  counting: { level: 5, failureCount: 1 },
  addition: { level: 3, failureCount: 0 },
  memory: { level: 6, failureCount: 2 },
  logic: { level: 1, failureCount: 0 },
  reading: { level: 4, failureCount: 0 },
  spatialReasoning: { level: 1, failureCount: 0 },
  astronomy: { level: 2, failureCount: 1 },
}
```

Objeto plano, serializable a JSON sin transformación (requisito de
`progress-persistence-model.md` para que `011-save-progress-local` lo persista
directamente).

### Transiciones de estado válidas

```text
{ level: N, failureCount: F }
  --update(skill, 'success')-->
{ level: min(N+1, 10), failureCount: 0 }

{ level: N, failureCount: F } con F < 2
  --update(skill, 'failure')-->
{ level: N, failureCount: F+1 }

{ level: N, failureCount: 2 }
  --update(skill, 'failure')-->
{ level: max(N-1, 1), failureCount: 0 }

{ level: N, failureCount: F }
  --update(skill, 'hint-used')-->
{ level: N, failureCount: F }   // sin cambios
```

### Reglas de validación

* **N1**: `level` MUST mantenerse siempre en el rango `[1, 10]` — nunca por debajo
  de 1 ni por encima de 10 (clarificación Q1).
* **N2**: `failureCount` MUST reiniciarse a `0` automáticamente en cualquier
  actualización que cambie `level` (subida por acierto o bajada por 3 fallos
  acumulados) — clarificación Q4.
* **N3**: Una actualización con resultado `'failure'` cuando `failureCount` ya es
  `2` MUST decrementar `level` en 1 (con suelo en 1) y reiniciar `failureCount` a
  `0`, en lugar de incrementar `failureCount` a 3 (clarificación Q2).
* **N4**: Una actualización con resultado `'hint-used'` MUST NOT modificar ni
  `level` ni `failureCount` (spec.md, Suposiciones).
* **N5**: Actualizar la habilidad `S` MUST NOT modificar el `SkillDomain` de
  ninguna otra habilidad del mismo `SkillProgressState` (FR-004, SC-003).
* **N6**: Leer o actualizar una clave que no pertenezca a `SkillName`, o pasar un
  resultado que no pertenezca a `SkillUpdateResult`, MUST lanzar una excepción
  (`throw`) en lugar de devolver un valor por defecto o `undefined`
  (clarificación Q5, FR-008, FR-009).
* **N7**: El estado inicial de un jugador nuevo MUST asignar `{ level: 1,
  failureCount: 0 }` a las 7 habilidades soportadas (FR-006).

**Persistencia**: N/A en esta feature (spec.md, Suposiciones: "No persistence in
this feature"). El objeto `SkillProgressState` se diseña para que
`011-save-progress-local` pueda serializarlo directamente sin cambiar su forma.
