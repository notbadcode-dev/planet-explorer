# Motor genérico de retos (`challenge-engine`)

Módulo `core` (sin dependencias de Phaser, principio VII de la constitución) que genera y valida retos educativos de forma agnóstica al tipo específico de reto y a la capa de renderizado.

Ver el contrato público completo en [`specs/007-challenge-engine-core/contracts/challenge-interface.md`](../../../../specs/007-challenge-engine-core/contracts/challenge-interface.md).

## API pública

### `generateChallenge(config: ChallengeConfig): Challenge`

Genera un nuevo reto según `config.type` (discriminador). Es pseudoaleatoria y sin semilla: invocaciones repetidas con la misma configuración pueden producir retos distintos. Lanza una excepción si `config` no es válida o su `type` no está soportado.

### `validateAnswer(challenge: Challenge, answer: unknown): SkillUpdateResult`

Valida la respuesta del jugador contra un reto ya generado, devolviendo `'success'` o `'failure'` (tipo `SkillUpdateResult`, reutilizado de `src/game/core/progress/`). Es una función pura: no muta `challenge` ni depende de estado global. Acepta números fuera del rango esperado como `'failure'` sin lanzar excepción, pero lanza excepción si `answer` es `null`/`undefined` o no es un número.

## Tipos públicos

- `Challenge` / `ChallengeConfig`: interfaces genéricas base.
- `CountingChallenge` / `CountingChallengeConfig`: especialización del tipo `'counting'` (único tipo soportado en v1.0).
- `SkillUpdateResult`: reexportado desde `src/game/core/progress/skill-progress-state.type.ts`.

## Ejemplo de uso

```typescript
import { generateChallenge, validateAnswer } from './challenge-engine';
import { updateSkillProgress } from '../progress/skill-progress-state';
import type { CountingChallengeConfig } from './challenge-engine.type';

const config: CountingChallengeConfig = { type: 'counting', min: 1, max: 10, difficulty: 2 };
const challenge = generateChallenge(config);

const playerAnswer = getUserInput(); // number, aportado por la capa de UI/Phaser

const result = validateAnswer(challenge, playerAnswer);

const newState = updateSkillProgress(skillState, 'counting', result);
```

## Extensibilidad

Añadir un nuevo tipo de reto (ej. `'addition'` en una feature futura) no requiere modificar `challenge-engine.ts` ni `challenge-engine.type.ts`: basta con definir una nueva interfaz que extienda `Challenge`/`ChallengeConfig` y su propia lógica de generación/validación (FR-007, SC-004).
