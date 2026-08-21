---

title: "Quickstart: Pistas y reintento sin penalización"
feature: "010-hints-and-retry-flow"
type: "quickstart"
version: "1.0"
created: "2026-08-21"
updated: "2026-08-21"
status: "Draft"
spec: "./spec.md"
------------------------------------------------------------

# Quickstart: Pistas y reintento sin penalización

Validación manual rápida de las extensiones de `core/challenge-engine/` y
`core/destination-visit/`, sin necesidad de levantar Storybook ni el juego
completo (módulos puros, testeables directamente en Node/Vitest).

## 1. Verificar que un `CountingChallenge` generado incluye pistas

```ts
import { generateChallenge } from './src/game/core/challenge-engine/challenge-engine';

const challenge = generateChallenge({ type: 'counting', min: 1, max: 5, difficulty: 1 });
console.log(challenge.hints);
// -> [{ id: 'counting-hint-1', order: 1, text: '...' }, { id: 'counting-hint-2', order: 2, text: '...' }]
```

Esperado: `challenge.hints` tiene 2 elementos, con `order` estrictamente
creciente (1, 2).

## 2. Verificar `requestHint()` puro (motor de retos)

```ts
import { requestHint } from './src/game/core/challenge-engine/challenge-engine';

console.log(requestHint(challenge, 0)); // -> primera pista
console.log(requestHint(challenge, 1)); // -> segunda pista
console.log(requestHint(challenge, 2)); // -> undefined (no hay tercera pista)
```

Esperado: nunca lanza una excepción; `undefined` cuando se agotan las pistas
(H2 de `contracts/hint-contract.md`).

## 3. Verificar `requestNextHint()` y neutralidad sobre el progreso (`006`)

```ts
import { createDestinationVisit, requestNextHint } from './src/game/core/destination-visit/destination-visit-state';
import { createInitialSkillProgressState } from './src/game/core/progress/skill-progress-state';
import { DESTINATIONS } from './src/game/core/content/destinations';

const moon = DESTINATIONS.find((d) => d.id === 'moon')!;
let visit = createDestinationVisit('moon', moon.challengeConfigs!, 1);
let skillState = createInitialSkillProgressState();

const before = skillState.counting.level;
const result1 = requestNextHint(visit, skillState);
visit = result1.visit;
skillState = result1.skillState;

console.log(result1.hint);                 // -> primera pista (Hint)
console.log(visit.hintsRevealedCount);      // -> 1
console.log(skillState.counting.level === before); // -> true (sin cambio, regla N4 de 006)
```

Esperado: `level`/`failureCount` de la habilidad `counting` no cambian tras
pedir una pista (H4); `hintsRevealedCount` avanza en 1.

## 4. Verificar reinicio de pistas al avanzar de reto (acierto)

```ts
import { submitAnswer } from './src/game/core/destination-visit/destination-visit-state';

const challenge = visit.challenges[visit.currentIndex];
const { visit: afterSuccess } = submitAnswer(visit, skillState, challenge.correctAnswer as number);

console.log(afterSuccess.hintsRevealedCount); // -> 0 (reto nuevo, pistas frescas)
```

Esperado: tras un acierto que avanza `currentIndex`, `hintsRevealedCount`
vuelve a `0` (H6).

## 5. Verificar que pedir pistas no afecta el reintento (fallo)

```ts
const { visit: afterFailure } = submitAnswer(visit, skillState, -1); // respuesta incorrecta

console.log(afterFailure.currentIndex === visit.currentIndex); // -> true (mismo reto, G2 de 008)
console.log(afterFailure.hintsRevealedCount === visit.hintsRevealedCount); // -> true (sin reinicio)
```

## Ejecución real de pruebas

```sh
npm test -- challenge-engine
npm test -- destination-visit-state
npm test -- skill-progress-state
```

Todas deben pasar en verde antes de considerar la feature lista para
`/speckit-tasks`/`/speckit-implement`.
