---
title: "Dificultad adaptativa v1"
feature: "009-adaptive-difficulty-v1"
type: "feature-spec"
version: "1.1"
created: "2026-08-20"
updated: "2026-08-20"
status: "Draft"
priority: "P1"
tags: ["game", "education", "progression", "challenges"]
dependencies: ["006-skill-progress-model", "007-challenge-engine-core"]
related_specs: ["008-moon-destination-counting"]
---

# Especificación de funcionalidad: Dificultad adaptativa v1

**Rama de la funcionalidad**: `009-quiero-implementar-una`

**Creado**: 2026-08-20

**Estado**: Draft

**Entrada**: Descripción del usuario: "Quiero implementar una primera versión de dificultad adaptativa: una función pura que, según el historial reciente de aciertos/fallos/pistas de una habilidad, ajuste los parámetros del siguiente reto generado por el motor de retos, sin usar nunca el tiempo de respuesta como criterio y sin mostrar nunca una bajada de dificultad como fracaso al jugador. Además, esta feature incorpora como deuda técnica previa los hallazgos de la retrospectiva R001 (`specs/retrospectives/R001-cierre-especificaciones-001-008.md`, sección 'Contratos compartidos'): corregir `challenge-engine.ts` para que use un patrón de registro por tipo de reto en vez de un `if`/`switch`, y eliminar su acoplamiento directo con las constantes del modelo de progreso."

## Clarifications

### Session 2026-08-20

- Q: Cuando esta función devuelve la configuración de dificultad ajustada, ¿debe fijar también el campo `difficulty` (1-10) del propio reto (`Challenge`/`ChallengeConfig`, 007) igual al nivel de dominio de la habilidad, o solo debe ajustar los parámetros específicos del tipo de reto (p. ej. `min`/`max`)? → A: La configuración devuelta fija `difficulty` = nivel de dominio de la habilidad (1-10), además de ajustar `min`/`max` u otros parámetros del tipo de reto.
- Q: Si se solicita esta configuración de dificultad para un tipo de reto sin mapeo nivel→dificultad definido (más allá de "counting"), ¿el sistema debe lanzar una excepción o devolver un valor por defecto? → A: El sistema lanza una excepción clara, coherente con el precedente ya establecido en 006/007 ante entradas no soportadas.

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Los retos se vuelven más difíciles cuando el jugador domina una habilidad (Prioridad: P1)

Un jugador acierta varios retos seguidos de una habilidad (por ejemplo, "counting"). Su nivel de dominio en esa habilidad sube, según el modelo de progreso ya existente. El siguiente reto generado para esa habilidad refleja ese nivel más alto con parámetros más exigentes (por ejemplo, un rango numérico mayor), en vez de mantenerse igual de fácil indefinidamente.

**Por qué tiene esta prioridad**: Es el requisito constitucional central de esta feature (principio IV, progresión adaptativa). Sin esta historia, el nivel de dominio del jugador queda registrado pero no tiene ningún efecto real sobre el juego, y el motor de retos (007) seguiría usando configuraciones fijas por destino.

**Prueba independiente**: Puede probarse en aislamiento con Vitest: invocar la función de ajuste de dificultad con niveles de dominio crecientes (p. ej. 1, 5, 10) para la misma habilidad y verificar que la configuración devuelta es cada vez más exigente, sin necesidad de Phaser ni de una sesión de juego real.

**Escenarios de aceptación**:

1. **Given** un jugador con nivel de dominio 3 en "counting", **When** se solicita la configuración de dificultad para el siguiente reto de tipo "counting", **Then** el sistema devuelve una configuración con parámetros más exigentes que los correspondientes al nivel 1.
2. **Given** el nivel de dominio de una habilidad sube de 4 a 5 tras un acierto (según el modelo de progreso ya existente), **When** se genera el siguiente reto de esa habilidad, **Then** su configuración de dificultad corresponde al nivel 5, no al nivel 4 anterior.

---

### Historia de usuario 2 - Los retos se vuelven más asequibles cuando el jugador acumula fallos, sin comunicarlo como un castigo (Prioridad: P1)

Un jugador falla varios retos seguidos de una habilidad. Su nivel de dominio baja, según el modelo de progreso ya existente. El siguiente reto generado se ajusta a un nivel más asequible, y en ningún momento la interfaz del juego comunica esa bajada como una pérdida, penalización o fracaso visible para el jugador.

**Por qué tiene esta prioridad**: El principio I ("experiencia centrada en el niño") exige explícitamente que ninguna bajada de dificultad interna se perciba como un castigo. Sin esta historia, el ajuste hacia abajo podría implementarse de forma técnicamente correcta pero exponerse de una manera que dañe la experiencia del niño.

**Prueba independiente**: Puede probarse invocando la función de ajuste con niveles de dominio decrecientes y verificando que la configuración generada es más asequible; y, por separado, revisando que ningún mensaje de BOT-6 ni elemento de UI existente referencia una "bajada de nivel" como evento negativo.

**Escenarios de aceptación**:

1. **Given** un jugador con nivel de dominio 6 en una habilidad, **When** el nivel baja a 5 tras fallos acumulados (según el modelo de progreso ya existente), **Then** la configuración del siguiente reto de esa habilidad es más asequible que la del nivel 6.
2. **Given** una bajada de nivel de dominio acaba de producirse, **When** el jugador continúa jugando, **Then** ningún mensaje ni elemento visual indica que ha "bajado de nivel", "fallado" o "perdido progreso".

---

### Historia de usuario 3 - El tiempo de respuesta nunca influye en la dificultad (Prioridad: P2)

Un jugador responde a los retos a velocidades muy distintas (muy rápido en unos, muy lento en otros). La dificultad de los siguientes retos generados depende únicamente de si acertó o falló, nunca de cuánto tardó en responder.

**Por qué tiene esta prioridad**: Es una prohibición explícita del principio IV. Aunque es una historia "negativa" (verifica una ausencia de comportamiento), es fundamental para no penalizar indirectamente a niños que razonan con calma, y debe quedar demostrada con la misma prioridad alta que la subida/bajada de dificultad. Se marca P2 porque depende de que US1/US2 ya existan para poder observar que el resultado no cambia al variar el tiempo.

**Prueba independiente**: Puede probarse invocando la función de ajuste de dificultad con el mismo historial de aciertos/fallos pero simulando tiempos de respuesta distintos (si la función ni siquiera acepta ese parámetro, la prueba consiste en confirmar que su firma no lo admite) y verificando que el resultado no varía.

**Escenarios de aceptación**:

1. **Given** dos jugadores con el mismo nivel de dominio e historial de resultados, **When** uno responde en 1 segundo y el otro en 30 segundos, **Then** la configuración de dificultad del siguiente reto es idéntica para ambos.

---

### Casos límite

* ¿Qué sucede cuando el nivel de dominio de una habilidad ya está en el máximo soportado (10) y el jugador sigue acertando? La configuración de dificultad permanece en la correspondiente al nivel 10, sin error ni parámetros fuera de los límites soportados por el tipo de reto.
* ¿Qué sucede cuando el nivel de dominio ya está en el mínimo soportado (1) y el jugador sigue fallando? La configuración de dificultad permanece en la correspondiente al nivel 1, sin error.
* ¿Qué sucede si se solicita la configuración de dificultad para una habilidad recién inicializada (nivel 1, sin historial previo)? El sistema devuelve la configuración base correspondiente al nivel 1 sin lanzar ningún error.
* ¿Qué sucede si se solicita la configuración de dificultad con un nivel de dominio fuera del rango 1-10? El sistema lanza una excepción clara, igual que el resto de funciones del modelo de progreso (006) ante entradas inválidas.
* ¿Qué sucede cuando un resultado es "pista usada" (`hint-used`)? No cambia el nivel de dominio ni el contador de fallos (comportamiento ya definido en 006), por lo que tampoco cambia la configuración de dificultad del siguiente reto de esa habilidad.
* ¿Qué sucede si se solicita la configuración de dificultad para un tipo de reto que todavía no tiene un mapeo nivel→dificultad definido (más allá de "counting")? El sistema lanza una excepción clara en vez de devolver una configuración por defecto silenciosa (clarificación Session 2026-08-20).

## Requisitos *(obligatorio)*

### Requisitos funcionales

* **FR-001**: The system MUST provide a pure function that, given a skill's current domain level (as defined by the existing skill progress model, 006) and a challenge type, returns a difficulty configuration for the next challenge of that skill/type.
* **FR-002**: The system MUST define an explicit, deterministic mapping between each supported skill domain level (1-10) and the difficulty parameters of at least the "counting" challenge type (e.g., numeric range), without requiring machine learning or non-deterministic logic.
* **FR-002a**: The difficulty configuration returned by the system MUST set the challenge configuration's `difficulty` field (1-10, already defined by 007-challenge-engine-core) equal to the skill's current domain level, in addition to any type-specific parameters it adjusts (clarification Session 2026-08-20).
* **FR-003**: WHEN a skill's domain level increases as a result of a success (per the existing skill progress model), the system MUST return a difficulty configuration for that skill's next challenge that is stricter than the configuration for the previous level.
* **FR-004**: WHEN a skill's domain level decreases as a result of accumulated failures (per the existing skill progress model), the system MUST return a difficulty configuration for that skill's next challenge that is easier than the configuration for the previous level.
* **FR-005**: The system MUST NOT accept response time as an input to the difficulty configuration function, under any circumstance.
* **FR-006**: WHILE a skill's domain level decreases, the system MUST NOT present that decrease to the player through any narrative message or UI element as a penalty, failure, or loss.
* **FR-007**: The difficulty configuration returned by the system MUST be directly usable as input to `generateChallenge()` (007-challenge-engine-core) without additional transformation.
* **FR-008**: The system MUST replace the fixed numeric range currently hardcoded as destination content in `008-moon-destination-counting` with the difficulty configuration derived from the player's current "counting" skill domain level.
* **FR-009**: IF the difficulty configuration function is invoked with a domain level outside the supported 1-10 range, THEN the system MUST throw an error rather than silently returning an arbitrary default, consistent with the error-handling convention already established in 006.
* **FR-009a**: IF the difficulty configuration function is invoked for a challenge type without an explicit level-to-difficulty mapping defined, THEN the system MUST throw an error rather than silently returning a default configuration (clarification Session 2026-08-20).
* **FR-010**: WHILE a skill's domain level is at the minimum (1) or maximum (10) supported value, the system MUST keep returning the difficulty configuration bound to that level without exceeding the challenge type's supported parameter limits.

### Requisitos no funcionales

* **NFR-001**: The difficulty adjustment logic MUST be a pure function (no side effects, no external state mutation), testable in isolation with Vitest without Phaser, DOM, or scene initialization.
* **NFR-002**: The difficulty adjustment logic MUST NOT introduce any new persisted player-facing metric beyond what already exists in the skill progress model (006).

## Entidades clave

* **Configuración de dificultad ajustada**: estructura de configuración de un tipo de reto concreto (p. ej. `CountingChallengeConfig`) cuyos parámetros (rango numérico u otros) se derivan del nivel de dominio actual de la habilidad asociada, y cuyo campo `difficulty` (1-10, ya definido en 007) queda fijado al mismo valor que ese nivel de dominio (clarificación Session 2026-08-20); lista para pasar directamente a `generateChallenge()` (007) sin transformación adicional.
* **Tabla de mapeo nivel → dificultad**: correspondencia explícita y determinista entre cada nivel de dominio soportado (1-10) y los parámetros de dificultad de un tipo de reto concreto; se define al menos para el tipo "counting" en esta versión.

## Criterios de éxito *(obligatorio)*

### Resultados medibles

* **SC-001**: Al comparar la configuración de dificultad generada para dos niveles de dominio distintos de la misma habilidad, el nivel más alto produce siempre una configuración estrictamente más exigente (o igual, si ya está en el límite máximo soportado).
* **SC-002**: Al comparar la configuración de dificultad generada para dos niveles de dominio distintos de la misma habilidad, el nivel más bajo produce siempre una configuración estrictamente más asequible (o igual, si ya está en el límite mínimo soportado).
* **SC-003**: Ninguna prueba de aceptación de esta funcionalidad depende del tiempo de respuesta del jugador como entrada observable.
* **SC-004**: El 100% de la lógica de ajuste de dificultad pasa sus pruebas unitarias en Vitest sin renderizado, DOM ni inicialización de escenas Phaser.
* **SC-005**: El destino Luna (008-moon-destination-counting) genera sus retos de "counting" usando la configuración derivada de esta funcionalidad en vez del rango fijo `min`/`max` anterior, verificable comparando la configuración generada en al menos dos niveles de dominio distintos.

## Suposiciones

* El "historial reciente" de una habilidad ya queda reflejado indirectamente en su nivel de dominio actual (`SkillProgressState`, definido en 006): un acierto sube el nivel de inmediato y tres fallos acumulados lo bajan, según las reglas ya implementadas y probadas en 006. Esta funcionalidad no introduce un nuevo histórico de resultados ni una ventana temporal adicional: se limita a mapear el nivel de dominio vigente a los parámetros de dificultad del siguiente reto, evitando duplicar estado (principio VI, simplicidad primero).
* Los resultados de tipo "pista usada" (`hint-used`) no alteran el nivel de dominio ni el contador de fallos (comportamiento ya definido en 006), por lo que tampoco alteran la configuración de dificultad devuelta por esta funcionalidad. El uso de pistas como señal explícita para el ajuste de dificultad (regla R4 de `docs/conventions/architecture/challenge-engine-contract.md`) queda diferido a `010-hints-and-retry-flow`.
* El mapeo nivel → dificultad se define en esta versión únicamente para el tipo de reto "counting" (único tipo existente); futuros tipos de reto (014-020, 053) definirán su propio mapeo siguiendo el mismo patrón, sin necesidad de modificar el motor genérico (007) ni esta funcionalidad.
* Como parte de esta misma feature, y siguiendo la recomendación de la retrospectiva `specs/retrospectives/R001-cierre-especificaciones-001-008.md` (sección "Contratos compartidos", hallazgos R2 y R5), se corrige `src/game/core/challenge-engine/challenge-engine.ts` para (a) sustituir su `if`/`switch` de `generateChallenge()` por un patrón de registro por tipo de reto, y (b) eliminar su import directo de `../progress/skill-progress-state.constants`, conforme a `docs/conventions/architecture/challenge-engine-contract.md`. El detalle técnico de esa corrección se documenta en `plan.md`/`tasks.md` de esta feature (como tareas Foundational previas), no en esta especificación, que describe el comportamiento observable y no la implementación interna.
* Tras corregir el motor de retos, se actualizarán `docs/conventions/architecture/challenge-engine-contract.md` y `game-engine-scenes.md` para reflejar la implementación real resultante (nombre de carpeta `challenge-engine/`, ausencia de acoplamiento directo con `progress/`), cerrando así el hallazgo de la sección "Decisiones arquitectónicas transversales" de R001.
* No se introduce ninguna interfaz de usuario nueva para mostrar el ajuste de dificultad al jugador; la única superficie visible sigue siendo el propio reto generado (007) y los mensajes narrativos ya existentes (005), que nunca deben mencionar el ajuste como tal.
