# Modelo de datos: Motor genérico de retos

**Fecha**: 2026-08-19  
**Feature**: 007-challenge-engine-core  
**Especificación**: [spec.md](spec.md)

## Propósito

Documentar el modelo de datos (entidades, validación, relaciones) del motor genérico de retos. Este es un motor puramente computacional sin persistencia; el modelo describe estructuras en memoria.

## Estructura de datos

### 1. Challenge (Interfaz genérica)

Representa un reto generado por el motor, independientemente de su tipo.

```typescript
interface Challenge {
  id: string;                    // Identificador único (ej: "challenge-abc123")
  type: string;                  // Tipo de reto (ej: "counting", "addition", "memory")
  question: string;              // Texto/descripción de la pregunta (visible al jugador)
  correctAnswer: unknown;        // Respuesta correcta (tipo depende del reto)
  difficulty: number;            // Nivel de dificultad (1-10)
}
```

**Validación**:
- `id`: No vacío, único dentro de una sesión
- `type`: Debe estar en SUPPORTED_CHALLENGE_TYPES
- `question`: No vacío, texto legible para el niño
- `correctAnswer`: Validado según el tipo específico
- `difficulty`: Entre 1-10 inclusive

**Ciclo de vida**: Creada por `generateChallenge()`, se mantiene inmutable durante su existencia, destruida cuando se genera un nuevo reto

---

### 2. CountingChallenge (extends Challenge)

Especialización del reto genérico para el tipo `counting`.

```typescript
interface CountingChallenge extends Challenge {
  type: 'counting';
  correctAnswer: number;         // Número correcto de objetos a contar
  items: Array<{ id: string; type: string }>;  // Objetos a contar
}
```

**Campos específicos**:
- `items`: Array de objetos, cada uno con:
  - `id`: Identificador único dentro del reto (ej: "item-1")
  - `type`: Tipo descriptivo del objeto (ej: "star", "planet", "asteroid")
  - Propósito: Permitir que la capa de renderizado interprete cómo visualizar cada objeto sin que el motor prescriba una presentación

**Validación**:
- `correctAnswer`: Corresponde a la longitud del array `items` (ej: si `items.length === 5`, entonces `correctAnswer === 5`)
- `items`: No vacío (mínimo 1 objeto)
- Cada elemento de `items` tiene `id` y `type` no vacíos

**Ejemplo**:
```json
{
  "id": "challenge-xyz-789",
  "type": "counting",
  "question": "¿Cuántas estrellas ves?",
  "correctAnswer": 5,
  "difficulty": 2,
  "items": [
    { "id": "item-1", "type": "star" },
    { "id": "item-2", "type": "star" },
    { "id": "item-3", "type": "star" },
    { "id": "item-4", "type": "star" },
    { "id": "item-5", "type": "star" }
  ]
}
```

---

### 3. ChallengeConfig (Interfaz base de configuración)

```typescript
interface ChallengeConfig {
  type: string;         // Tipo de reto a generar
  difficulty?: number;  // Dificultad deseada (1-10, por defecto 1)
}
```

**Propósito**: Interfaz base que pueden extender tipos específicos. La propiedad `type` actúa como discriminador.

---

### 4. CountingChallengeConfig (extends ChallengeConfig)

```typescript
interface CountingChallengeConfig extends ChallengeConfig {
  type: 'counting';
  min: number;          // Número mínimo de objetos a contar
  max: number;          // Número máximo de objetos a contar
  difficulty?: number;  // Opcional, por defecto 1
}
```

**Validación**:
- `min` >= 1
- `max` >= `min` (no puede haber un máximo menor que el mínimo)
- `difficulty` (si se proporciona): Entre 1-10

**Ejemplo**:
```json
{
  "type": "counting",
  "min": 1,
  "max": 10,
  "difficulty": 2
}
```

---

### 5. SkillUpdateResult (reutilizado de feature 006)

```typescript
type SkillUpdateResult = 'success' | 'failure' | 'hint-used';
```

Para esta feature 007, el motor solo retorna `'success'` o `'failure'`.

---

## Relaciones y flujos

### Flujo de generación

```
CountingChallengeConfig (entrada)
    ↓
generateChallenge(config)
    ↓
CountingChallenge (salida, inmutable, pseudoaleatoria)
```

**Garantías**:
- Sin estado global
- Sin efectos secundarios
- Pseudoaleatoria: invocaciones repetidas con la misma config pueden producir retos distintos (sin semilla, según clarificación en spec.md)

### Flujo de validación

```
CountingChallenge (reto generado)
+ answer (respuesta del jugador, número)
    ↓
validateAnswer(challenge, answer)
    ↓
SkillUpdateResult ('success' | 'failure')
    ↓
updateSkillProgress() [feature 006]
```

**Garantías**:
- Función pura: mismo reto + respuesta → mismo resultado
- Sin mutación del reto

---

## Validación y restricciones

### En generación

| Aspecto | Validación | Acción si falla |
|---------|-----------|-----------------|
| Config `min` < 1 | Rechazar | Lanzar excepción: "min must be >= 1" |
| Config `min` > `max` | Rechazar | Lanzar excepción: "min cannot exceed max" |
| Config `difficulty` fuera [1,10] | Rechazar | Lanzar excepción: "difficulty must be between 1 and 10" |
| Reto generado vacío | Rechazar | Lanzar excepción: "challenge must have at least 1 item" |

### En validación

| Aspecto | Validación | Acción si falla |
|---------|-----------|-----------------|
| Respuesta `null` o `undefined` | Rechazar | Lanzar excepción: "answer cannot be null or undefined" |
| Respuesta tipo inválido (objeto, array, string) | Rechazar | Lanzar excepción: "answer must be a number" |
| Número fuera del rango esperado | Aceptar (retorna false) | Devuelve `'failure'` sin excepción |

---

## Persistencia

**Estado**: No aplica. El motor no persiste datos.

- Cada invocación de `generateChallenge()` crea una instancia nueva de Challenge en memoria
- Cada invocación de `validateAnswer()` es independiente
- No hay base de datos, caché, localStorage, o almacenamiento externo

**Responsabilidad de capas superiores**:
- Auditoría de retos presentados al jugador
- Historial de respuestas
- Estadísticas de rendimiento

---

## Extensibilidad para futuros tipos

```typescript
// Futuro: Tipo "addition"
interface AdditionChallenge extends Challenge {
  type: 'addition';
  operand1: number;
  operand2: number;
  correctAnswer: number;
}

interface AdditionChallengeConfig extends ChallengeConfig {
  type: 'addition';
  minOperand: number;
  maxOperand: number;
  maxResult?: number;
}

// El motor permanece agnóstico:
function generateChallenge(config: ChallengeConfig): Challenge { ... }
```

Cada tipo específico implementa:
1. Su propia interfaz de Challenge
2. Su propia interfaz de Config
3. Su lógica de generación (en futuro: 008-addition-challenges, 015-memory-challenges, etc.)

---

## Notas de diseño

- **Agnosis de renderizado**: El campo `items` en CountingChallenge contiene objetos genéricos, permitiendo que la capa de presentación interprete cómo visualizarlos
- **Pseudoaleatorio sin semilla**: Cada invocación puede variar; no se garantiza reproducibilidad exacta (según clarificación de spec.md)
- **Pureza**: Ambas funciones son testables en Node.js sin dependencias de Phaser (principio VII)
- **Data-driven**: Configuración como objetos, no literales en código (principio IX)
