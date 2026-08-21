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
dependencies: ["007-challenge-engine-core", "008-moon-destination-counting", "006-skill-progress-model"]
related_specs: ["006-skill-progress-model", "009-adaptive-difficulty-v1"]
---

# Especificación de funcionalidad: Pistas y reintento sin penalización

**Rama de la funcionalidad**: `010-010-hints-and`

**Creado**: 2026-08-21

**Estado**: Draft

**Entrada**: "Quiero añadir un sistema transversal de pistas progresivas y reintento sin penalización tras una respuesta incorrecta, integrado en el motor genérico de retos, de forma que el uso de una pista se registre como señal para el progreso y la dificultad adaptativa, nunca como castigo visible para el jugador."

## Clarifications

### Session 2026-08-21

- Q: ¿Debe el sistema registrar el uso de una pista llamando directamente a `updateSkillProgress(skill, 'hint-used')` —reutilizando el valor ya existente en el modelo de habilidades (006)— en el momento en que el jugador la solicita, en vez de adjuntar un nuevo indicador `hintUsed` al evento de validación de la respuesta final? → A: Sí. Se reutiliza `'hint-used'` (SkillUpdateResult ya existente en 006/007/009): se llama `updateSkillProgress(skill, 'hint-used')` en el momento de solicitar la pista; la respuesta final se sigue validando por separado como `'success'`/`'failure'`, sin flag adicional ni nuevo tipo de evento.
- Q: ¿Debe la Historia de Usuario 3 mantenerse tal como está redactada —afirmando que 009 "puede considerar" el uso de pistas para ajustar la dificultad futura—, o debe corregirse para reflejar que `'hint-used'` es intencionalmente neutro (no cambia `level` ni `failureCount`, regla N4 de 006, ya confirmada por el edge case de 009) y por tanto no influye en la dificultad adaptativa en esta versión? → A: Se corrige. El uso de pistas se registra mediante la llamada ya existente a `updateSkillProgress(..., 'hint-used')`, que por diseño no altera nivel, `failureCount` ni dificultad futura (006 N4, 009). El valor de esta historia es la neutralidad garantizada (ninguna penalización, ni siquiera indirecta vía dificultad), no una futura adaptación.

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

### Historia de usuario 3 - El uso de pistas queda registrado de forma neutra, sin afectar la dificultad (Prioridad: P2)

Tras solicitar una o más pistas en un reto, el sistema registra ese uso mediante el mecanismo ya existente del modelo de habilidades (`'hint-used'`), que por diseño no modifica el nivel de dominio de la habilidad ni la dificultad de retos futuros (clarificación Session 2026-08-21).

**Por qué tiene esta prioridad**: Cierra el ciclo de feedback pedagógico: las pistas no son castigo, ni siquiera de forma indirecta a través de la dificultad adaptativa. Sin esta historia, no quedaría demostrado que el flujo de pistas de 010 se integra correctamente con el mecanismo ya neutro de 006/009 sin alterar sus reglas.

**Prueba independiente**: Completar un reto del juego (p. ej. conteo) usando una o más pistas, comparar el nivel de dominio de la habilidad antes y después, y verificar que permanece igual (salvo por los efectos ya existentes de la respuesta final correcta/incorrecta), confirmando que 010 no introduce ningún comportamiento nuevo en 006/009.

**Escenarios de aceptación**:

1. **Given** un jugador solicita una pista durante un reto, **When** el sistema procesa la solicitud, **Then** invoca la actualización de habilidades ya existente con `'hint-used'`, sin modificar `level` ni `failureCount` de esa habilidad (006, regla N4).
2. **Given** un jugador ha usado una o más pistas y luego responde correcta o incorrectamente, **When** el sistema valida esa respuesta, **Then** el resultado (`'success'`/`'failure'`) se procesa exactamente igual que si no se hubieran usado pistas, sin ningún ajuste adicional de dificultad atribuible al uso de pistas.
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
* **FR-006**: WHEN a player receives a hint, the system MUST NOT apply any in-game penalty (score, lives, time, resources); the use of the hint is recorded internally via the existing `'hint-used'` value of the skill progress model's `SkillUpdateResult` (006), not a newly introduced signal type.
* **FR-007**: WHEN a player requests a hint, the system MUST call the existing skill progress update function with the challenge's associated skill and the `'hint-used'` result (006), separately from and without altering the eventual `'success'`/`'failure'` validation of that same challenge's answer (clarification Session 2026-08-21).
* **FR-008**: WHEN a player completes a challenge after using one or more hints, the system MUST display positive feedback (same as if completed without hints) and MUST NOT show any visual indicator of "hint dependency" (no badges, colors, or language highlighting the hint usage as a negative factor).
* **FR-009**: The system MUST make the hint/retry flow available to any challenge type (e.g., counting) without requiring modification to the specific challenge type's implementation; this MUST be implemented as a generic wrapper or middleware at the challenge engine level.
* **FR-010**: The system MUST preserve the narrative framing of a challenge across multiple retry attempts and hint requests; the retry/hint UI overlay MUST not reset or interfere with the challenge's existing narrative message from BOT-6.

### Non-functional requirements

* **NFR-001**: Hint text MUST be written in Spanish (castellano) at the child's comprehension level, with clear, actionable guidance (e.g., "Intenta contar de dos en dos" instead of "Optimiza tu estrategia de cálculo").
* **NFR-002**: The hint request flow MUST be accessible via keyboard, touch, and mouse without requiring special hardware.
* **NFR-003**: Hint display MUST not obscure or replace the challenge's existing narrative context; hints MUST be presented as a complementary layer or message within the same scene.

## Criterios de éxito *(obligatorio)*

* **SC-001**: Tras una respuesta incorrecta, el jugador puede reintentar el mismo reto sin observar ninguna reducción de puntuación, vidas o tiempo disponible (idéntico a la garantía ya verificada por 008/SC-003).
* **SC-002**: Cuando un reto tiene pistas definidas, el jugador puede solicitar hasta N pistas progresivas (N = `challenge.hints.length`) sin que ninguna se repita; al agotarlas, ve un mensaje amable en vez de que el botón desaparezca sin explicación.
* **SC-003**: El nivel de dominio (`level`) y el `failureCount` de la habilidad `counting` del jugador son idénticos antes y después de solicitar una o más pistas, verificable comparando ambos valores (regla N4 de 006, garantía H4 del contrato de pistas).
* **SC-004**: El 100% de la lógica nueva (`requestHint`, `requestNextHint`) pasa sus pruebas unitarias en Vitest sin renderizado, DOM ni inicialización de escenas Phaser.
* **SC-005**: El feedback de acierto que ve el jugador es idéntico exista o no un historial de pistas usadas en ese reto (ningún indicador visual o textual distingue ambos casos).

## Criterios de aceptación *(obligatorio)*

- [ ] Challenge contract is extended with optional `hints: Hint[]` field
- [ ] A player can retry a challenge after an incorrect answer without in-game penalty
- [ ] A "Request Hint" affordance is displayed after an incorrect answer if hints are available
- [ ] Hints are displayed progressively (no repetition within the same challenge attempt sequence)
- [ ] Hint usage is recorded via the existing `'hint-used'` `SkillUpdateResult` (006), verified to leave the skill's `level` and `failureCount` unchanged
- [ ] No visual or textual "punishment" appears for using hints (e.g., no badges, score reductions, or shaming language)
- [ ] The hint/retry flow works for all challenge types (tested with `counting` challenge type)
- [ ] Narrative framing of the challenge is preserved across retries and hint requests
- [ ] Acceptance test scenarios 1–3 can be verified end-to-end in the current game build

## Restricciones y asunciones *(obligatorio)*

### Restricciones

* **Alcance de Phase 1**: Esta feature solo integra el sistema de pistas y reintento en la escena de retos existentes y en el motor genérico ya construido (007); no incluye nuevos tipos de retos ni nuevos destinos.
* **Sin persistencia entre sesiones**: El historial de pistas usadas en un reto individual no se guarda entre visitas al mismo destino en la misma sesión. Cada destino se regenera al entrar (regla establecida en 008). La persistencia entre sesiones queda para una feature posterior.
* **Neutralidad ya definida por 006/009**: El uso de pistas se registra vía `'hint-used'` (006), que por diseño no modifica `level`, `failureCount` ni la dificultad adaptativa (009, regla N4 de 006). 010 no introduce ni modifica ninguna regla de dificultad; se limita a disparar la llamada ya existente en el momento correcto (clarificación Session 2026-08-21).
* **Localización**: Inicialmente solo castellano (según convenciones del proyecto); i18n queda para feature posterior (046).

### Asunciones

* **Retos multiintento son la norma**: Se asume que la mayoría de retos educativos (conteo, lectura, memoria, etc.) requieren la opción de reintento; por tanto, el wrapper genérico de retry/hints es obligatorio para cualquier reto (no opcional).
* **Pistas son un concepto de dominio pedagógico**: Las pistas son escritas por diseñadores de contenido (no IA generada en Fase 1) y se definen como parte del contrato del reto en los datos de configuración/contenido.
* **BOT-6 es el vehículo narrativo**: Todas las pistas se entregan como mensajes de BOT-6 para mantener la consistencia narrativa ya establecida en 005.
* **El modelo de habilidades (006) ya soporta `'hint-used'` sin cambios**: Se reutiliza tal cual el valor `'hint-used'` de `SkillUpdateResult`, ya implementado y probado en 006/009; 010 no requiere ninguna extensión de su contrato.
* **No hay competición de puntuación global**: La ausencia de penalización por pistas se alinea con el Principio I (sin frustración) y asume que el juego no tiene un sistema de tabla de clasificación competitiva en Fase 1 (ver roadmap).

## Entidades clave

### Challenge (extensión del contrato de 007)

```typescript
interface Hint {
  readonly id: string;           // e.g., "hint-001"
  readonly order: number;        // 1, 2, 3, ... (progresión)
  readonly text: string;         // Spanish, child-friendly hint text
}

interface Challenge {
  // ... existing fields from 007 ...
  readonly hints?: readonly Hint[];       // Optional; empty array or undefined means no hints available
}
```

### Reutilización de `SkillUpdateResult` (006/007/009) — sin nueva entidad de evento

No se introduce ningún tipo de evento nuevo. Solicitar una pista invoca directamente la función de actualización de habilidades ya existente con el valor `'hint-used'` que ya forma parte de `SkillUpdateResult` (clarificación Session 2026-08-21):

```typescript
// Ya existente en 006/007, sin cambios:
type SkillUpdateResult = 'success' | 'failure' | 'hint-used';

// Al solicitar una pista (010):
updateSkillProgress(skillState, skill, 'hint-used'); // no altera level/failureCount (006, regla N4)

// Al enviar la respuesta final (ya existente, sin cambios):
const outcome = validateAnswer(challenge, answer); // 'success' | 'failure'
updateSkillProgress(skillState, skill, outcome);
```

## Alineación con la constitución

- **Principio I — Experiencia centrada en el niño**: Reintento sin penalización y pistas sin culpa son aplicaciones directas. El jugador experimenta seguridad para explorar y aprender.
- **Principio IV — Progresión adaptativa**: El uso de pistas se integra con el modelo de progreso existente (006/009) sin alterar sus reglas; la neutralidad ya definida de `'hint-used'` (sin cambio de nivel ni dificultad) refuerza que pedir ayuda nunca perjudica al jugador, ni siquiera indirectamente (clarificación Session 2026-08-21).
- **Principio VI — Simplicidad primero**: El sistema es un wrapper genérico, no una arquitectura compleja de "modos dificultad" o "subesistema de pistas". Reutiliza contratos y flujos ya existentes.

## Dependencias

- **Hard**: 007-challenge-engine-core (contrato Challenge base), 008-moon-destination-counting (destino y reto de prueba), 006-skill-progress-model (valor `'hint-used'` ya existente en `SkillUpdateResult`, reutilizado tal cual).
- **Soft**: 009-adaptive-difficulty-v1 (no requiere cambios; su comportamiento neutro ante `'hint-used'` ya definido se mantiene sin modificación).

## Notas para el planning

- El diseño debe enfatizar que pistas ≠ castigo; la UI/UX debe reflejar esto (lenguaje amable, sin rojo/alertas negativas, posicionamiento como "ayuda" no "fallo").
- El contrato `Hint` debería ser extensible para futuras features (auditoría de uso, análisis, etc.); manténlo simple en Fase 1 pero diseña para futuro.
- Las pistas para el reto `counting` existente deben ser diseñadas como parte de esta feature (no como contenido futuro).
