---
title: "Modelo de progreso por habilidades"
feature: "006-skill-progress-model"
type: "feature-spec"
version: "1.0"
created: "2026-08-19"
updated: "2026-08-19"
status: "Draft"
priority: "P1"
tags: ["game", "progression", "data", "education"]
dependencies: ["004-core-game-loop"]
related_specs: []
---

# Especificación de funcionalidad: Modelo de progreso por habilidades

**Rama de la funcionalidad**: `006-quiero-definir-modelo`

**Creado**: 2026-08-19

**Estado**: Draft

**Entrada**: Descripción del usuario: "Quiero definir el modelo de datos de progreso por habilidad del jugador (counting, addition, memory, logic, reading, spatialReasoning, astronomy), con funciones puras para leer y actualizar el nivel de dominio tras un resultado, completamente desacoplado de destinos y de Phaser."

## Clarificaciones

### Sesión 2026-08-19

- Q: ¿Cuál es el rango exacto de niveles de dominio permitidos en la escala de habilidades? → A: Rango 1-10 (nivel mínimo=1, máximo=10)
- Q: ¿Comportamiento en los límites de actualización cuando un fallo ocurre? → A: Fallos acumulados (contador interno): 3 fallos acumulados = -1 nivel. Nivel mínimo siempre capped at 1.
- Q: ¿Persistencia del contador de fallos acumulados? → A: Contador persiste en PlayerSkillState como campo `failureCount` para cada habilidad.
- Q: ¿Reinicio del contador al cambiar de nivel? → A: Sí, contador se reinicia a 0 automáticamente cuando el nivel cambia (subir u bajar).
- Q: ¿Estrategia de manejo de errores para entradas inválidas (habilidad no soportada o resultado no válido)? → A: Lanzar excepción (`throw new Error(...)`) en ambos casos.

## Escenarios de usuario y pruebas

### Historia de usuario 1 — Lectura del progreso actual por habilidad (Prioridad: P1)

Un jugador quiere ver su nivel de dominio en cada habilidad de forma transparente. El sistema mantiene un registro independiente del nivel alcanzado en cada habilidad (p. ej., Counting: 5, Addition: 3, Memory: 6), sin asociación a destino alguno.

**Por qué tiene esta prioridad**: Es el caso de uso fundamental. Sin poder leer el estado del progreso, no hay forma de saber si el modelo existe ni de integrarlo en otros componentes (retos, dificultad adaptativa, dashboards). Es también la base de la dependencia de 007-challenge-engine-core.

**Prueba independiente**: Puede probarse en aislamiento creando una instancia del modelo de progreso, consultando los niveles de varias habilidades y verificando que cada una tiene un valor independiente. No requiere UI, Phaser, ni destinos.

**Escenarios de aceptación**:

1. **Given** un jugador sin historial previo (nueva partida), **When** se consulta su nivel en "counting", **Then** devuelve un nivel inicial por defecto (ej. 1)
2. **Given** un jugador que ha avanzado en múltiples habilidades (Counting: 5, Addition: 2), **When** se consultan los niveles de ambas, **Then** devuelve los valores correctos sin mezcla entre ellas
3. **Given** una habilidad no soportada, **When** se intenta consultar su nivel, **Then** el sistema lanza una excepción (`throw`) indicando que la habilidad no existe (clarificación Q5)

---

### Historia de usuario 2 — Actualización del dominio tras un resultado (Prioridad: P1)

Cuando el jugador completa un reto (acierto, fallo o usa pista), el sistema debe actualizar el nivel de dominio de la habilidad asociada. La lógica de actualización es pura: misma entrada (nivel actual + resultado) → mismo resultado siempre.

**Por qué tiene esta prioridad**: La actualización es el mecanismo central de progresión. Sin poder modificar el estado, el modelo es inmutable y no refleja el aprendizaje del jugador. Es crítico para 007-challenge-engine-core y toda la dificultad adaptativa posterior.

**Prueba independiente**: Puede probarse directamente en Vitest: crear un estado, invocar la función de actualización con un resultado (acierto/fallo/pista), verificar que el nuevo nivel es correcto. No requiere UI ni integración de escenas.

**Escenarios de aceptación**:

1. **Given** un jugador con Counting en nivel 3, **When** obtiene un acierto, **Then** el nivel sube a 4
2. **Given** un jugador con Counting en nivel 3, **When** obtiene 1 fallo, **Then** el contador de fallos acumulados aumenta a 1, pero el nivel permanece en 3
3. **Given** un jugador con Counting en nivel 3 y 3 fallos acumulados, **When** obtiene otro fallo, **Then** el nivel baja a 2 y el contador de fallos se reinicia a 0
4. **Given** un jugador con Counting en nivel 1 y 3 fallos acumulados, **When** obtiene otro fallo, **Then** el nivel permanece en 1 (mínimo capped)
5. **Given** un jugador con Counting en nivel 8, **When** obtiene un acierto, **Then** el nivel sigue siendo 8 (nivel máximo)
6. **Given** un jugador con Counting en nivel 3, **When** usa pista, **Then** ni `level` ni `failureCount` cambian; el registro de pistas usadas queda explícitamente fuera de alcance de esta feature

---

### Historia de usuario 3 — Progreso independiente por habilidad (Prioridad: P1)

Un jugador debe poder tener niveles diferentes en diferentes habilidades. El progreso en una habilidad no afecta a otras: dominar "Addition" no aumenta automáticamente "Memory".

**Por qué tiene esta prioridad**: La constitución (Principio IV) lo prohíbe explícitamente: "el progreso MUST mantenerse por habilidad". Sin independencia de habilidades, el modelo no cumple el requisito fundamental de adaptabilidad y no prepara el terreno para dificultad verdaderamente personalizada (Principle IV).

**Prueba independiente**: Crear un estado con múltiples habilidades, actualizar una (ej. Addition +1), verificar que otras permanecen inalteradas. Una prueba rápida pero exhaustiva en Vitest.

**Escenarios de aceptación**:

1. **Given** progreso en Addition: 5, Memory: 2, Counting: 7, **When** el jugador acierta un reto de Addition, **Then** Addition sube a 6, pero Memory y Counting permanecen igual
2. **Given** dos jugadores con el mismo perfil de partida, **When** uno avanza en Reading y el otro en Counting, **Then** sus historiales de progreso divergen sin interferencia mutua

---

### Casos límite

* ¿Qué sucede cuando se consulta el nivel de una habilidad antes de su inicialización? Resuelto: se asigna nivel inicial 1 en la inicialización del jugador (FR-006); no existe estado "pre-inicialización" consultable.
* Rango de niveles: 1-10 (resuelto, clarificación Q1).
* ¿Cómo se maneja un resultado inválido (ni acierto, ni fallo, ni pista)? Resuelto: el sistema lanza una excepción (`throw`) (clarificación Q5).
* ¿Qué sucede si se intenta actualizar una habilidad no soportada? Resuelto: el sistema lanza una excepción (`throw`) (clarificación Q5).
* ¿Se permiten históricos de intentos o solo el nivel actual? (alcance: solo nivel actual + failureCount, sin histórico en esta fase)

## Requisitos

### Requisitos funcionales

* **FR-001**: The system MUST maintain an independent skill level for each supported skill (counting, addition, memory, logic, reading, spatialReasoning, astronomy) without coupling to any destination or challenge.

* **FR-002**: WHEN queried, the system MUST return the current domain level for any requested skill as an integer within the range 1-10.

* **FR-003**: WHEN a challenge result is received (success/failure/hint-used), the system MUST update the corresponding skill's domain level according to deterministic rules (same input → same output always).

* **FR-004**: WHILE updating a skill's level, the system MUST NOT modify any other skill's level.

* **FR-005**: The system MUST provide pure functions (no side effects, no external state mutation) for reading and updating skill levels, testable in isolation without UI or Phaser.

* **FR-006**: WHERE a player is newly initialized, the system MUST assign level 1 to each supported skill.

* **FR-007**: The system MUST support querying the entire skill state (all skills and their current levels) as a single snapshot for integration with dashboards or difficulty adaptation logic.

* **FR-008**: IF an unsupported skill key is requested (read or update), THEN the system MUST throw an error rather than returning a silent default or `undefined` (clarification Q5, Sesión 2026-08-19).

* **FR-009**: IF an invalid challenge result is passed to the update function (not one of "success"/"failure"/"hint-used"), THEN the system MUST throw an error (clarification Q5, Sesión 2026-08-19).

### Requisitos no funcionales

* **NFR-001**: The model MUST be a pure data structure (no Phaser imports, no direct DOM access).

* **NFR-002**: All skill level updates MUST be testable via Vitest without rendering or scene initialization.

### Entidades clave

* **Skill**: A type of player competency (e.g., "counting", "addition", "memory"). Identified by a string key. Defined as an enum or constant set of supported skill names.

* **SkillLevel**: An integer representing the current mastery of a skill, in the range 1-10. Immutable from the player's perspective; updated only via the dedicated update function.

* **FailureCount**: An integer counter (0-2) tracking accumulated failures for a single skill at its current level. When it reaches 3, triggers a -1 level update and resets to 0. Part of the persisted skill state (clarification Q3, Sesión 2026-08-19).

* **SkillProgressState**: A data structure holding all skill state for a player. Each skill holds an object with:
  - `level: SkillLevel` (1-10)
  - `failureCount: number` (0-2, resets on level change or when <= 2)
  Example: `{ counting: { level: 5, failureCount: 1 }, addition: { level: 3, failureCount: 0 }, memory: { level: 6, failureCount: 2 }, ... }`
  Serializable for persistence (required for 011-save-progress-local).

* **SkillUpdateResult**: An enum or constant representing a challenge outcome: "success", "failure", "hint-used". Used as input to the update function.

## Criterios de éxito

### Resultados medibles

* **SC-001**: A testeable data model exists that can represent skill levels for all 7 supported skills independently, with no implementation leakage (pure data, no Phaser).

* **SC-002**: Pure functions for reading and updating skill levels pass 100% of unit tests in Vitest without DOM rendering, scene initialization, or external dependencies.

* **SC-003**: A player can achieve different levels across different skills (e.g., Counting: 8, Addition: 3, Memory: 7) and each level is updated independently without cross-contamination.

* **SC-004**: The model is decoupled from destinations, challenges, and difficulty logic — it knows only about skills and their levels, nothing about where or how they were earned.

## Suposiciones

* Initial skill level for new players is 1 (minimum of the range).

* Skill level range is exactly **1-10** (as clarified: Sesión 2026-08-19, Q1). Level 1 represents basic competency (entry-level), level 10 represents mastery.

* Challenge results are always one of three types: "success", "failure", "hint-used". Other outcomes are out of scope for v1.

* Progression rules in v1 (clarified Q2 & Q4, Sesión 2026-08-19):
  - **Success**: +1 level (capped at 10), failureCount reset to 0 automatically
  - **Failure**: Increment failureCount; after 3 accumulated failures, -1 level (capped at 1) and reset failureCount to 0 automatically
  - **Hint-used**: +0 level change, failureCount unchanged
  Complex adaptive curves are deferred to 009-adaptive-difficulty-v1 and 042-difficulty-tuning-v2.

* Failure counter persistence (clarified Q3, Sesión 2026-08-19): failureCount is a persistent field in PlayerSkillState for each skill, serialized and restored from saves (011-save-progress-local). Automatically resets to 0 whenever level changes (clarified Q4).

* No persistence in this feature (saved to memory only). Disk/localStorage persistence is 011-save-progress-local.

* No UI visualization in this feature. Dashboards and UI will reuse this model in future features (e.g., 028-parental-dashboard).

* The player's skill state is owned and managed exclusively by this model. No other part of the game will directly mutate it outside the designated update functions.
