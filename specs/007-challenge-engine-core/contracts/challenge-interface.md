# Contrato público: Motor genérico de retos

**Fecha**: 2026-08-19  
**Feature**: 007-challenge-engine-core  
**Estabilidad**: ALPHA (sujeto a cambio hasta que feature 008+ agregue nuevos tipos)

## Propósito

Este documento define el contrato público (interfaz) que el motor de retos expone a consumidores (escenas Phaser, componentes de UI, futuras features).

## Módulo público

**Ubicación**: `src/game/core/challenge-engine/`  
**Exporta**: Funciones `generateChallenge()` y `validateAnswer()` + tipos

---

## Tipos públicos

### Challenge (genérica)

```typescript
interface Challenge {
  readonly id: string;
  readonly type: string;
  readonly question: string;
  readonly correctAnswer: unknown;
  readonly difficulty: number;
}
```

**Contrato**:
- `id`: Identificador único, no repetible dentro de una sesión
- `type`: Valor de SUPPORTED_CHALLENGE_TYPES
- `question`: Texto legible, apropiado para niño de ~6 años
- `correctAnswer`: El tipo depende del reto (number para counting, etc.)
- `difficulty`: Entero entre 1-10 inclusive

---

### CountingChallenge (específica)

```typescript
interface CountingChallenge extends Challenge {
  readonly type: 'counting';
  readonly correctAnswer: number;
  readonly items: ReadonlyArray<{
    readonly id: string;
    readonly type: string;
  }>;
}
```

**Contrato**:
- `type` es literalmente `'counting'` (discriminador)
- `correctAnswer` es un número entre 1-10+ (depende de config)
- `items` es un array no vacío de objetos con `id` y `type`
- `items.length === correctAnswer` (garantizado)

---

### ChallengeConfig (configuración base)

```typescript
interface ChallengeConfig {
  type: string;
  difficulty?: number;  // 1-10, default 1
}
```

---

### CountingChallengeConfig (configuración específica)

```typescript
interface CountingChallengeConfig extends ChallengeConfig {
  type: 'counting';
  min: number;
  max: number;
  difficulty?: number;
}
```

**Contrato**:
- `type` es literalmente `'counting'`
- `min >= 1`
- `max >= min`
- `difficulty` (si se proporciona) entre 1-10

---

### SkillUpdateResult (del modelo de progreso 006)

```typescript
type SkillUpdateResult = 'success' | 'failure' | 'hint-used';
```

**Contrato**: Resultado de `validateAnswer()` es `'success'` o `'failure'` (v1.0 no incluye hints). Se elige deliberadamente un tipo union/enum-like en lugar de un booleano para permitir incorporar en el futuro resultados no binarios o no deterministas (p. ej. un valor adicional) sin romper la firma pública de `validateAnswer()`.

---

## Funciones públicas

### generateChallenge()

```typescript
function generateChallenge(config: ChallengeConfig): Challenge
```

**Contrato**:

| Aspecto | Garantía |
|---------|----------|
| **Pureza** | Función pura; sin estado global |
| **Pseudoaleatoriedad** | Sin semilla; invocaciones repetidas con la misma config pueden retornar retos distintos |
| **Sin reproducibilidad garantizada** | No existe parámetro de semilla en v1.0 |
| **Inmutabilidad** | Retorna objeto inmutable (propiedades `readonly`) |
| **Validación de entrada** | Lanza excepción si `config` inválida |
| **Independencia de Phaser** | Sin dependencias de Phaser; testeable en Node.js |

**Excepciones lanzadas**:
- `min < 1` → "min must be >= 1"
- `min > max` → "min cannot exceed max"
- `difficulty` fuera [1,10] → "difficulty must be between 1 and 10"
- `type` no soportado → "unsupported challenge type: {type}"

**Ejemplo de uso**:
```typescript
const config: CountingChallengeConfig = {
  type: 'counting',
  min: 1,
  max: 5,
  difficulty: 2
};

const challenge = generateChallenge(config);
// challenge es un CountingChallenge válido
```

---

### validateAnswer()

```typescript
function validateAnswer(challenge: Challenge, answer: unknown): SkillUpdateResult
```

**Contrato**:

| Aspecto | Garantía |
|---------|----------|
| **Pureza** | Función pura; no muta `challenge` ni estado global |
| **Validación de tipo** | Rechaza tipos inválidos (ej: `null`, `{}`, `[]`, `string`) con excepción |
| **Rango no restrictivo** | Acepta números fuera de rango esperado como `'failure'` (no excepción) |
| **Independencia de Phaser** | Sin dependencias de Phaser; testeable en Node.js |

**Excepciones lanzadas**:
- `answer` es `null` o `undefined` → "answer cannot be null or undefined"
- `answer` no es `number` → "answer must be a number (got {typeof})"

**Retorno**:
- `'success'` si la respuesta es correcta
- `'failure'` si la respuesta es incorrecta o fuera de rango

**Ejemplo de uso**:
```typescript
const result = validateAnswer(challenge, 5);
// result es 'success' si challenge.correctAnswer === 5, si no 'failure'
```

---

## Constantes públicas

```typescript
const SUPPORTED_CHALLENGE_TYPES: readonly string[] = ['counting'];
```

**Contrato**: Array de tipos válidos. Futuras features pueden extender este array.

---

## Patrones de uso

### Patrón 1: Generar → Validar → Actualizar progreso

```typescript
import { generateChallenge, validateAnswer } from 'src/game/core/challenge-engine/challenge-engine';
import { updateSkillProgress } from 'src/game/core/progress/skill-progress-state';

const config = { type: 'counting', min: 1, max: 10, difficulty: 2 };
const challenge = generateChallenge(config);

const playerAnswer = getUserInput();  // number

const result = validateAnswer(challenge, playerAnswer);

const newState = updateSkillProgress(skillState, 'counting', result);
```

**Garantía**: No requiere transformación de tipos entre módulos.

---

## Evolución futura

### Adición de nuevos tipos de reto (v2.0+)

```typescript
// v2.0 (futuro)
const SUPPORTED_CHALLENGE_TYPES = ['counting', 'addition', 'memory'];

interface AdditionChallenge extends Challenge {
  type: 'addition';
  operand1: number;
  operand2: number;
  correctAnswer: number;
}
```

**Contrato de estabilidad**: Las firmas de `generateChallenge()` y `validateAnswer()` no cambian; solo se extienden los tipos de `Challenge` y `ChallengeConfig`. Si en el futuro se requiere reproducibilidad, se puede añadir un parámetro opcional `seed?` sin romper compatibilidad (parámetro opcional al final de la firma).

---

## Notas de implementación

1. **Inmutabilidad**: Todos los objetos retornados utilizan `readonly` en sus propiedades
2. **Agnosis de Phaser**: El módulo NO importa `Phaser`; es testeable en Node.js
3. **Agnosis de renderizado**: El campo `items` en CountingChallenge permite que la capa de UI interprete cómo visualizarlo
4. **Agnosis de persistencia**: El motor no persiste; es responsabilidad de capas superiores (escenas, stores)
5. **Agnosis de habilidad**: El motor no conoce "habilidades" (counting, addition, etc.); eso es responsabilidad del consumidor (feature 006)

---

## SemVer versioning

- **v1.0.0** (actual): Interfaz estable para counting, pseudoaleatorio sin semilla.
- **v2.0.0** (futuro): Nuevos tipos, posible adición de semilla opcional.

Hasta que 2.0 sea lanzado, cambios en el contrato requieren aprobación de arquitecto principal.
