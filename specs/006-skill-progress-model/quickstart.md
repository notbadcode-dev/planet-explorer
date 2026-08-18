---
title: "Quickstart: Modelo de progreso por habilidades"
feature: "006-skill-progress-model"
type: "quickstart"
version: "1.0"
created: "2026-08-19"
updated: "2026-08-19"
status: "Draft"
---

# Quickstart: Validación del modelo de progreso por habilidades

**Entrada**: [data-model.md](./data-model.md) · [contracts/skill-progress-contract.md](./contracts/skill-progress-contract.md)

## Prerrequisitos

* Rama `006-skill-progress-model` con la implementación de
  `src/game/core/progress/` completa.
* `npm install` ya ejecutado en la raíz del repositorio.

## Validación mediante tests unitarios (principal)

Esta feature es lógica pura sin UI, por lo que su validación end-to-end es la
suite de tests unitarios de Vitest — no requiere navegador ni Storybook.

```bash
npm test -- src/game/core/progress
```

**Resultado esperado**: todos los tests de
`src/game/core/progress/skill-progress-state.test.ts` pasan, cubriendo como mínimo:

1. `createInitialSkillProgressState()` devuelve las 7 habilidades en `{ level: 1,
   failureCount: 0 }` (G1).
2. `getSkillLevel(state, 'counting')` devuelve el nivel correcto sin afectar a
   otras habilidades (G2, G4).
3. Un `'success'` sube el nivel en 1 y reinicia `failureCount` (G5).
4. Un `'success'` en nivel 10 mantiene el nivel en 10 (techo, G5).
5. Tres `'failure'` consecutivos bajan el nivel en 1 y reinician `failureCount`
   a 0 (G6).
6. Un `'failure'` en nivel 1 con `failureCount` ya en 2 mantiene el nivel en 1
   (suelo, G6/N1).
7. Un `'hint-used'` no modifica `level` ni `failureCount` (G7).
8. Actualizar `addition` no modifica `memory`, `counting`, etc. en el mismo
   estado (G4).
9. `getSkillLevel`/`updateSkillProgress` con una habilidad no soportada (p. ej.
   `'chess'`) lanzan una excepción (G8).
10. `updateSkillProgress` con un resultado no soportado (p. ej. `'draw'`) lanza
    una excepción (G8).

## Validación manual (opcional, exploratoria)

Al no existir UI en esta feature, no hay un flujo jugable que probar en el
navegador. Para una inspección manual rápida durante el desarrollo, puede
ejecutarse el módulo directamente desde un script Node/Vitest ad-hoc:

```ts
import {
  createInitialSkillProgressState,
  getSkillLevel,
  updateSkillProgress,
} from './src/game/core/progress/skill-progress-state';

let state = createInitialSkillProgressState();
state = updateSkillProgress(state, 'addition', 'success');
console.log(getSkillLevel(state, 'addition')); // 2
console.log(getSkillLevel(state, 'memory'));    // 1 (sin cambios)
```

## Gate de CI

Antes de considerar la feature completa, MUST pasar el gate estándar del
proyecto:

```bash
npm run lint && npm test && npm run build
```

(`npx tsc --noEmit` no se usa como gate — falso positivo conocido, ver
`.github/copilot-instructions.md`).
