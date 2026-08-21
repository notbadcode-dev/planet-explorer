---

title: "Quickstart: Dificultad adaptativa v1"
feature: "009-adaptive-difficulty-v1"
type: "quickstart"
version: "1.0"
created: "2026-08-20"
updated: "2026-08-20"
status: "Draft"
spec: "./spec.md"
------------------------------------------------------------

# Quickstart: Dificultad adaptativa v1

Validación manual rápida del módulo `core/difficulty/`, sin necesidad de
levantar Storybook ni el juego completo (módulo puro, testeable directamente en
Node/Vitest).

## 1. Verificar el mapeo nivel → rango

```ts
import { getDifficultyConfig } from './src/game/core/difficulty/difficulty';

console.log(getDifficultyConfig('counting', 1));
// -> { type: 'counting', min: 1, max: 3, difficulty: 1 }

console.log(getDifficultyConfig('counting', 10));
// -> { type: 'counting', min: 1, max: 12, difficulty: 10 }
```

Esperado: `max` crece estrictamente entre nivel 1 y nivel 10; `difficulty`
coincide siempre con el nivel solicitado (FR-002a).

## 2. Verificar que el resultado es directamente usable por `generateChallenge()`

```ts
import { generateChallenge } from './src/game/core/challenge-engine/challenge-engine';
import { getDifficultyConfig } from './src/game/core/difficulty/difficulty';

const config = getDifficultyConfig('counting', 5);
const challenge = generateChallenge(config);
console.log(challenge.difficulty); // -> 5
```

Esperado: no lanza ningún error de validación (FR-007); `challenge.difficulty`
coincide con el nivel solicitado.

## 3. Verificar errores esperados

```ts
try {
    getDifficultyConfig('counting', 11); // fuera de rango
} catch (e) {
    console.log((e as Error).message); // mensaje claro de nivel inválido
}

try {
    getDifficultyConfig('memory', 3); // tipo sin mapeo definido en esta versión
} catch (e) {
    console.log((e as Error).message); // mensaje claro de tipo no soportado
}
```

## 4. Verificar la integración con el destino Luna (`008`)

```ts
import { createDestinationVisit } from './src/game/core/destination-visit/destination-visit-state';
import { DESTINATIONS } from './src/game/core/content/destinations';

const moon = DESTINATIONS.find((d) => d.id === 'moon')!;
const visitLowLevel = createDestinationVisit('moon', moon.challengeConfigs!, 1);
const visitHighLevel = createDestinationVisit('moon', moon.challengeConfigs!, 10);
```

Esperado: los retos de `visitHighLevel` tienen un `max` de conteo mayor que los
de `visitLowLevel` (FR-008); ninguno depende ya de `MOON_COUNTING_MIN`/
`MOON_COUNTING_MAX` (constantes eliminadas de `destinations.constants.ts`).

## Ejecución real de pruebas

```sh
npm test -- difficulty
npm test -- challenge-engine
npm test -- destination-visit-state
```

Todas deben pasar en verde antes de considerar la feature lista para
`/speckit-tasks`/`/speckit-implement`.
