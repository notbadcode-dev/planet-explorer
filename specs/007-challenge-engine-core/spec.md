---
title: "Motor genérico de retos"
feature: "007-challenge-engine-core"
type: "feature-spec"
version: "1.0"
created: "2026-08-19"
updated: "2026-08-19"
status: "Implemented"
priority: "P1"
tags: ["game", "challenges", "core", "data", "education"]
dependencies: ["006-skill-progress-model"]
related_specs: []
---

# Especificación de funcionalidad: Motor genérico de retos

**Rama de la funcionalidad**: `007-quiero-construir-motor`

**Creado**: 2026-08-19

**Estado**: Draft

**Entrada**: Descripción del usuario: "Quiero construir un motor genérico de retos (generación y validación) desacoplado de Phaser, con una interfaz reutilizable para futuros tipos de reto, implementando primero el tipo 'counting' de forma data-driven e integrado con el modelo de progreso por habilidades."

## Clarifications

### Session 2026-08-19

- Q: ¿Qué debe devolver realmente `validateAnswer(challenge, answer)` al validar la respuesta del jugador? → A: Devuelve `SkillUpdateResult`, un tipo union/enum-like (`'success' | 'failure'`, reutilizado de 006), no un booleano. Se elige un tipo basado en enum en lugar de un booleano para poder incorporar en el futuro resultados no binarios o no deterministas (p. ej. un valor adicional a `'success'`/`'failure'`) sin cambiar la firma de la función.
- Q: ¿Los objetivos de rendimiento (60 fps, generación <5ms, validación <1ms) deben ser un Success Criterion medible con tarea de benchmark, o quedarse solo como contexto informativo en plan.md? → A: Quedan solo como contexto informativo en plan.md; no se añade Success Criterion ni tarea de benchmark dedicada (alcance simple de la feature, principio VI YAGNI).

## Escenarios de usuario y pruebas

### Historia de usuario 1 — Generación de un reto de conteo (Prioridad: P1)

El sistema de juego necesita generar un reto de conteo (counting) con configuración data-driven: indicar un rango de valores a contar y el sistema generará automáticamente un reto válido.

**Por qué tiene esta prioridad**: La generación de retos es la base funcional sin la cual no se pueden presentar desafíos al jugador. Es el primer paso de cualquier interacción educativa.

**Prueba independiente**: Invocar `generateChallenge()` con una configuración de reto de conteo, verificar que la respuesta generada contiene los campos esperados (pregunta, respuesta correcta, etc.) sin ninguna dependencia de Phaser ni renderizado.

**Escenarios de aceptación**:

1. **Given** una configuración `CountingChallengeConfig` con rango 1-10, **When** se invoca `generateChallenge(config)`, **Then** devuelve un reto de conteo con una pregunta clara y una respuesta correcta dentro del rango especificado
2. **Given** múltiples invocaciones con la misma configuración, **When** se generan varios retos, **Then** cada reto es válido e independiente (pueden repetirse, pero cada uno cumple los criterios)
3. **Given** una configuración de reto inválida (rango vacío, valores incoherentes), **When** se intenta generar, **Then** el sistema lanza una excepción clara indicando el problema

---

### Historia de usuario 2 — Validación de la respuesta del jugador (Prioridad: P1)

Después de que el jugador resuelve un reto, el sistema debe validar su respuesta y determinar si fue correcta o incorrecta.

**Por qué tiene esta prioridad**: La validación es el mecanismo central de feedback. Sin validación, no hay forma de saber si el jugador acertó y no se puede actualizar su progreso.

**Prueba independiente**: Invocar `validateAnswer()` con un reto generado previamente y una respuesta del jugador, verificar que devuelve un resultado `SkillUpdateResult` correcto sin efectos secundarios.

**Escenarios de aceptación**:

1. **Given** un reto de conteo con respuesta correcta = 5, **When** el jugador responde "5", **Then** `validateAnswer()` devuelve `'success'`
2. **Given** un reto de conteo con respuesta correcta = 5, **When** el jugador responde "3", **Then** `validateAnswer()` devuelve `'failure'`
3. **Given** un reto de conteo con respuesta correcta = 5, **When** el jugador responde "abc" (valor inválido), **Then** el sistema lanza una excepción clara indicando que la respuesta no es válida
4. **Given** múltiples retos con respuestas distintas, **When** se validan en secuencia, **Then** cada validación es independiente (resultado anterior no afecta al siguiente)

---

### Historia de usuario 3 — Integración con el modelo de progreso (Prioridad: P1)

El sistema debe permitir que el resultado de un reto (acierto/fallo) se alimente automáticamente al modelo de progreso por habilidades para actualizar el nivel del jugador.

**Por qué tiene esta prioridad**: La separación entre generación/validación y actualización de progreso permite que el motor genérico sea independiente de cómo se visualicen los retos o cómo se persista el progreso. La integración es el puente entre ambos módulos.

**Prueba independiente**: Generar un reto de counting, validar una respuesta, obtener el resultado y verificar que se puede pasar directamente a `updateSkillProgress()` sin transformación.

**Escenarios de aceptación**:

1. **Given** un reto válido y una respuesta del jugador, **When** se valida, **Then** devuelve un resultado que puede ser consumido directamente por `updateSkillProgress()` (compatibilidad de tipos con `SkillUpdateResult`)
2. **Given** un reto de counting, **When** el jugador acierta, **Then** el resultado es `'success'`; cuando falla, es `'failure'`
3. **Given** el modelo de progreso inicializado con nivel 3 en counting, **When** se valida un reto y se integra el resultado, **Then** el nivel se actualiza correctamente (sube a 4 si acierta, sube el contador de fallos si falla)

---

### Casos límite

* ¿Qué sucede cuando la configuración especifica un rango imposible (min > max)? El sistema lanza una excepción clara.
* ¿Qué sucede si la respuesta del jugador es `null` o `undefined`? El sistema lanza una excepción clara.
* ¿Cómo se manejan los valores fuera del rango esperado? La validación los rechaza como incorrectos (nunca se lanzan excepciones por valores fuera de rango, solo por tipos inválidos o configuraciones imposibles).
* ¿Se pueden generar retos con la misma pregunta en secuencia? Sí: la generación es pseudoaleatoria (sin semilla), por lo que dos invocaciones con la misma configuración pueden producir retos distintos; no se garantiza reproducibilidad exacta entre llamadas.

## Requisitos

### Requisitos funcionales

* **FR-001**: El sistema MUST proporcionar una interfaz genérica `Challenge` que sea agnóstica del tipo de reto específico.

* **FR-002**: El sistema MUST proporcionar una función `generateChallenge(config)` que genere un reto válido a partir de una configuración data-driven sin efectos secundarios ni dependencias de Phaser. La generación MUST ser pseudoaleatoria (sin semilla): invocaciones repetidas con la misma configuración pueden producir retos distintos.

* **FR-003**: El sistema MUST proporcionar una función `validateAnswer(challenge, answer)` que devuelva un `SkillUpdateResult` (tipo union/enum-like: `'success'` | `'failure'`) indicando si la respuesta del jugador es correcta, sin mutar el reto ni el estado del jugador. Se usa un tipo basado en enum en lugar de un booleano para permitir incorporar en el futuro resultados no binarios sin romper la firma.

* **FR-004**: El sistema MUST soportar el primer tipo de reto implementado: `counting` (reto de conteo), con configuración `CountingChallengeConfig` que especifique el rango de valores a contar.

* **FR-005**: El sistema MUST devolver resultados de validación compatibles con `SkillUpdateResult` del modelo de progreso (006) para que se puedan integrar sin transformación.

* **FR-006**: El sistema MUST proporcionar funciones puras testables con Vitest sin renderizado ni inicialización de Phaser.Scene (principio VII).

* **FR-007**: El sistema MUST permitir que futuros tipos de reto reutilicen la interfaz genérica sin modificar el motor central (principio IX).

* **FR-008**: IF una configuración es inválida (rango vacío, valores inconsistentes), THEN el sistema MUST lanzar una excepción clara en lugar de generar un reto inválido.

* **FR-009**: IF la respuesta del jugador es inválida (tipo incorrecto), THEN el sistema MUST lanzar una excepción clara en lugar de devolver un falso positivo/negativo.

### Requisitos no funcionales

* **NFR-001**: El motor MUST ser agnóstico del tipo de reto específico; cada tipo de reto puede heredar o reutilizar la interfaz genérica `Challenge`.

* **NFR-002**: Las funciones de generación y validación MUST ser puras (sin estado global, sin efectos secundarios, sin mutación de argumentos).

* **NFR-003**: El motor MUST ser testeable 100% con Vitest sin DOM ni Phaser.

### Entidades clave

* **Challenge**: Estructura genérica que representa un reto generado. Contiene:
  - `id: string` — identificador único del reto (para auditoría y tracking)
  - `type: string` — tipo de reto (p. ej., `'counting'`, `'addition'`, etc.)
  - `question: string` — texto o descripción de la pregunta (visible al jugador)
  - `correctAnswer: unknown` — la respuesta correcta (tipo depende del reto)
  - `difficulty: number` — nivel de dificultad (1-10, para futuras decisiones de adaptación)
  - Otros campos específicos del tipo de reto (p. ej., `CountingChallenge` incluye `items: Array<{ id: string; type: string }>` — array de objetos a contar, cada uno con identificador único y tipo descriptivo para la capa de renderizado)

* **ChallengeConfig**: Configuración genérica para generación de retos. Cada tipo de reto extiende este contrato con campos específicos.

* **CountingChallengeConfig**: Configuración específica del tipo `counting`:
  - `type: 'counting'` (discriminador)
  - `min: number` — número mínimo de objetos a contar (p. ej., 1)
  - `max: number` — número máximo de objetos a contar (p. ej., 10)
  - `difficulty: number` (opcional, por defecto 1) — dificultad inicial del reto

* **SkillUpdateResult** (reutilizado de 006): Los resultados de validación son:
  - `'success'` — respuesta correcta
  - `'failure'` — respuesta incorrecta

## Criterios de éxito

### Resultados medibles

* **SC-001**: Un motor genérico existe con una interfaz `Challenge` y funciones `generateChallenge()` y `validateAnswer()` que son testables sin Phaser.

* **SC-002**: El tipo `counting` está implementado y todos sus retos generados son válidos (pregunta clara, respuesta dentro del rango esperado) y se validan correctamente.

* **SC-003**: Los resultados de validación son compatibles con el modelo de progreso de 006 sin transformación adicional (tipos alineados con `SkillUpdateResult`).

* **SC-004**: Futuras features pueden agregar nuevos tipos de reto reutilizando la interfaz genérica sin modificar `src/game/core/challenge-engine/` central.

* **SC-005**: El motor pasa todos los tests sin errores de lint, type, o compilación.

## Suposiciones

* Los objetivos de rendimiento mencionados en `plan.md` (60 fps, generación <5ms, validación <1ms) son orientativos y no constituyen un Success Criterion medible ni requieren una tarea de benchmark dedicada, dado el alcance simple de esta feature (principio VI, YAGNI). Si en el futuro se detecta un problema real de rendimiento, se formalizarán como SC en una revisión posterior.

* El motor genérico define la interfaz y las funciones base; cada tipo de reto concreto (counting, addition, etc.) es responsable de implementar la lógica específica de generación y validación dentro del contrato genérico.

* Los retos generados son pseudoaleatorios (mismo config puede producir retos distintos en cada invocación); no se garantiza determinismo ni reproducibilidad exacta en esta versión. Futuras features de variabilidad controlada (p. ej., `043-mission-variability-engine`) pueden introducir semillas si resulta necesario.

* La dificultad (campo `difficulty`) es un parámetro de configuración, no se calcula automáticamente en este motor; futuras features como `009-adaptive-difficulty-v1` pueden usarla para ajustar futuras configuraciones.

* La respuesta del jugador es un número (entero) en el caso de `counting`. Futuras variantes pueden aceptar otros tipos (string, array, etc.).

* No existe persistencia de retos en este motor; cada invocación de `generateChallenge()` crea un reto nuevo. Auditoría o almacenamiento de retos históricos es responsabilidad de capas superiores.

* La validación es una función pura que no tiene acceso al modelo de progreso; la integración con 006 ocurre en capas superiores (p. ej., en una escena de Phaser o en el motor de juego).

* Ningún tipo de reto está acoplado a un destino, planeta, o contexto específico; los retos son generables en cualquier contexto (principio IV, adaptabilidad).
