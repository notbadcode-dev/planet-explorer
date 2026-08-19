# Quickstart: Validación del motor genérico de retos

**Fecha**: 2026-08-19  
**Feature**: 007-challenge-engine-core  
**Propósito**: Guía runnable para validar que el motor genera y valida retos correctamente

## Prerequisitos

- Node.js 18+ o navegador moderno
- TypeScript compilador
- Vitest instalado en el proyecto
- Acceso a `src/game/core/challenge-engine/`

## Escenarios de validación

Cada escenario representa un caso de uso clave de la especificación. Los tests unitarios en `challenge-engine.test.ts` los cubren exhaustivamente.

### Escenario 1: Generación de un reto de conteo válido

**Objetivo**: Verificar que `generateChallenge()` produce un reto estructuralmente correcto

**Entrada**:
```typescript
const config: CountingChallengeConfig = {
  type: 'counting',
  min: 1,
  max: 5,
  difficulty: 1
};
```

**Comando** (via Vitest):
```bash
npm test -- src/game/core/challenge-engine/challenge-engine.test.ts --reporter=verbose
```

**Validación esperada**:
1. El reto retornado tiene `type === 'counting'`
2. El reto tiene un `id` único no vacío
3. El reto tiene una `question` visible al niño
4. El reto tiene un `correctAnswer` entre `min` y `max` (inclusive)
5. El reto tiene un array `items` con cantidad = `correctAnswer`
6. Cada elemento de `items` tiene `id` y `type` no vacíos
7. El reto tiene un `difficulty` entre 1-10

**Test case de referencia**:
```typescript
it('generates a valid counting challenge', () => {
  const config = { type: 'counting', min: 1, max: 5, difficulty: 1 };
  const challenge = generateChallenge(config);
  
  expect(challenge.type).toBe('counting');
  expect(challenge.id).toBeTruthy();
  expect(challenge.question).toBeTruthy();
  expect(challenge.correctAnswer).toBeGreaterThanOrEqual(1);
  expect(challenge.correctAnswer).toBeLessThanOrEqual(5);
  expect(challenge.items).toHaveLength(challenge.correctAnswer);
  expect(challenge.difficulty).toBe(1);
});
```

---

### Escenario 2: Validación de respuesta correcta

**Objetivo**: Verificar que `validateAnswer()` reconoce respuestas correctas

```typescript
const challenge = generateChallenge({ type: 'counting', min: 1, max: 5 });
const result = validateAnswer(challenge, challenge.correctAnswer);

expect(result).toBe('success');
```

---

### Escenario 3: Validación de respuesta incorrecta

**Objetivo**: Verificar que `validateAnswer()` rechaza respuestas incorrectas

```typescript
const challenge = generateChallenge({ type: 'counting', min: 1, max: 5 });
const wrongAnswer = challenge.correctAnswer + 1;
const result = validateAnswer(challenge, wrongAnswer);

expect(result).toBe('failure');
```

---

### Escenario 4: Rechazo de entrada inválida

**Objetivo**: Verificar que `validateAnswer()` lanza excepciones claras para input inválido

```typescript
const challenge = generateChallenge({ type: 'counting', min: 1, max: 5 });

expect(() => validateAnswer(challenge, null)).toThrow(/cannot be null/);
expect(() => validateAnswer(challenge, undefined)).toThrow(/cannot be null/);
expect(() => validateAnswer(challenge, "abc")).toThrow(/must be a number/);
expect(() => validateAnswer(challenge, { value: 3 })).toThrow(/must be a number/);
```

**Por qué importa**: Errores explícitos facilitan debugging en capas consumidoras (escenas Phaser, componentes UI)

---

### Escenario 5: Variabilidad pseudoaleatoria (sin semilla)

**Objetivo**: Verificar que múltiples invocaciones con la misma config pueden generar retos distintos

```typescript
const config = { type: 'counting', min: 1, max: 10 };
const challenges = Array(10).fill(null).map(() => generateChallenge(config));
const answers = challenges.map(c => c.correctAnswer);
const uniqueAnswers = new Set(answers);

expect(uniqueAnswers.size).toBeGreaterThan(1);  // Altamente probable que haya variación
```

**Por qué importa**: UX natural, evita repetición de retos, no se garantiza reproducibilidad exacta (según clarificación de spec.md)

---

### Escenario 6: Rechazo de configuración inválida

```typescript
const invalidConfigs = [
  { type: 'counting', min: 0, max: 5 },        // min < 1
  { type: 'counting', min: 10, max: 5 },       // min > max
  { type: 'counting', min: 1, max: 5, difficulty: 0 },    // difficulty < 1
  { type: 'counting', min: 1, max: 5, difficulty: 11 },   // difficulty > 10
];

invalidConfigs.forEach(config => {
  expect(() => generateChallenge(config)).toThrow();
});
```

---

### Escenario 7: Integración con modelo de progreso (006)

**Objetivo**: Verificar que resultados de validación son compatibles con `SkillUpdateResult`

```typescript
import { updateSkillProgress, createInitialSkillProgressState } from 'src/game/core/progress/skill-progress-state';

const state = createInitialSkillProgressState();
const challenge = generateChallenge({ type: 'counting', min: 1, max: 5 });
const result = validateAnswer(challenge, challenge.correctAnswer);  // 'success'

const updatedState = updateSkillProgress(state, 'counting', result);

expect(updatedState.counting.level).toBeGreaterThan(1);
expect(updatedState.counting.failureCount).toBe(0);
```

**Por qué importa**: Sin transformación necesaria entre módulos, integración limpia

---

## Ejecución manual de tests

```bash
cd /Users/bgr/Proyectos/HTML/planet-explorer
npm test -- src/game/core/challenge-engine/challenge-engine.test.ts
```

**Salida esperada**:
```
✓ generateChallenge produces valid counting challenges
✓ generateChallenge respects min/max bounds
✓ generateChallenge throws on invalid config
✓ validateAnswer returns success for correct answers
✓ validateAnswer returns failure for incorrect answers
✓ validateAnswer rejects invalid types (null, undefined, string, object)
✓ validateAnswer is pure (no mutations)
✓ generateChallenge produces variation across invocations
... [15+ tests total]

15+ passed (0 failed) ✓
```

---

## Gates de aceptación

- [ ] `npm run lint` pasa sin errores en `src/game/core/challenge-engine/`
- [ ] `npm test` pasa 100% de tests
- [ ] `npm run build` genera artefactos sin errores
- [ ] TypeScript strict mode: cero errores tipo
- [ ] Code review: especificación y plan aprobados

---

## Próximos pasos

1. Proceder a `/speckit-tasks` para generar lista de tareas de implementación
2. Implementar `src/game/core/challenge-engine/` siguiendo estructura hermano de 006
3. Escribir suite completa de tests en `challenge-engine.test.ts`
4. Integrar con futuras features (008-addition-challenges, etc.)
