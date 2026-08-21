---

title: "Modelo de datos: Pistas y reintento sin penalización"
feature: "010-hints-and-retry-flow"
type: "data-model"
version: "1.0"
created: "2026-08-21"
updated: "2026-08-21"
status: "Draft"
spec: "./spec.md"
------------------------------------------------------------

# Modelo de datos: Pistas y reintento sin penalización

No se introduce ninguna entidad persistida nueva (misma restricción que `006`
NFR-002 y `009` NFR-002): todo el estado de pistas vive en memoria durante la
visita al destino, igual que `currentIndex`/`lastOutcome` ya existentes.

## Hint (nueva, extensión de `007-challenge-engine-core`)

```ts
interface Hint {
  readonly id: string;      // p. ej. "counting-hint-1"
  readonly order: number;   // 1, 2, 3... — orden de progresión
  readonly text: string;    // texto en castellano, apropiado para ~6 años
}
```

| Campo | Tipo | Regla |
|---|---|---|
| `id` | `string` | único dentro del array `hints` de un `Challenge` |
| `order` | `number` | entero positivo, estrictamente creciente dentro del array (1, 2, 3...) |
| `text` | `string` | no vacío; en castellano; describe una estrategia, nunca revela directamente `correctAnswer` |

## Challenge (extensión de `007-challenge-engine-core`)

```ts
interface Challenge {
  // ...campos existentes sin cambios (id, type, question, correctAnswer, difficulty)...
  readonly hints?: readonly Hint[]; // opcional; ausente o vacío = sin pistas disponibles
}
```

`CountingChallenge` (007) hereda este campo sin cambios adicionales en su
propia interfaz; `generateCountingChallenge()` (challenge-engine.ts) pasa a
adjuntar siempre `COUNTING_HINTS` (constante de 2 pistas, ver `research.md`
sección 3) a cada `CountingChallenge` que genera.

## DestinationVisitState (extensión de `008-moon-destination-counting`)

```ts
interface DestinationVisitState {
  // ...campos existentes sin cambios (destinationId, challenges, currentIndex, status, lastOutcome)...
  readonly hintsRevealedCount: number; // pistas ya reveladas para el reto en `currentIndex`
}
```

| Campo | Tipo | Regla |
|---|---|---|
| `hintsRevealedCount` | `number` | `0` al crear la visita (`createDestinationVisit`); reiniciado a `0` cuando `submitAnswer` avanza `currentIndex` tras un acierto; sin cambios en un fallo; incrementado en 1 por cada llamada exitosa a `requestNextHint` |

### Transiciones de estado válidas (nuevas, complementan las de `008`)

```text
{ hintsRevealedCount: N } con N < challenge.hints.length
  --requestNextHint()-->
{ hintsRevealedCount: N + 1 }   // se reveló una pista nueva; updateSkillProgress(skill, 'hint-used')

{ hintsRevealedCount: N } con N >= challenge.hints.length (o challenge sin hints)
  --requestNextHint()-->
{ hintsRevealedCount: N }   // sin cambios; no hay pista que revelar; no se llama a updateSkillProgress

{ currentIndex: I, hintsRevealedCount: N }
  --submitAnswer(...) con outcome 'success'-->
{ currentIndex: I + 1, hintsRevealedCount: 0 }   // nuevo reto, pistas reiniciadas

{ currentIndex: I, hintsRevealedCount: N }
  --submitAnswer(...) con outcome 'failure'-->
{ currentIndex: I, hintsRevealedCount: N }   // sin cambios (mismo reto, mismas pistas ya reveladas)
```

## Reutilización de `SkillUpdateResult` (006/007/009) — sin nueva entidad de evento

Sin cambios respecto a la clarificación ya integrada en `spec.md`: solicitar una
pista invoca `updateSkillProgress(skillState, skill, 'hint-used')` directamente,
reutilizando el valor ya existente y neutro (regla N4 de `006`). Ver
`spec.md` sección "Reutilización de `SkillUpdateResult`".

## Funciones públicas nuevas

```ts
// core/challenge-engine/challenge-engine.ts (extensión de 007)
function requestHint(challenge: Challenge, hintIndex: number): Hint | undefined;

// core/destination-visit/destination-visit-state.ts (extensión de 008)
function requestNextHint(
  visit: DestinationVisitState,
  skillState: SkillProgressState,
): {
  visit: DestinationVisitState;
  skillState: SkillProgressState;
  hint: Hint | undefined; // undefined si no quedan más pistas para este reto
};
```

Ver `contracts/hint-contract.md` para las garantías completas de ambas
funciones.

## Cambios en entidades existentes

- **`Challenge`/`CountingChallenge` (`007`)**: campo opcional `hints` añadido;
  ningún campo existente cambia de tipo o significado.
- **`DestinationVisitState` (`008`)**: campo nuevo `hintsRevealedCount`; ningún
  campo existente cambia de tipo o significado; `G1`-`G6` de
  `destination-visit-contract.md` permanecen válidas sin modificación.
- **Ningún cambio en `SkillProgressState`/`SkillUpdateResult` (`006`)** ni en
  `getDifficultyConfig` (`009`) — se reutilizan tal cual.
