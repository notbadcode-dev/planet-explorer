---
title: "Quickstart: Validación de persistencia local"
feature: "011-save-progress-local"
type: "quickstart"
version: "1.0"
created: "2026-08-21T18:50:00Z"
---

# Quickstart: Validación de persistencia local

## Propósito

Esta guía describe cómo validar de extremo a extremo que la persistencia local (load/save) funciona correctamente. Sirve como referencia para pruebas unitarias y E2E.

## Requisitos previos

- [Spec 006](../006-skill-progress-model/) (SkillProgress model) implementada
- [Spec 008](../008-moon-destination-counting/) (DestinationVisitState) implementada
- localStorage disponible en el navegador (o mock en tests)
- Tipos TypeScript de [data-model.md](./data-model.md) disponibles

## Validación Unitaria (Vitest)

### Suite 1: Deserialización (Carga)

**Objetivo**: Validar que datos en localStorage se cargan correctamente.

#### Test 1.1: Carga desde localStorage vacío (primera sesión)

```typescript
describe('PlayerProgress deserialization', () => {
  it('should load clean initial state when localStorage is empty', () => {
    const mockStorage = new MockStorageAdapter();  // returns empty
    const result = deserialize(mockStorage);
    
    expect(result.version).toBe(1);
    expect(result.skills).toEqual({});
    expect(result.destinations).toEqual({});
    expect(result.lastSavedTime).toBeDefined();
  });
});
```

**Escenario**: Jugador abre el juego por primera vez.
**Resultado esperado**: Estado limpio, cero habilidades, cero destinos.

#### Test 1.2: Carga de datos válidos

```typescript
it('should load valid stored data', () => {
  const mockStorage = new MockStorageAdapter({
    version: 1,
    skills: {
      counting: { skillId: "counting", skillLevel: 3, failureCount: 1, lastUpdateTime: "2026-08-21T10:00:00Z" }
    },
    destinations: {
      moon: { destinationId: "moon", completed: true, missionsCompleted: ["m1", "m2"], lastVisitTime: "2026-08-21T09:00:00Z" }
    },
    lastSavedTime: "2026-08-21T10:30:00Z"
  });
  
  const result = deserialize(mockStorage);
  
  expect(result.version).toBe(1);
  expect(result.skills.counting.skillLevel).toBe(3);
  expect(result.destinations.moon.completed).toBe(true);
});
```

**Escenario**: Datos válidos en localStorage.
**Resultado esperado**: Todos los campos se restauran exactamente.

#### Test 1.3: Carga de datos parcialmente válidos (fallback permisivo)

```typescript
it('should recover valid data and ignore invalid entries', () => {
  const mockStorage = new MockStorageAdapter({
    version: 1,
    skills: {
      counting: { skillId: "counting", skillLevel: 3, failureCount: 1, lastUpdateTime: "2026-08-21T10:00:00Z" },
      addition: { skillId: "addition", skillLevel: "invalid_type", ...}  // Invalid
    },
    destinations: {},  // Missing
    lastSavedTime: "2026-08-21T10:30:00Z"
  });
  
  const result = deserialize(mockStorage);
  
  // Valid skill recovered
  expect(result.skills.counting).toBeDefined();
  expect(result.skills.counting.skillLevel).toBe(3);
  
  // Invalid skill skipped
  expect(result.skills.addition).toBeUndefined();
  
  // Missing destinations map created with defaults
  expect(result.destinations).toEqual({});
});
```

**Escenario**: Datos parcialmente válidos (un skill válido, otro con tipo incorrecto, destinations faltantes).
**Resultado esperado**: Skill válido se recupera; skill inválido se descarta; destinations inicializado como vacío.

#### Test 1.4: Carga de datos corruptos (JSON inválido)

```typescript
it('should handle corrupted JSON gracefully', () => {
  const mockStorage = new MockStorageAdapter(null);  // JSON.parse throws
  const result = deserialize(mockStorage);
  
  expect(result.version).toBe(1);
  expect(result.skills).toEqual({});
  expect(result.destinations).toEqual({});
  // Log should have error message
});
```

**Escenario**: JSON inválido en localStorage.
**Resultado esperado**: Estado limpio retornado, sin throw.

### Suite 2: Serialización (Guardado)

**Objetivo**: Validar que objetos PlayerProgress se serializan a JSON válido.

#### Test 2.1: Serialización correcta (Schema A)

```typescript
describe('PlayerProgress serialization', () => {
  it('should serialize to Schema A (version at root)', () => {
    const playerProgress: PlayerProgress = {
      version: 1,
      skills: {
        counting: { skillId: "counting", skillLevel: 3, failureCount: 1, lastUpdateTime: "2026-08-21T10:00:00Z" }
      },
      destinations: {
        moon: { destinationId: "moon", completed: true, missionsCompleted: ["m1"], lastVisitTime: "2026-08-21T09:00:00Z" }
      },
      lastSavedTime: "2026-08-21T10:30:00Z"
    };
    
    const json = serialize(playerProgress);
    const parsed = JSON.parse(json);
    
    expect(parsed.version).toBe(1);  // version at root (not nested)
    expect(parsed.skills).toBeDefined();
    expect(parsed.destinations).toBeDefined();
  });
});
```

**Escenario**: Serialización de PlayerProgress válido.
**Resultado esperado**: JSON con `version` en raíz.

#### Test 2.2: Round-trip (serialize → deserialize)

```typescript
it('should preserve data through serialize-deserialize cycle', () => {
  const original: PlayerProgress = { /* valid data */ };
  const json = serialize(original);
  const mockStorage = new MockStorageAdapter(JSON.parse(json));
  const recovered = deserialize(mockStorage);
  
  expect(recovered).toEqual(original);
});
```

**Escenario**: Ciclo completo serialize/deserialize.
**Resultado esperado**: Datos idénticos antes y después.

### Suite 3: Validación

**Objetivo**: Validar que estructura y tipos se validan correctamente.

#### Test 3.1: Tipos correctos aceptados

```typescript
describe('Validation', () => {
  it('should accept valid types', () => {
    const data = {
      version: 1,
      skills: { counting: { skillId: "counting", skillLevel: 3, failureCount: 1, lastUpdateTime: "iso-date" } },
      destinations: { moon: { destinationId: "moon", completed: true, missionsCompleted: ["m1"], lastVisitTime: "iso-date" } },
      lastSavedTime: "iso-date"
    };
    
    const valid = validate(data);
    expect(valid).toBe(true);
  });
});
```

**Escenario**: Todos los tipos son correctos.
**Resultado esperado**: `validate()` retorna true.

#### Test 3.2: Tipos incorrectos rechazados

```typescript
it('should reject invalid types', () => {
  const data = {
    version: 1,
    skills: {
      counting: { skillId: "counting", skillLevel: "three", ... }  // skillLevel is string, not number
    },
    destinations: {},
    lastSavedTime: "iso-date"
  };
  
  const valid = validate(data);
  expect(valid).toBe(false);  // or valid entries marked for fallback
});
```

**Escenario**: Campo con tipo incorrecto.
**Resultado esperado**: `validate()` retorna false o marca entry para fallback.

### Suite 4: Edge Cases

**Objetivo**: Validar comportamiento en casos límite.

#### Test 4.1: Habilidades nuevas en datos futuros

```typescript
describe('Edge cases', () => {
  it('should handle new skills in future data', () => {
    const data = {
      version: 1,
      skills: {
        counting: { ... },
        "future_skill": { skillId: "future_skill", skillLevel: 2, ... }  // New in future spec
      },
      destinations: {},
      lastSavedTime: "..."
    };
    
    const result = deserialize(data);
    
    // Should accept and preserve future skill
    expect(result.skills["future_skill"]).toBeDefined();
    expect(result.skills["future_skill"].skillLevel).toBe(2);
  });
});
```

**Escenario**: Datos con habilidades que no existen en spec actual.
**Resultado esperado**: Nuevas habilidades se preservan sin error.

#### Test 4.2: localStorage no disponible

```typescript
it('should handle localStorage unavailable', () => {
  const mockStorage = new MockStorageAdapter();
  mockStorage.getItem = () => { throw new Error("localStorage not available"); };
  
  const result = deserialize(mockStorage);
  
  // Should return clean state, log error
  expect(result.version).toBe(1);
  expect(result.skills).toEqual({});
});
```

**Escenario**: localStorage throws error.
**Resultado esperado**: Estado limpio, sin crash.

#### Test 4.3: Quota exceeded

```typescript
it('should handle quota exceeded on save', () => {
  const mockStorage = new MockStorageAdapter();
  mockStorage.setItem = () => { throw new Error("QuotaExceededError"); };
  
  const playerProgress: PlayerProgress = { /* data */ };
  
  expect(() => serialize(playerProgress)).not.toThrow();
  // Should log error but not throw
});
```

**Escenario**: Save falla por quota excedida.
**Resultado esperado**: Error logueado, sin throw (game continues).

## Validación E2E (Playwright, spec 033+)

### Escenario E2E 1: Ciclo completo (Challenge → Persist → Restart)

```
1. Start game, complete first challenge in counting skill
   → Expect: skillLevel increases from 0 to 1
2. Manually save (or auto-save fires internally)
   → Expect: localStorage contains updated counting skill
3. Close browser
4. Reopen game
   → Expect: Counting skill is still 1 (persisted)
5. Complete another challenge
   → Expect: Counting skill now 2
```

**Escenario**: Progreso sobrevive a browser restart.
**Resultado esperado**: Skill level persists exactamente.

### Escenario E2E 2: Destination Completion Persists

```
1. Start game, visit Moon destination
2. Complete all missions in Moon
   → Expect: Moon.completed = true
3. Refresh browser
   → Expect: Moon appears as completed in UI
4. Verify localStorage contains moon.completed = true
```

**Escenario**: Destino completado persiste tras refresh.
**Resultado esperado**: Destino sigue completado.

### Escenario E2E 3: Corrupted Data Recovery

```
1. Manually corrupt localStorage (edit JSON in DevTools)
   → Example: Remove 'destinations' key
2. Reload game
   → Expect: Game starts without error
   → Expect: Valid skills load, destinations initialize empty
3. Verify in DevTools console: No crash, error logged
```

**Escenario**: Datos corruptos en localStorage.
**Resultado esperado**: Game recupera gracefully.

## Checklist de validación

Antes de marcar spec 011 como "Implemented", validar:

- [ ] Vitest suite pasa 100% (todas las pruebas unitarias verdes)
- [ ] Unit coverage ≥ 95% (líneas, ramas)
- [ ] `npm run lint && npm test && npm run build` pasa
- [ ] Datos válidos se cargan y guardan correctamente (E2E escenario 1)
- [ ] Destinos completados persisten (E2E escenario 2)
- [ ] Datos corruptos se recuperan sin crash (E2E escenario 3)
- [ ] data-model.md documenta estructura exacta
- [ ] Spec 006 y 008 no están broken por esta feature
- [ ] Principios I-X de constitución validados en plan.md

## Próximos pasos

1. **Implementación**: `/speckit-tasks` genera lista de tareas
2. **E2E Coverage**: Spec 033 proporcionará suite exhaustiva de Playwright tests
3. **Integración Security**: Spec 030 añade validación de rangos y encryption

## Referencias

- [spec.md](./spec.md) — Especificación funcional
- [plan.md](./plan.md) — Plan de implementación
- [data-model.md](./data-model.md) — Modelo de datos detallado
- [../006-skill-progress-model/](../006-skill-progress-model/) — Dependencia: SkillProgress
- [../008-moon-destination-counting/](../008-moon-destination-counting/) — Dependencia: DestinationVisitState
