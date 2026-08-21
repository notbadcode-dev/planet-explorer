---
title: "Pistas y reintento sin penalización"
feature: "010-hints-and-retry-flow"
type: "feature-spec"
version: "1.0"
created: "2026-08-21"
updated: "2026-08-21"
status: "Draft"
priority: "P1"
tags: ["game", "education", "challenges", "hints", "retry", "adaptive-difficulty"]
dependencies: ["007-challenge-engine-core", "008-moon-destination-counting"]
related_specs: ["006-skill-progress-model", "009-adaptive-difficulty-v1"]
---

# Especificación de funcionalidad: Pistas y reintento sin penalización

**Rama de la funcionalidad**: `010-010-hints-and`

**Creado**: 2026-08-21

**Estado**: Draft

**Entrada**: "Quiero añadir un sistema transversal de pistas progresivas y reintento sin penalización tras una respuesta incorrecta, integrado en el motor genérico de retos, de forma que el uso de una pista se registre como señal para el progreso y la dificultad adaptativa, nunca como castigo visible para el jugador."

## Clarifications

_No aplican clarificaciones obligatorias después de revisar el pending y la constitución del proyecto. La forma en que se tratan las pistas (como señales, no castigos) y el reintento ilimitado están alineados con los Principios I, IV y VI de la constitución._

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Reintentar sin penalización tras error (Prioridad: P1)

Un jugador responde incorrectamente a un reto (p. ej. conteo en la Luna). El sistema muestra feedback amable indicando que la respuesta no fue correcta, sin penalizar puntuación, vidas ni recursos, y permite volver a intentarlo en el acto.

**Por qué tiene esta prioridad**: Es un requisito explícito de la Constitución (Principio I: "permitir repetir una acción tras un error"); sin este comportamiento la experiencia es frustrante y contradice los valores del proyecto.

**Prueba independiente**: Responder incorrectamente a un reto existente (p. ej. conteo) y verificar que (a) aparece feedback de error claro, (b) el mismo reto sigue disponible, (c) no se ve reducción de puntuación ni vidas, (d) el jugador puede reintentarlo inmediatamente.

**Escenarios de aceptación**:

1. **Given** el jugador ve un reto (p. ej. conteo) durante una escena de destino, **When** responde con un valor incorrecto, **Then** el sistema muestra un mensaje de feedback amable indicando error, sin aplicar ninguna penalización de juego (puntuación, vidas, tiempo, recursos).
2. **Given** el jugador acaba de fallar un reto, **When** observa la pantalla, **Then** el mismo reto se mantiene disponible, sin cambios en su presentación narrativa, listo para reintentarlo.
3. **Given** el jugador puede reintentar un reto de forma ilimitada, **When** ya ha fallado N veces (N ≥ 1), **Then** puede seguir intentando sin límite, sin penalización acumulativa y sin mensajes de frustración.
4. **Given** el jugador ha fallado un reto 1 o más veces, **When** finalmente responde correctamente, **Then** el sistema muestra el mismo feedback de acierto que si lo hubiera resuelto a la primera, sin indicar que fue un reintento.

---

### Historia de usuario 2 - Solicitar y recibir una pista progresiva (Prioridad: P1)

Tras fallar una respuesta, un jugador puede solicitar una pista. El sistema muestra una pista progresiva (si está disponible para ese reto) sin penalizar al jugador. El uso de la pista queda registrado como señal para el modelo de habilidades, pero no aparece al jugador como un "castigo" o "marca negativa".

**Por qué tiene esta prioridad**: Las pistas son una herramienta pedagógica central; permitir su uso sin culpa refuerza la confianza del niño y soporta el aprendizaje adaptativo (Principio IV).

**Prueba independiente**: Fallar un reto que tenga al menos una pista definida, solicitar la pista, verificar que (a) aparece la pista de forma clara, (b) no se muestra en la UI como un "castigo", (c) el jugador puede seguir reintentando el mismo reto, (d) no hay cambio visible en puntuación o vidas.

**Escenarios de aceptación**:

1. **Given** un reto tiene una o más pistas progresivas definidas en su contrato, **When** el jugador falla y accede a la UI de error, **Then** el sistema muestra un botón/opción "Pedir pista" (u equivalente amable) junto a la opción de reintentar.
2. **Given** el jugador solicita una pista, **When** la pista está disponible, **Then** el sistema muestra la pista de forma clara, integrada en la narrativa o como un consejo de BOT-6, sin mensajes de culpa o penalización.
3. **Given** el jugador ha recibido una pista, **When** solicita otra pista, **Then** si existen pistas adicionales, el sistema muestra la siguiente pista en la secuencia progresiva (sin repetir la anterior); si no hay más pistas, el sistema comunica esto de forma amable.
4. **Given** el jugador ha recibido una o más pistas, **When** responde correctamente al reto, **Then** el sistema procesa el acierto normalmente; el historial de pistas usadas queda registrado en el modelo de habilidades pero no aparece en el feedback al jugador.

---

### Historia de usuario 3 - El uso de pistas se registra en el modelo de progreso (Prioridad: P2)

Tras completar un reto (con o sin pistas), el modelo de habilidades y el motor de dificultad adaptativa reciben una señal sobre si se usaron pistas. Esta señal se utiliza para ajustar la dificultad futura sin penalizar visiblemente al jugador.

**Por qué tiene esta prioridad**: Cierra el ciclo de feedback pedagógico: las pistas no son castigo, sino señal de que el jugador puede estar en un nivel intermedio. Sin esta historia no hay valor para la adaptación.

**Prueba independiente**: Completar un reto del juego (p. ej. conteo con pistas), comparar el nivel de habilidad antes y después, verificar que el nivel evoluciona considerando el uso de pistas según las reglas ya definidas en 006/009 (sin nuevas reglas).

**Escenarios de aceptación**:

1. **Given** un jugador ha completado un reto usando una o más pistas, **When** el sistema registra el acierto en el modelo de habilidades, **Then** la información "pistas usadas: sí" se adjunta al evento de validación de respuesta, para que 006/009 puedan usarla.
2. **Given** el motor de dificultad adaptativa (009) recibe un evento de acierto con "pistas usadas: sí", **When** procesa ese evento, **Then** puede considerar este dato al decidir si aumentar o mantener la dificultad en futuros retos, según sus propias reglas (sin introducir comportamiento nuevo en 010).
3. **Given** un jugador ha usado pistas en varios retos de una sesión, **When** la sesión termina, **Then** no aparece ningún "badge" de castigo, penalización visual, o marca negativa por haber usado pistas; el feedback es únicamente sobre el aprendizaje logrado.

---

### Casos límite

* ¿Qué sucede si un reto no tiene pistas definidas? El botón/opción de pista no aparece; el jugador solo puede reintentar.
* ¿Qué sucede si el jugador solicita una pista sin haber fallado? Fuera de alcance; el flujo de pistas se dispara solo tras un error.
* ¿Qué sucede si el jugador pide pista múltiples veces seguidas? Puede recibirlas (todas las disponibles) sin límite; el registro incluye cantidad de pistas solicitadas.
* ¿Qué sucede si un jugador completa un destino sin usar pistas y luego repite el mismo destino y sí las usa? Cada visita es independiente (sin persistencia entre destinos en la misma sesión de Fase 1); el modelo de habilidades acumula ambos eventos.

## Requisitos *(obligatorio)*

### Requisitos funcionales

* **FR-001**: The system MUST extend the `Challenge` contract (interface/type) to include an optional field `hints: Hint[]` where each `Hint` defines a progressive hint for that challenge.
* **FR-002**: Each `Hint` MUST include at minimum a unique identifier, narrative-friendly text, and an order/index for progression.
* **FR-003**: WHEN a player submits an incorrect answer to a challenge that has hints defined, the system MUST display a feedback message indicating the error (friendly, without punitive language) alongside a "Request Hint" button or equivalent affordance.
* **FR-004**: WHEN a player clicks "Request Hint", the system MUST display the next available hint in the sequence for that challenge, integrating it into the narrative context (e.g., as BOT-6 advice) rather than as a standalone technical message.
* **FR-005**: WHEN a player has already received a hint and requests another, the system MUST show the next hint in the progressive sequence (if available) or a friendly message stating no more hints exist; the system MUST NOT repeat the same hint.
* **FR-006**: WHEN a player receives a hint, the system MUST NOT apply any in-game penalty (score, lives, time, resources); the use of the hint is recorded internally as a signal for the skill progress model and adaptive difficulty system.
* **FR-007**: WHEN a player receives a hint and then answers the same challenge (correctly or incorrectly), the system MUST attach a flag `hintUsed: true` to the challenge validation event sent to the skill progress model (006) and adaptive difficulty engine (009).
* **FR-008**: WHEN a player completes a challenge after using one or more hints, the system MUST display positive feedback (same as if completed without hints) and MUST NOT show any visual indicator of "hint dependency" (no badges, colors, or language highlighting the hint usage as a negative factor).
* **FR-009**: The system MUST make the hint/retry flow available to any challenge type (e.g., counting) without requiring modification to the specific challenge type's implementation; this MUST be implemented as a generic wrapper or middleware at the challenge engine level.
* **FR-010**: The system MUST preserve the narrative framing of a challenge across multiple retry attempts and hint requests; the retry/hint UI overlay MUST not reset or interfere with the challenge's existing narrative message from BOT-6.

### Non-functional requirements

* **NFR-001**: Hint text MUST be written in Spanish (castellano) at the child's comprehension level, with clear, actionable guidance (e.g., "Intenta contar de dos en dos" instead of "Optimiza tu estrategia de cálculo").
* **NFR-002**: The hint request flow MUST be accessible via keyboard, touch, and mouse without requiring special hardware.
* **NFR-003**: Hint display MUST not obscure or replace the challenge's existing narrative context; hints MUST be presented as a complementary layer or message within the same scene.

## Criterios de aceptación *(obligatorio)*

- [ ] Challenge contract is extended with optional `hints: Hint[]` field
- [ ] A player can retry a challenge after an incorrect answer without in-game penalty
- [ ] A "Request Hint" affordance is displayed after an incorrect answer if hints are available
- [ ] Hints are displayed progressively (no repetition within the same challenge attempt sequence)
- [ ] Hint usage is recorded and passed to the skill progress model (006) and adaptive difficulty engine (009) as a `hintUsed` signal
- [ ] No visual or textual "punishment" appears for using hints (e.g., no badges, score reductions, or shaming language)
- [ ] The hint/retry flow works for all challenge types (tested with `counting` challenge type)
- [ ] Narrative framing of the challenge is preserved across retries and hint requests
- [ ] Acceptance test scenarios 1–3 can be verified end-to-end in the current game build

## Restricciones y asunciones *(obligatorio)*

### Restricciones

* **Alcance de Phase 1**: Esta feature solo integra el sistema de pistas y reintento en la escena de retos existentes y en el motor genérico ya construido (007); no incluye nuevos tipos de retos ni nuevos destinos.
* **Sin persistencia entre sesiones**: El historial de pistas usadas en un reto individual no se guarda entre visitas al mismo destino en la misma sesión. Cada destino se regenera al entrar (regla establecida en 008). La persistencia entre sesiones queda para una feature posterior.
* **Adaptación solo a nivel de motor**: El uso de pistas es una señal para 006/009; no hay nuevas reglas de dificultad introducidas en 010. Cualquier cambio en la dificultad adaptativa como respuesta a pistas usadas lo define 009.
* **Localización**: Inicialmente solo castellano (según convenciones del proyecto); i18n queda para feature posterior (046).

### Asunciones

* **Retos multiintento son la norma**: Se asume que la mayoría de retos educativos (conteo, lectura, memoria, etc.) requieren la opción de reintento; por tanto, el wrapper genérico de retry/hints es obligatorio para cualquier reto (no opcional).
* **Pistas son un concepto de dominio pedagógico**: Las pistas son escritas por diseñadores de contenido (no IA generada en Fase 1) y se definen como parte del contrato del reto en los datos de configuración/contenido.
* **BOT-6 es el vehículo narrativo**: Todas las pistas se entregan como mensajes de BOT-6 para mantener la consistencia narrativa ya establecida en 005.
* **El modelo de habilidades (006) ya soporta eventos complejos**: Se asume que el sistema construido en 006 puede recibir y procesar eventos de validación que incluyan información adicional como `hintUsed: true`.
* **No hay competición de puntuación global**: La ausencia de penalización por pistas se alinea con el Principio I (sin frustración) y asume que el juego no tiene un sistema de tabla de clasificación competitiva en Fase 1 (ver roadmap).

## Entidades clave

### Challenge (extensión del contrato de 007)

```typescript
interface Hint {
  id: string;           // e.g., "hint-001"
  order: number;        // 1, 2, 3, ... (progresión)
  text: string;         // Spanish, child-friendly hint text
}

interface Challenge {
  // ... existing fields from 007 ...
  hints?: Hint[];       // Optional; empty array or undefined means no hints available
}
```

### Challenge Validation Event (extensión del evento de 006/007)

```typescript
interface ChallengeValidationEvent {
  // ... existing fields ...
  hintUsed?: boolean;   // true if player used hints before answering this attempt
  hintsUsedCount?: number; // Number of hints revealed in this attempt sequence
}
```

## Alineación con la constitución

- **Principio I — Experiencia centrada en el niño**: Reintento sin penalización y pistas sin culpa son aplicaciones directas. El jugador experimenta seguridad para explorar y aprender.
- **Principio IV — Progresión adaptativa**: El uso de pistas es una señal rica para 009/006; permite ajustar dificultad sin frustración.
- **Principio VI — Simplicidad primero**: El sistema es un wrapper genérico, no una arquitectura compleja de "modos dificultad" o "subesistema de pistas". Reutiliza contratos y flujos ya existentes.

## Dependencias

- **Hard**: 007-challenge-engine-core (contrato Challenge base), 008-moon-destination-counting (destino y reto de prueba).
- **Soft**: 006-skill-progress-model (consumidor de eventos con `hintUsed`), 009-adaptive-difficulty-v1 (consumidor de `hintUsed` para ajuste de dificultad).

## Notas para el planning

- El diseño debe enfatizar que pistas ≠ castigo; la UI/UX debe reflejar esto (lenguaje amable, sin rojo/alertas negativas, posicionamiento como "ayuda" no "fallo").
- El contrato `Hint` debería ser extensible para futuras features (auditoría de uso, análisis, etc.); manténlo simple en Fase 1 pero diseña para futuro.
- Las pistas para el reto `counting` existente deben ser diseñadas como parte de esta feature (no como contenido futuro).
