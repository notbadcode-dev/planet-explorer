---
title: "Modelo de Datos: Persistencia local de progreso"
feature: "011-save-progress-local"
type: "data-model"
version: "1.0"
created: "2026-08-21T18:50:00Z"
---

# Modelo de Datos: Persistencia local de progreso

## Overview

Esta capa de persistencia define un esquema versionado (Schema A) para serializar y recuperar el estado del jugador (habilidades y destinos completados) usando localStorage. El diseño es permisivo (fallback Opción B), estructurado (JSON), y testeable sin navegador.

## Entidades principales

### PlayerProgress (Aggregate Root)

Entidad raíz que contiene todo el estado del jugador.

```typescript
interface PlayerProgress {
  version: number;           // Schema version (1 = v1.0)
  skills: SkillProgressMap;  // Map<skillId, SkillProgress>
  destinations: DestinationStateMap;  // Map<destId, DestinationState>
  lastSavedTime: string;     // ISO8601 timestamp
}
```

**Responsabilidades**:
- Agregar todas las secciones de estado del jugador
- Incluir version para migraciones futuras (spec 030)
- Registrar cuándo fue el último guardado

**Ciclo de vida**:
- Creado en primera sesión (clean state)
- Actualizado en 3 eventos: Challenge Completion, Destination Completion, Skill Level Change
- Guardado asincrónica no-bloqueante (fire-and-forget)
- Recuperado al startup desde localStorage

### SkillProgress

Representa el dominio del jugador en una habilidad específica.

```typescript
interface SkillProgress {
  skillId: string;           // Identificador canónico (ej: "counting", "addition")
  skillLevel: number;        // Nivel actual (0 = no dominio, ∞ = máximo; adaptativo)
  failureCount: number;      // Acumulador de fallos recientes (para dificultad adaptativa, spec 009)
  lastUpdateTime: string;    // ISO8601 timestamp de último cambio
}
```

**Validación** (v1):
- `skillId` debe ser string no-vacío
- `skillLevel` debe ser number ≥ 0
- `failureCount` debe ser number ≥ 0
- `lastUpdateTime` debe ser ISO8601 válido

**Nota**: Rangos específicos (ej: 0-10) se validan en spec 030. v1 valida solo tipos y estructura.

**Propietario**: Spec 006 (SkillProgress model). Esta capa solo persiste.

### DestinationState

Representa el estado de exploración de un destino.

```typescript
interface DestinationState {
  destinationId: string;     // Identificador canónico (ej: "moon", "mars")
  completed: boolean;        // ¿Todas las misiones del destino están completadas?
  missionsCompleted: string[];  // IDs de misiones completadas en este destino
  lastVisitTime: string;     // ISO8601 timestamp de última visita
}
```

**Validación** (v1):
- `destinationId` debe ser string no-vacío
- `completed` debe ser boolean
- `missionsCompleted` debe ser array de strings
- `lastVisitTime` debe ser ISO8601 válido

**Propietario**: Spec 008 (DestinationVisitState). Esta capa solo persiste.

## Mapas de entidades

### SkillProgressMap

```typescript
type SkillProgressMap = Record<skillId: string, SkillProgress>;
```

Ejemplo:
```typescript
{
  "counting": {
    "skillId": "counting",
    "skillLevel": 3,
    "failureCount": 2,
    "lastUpdateTime": "2026-08-21T10:30:00Z"
  },
  "addition": {
    "skillId": "addition",
    "skillLevel": 1,
    "failureCount": 5,
    "lastUpdateTime": "2026-08-21T09:15:00Z"
  }
}
```

**Reglas**:
- Clave = `skillId` (mismo que `skill.skillId`)
- Todos los `skillId` conocidos deben tener entrada
- Nuevas habilidades en futuras specs se agregan con `skillLevel: 0`
- NO borrar habilidades antiguas (preservar historial)

### DestinationStateMap

```typescript
type DestinationStateMap = Record<destId: string, DestinationState>;
```

Ejemplo:
```typescript
{
  "moon": {
    "destinationId": "moon",
    "completed": true,
    "missionsCompleted": ["mission_1", "mission_2", "mission_3"],
    "lastVisitTime": "2026-08-21T10:00:00Z"
  },
  "mars": {
    "destinationId": "mars",
    "completed": false,
    "missionsCompleted": ["mission_1"],
    "lastVisitTime": "2026-08-21T08:00:00Z"
  }
}
```

**Reglas**:
- Clave = `destinationId` (mismo que `destination.destinationId`)
- Entrada se crea en primera visita al destino
- `completed: true` solo cuando TODAS las misiones están hechas (spec 021)
- NO borrar destinos visitados (preservar historial)

## Esquema JSON serializado (localStorage)

### Estructura (Schema A - Opción Q1)

```json
{
  "version": 1,
  "skills": {
    "counting": {
      "skillId": "counting",
      "skillLevel": 3,
      "failureCount": 2,
      "lastUpdateTime": "2026-08-21T10:30:00Z"
    },
    "addition": {
      "skillId": "addition",
      "skillLevel": 1,
      "failureCount": 5,
      "lastUpdateTime": "2026-08-21T09:15:00Z"
    }
  },
  "destinations": {
    "moon": {
      "destinationId": "moon",
      "completed": true,
      "missionsCompleted": ["mission_1", "mission_2", "mission_3"],
      "lastVisitTime": "2026-08-21T10:00:00Z"
    },
    "mars": {
      "destinationId": "mars",
      "completed": false,
      "missionsCompleted": ["mission_1"],
      "lastVisitTime": "2026-08-21T08:00:00Z"
    }
  },
  "lastSavedTime": "2026-08-21T10:30:45Z"
}
```

### localStorage Key

```
planet-explorer:progress
```

### Serialización

```typescript
JSON.stringify(playerProgress)
```

### Deserialización

```typescript
const parsed = JSON.parse(jsonString);
// Luego validateAndFallback() aplica estrategia permisiva (Opción Q2)
```

## Estrategia de fallback permisivo (Opción Q2)

### Algoritmo

```
IF JSON.parse fails
  THEN: Log error, return clean initial state
  
IF root is not object or missing required keys
  THEN: Log error, initialize each section with defaults
  
FOR each field in root {
  IF field is invalid type (ej: skills is not object)
    THEN: Use default for that field, log warning
    
  IF field structure is invalid (ej: skills has entry without skillId)
    THEN: Skip invalid entry, keep valid ones, log warning
}

FOR each skill in skills map {
  IF skillId missing or not string
    THEN: Skip this entry, log warning
    
  IF skillLevel not number
    THEN: Skip this entry (don't fall back to 0), log warning
    
  IF skillLevel is valid but out-of-range (future spec 030)
    THEN: Accept it (don't validate ranges in v1)
}

FOR each destination in destinations map {
  IF destinationId missing or not string
    THEN: Skip this entry, log warning
    
  IF completed not boolean
    THEN: Skip this entry, log warning
    
  IF missionsCompleted not array
    THEN: Skip this entry (or use empty array?), log warning
}

MERGE loaded data with defaults for missing sections
RETURN recovered PlayerProgress
```

### Ejemplos de fallback

**Escenario 1: Destinos faltantes**
- Datos en localStorage: `{ version: 1, skills: {...}, destinations: undefined, lastSavedTime: "..." }`
- Fallback: `{ version: 1, skills: {...}, destinations: {}, lastSavedTime: "..." }` + log warning
- Resultado: Habilidades recuperadas, destinos vacíos (no se pierden habilidades)

**Escenario 2: Habilidad con tipo incorrecto**
- Datos: `{ version: 1, skills: { counting: { skillId: "counting", skillLevel: "three" } }, ... }`
- Fallback: Saltar entry counting, log warning, usar defaults para skills
- Resultado: Datos inválidos se descartan, pero otras habilidades se conservan si son válidas

**Escenario 3: JSON completamente corrupto**
- Datos: `{ invalid json [[[ `
- Fallback: `JSON.parse` throws, catch error, log, return clean initial state
- Resultado: Ningún progreso se recupera, pero no crash

## Transiciones de estado

### Load (startup)

```
Browser startup
  ↓
PersistenceService.load()
  ↓
localStorage.getItem("planet-explorer:progress")
  ↓
IF exists: deserialize + validate + fallback → PlayerProgress
IF missing: clean initial state (all skills level 0, no destinations)
  ↓
Game state initialized with PlayerProgress
```

### Save (3 eventos)

```
Event: Challenge Completion / Destination Completion / Skill Level Change
  ↓
Game logic updates in-memory SkillProgress / DestinationState
  ↓
PersistenceService.save(playerProgress)
  ↓
[ASYNC fire-and-forget]
  serialize(playerProgress) → JSON string
  localStorage.setItem("planet-explorer:progress", jsonString)
  IF error: log error (don't throw, don't block game loop)
  ↓
Game loop continues immediately (no await)
```

**Garantía**: Datos más recientes se guardan en próximo evento si este falla.

## Validación

### Tipos de validación (v1)

1. **JSON parseable**: `JSON.parse()` no throws
2. **Estructura**: Propiedades requeridas existen
3. **Tipos**: `typeof` checks (string, number, boolean, object, array)

### NO se valida en v1 (deferred a spec 030)

- Rangos de valores (ej: 0 ≤ skillLevel ≤ 10)
- Contenido de strings (ej: skillId es un ID conocido)
- Estado coherente (ej: si completed=true, missionsCompleted debe tener N elementos)
- Canonicalidad (ej: skillId == skill.skillId, destId == destination.destId)

### Reglas de rechazo (entrada descartada)

- `skillId` no es string → skill entry rechazada
- `skillLevel` no es number → skill entry rechazada
- `destinationId` no es string → destination entry rechazada
- `completed` no es boolean → destination entry rechazada
- `missionsCompleted` no es array → destination entry rechazada

## Escalabilidad a futuras extensiones

### Spec 012: Player name

Nueva propiedad en root:
```json
{
  "version": 1,
  "playerName": "Alex",  // NEW
  "skills": { ... },
  "destinations": { ... },
  "lastSavedTime": "..."
}
```

**Compatibilidad**: Estrategia permisiva permite que v1 data sin `playerName` se cargue sin error. `playerName` se inicializa a default si falta.

### Spec 030: Encryption

No cambia estructura. Wrapper:
```json
{
  "version": 1,
  "encrypted": true,  // flag
  "payload": "[encrypted blob]",
  "timestamp": "..."
}
```

O se rota a version: 2 con validación de rangos incluida.

## Resumen

| Aspecto | Detalle |
|---------|---------|
| Root aggregate | PlayerProgress |
| Entidades | SkillProgress, DestinationState |
| Mapas | SkillProgressMap, DestinationStateMap |
| Serialización | JSON Schema A (raíz única con `version`) |
| Validación | Estructura + tipos (v1); rangos → spec 030 |
| Fallback | Permisiva (recuperar válidos, completar faltantes) |
| Persistencia | localStorage key `planet-explorer:progress` |
| Ciclo load/save | Load startup, save en 3 eventos (async non-blocking) |
| Extensibilidad | Escalable a nuevas propiedades (12), nuevas versiones (30) |
