---

title: "Motor genérico de retos"
feature: "007-challenge-engine-core"
type: "implementation-plan"
version: "1.0"
created: "2026-08-19"
updated: "2026-08-19"
status: "Draft"
spec: "./spec.md"
tags: ["game", "challenges", "core", "data-driven", "education", "logic", "testing"]
dependencies: ["006-skill-progress-model"]
related_specs: []
------------------------------------------------------------

# Plan de implementación: Motor genérico de retos

**Rama**: `007-quiero-construir-motor` | **Fecha**: 2026-08-19 | **Especificación**: [spec.md](spec.md)

**Entrada**: Especificación de funcionalidad de `/specs/007-challenge-engine-core/spec.md`

**Nota**: Esta plantilla se completa mediante el comando `/speckit-plan`; su definición describe el flujo de ejecución.

## Resumen

Desarrollar un motor genérico de retos desacoplado de Phaser que sea testeable en Node.js, data-driven y extensible para futuros tipos de reto. El motor proporciona una interfaz `Challenge` agnóstica, funciones puras `generateChallenge(config)` (pseudoaleatoria, sin semilla) y `validateAnswer(challenge, answer)`, con implementación inicial del tipo `counting`. Los resultados de validación se integran directamente con el modelo de progreso de feature 006 sin transformación.

## Contexto técnico

**Lenguaje/Versión**: TypeScript 6 (strict mode)

**Dependencias principales**: Vite, Vitest, ESLint, Phaser (solo para futuras escenas que consuman el motor; core module sin importaciones de Phaser)

**Almacenamiento**: N/A (motor puramente computacional sin persistencia)

**Testing**: Vitest (unit tests, sin DOM ni Phaser.Scene)

**Plataforma objetivo**: Navegadores modernos (compatibilidad con HTML5)

**Tipo de proyecto**: Librería de módulo de core (reutilizable por features posteriores)

**Objetivos de rendimiento**: 60 fps cuando se integre con renderizado Phaser; generación de reto <5ms, validación <1ms

**Restricciones**: 
- Sin importaciones de Phaser en `src/game/core/challenge-engine/`
- Sin magia (strings/números sueltos fuera de `*.constants.ts`)
- Funciones puras sin estado global
- Testeable 100% en Node.js

**Escala/Alcance**: Interfaz genérica + 1 tipo de reto (counting) + 3 user stories + ~50-80 líneas de código + 20+ tests de cobertura completa

## Comprobación de la constitución

> **GATE**: Debe superarse antes de iniciar la Fase 0 de investigación. Debe volver a comprobarse después de la Fase 1 de diseño.

**Resultado**: ✅ CUMPLE SIN DESVIACIONES

### Principios aplicables

| Principio | Requisito | Cumplimiento | Notas |
|-----------|-----------|--------------|-------|
| **VI — Simplicidad primero** | Solución más simple que satisface req. | ✅ CUMPLE | Interfaz genérica mínima, sin CQRS, sin DI frameworks, sin capas innecesarias |
| **VII — Separación lógica/renderizado** | Lógica de generación/validación sin Phaser | ✅ CUMPLE | Funciones puras en `src/game/core/challenge-engine/`, testeable en Node.js sin Scene |
| **IX — Contenido data-driven** | Config objects, no literals en lógica | ✅ CUMPLE | `CountingChallengeConfig` define min/max; números/strings en `*.constants.ts` |
| **IV — Progresión por habilidades** | Motor agnóstico de destino/contexto | ✅ CUMPLE | `generateChallenge()` genera retos para cualquier contexto, sin acoplamiento |
| **II — Juego antes que ejercicio** | Presentación agnóstica del motor | ✅ CUMPLE | Estructura de `items` permite renderizado flexible, motor no prescribe cómo visualizar |

**Conclusión**: Especificación y plan alineados con constitución. No hay violaciones que documentar.

## Investigación técnica

**Resultado**: N/A — No hay áreas que requieran investigación adicional. Todas las decisiones necesarias se dedujeron de la especificación, del contexto del proyecto (patrón hermano de feature 006), y de la constitución (principios VI, VII, IX).

Áreas cubiertas sin investigación externa:
- Determinismo de generación → Resuelto en spec.md (pseudoaleatorio sin semilla)
- Estructura de countables → Resuelto en spec.md (Array<{id, type}>)
- Stack tecnológico → Ya establecido en el proyecto (TypeScript + Vite + Vitest)
- Ubicación del módulo → Patrón hermano de `src/game/core/progress/` (006)

## Decisiones técnicas

### Separación física en módulo core

**Decisión**: Motor en `src/game/core/challenge-engine/` siguiendo patrón hermano de feature 006 (estructura similar: types, constants, implementation, tests)

**Motivo**: Coherencia arquitectónica con 006 (skill-progress-model), agnosis de Phaser en core/ modules, reusabilidad por múltiples features futuras

**Alternativas descartadas**: 
- Incluir en `src/game/scenes/` (violaría principio VII, acoplamiento a renderizado)
- Monolito en `src/game/` raíz (complejidad innecesaria, difícil de aislar para testing)

### Generación pseudo-aleatoria sin semilla

**Decisión**: `generateChallenge(config)` usa `Math.random()`; sin soporte de semilla en esta versión (según clarificación en spec.md)

**Motivo**: 
- Variabilidad nativa, UX más natural (no repite retos exactos)
- Simplicidad: evita complejidad de PRNG determinista hasta que exista necesidad real (principio VI, YAGNI)

**Alternativas descartadas**:
- Semilla opcional (añadiría complejidad sin caso de uso actual demostrado)
- Determinístico siempre (UX repetitiva, sin variabilidad)

### Interfaces genéricas vs. tipos específicos

**Decisión**: `Challenge` es genérica (id, type, question, correctAnswer, difficulty), `CountingChallenge` la extiende con `items: Array<{id, type}>`; config similarmente (ChallengeConfig base, CountingChallengeConfig específica)

**Motivo**: Futuros tipos (addition, memory, etc.) reutilizan interfaz sin modificar core, cumple SC-004 (extensibilidad); estructura de items permite renderizado flexible sin acoplar el motor a la presentación

**Alternativas descartadas**:
- Union types en vez de herencia (menos extensible, más verboso)
- `itemCount: number` simple (limitaría renderizado a elementos idénticos repetidos)

## Estrategia de pruebas

* **Unit**: Cobertura completa de `generateChallenge()` y `validateAnswer()` en Vitest
  - Retos válidos generados (estructura correcta, valores en rango)
  - Validaciones correctas (aciertos, fallos)
  - Excepciones en casos límite (config inválida, respuesta inválida/null/undefined)
  - Pureza (sin mutaciones, sin estado global)
  - Variabilidad entre invocaciones (pseudoaleatoriedad)

* **Integration**: Verificar que SkillUpdateResult devuelto por validación se integra con `updateSkillProgress()` de feature 006 (compatible sin transformación)

* **Contract**: Interfaz `Challenge` y `ChallengeConfig` documentadas en `contracts/challenge-interface.md`

* **E2E**: Deferred a features posteriores (cuando exista una escena Phaser que consume el motor)

## Estructura del proyecto

### Documentación de esta funcionalidad

```text
specs/007-challenge-engine-core/
├── spec.md              # Especificación funcional ✓
├── plan.md              # Este fichero
├── research.md          # Fase 0 (vacío, no hay investigación pendiente)
├── data-model.md        # Fase 1 (entidades, validación, estado)
├── quickstart.md        # Fase 1 (guía de validación + runnable scenarios)
├── contracts/           # Fase 1 (interfaces públicas)
│   └── challenge-interface.md
└── tasks.md             # Fase 2 (no creado por /speckit-plan)
```

### Código fuente (raíz del repositorio)

```text
src/game/core/challenge-engine/
├── challenge-engine.type.ts          # Interfaces Challenge, ChallengeConfig, CountingChallenge, etc.
├── challenge-engine.constants.ts     # SUPPORTED_CHALLENGE_TYPES, error messages, default dificultad, etc.
├── challenge-engine.ts               # Funciones públicas: generateChallenge(), validateAnswer()
├── challenge-engine.test.ts          # Suite Vitest (20+ tests cobriendo todas las garantías)
└── README.md                         # Documentación del módulo

specs/007-challenge-engine-core/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── challenge-interface.md
└── checklists/
    └── requirements.md
```

**Decisión de estructura**: Motor core agnóstico (feature 007) en `src/game/core/challenge-engine/` reutilizable; documentación de diseño en `specs/007-*/`; tipo `counting` como implementación de demostración dentro del mismo módulo (futuras variantes: addition, memory, etc., pueden vivir en 008+, 015+, etc. o dentro de este módulo según decisión de arquitecto)

## Modelo de datos

(Ver detalles completos en `data-model.md`)

**Nuevas entidades**:
- `Challenge`: Estructura genérica de un reto (id, type, question, correctAnswer, difficulty)
- `CountingChallenge extends Challenge`: Añade `items: Array<{id, type}>`
- `ChallengeConfig`: Interfaz base para configuración
- `CountingChallengeConfig extends ChallengeConfig`: min, max, difficulty (opcional)

**Persistencia**: N/A — Motor sin persistencia; retos son transitorios (cada invocación genera nuevo reto)

**Migraciones**: N/A

**Relaciones**:
- Challenge depende de ChallengeConfig de entrada
- SkillUpdateResult se devuelve como resultado de validación (reutiliza tipos de 006)

## Contratos e interfaces

* **Challenge interface**: Estructura genérica pública que expone el motor (id, type, question, correctAnswer, difficulty + campos type-specific)

* **validateAnswer() output**: `SkillUpdateResult` ('success' | 'failure') compatible con modelo de progreso 006

* **generateChallenge() signature**: `(config: ChallengeConfig) => Challenge` puro, pseudoaleatorio sin semilla

(Detalles en `contracts/challenge-interface.md`)

## Riesgos y compromisos

* **Pseudo-aleatoriedad simple**: Usa `Math.random()` (no criptográfica, sin semilla). RIESGO BAJO. Mitigación: suficiente para educación; sin reproducibilidad exacta en tests (se validan propiedades/rangos, no valores exactos). Si futuro requiere reproducibilidad (testing determinista, mission-variability-engine), se puede añadir semilla opcional sin romper el contrato público.

* **Sin persistencia en motor**: Retos no se guardan. EXPECTED. Responsabilidad de capas superiores. No es riesgo, es diseño intencional (principio VII).

* **Tests no deterministas**: Al no soportar semilla, los tests de generación deben validar rangos/propiedades estructurales en vez de valores exactos. RIESGO BAJO. Mitigación: diseñar aserciones sobre rango y estructura, no sobre valores específicos.

## Seguimiento de complejidad

> **Completar SOLO si Constitution Check detecta violaciones que deban justificarse.**

**Resultado**: N/A — No hay violaciones de constitución que documentar.
