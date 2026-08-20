---

title: "Contrato: core/difficulty"
feature: "009-adaptive-difficulty-v1"
type: "contract"
version: "1.0"
created: "2026-08-20"
updated: "2026-08-20"
status: "Draft"
spec: "./spec.md"
------------------------------------------------------------

# Contrato: `core/difficulty`

API pública y garantías del nuevo módulo puro que deriva la configuración de
dificultad de un reto a partir del nivel de dominio actual de una habilidad. Sin
dependencia de `phaser` ni del DOM (regla R1 de
`docs/conventions/architecture/game-engine-scenes.md`).

## Superficie pública

```ts
function getDifficultyConfig(
    challengeType: string,
    skillLevel: number,
): ChallengeConfig;
```

## Garantías

- **G1 (determinismo)**: para el mismo `challengeType` y el mismo `skillLevel`,
  `getDifficultyConfig` devuelve siempre el mismo resultado (FR-002); no
  depende de temporizadores, aleatoriedad ni estado externo.
- **G2 (monotonicidad)**: para un `challengeType` con mapeo definido, si
  `skillLevel2 > skillLevel1`, la configuración de `skillLevel2` es igual o más
  exigente que la de `skillLevel1`, y estrictamente más exigente entre niveles
  consecutivos dentro del rango soportado (SC-001/SC-002); en los extremos (1 y
  10) el resultado permanece estable si se solicita repetidamente el mismo nivel
  (FR-010).
- **G3 (campo `difficulty`)**: el `ChallengeConfig` devuelto siempre incluye
  `difficulty === skillLevel` (FR-002a).
- **G4 (uso directo)**: el resultado es aceptado sin ninguna transformación
  adicional por `generateChallenge()` de `007-challenge-engine-core` (FR-007).
- **G5 (pureza)**: ninguna función de este módulo depende de `phaser`, del DOM
  ni de `core/progress/` — solo recibe `skillLevel` como número, sin acoplarse
  al tipo `SkillProgressState` (mantiene la independencia exigida por R5 de
  `challenge-engine-contract.md`, extendida por coherencia a este módulo).

## Errores

- `getDifficultyConfig` lanza una excepción clara si `skillLevel` está fuera del
  rango soportado (`1-10`, mismo rango que `006-skill-progress-model`) (FR-009).
- `getDifficultyConfig` lanza una excepción clara si `challengeType` no tiene
  ninguna entrada de mapeo definida en el registro interno (FR-009a); en esta
  versión, esto ocurre con cualquier valor distinto de `'counting'`.

## Consumidores previstos

- `src/game/core/destination-visit/destination-visit-state.ts`
  (`createDestinationVisit`): sustituye el `min`/`max` fijo de
  `destinations.constants.ts` por el resultado de este módulo (FR-008).
- Cualquier feature futura de tipo de reto (`014`-`020`, `053`) que añada su
  propia entrada al registro interno para obtener dificultad adaptativa desde
  el primer momento.
