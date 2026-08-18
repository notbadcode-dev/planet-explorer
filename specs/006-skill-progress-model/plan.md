---

title: "Modelo de progreso por habilidades"
feature: "006-skill-progress-model"
type: "implementation-plan"
version: "1.0"
created: "2026-08-19"
updated: "2026-08-19"
status: "Draft"
spec: "./spec.md"
tags: ["game", "progression", "data", "education"]
dependencies: ["004-core-game-loop"]
related_specs: []
------------------------------------------------------------

# Plan de implementación: Modelo de progreso por habilidades

**Rama**: `006-skill-progress-model` | **Fecha**: 2026-08-19 | **Especificación**: [spec.md](./spec.md)

**Entrada**: Especificación de funcionalidad de `/specs/006-skill-progress-model/spec.md`

**Nota**: Esta plantilla se completa mediante el comando `/speckit-plan`; su definición describe el flujo de ejecución.

## Resumen

Implementar el modelo de datos puro que representa el dominio del jugador por
habilidad (counting, addition, memory, logic, reading, spatialReasoning,
astronomy), completamente desacoplado de destinos, retos y de Phaser. El enfoque
técnico sigue el patrón ya establecido en `src/game/core/navigation/`
(004-core-game-loop): un objeto de estado plano e inmutable (`SkillProgressState`)
y funciones puras (`createInitialSkillProgressState`, `getSkillLevel`,
`updateSkillProgress`) que devuelven un nuevo estado sin mutar el argumento
recibido. La mecánica de progresión (rango 1-10, fallos acumulados con umbral 3,
manejo de errores mediante excepciones) queda fijada por las clarificaciones Q1-Q5
de `spec.md`.

## Contexto técnico

**Lenguaje/Versión**: TypeScript 6 (strict mode, ya configurado en el proyecto)

**Dependencias principales**: Ninguna nueva. Reutiliza Vitest (ya instalado) para
tests; no introduce librerías de estado (Redux, Zustand, etc.) — objeto plano y
funciones puras son suficientes (principio VI).

**Almacenamiento**: N/A en esta feature (in-memory únicamente). El estado se
diseña como objeto serializable a JSON para que `011-save-progress-local` lo
persista sin transformación, pero la persistencia en sí queda fuera de alcance.

**Testing**: Vitest (`npm test`), siguiendo el patrón de
`src/game/core/navigation/navigation-state.test.ts`.

**Plataforma objetivo**: N/A — lógica pura ejecutable indistintamente en Node
(Vitest) o navegador, sin dependencias de entorno.

**Tipo de proyecto**: Módulo dentro del proyecto único existente (`src/game/core/progress/`), no introduce un nuevo proyecto ni paquete.

**Objetivos de rendimiento**: N/A — operaciones O(1) sobre un objeto en memoria
con 7 claves fijas; sin restricciones de rendimiento relevantes.

**Restricciones**: MUST NOT importar `phaser` (regla R1 de
`game-engine-scenes.md`); MUST vivir en `src/game/core/progress/` (convención ya
fijada); MUST ser un objeto plano serializable a JSON (sin clases/métodos) para
compatibilidad futura con `011-save-progress-local`.

**Escala/Alcance**: 7 habilidades soportadas en esta feature (subconjunto del
catálogo completo de la constitución); un único `SkillProgressState` en memoria
por partida — sin namespacing multi-perfil en este slice (diferido a
`029-multi-profile-support`, ver `research.md`).

## Comprobación de la constitución

> **GATE**: Debe superarse antes de iniciar la Fase 0 de investigación. Debe volver a comprobarse después de la Fase 1 de diseño.

* **I. Experiencia centrada en el niño**: N/A directo (sin UI en esta feature),
  pero la mecánica de fallos acumulados (3 fallos antes de bajar de nivel, en
  lugar de penalización inmediata) está alineada con "evitar penalizaciones
  frustrantes" y "tratar los errores como parte natural del aprendizaje". Cumple.
* **II. Juego antes que ejercicio**: N/A (sin presentación ni contenido narrativo
  en esta feature; es infraestructura de datos consumida por features futuras que
  sí tendrán presentación jugable).
* **III. Astronomía real y separación ficción/realidad**: N/A (no introduce
  contenido astronómico ni narrativo).
* **IV. Progresión adaptativa y por habilidades**: Cumplimiento directo — esta
  feature ES la implementación central de este principio. El progreso se
  mantiene por habilidad, independiente de cualquier destino/expedición/misión.
* **V. Destinos, expediciones, misiones, retos**: N/A (sin acoplamiento a la
  jerarquía de contenido, como exige explícitamente el principio IV).
* **VI. Simplicidad primero**: Cumple — objeto plano + 3 funciones puras, sin
  persistencia prematura, sin `schemaVersion`/`profileId` anticipados (YAGNI, ver
  `research.md`), sin frameworks de estado.
* **VII. Separación entre lógica y renderizado**: Cumplimiento directo — módulo
  100% lógica pura en `core/progress/`, sin `Phaser.Scene`, testable con Vitest en
  aislamiento.
* **VIII. Desarrollo incremental y vertical slices**: Cumple — incremento
  autocontenido y testeable de extremo a extremo (aunque sin UI, es una "vertical
  slice" de infraestructura de datos que desbloquea `007-challenge-engine-core`).
* **IX. Contenido dirigido por datos**: Cumple — el catálogo de habilidades
  (`SkillName`) y los umbrales (rango 1-10, umbral de 3 fallos) se definen como
  constantes en `*.constants.ts`, no hardcodeados dispersos en la lógica.

**Resultado**: Sin incumplimientos. No se requiere Seguimiento de complejidad.

## Investigación técnica

N/A — todas las decisiones técnicas quedaron resueltas mediante `/speckit-clarify`
(Q1-Q5) y mediante los documentos de arquitectura ya existentes
(`game-engine-scenes.md`, `progress-persistence-model.md`). Ver
[research.md](./research.md) para el detalle de cada decisión y sus alternativas
descartadas.

## Decisiones técnicas

### Objeto de estado plano e inmutable

**Decisión**: `SkillProgressState` es `Record<SkillName, SkillDomain>`, un objeto
plano sin clases. Las funciones de actualización devuelven un nuevo objeto
mediante spread, sin mutar el argumento de entrada.

**Motivo**: Consistencia con `src/game/core/navigation/navigation-state.ts`
(patrón ya validado en `004-core-game-loop`); serializable a JSON sin
transformación para `011-save-progress-local`.

**Alternativas descartadas**: Clase con métodos de instancia (rompe
serializabilidad directa y añade complejidad sin beneficio, principio VI).

### Contador de fallos acumulados (`failureCount`) con umbral 3

**Decisión**: Cada `SkillDomain` incluye `failureCount` (0-2). Al tercer fallo
consecutivo sin acierto intermedio, el nivel baja en 1 y el contador se reinicia.

**Motivo**: Clarificación Q2 (spec.md) — decisión explícita del usuario para
evitar penalización inmediata por un único fallo.

**Alternativas descartadas**: Descenso inmediato de nivel en cada fallo
(descartado explícitamente en Q2).

### Manejo de errores mediante excepciones

**Decisión**: `getSkillLevel`/`updateSkillProgress` lanzan `Error` ante una
`skill` o `result` no soportados, en lugar de devolver `undefined`.

**Motivo**: Clarificación Q5 (spec.md) — falla explícita y rápida, consistente
con TypeScript `strict` mode.

**Alternativas descartadas**: Retorno de valor sentinela (`undefined`)
(descartado en Q5, opción B).

## Estrategia de pruebas

* **Unit**: Suite completa en `src/game/core/progress/skill-progress-state.test.ts`
  cubriendo las garantías G1-G9 del contrato (estado inicial, lectura aislada,
  progresión por acierto/fallo/pista, techo/suelo de nivel, aislamiento entre
  habilidades, excepciones ante entradas inválidas). Ejecutable con
  `npm test -- src/game/core/progress`, sin DOM ni Phaser.
* **Integration**: N/A en esta feature — no hay escenas Phaser ni overlay que
  integrar todavía (eso lo introducirá `007-challenge-engine-core` al consumir
  esta API desde retos reales).
* **Contract**: El contrato de API (`contracts/skill-progress-contract.md`) se
  valida mediante los mismos tests unitarios; no requiere un runner de contratos
  separado dado que no hay límite de proceso (todo vive en el mismo bundle TS).
* **E2E**: N/A — sin UI, ver `quickstart.md` para la validación manual opcional
  vía script ad-hoc.

## Estructura del proyecto

### Documentación de esta funcionalidad

```text
specs/006-skill-progress-model/
├── spec.md              # Especificación funcional (/speckit-specify)
├── plan.md              # Este fichero (/speckit-plan)
├── research.md          # Fase 0 (/speckit-plan)
├── data-model.md        # Fase 1 (/speckit-plan)
├── quickstart.md        # Fase 1 (/speckit-plan)
├── contracts/           # Fase 1 (/speckit-plan)
│   └── skill-progress-contract.md
└── tasks.md             # Fase 2 (/speckit-tasks - NO creado por /speckit-plan)
```

### Código fuente (raíz del repositorio)

```text
src/game/core/progress/
├── skill-progress-state.ts            # API pública: create/get/update (puras)
├── skill-progress-state.type.ts       # SkillName, SkillUpdateResult, SkillDomain, SkillProgressState
├── skill-progress-state.constants.ts  # SKILL_NAMES, límites de nivel/fallos, resultados válidos
└── skill-progress-state.test.ts       # Suite Vitest (G1-G9 del contrato)
```

**Decisión de estructura**: Módulo hermano de `src/game/core/navigation/` y
`src/game/core/content/`, siguiendo exactamente el mismo layout de 4 ficheros
(`.ts`, `.type.ts`, `.constants.ts`, `.test.ts`) ya validado en
`004-core-game-loop`. No se modifica ningún fichero existente fuera de
`src/game/core/progress/` — feature completamente aditiva.

## Modelo de datos

Ver [data-model.md](./data-model.md) para el detalle completo. Resumen: un tipo
`SkillProgressState = Record<SkillName, SkillDomain>` donde `SkillDomain = {
level: number (1-10), failureCount: number (0-2) }`, con 7 `SkillName` soportados
en esta feature. Sin persistencia (in-memory).

## Contratos e interfaces

* **`skill-progress-contract.md`**: API pública de `core/progress/`
  (`createInitialSkillProgressState`, `getSkillLevel`, `updateSkillProgress`) y
  sus garantías de comportamiento G1-G9. Ver
  [contracts/skill-progress-contract.md](./contracts/skill-progress-contract.md).

## Riesgos y compromisos

* **Riesgo**: Ninguna feature consumidora real existe todavía
  (`007-challenge-engine-core` no está implementada), por lo que el contrato
  público podría necesitar ajustes menores cuando se integre por primera vez.
  **Mitigación**: El contrato documenta explícitamente los consumidores
  esperados y sus garantías (G1-G9); cualquier ajuste futuro se hará actualizando
  este contrato de forma explícita, no silenciosamente.
* **Trade-off**: Se acepta no incluir `schemaVersion` ni namespacing por
  `profileId` en esta feature, aunque `progress-persistence-model.md` los exige
  para el esquema *persistido*. Se documenta en `research.md` como diferido a
  `011`/`029`, ya que ningún mecanismo de persistencia real existe todavía que
  consuma esos campos (YAGNI, principio VI).

## Seguimiento de complejidad

N/A — la Comprobación de la constitución no detectó incumplimientos.
