---

title: "Plan de implementación: Pistas y reintento sin penalización"
feature: "010-hints-and-retry-flow"
type: "implementation-plan"
version: "1.0"
created: "2026-08-21"
updated: "2026-08-21"
status: "Draft"
spec: "./spec.md"
tags: [game, education, ui]
dependencies: ["007-challenge-engine-core", "008-moon-destination-counting", "006-skill-progress-model"]
related_specs: ["009-adaptive-difficulty-v1"]
------------------------------------------------------------

# Plan de implementación: Pistas y reintento sin penalización

**Rama**: `010-hints-and-retry-flow` | **Fecha**: 2026-08-21 | **Especificación**: [spec.md](./spec.md)

**Entrada**: Especificación de funcionalidad de `/specs/010-hints-and-retry-flow/spec.md`

**Nota**: Esta plantilla se completa mediante el comando `/speckit-plan`; su definición describe el flujo de ejecución.

## Resumen

Los jugadores ya pueden reintentar un reto sin límite tras un fallo (`008`,
G2), pero no existe ninguna forma de pedir ayuda progresiva. Esta feature
añade pistas opcionales y ordenadas a cualquier `Challenge` (`007`) y una
acción de primera clase para solicitarlas tras un fallo, reutilizando
directamente el resultado ya existente `'hint-used'` de `SkillUpdateResult`
(`006`) — sin inventar un nuevo evento ni una nueva señal de dificultad. El
enfoque técnico es una extensión mínima de tres módulos ya existentes
(`challenge-engine`, `destination-visit`, el overlay `challenge-dialogue`),
sin crear ningún módulo nuevo en `core/`, siguiendo el mismo patrón de
composición ya usado por `008` (Dialog + Icon + Button de `libs/components/`).

## Contexto técnico

**Lenguaje/Versión**: TypeScript 5 (strict mode)

**Dependencias principales**: Ninguna nueva; reutiliza `libs/components/button`,
`libs/components/dialog`, `libs/components/icon` (ya usadas por `008`) y
`core/progress/skill-progress-state.ts` (`006`, `updateSkillProgress` con el
valor ya existente `'hint-used'`).

**Almacenamiento**: N/A — todo el estado de pistas (`hintsRevealedCount`) vive
en memoria durante la visita al destino, igual que `currentIndex`/`lastOutcome`
ya existentes; no hay persistencia entre sesiones (fuera de alcance, ver
`spec.md`).

**Testing**: Vitest (mismo patrón que `007`/`008`/`009` — tests unitarios sin
Phaser sobre `core/`).

**Plataforma objetivo**: navegadores modernos, despliegue estático en GitHub
Pages (sin cambios respecto a features anteriores).

**Tipo de proyecto**: web-app (Vite + Phaser + DOM vanilla, ya establecido).

**Objetivos de rendimiento**: sin objetivos nuevos — la funcionalidad no añade
renderizado continuo ni bucles de juego; impacto en 60 fps no medible (mismo
criterio que `008`/`009`).

**Restricciones**: sin literales mágicos fuera de `*.constants.ts`
(`scripts/check-components.mjs`); `core/` MUST NOT importar `phaser` (regla R1
de `game-engine-scenes.md`); compatible con GitHub Pages (sin backend).

**Escala/Alcance**: extiende el único tipo de reto existente (`counting`, `007`/`008`)
con 2 pistas progresivas; el contrato añadido (`requestHint`) es genérico y
aplicable sin cambios a futuros tipos de reto (`014`-`020`) cuando estos
definan su propio array `hints`.

## Comprobación de la constitución

> **GATE**: Debe superarse antes de iniciar la Fase 0 de investigación. Debe volver a comprobarse después de la Fase 1 de diseño.

* **Principio I (UX centrada en el niño, no negociable)**: **Cumple**. Las
  pistas y el reintento nunca se presentan como fallo o penalización (NFR-001);
  el botón usa variante `'secondary'`, nunca `'danger'`; `'hint-used'` es
  neutro por diseño (regla N4 de `006`) — no reduce ningún progreso visible.
* **Principio II (juego antes que ejercicio)**: **Cumple**. Las pistas son
  estrategias narradas por BOT-6 (mismo diálogo/título ya usado por `008`),
  no revelan directamente la respuesta correcta (research.md sección 3).
* **Principio III (astronomía real, no negociable)**: **N/A** — esta feature
  no introduce contenido astronómico nuevo, solo mecánica de ayuda.
* **Principio IV (progresión adaptativa por habilidad)**: **Cumple**.
  `'hint-used'` no influye en `level`/`failureCount` (regla N4 de `006`,
  reafirmada explícitamente por H4 del nuevo contrato); no se usa tiempo de
  respuesta como criterio en ningún punto de esta feature.
* **Principio V (destinos/expediciones/misiones/retos, replayability)**:
  **N/A** — no se modifica la jerarquía de contenido, solo el `Challenge`
  existente del destino Luna.
* **Principio VI (simplicidad primero)**: **Cumple**. Se reutiliza
  `'hint-used'` en vez de crear un nuevo evento/entidad (decisión ya tomada en
  `spec.md` tras clarificación); `requestHint()` es una función genérica sin
  registro por tipo (research.md sección 1, evita abstracción prematura); no
  se crea ningún módulo `core/hints/` nuevo — se extienden los 2 módulos ya
  existentes que ya tienen responsabilidad sobre retos/visitas.
* **Principio VII (separación lógica/renderizado)**: **Cumple**.
  `requestHint`/`requestNextHint` son funciones puras sin `phaser` (H7 del
  contrato); `DestinationScene.ts` solo coordina presentación/input, igual que
  ya hace con `submitAnswer`.
* **Principio VIII (desarrollo incremental)**: **Cumple**. Vertical slice
  acotada: extiende el reto `counting` ya jugable de punta a punta (pedir
  pista → verla → seguir respondiendo), sin intentar cubrir tipos de reto
  todavía no implementados.
* **Principio IX (contenido dirigido por datos)**: **Cumple**. Las 2 pistas
  de `counting` se definen como constantes en `challenge-engine.constants.ts`
  (mismo patrón que `COUNTING_QUESTION_TEXT`), no embebidas en la escena ni en
  el overlay.

**Sin incumplimientos** — no se requiere ninguna entrada en "Seguimiento de
complejidad".

## Investigación técnica

Ver `research.md` para el análisis completo. Resumen de las decisiones que
había que tomar antes de cerrar el diseño:

* **Ubicación de `requestHint()`**: ¿motor de retos (`challenge-engine.ts`,
  genérico) o coordinador de visita (`destination-visit-state.ts`)? Afecta a
  qué módulo es dueño del acceso a `challenge.hints` y si conviene un patrón
  de registro por tipo (como `generateChallenge`) o una función única.
* **Tracking de pistas ya reveladas**: ¿nuevo campo en `DestinationVisitState`
  o estado fuera de `core/`? Afecta directamente al cumplimiento del
  principio VII (lógica sin Phaser).
* **Contenido concreto de las pistas de `counting`**: ¿genérico (estrategia de
  conteo) o dependiente del `correctAnswer` aleatorio? Afecta al principio II
  (no convertir la pista en la respuesta) y a la reutilización entre partidas.
* **Integración en `overlay/challenge-dialogue.ts`**: ¿extender el componente
  ya existente o crear un overlay nuevo? Afecta a la superficie de cambio y a
  la reutilización de `libs/components/`.
* **Momento de aparición del botón "Pedir pista"**: ¿desde el primer intento o
  solo tras un fallo? Ya acotado por el edge case de `spec.md`, pero se
  documenta el punto de integración exacto en `DestinationScene.ts`.

## Decisiones técnicas

### Ubicación genérica de `requestHint()` en el motor de retos

**Decisión**: `requestHint(challenge, hintIndex)` se añade a
`core/challenge-engine/challenge-engine.ts` como función pura y genérica, sin
patrón de registro por tipo.

**Motivo**: `docs/conventions/architecture/challenge-engine-contract.md` (R4)
ya anticipaba esta operación como parte del contrato del motor; la lógica de
indexar `challenge.hints` no varía por tipo de reto, a diferencia de
`generateChallenge`/`validateAnswer`.

**Alternativas descartadas**: definirla en `destination-visit-state.ts`
(mezclaría una responsabilidad del motor con la orquestación de la visita);
registrarla en `CHALLENGE_GENERATORS`-style registry (sobre-diseño sin
variación real por tipo).

### Tracking de pistas reveladas como campo del estado de visita existente

**Decisión**: nuevo campo `hintsRevealedCount: number` en
`DestinationVisitState` (008), sin crear ningún módulo de estado nuevo.

**Motivo**: es el mismo patrón ya usado por `currentIndex`/`lastOutcome`:
información derivada de la visita en curso, sin persistencia. Mantenerlo en
`core/destination-visit/` preserva el principio VII (nada de este estado vive
en `DestinationScene.ts`).

**Alternativas descartadas**: contador en `DestinationScene` (rompe la
separación lógica/renderizado ya establecida); tercer módulo `core/hints/`
(sobre-diseño para un único campo numérico, principio VI).

### Contenido de pistas genérico, no dependiente de la respuesta aleatoria

**Decisión**: 2 pistas fijas de estrategia de conteo ("cuenta de una en una",
"agrupa de dos en dos"), definidas como constantes en
`challenge-engine.constants.ts` y adjuntas a todo `CountingChallenge` generado.

**Motivo**: funcionan para cualquier `correctAnswer` aleatorio (`007`/`009`)
sin acoplar el contenido de la pista al valor concreto generado; evita que la
pista se convierta, de facto, en la respuesta (principio II).

**Alternativas descartadas**: pistas que acoten el rango del número correcto
(demasiado cerca de revelar la respuesta); contenido en fichero de datos
separado (sobre-diseño para 2 strings, principio VI).

### Extensión de `overlay/challenge-dialogue.ts` en vez de un overlay nuevo

**Decisión**: añadir props opcionales (`hints`, `hintsRevealedCount`,
`onRequestHint`) al componente ya existente, reutilizando `createDialog` +
`createButton` (variante `'secondary'` para "Pedir pista", nunca `'danger'`) +
las pistas ya reveladas como contenido de texto adicional.

**Motivo**: reutiliza el componente ya validado por `008`, evitando duplicar
la lógica de montaje/limpieza de un segundo overlay; `'secondary'` distingue
visualmente "pedir ayuda" de "responder" (variante `'primary'`) sin usar
colores de alerta (NFR-001/NFR-003).

**Alternativas descartadas**: overlay HTML independiente superpuesto
(complica la coordinación en `DestinationScene` con dos elementos flotantes).

### Aparición del botón de pista solo en la rama de reintento

**Decisión**: `DestinationScene.handleAnswerSelected` solo pasa
`hints`/`onRequestHint` a `createChallengeDialogue` en su rama de fallo
(reintento ya existente), nunca en el primer intento de un reto.

**Motivo**: coincide con el edge case ya fijado en `spec.md` (pedir pista sin
haber fallado antes queda fuera de alcance) y con FR-003; no requiere estado
nuevo más allá de la rama de reintento ya existente.

**Alternativas descartadas**: mostrar el botón siempre — contradice
explícitamente el edge case documentado en `spec.md`.

## Estrategia de pruebas

* **Unit**: `core/challenge-engine/challenge-engine.test.ts` (extendido) —
  `generateCountingChallenge` adjunta siempre `hints` con `order` creciente
  (FR-004/FR-005); `requestHint` devuelve la `Hint` correcta por índice y
  `undefined` fuera de rango (H2), sin lanzar excepción. Nuevo bloque de tests
  en `core/destination-visit/destination-visit-state.test.ts` —
  `requestNextHint` incrementa `hintsRevealedCount` (H3), invoca
  `updateSkillProgress(..., 'hint-used')` solo cuando hay pista real (H4), no
  modifica `level`/`failureCount` de `006` (regresión explícita de N4),
  `submitAnswer` reinicia `hintsRevealedCount` a `0` tras un acierto (H6) y lo
  preserva tras un fallo (H5). Test de regresión sobre `008`: G1-G6 de
  `destination-visit-contract.md` siguen pasando sin cambios.
* **Integration**: N/A dedicada — la integración `challenge-engine` ↔
  `destination-visit` ↔ `progress` se valida vía los unit tests de arriba y
  `quickstart.md` (mismo criterio que `008`/`009`, sin Playwright todavía).
* **Contract**: `contracts/hint-contract.md` describe la API pública y
  garantías (H1-H7) de las funciones nuevas; verificado por los unit tests de
  arriba.
* **E2E**: N/A — fuera de alcance hasta `033-automated-e2e-testing`.

## Estructura del proyecto

### Documentación de esta funcionalidad

```text
specs/010-hints-and-retry-flow/
├── spec.md              # Especificación funcional (/speckit-specify)
├── plan.md              # Este fichero (/speckit-plan)
├── research.md          # Fase 0 (/speckit-plan)
├── data-model.md        # Fase 1 (/speckit-plan)
├── quickstart.md        # Fase 1 (/speckit-plan)
├── contracts/           # Fase 1 (/speckit-plan)
│   └── hint-contract.md
└── tasks.md             # Fase 2 (/speckit-tasks - NO creado por /speckit-plan)
```

### Código fuente (raíz del repositorio)

```text
src/game/core/
├── challenge-engine/
│   ├── challenge-engine.ts             # [MODIFICADO] nueva función pura requestHint(); generateCountingChallenge adjunta hints
│   ├── challenge-engine.type.ts        # [MODIFICADO] nueva interfaz Hint; Challenge.hints? opcional
│   ├── challenge-engine.constants.ts   # [MODIFICADO] COUNTING_HINT_1_TEXT/COUNTING_HINT_2_TEXT/COUNTING_HINTS
│   └── challenge-engine.test.ts        # [MODIFICADO] cobertura de requestHint() y hints en CountingChallenge
├── destination-visit/
│   ├── destination-visit-state.ts      # [MODIFICADO] nueva función requestNextHint(); submitAnswer reinicia hintsRevealedCount
│   ├── destination-visit-state.type.ts # [MODIFICADO] nuevo campo hintsRevealedCount
│   └── destination-visit-state.test.ts # [MODIFICADO] cobertura de requestNextHint() y neutralidad sobre progress (006)
└── progress/                           # sin cambios — se reutiliza updateSkillProgress(..., 'hint-used') tal cual

src/game/overlay/
├── challenge-dialogue.ts               # [MODIFICADO] props opcionales hints/hintsRevealedCount/onRequestHint; botón "Pedir pista"
└── challenge-dialogue.constants.ts     # [MODIFICADO] CHALLENGE_DIALOGUE_HINT_BUTTON_VARIANT ('secondary'), textos del botón/mensaje final

src/game/scenes/
└── DestinationScene.ts                 # [MODIFICADO] rama de reintento pasa hints/onRequestHint; nuevo handler handleRequestHint()

docs/conventions/architecture/
└── challenge-engine-contract.md        # sin cambios — R4 ya anticipaba exactamente este contrato, ahora implementado
```

**Decisión de estructura**: se mantiene el layout ya fijado por
`game-engine-scenes.md` (`core/<módulo>/` puro, sin Phaser); no se crea ningún
directorio nuevo — se extienden `challenge-engine/` y `destination-visit/`
(ya dueños de `Challenge`/`DestinationVisitState` respectivamente) y los dos
ficheros de presentación (`overlay/challenge-dialogue.ts`,
`scenes/DestinationScene.ts`) que ya implementan el flujo de retos de `008`.

## Modelo de datos

Ver `data-model.md` para el detalle completo. Resumen:

* **Sin entidades persistidas nuevas** — todo el estado nuevo
  (`hintsRevealedCount`) es en-memoria, con el mismo ciclo de vida que
  `currentIndex`/`lastOutcome` ya existentes en `DestinationVisitState`.
* **`Hint`** (nueva, `007`): `{ id, order, text }`, expuesta opcionalmente vía
  `Challenge.hints?: readonly Hint[]`.
* **`DestinationVisitState`** (`008`) gana el campo `hintsRevealedCount:
  number`, reiniciado a `0` en cada nuevo reto (acierto) y preservado en cada
  reintento (fallo).
* Reutilización directa, sin cambios, de `SkillUpdateResult` (`006`) y su
  valor ya existente `'hint-used'`.

## Contratos e interfaces

* **`contracts/hint-contract.md`**: contrato de las dos funciones públicas
  nuevas (`requestHint` en `007`, `requestNextHint` en `008`), garantías H1-H7
  y notas de integración con la UI (`overlay/challenge-dialogue.ts`).
* Sin contratos externos (REST/eventos) nuevos — toda la comunicación es
  interna entre módulos `core/`, ya cubierta por los contratos existentes de
  `006`/`007`/`008` y por este nuevo contrato.
* Los contratos ya existentes
  `specs/007-challenge-engine-core/contracts/challenge-interface.md` y
  `specs/008-moon-destination-counting/contracts/destination-visit-contract.md`
  no se reescriben retroactivamente; las extensiones de firma/estado se
  documentan hacia adelante en este `plan.md` y en `data-model.md` (mismo
  tratamiento ya aplicado por `009`).

## Riesgos y compromisos

* **Riesgo**: extender `DestinationVisitState` con `hintsRevealedCount` podría
  romper alguna de las garantías G1-G6 ya validadas de `008` si el reinicio en
  `submitAnswer` se implementa incorrectamente. **Mitigación**: test de
  regresión explícito que ejecuta la suite existente de
  `destination-visit-state.test.ts` sin cambios, más los nuevos casos H5/H6.
* **Compromiso**: las pistas de `counting` son genéricas (no personalizadas
  por dificultad/nivel). Aceptado porque añadir variantes por nivel sería
  sobre-diseño para un único tipo de reto con 2 pistas (principio VI); se
  puede revisar en una spec futura si se detecta necesidad real con más tipos
  de reto.

## Seguimiento de complejidad

N/A — no se han detectado incumplimientos de `constitution.md` en la
Comprobación de la constitución (ni antes ni después del diseño de Fase 1).
