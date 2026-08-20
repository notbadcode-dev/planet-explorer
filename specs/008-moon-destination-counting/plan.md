---

title: "Destino: la Luna con retos de conteo"
feature: "008-moon-destination-counting"
type: "implementation-plan"
version: "1.0"
created: "2026-08-20"
updated: "2026-08-20"
status: "Implemented"
spec: "./spec.md"
tags: ["game", "education", "challenges", "narrative", "planets"]
dependencies: ["004-core-game-loop", "005-bot6-narrative-shell", "007-challenge-engine-core"]
related_specs: ["006-skill-progress-model"]
------------------------------------------------------------

# Plan de implementación: Destino: la Luna con retos de conteo

**Rama**: `008-quiero-convertir-destino` | **Fecha**: 2026-08-20 | **Especificación**: [spec.md](./spec.md)

**Entrada**: Especificación de funcionalidad de `/specs/008-moon-destination-counting/spec.md`

## Resumen

Sustituir el destino placeholder "Luna" (ya presente en `DESTINATIONS` desde
`004-core-game-loop`) por un destino jugable real: al entrar, `DestinationScene`
genera por adelantado una secuencia fija de 3 retos de tipo `counting` (motor ya
construido en `007`), los presenta uno a uno envueltos en mensajes narrativos de
BOT-6 mediante un nuevo overlay de reto (composición de `Dialog`/`Button`/`Icon` ya
existentes, sin nuevo componente en `libs/components/`), permite reintentos
ilimitados sin penalización de juego, actualiza el nivel de dominio de "counting"
tras cada intento (`006`), y cierra el destino con un mensaje de BOT-6 al completar
el último reto. Toda la coordinación (secuencia, opciones de respuesta, aplicar
resultado) vive en un nuevo módulo puro `core/destination-visit/`, sin lógica de
juego dentro de la escena Phaser (principio VII).

## Contexto técnico

**Lenguaje/Versión**: TypeScript 5 (`strict` mode, ya configurado en `tsconfig.json`)

**Dependencias principales**: Phaser 3 (escenas/canvas), `libs/components/` (`Dialog`,
`Button`, `Icon`, `Progress` — sin dependencias npm nuevas)

**Almacenamiento**: N/A — sin persistencia entre visitas ni entre sesiones (excluido
explícitamente en spec.md; `011-save-progress-local` es quien la introducirá)

**Testing**: Vitest (unit sobre `core/`, mismo patrón que `004`/`005`/`006`/`007`)

**Plataforma objetivo**: navegadores modernos, GitHub Pages estático (sin backend)

**Tipo de proyecto**: web-app (juego Phaser + overlay HTML sobre el mismo `index.html`)

**Objetivos de rendimiento**: 60 fps en `DestinationScene` (heredado de `004`);
generación/validación de reto <5 ms (contexto informativo heredado de `007`, sin
Success Criterion ni benchmark dedicado — YAGNI)

**Restricciones**: compatible con GitHub Pages; sin nuevas dependencias npm; sin
literales mágicos fuera de `*.constants.ts` (`scripts/check-components.mjs`); `core/`
sin import de `phaser` (regla R1 de `game-engine-scenes.md`)

**Escala/Alcance**: 1 destino (Luna), 1 tipo de reto ya existente (`counting`),
secuencia fija de 3 retos por visita, 4 opciones de respuesta por reto (1 correcta +
3 distractores)

## Comprobación de la constitución

> **GATE**: Debe superarse antes de iniciar la Fase 0 de investigación. Debe volver a comprobarse después de la Fase 1 de diseño.

* **I. Experiencia centrada en el niño**: cumple — feedback inmediato (FR-003/FR-004),
  reintento sin penalización y sin límite (FR-004/FR-006), zonas táctiles mediante
  `Button` ya accesible, sin frustración añadida.
* **II. Juego antes que ejercicio**: cumple — el reto siempre se envuelve en un
  mensaje narrativo de BOT-6 (FR-002/FR-005), nunca como expresión aritmética
  desnuda (SC-002).
* **III. Astronomía real**: N/A para esta feature — la ambientación de la Luna es
  temática/genérica (Suposición de spec.md); no se presentan datos astronómicos
  reales (fuera de alcance, ver `023`).
* **IV. Progresión adaptativa por habilidades**: cumple — el nivel de "counting" se
  actualiza vía el modelo ya existente (`006`) tras cada intento (FR-007); la
  dificultad NO se asocia al destino en sí, solo el contenido educativo concreto de
  esta visita lo usa como entrada (ver desviación documentada en "Riesgos y
  compromisos" sobre el origen de `min`/`max`, heredada del propio alcance ya
  aceptado por `007`).
* **V. Destinos, expediciones, misiones**: sin violación, diferimiento explícito
  amparado por el principio VIII — esta feature NO introduce la jerarquía
  completa `Expedition > Mission` (eso es `021`, aún no construida);
  introducir esa estructura ahora anticiparía una spec futura no necesaria
  todavía (YAGNI). El destino Luna referencia directamente su secuencia de
  `ChallengeConfig`, migrable a `Mission.challengeConfigs` sin cambiar su
  forma cuando `021` exista. Ver "Seguimiento de complejidad" para la
  justificación formal de este diferimiento.
* **VI. Simplicidad primero**: cumple — reutiliza `Dialog`/`Button`/`Icon` sin
  nuevo componente en `libs/components/`; un único módulo `core/` nuevo
  (`destination-visit/`), sin capas ni abstracciones adicionales.
* **VII. Separación lógica/renderizado**: cumple — secuencia, generación de
  opciones y aplicación de resultados viven en `core/destination-visit/` (sin
  `phaser`), `DestinationScene` solo coordina y monta el overlay.
* **VIII. Desarrollo incremental**: cumple — continúa el vertical slice de `004` sin
  implementar contenido de destinos futuros (`013`+).
* **IX. Contenido dirigido por datos**: cumple — la secuencia de retos y los
  mensajes de BOT-6 son datos en `core/content/`, no están embebidos en la escena.
* **Componentes compartidos**: comprobado — `Dialog.content`/`Dialog.actions`
  aceptan `HTMLElement[]`, suficiente para narrativa + items a contar + botones de
  opción sin nuevo componente; no se detiene la ejecución.

No se detectan violaciones bloqueantes de `constitution.md`. Se deja constancia
formal del único punto de atención (principio V, diferimiento de la jerarquía
`Expedition > Mission`) en la sección "Seguimiento de complejidad" para evitar
ambigüedad sobre si constituye o no una violación.

## Investigación técnica

* **Origen de `min`/`max` para los retos `counting` sin `009-adaptive-difficulty-v1`
  aún construida**: `docs/conventions/architecture/challenge-engine-contract.md`
  (R3) indica que la configuración de rango debe proceder del futuro módulo de
  dificultad adaptativa. Decisión final en `research.md`.
* **Dónde vive la generación de opciones múltiples (distractores) a partir de un
  `CountingChallenge`**: `007` no expone este concepto (contrato agnóstico de
  presentación). Decisión final en `research.md`.
* **Composición del overlay de reto con componentes ya existentes**: confirmar que
  `DialogProps.content`/`actions` cubren narrativa + items a contar + opciones de
  respuesta sin nuevo componente compartido. Decisión final en `research.md`.

## Decisiones técnicas

### Nuevo módulo puro `core/destination-visit/`

**Decisión**: Crear `src/game/core/destination-visit/` (mismo patrón que
`navigation-state`/`skill-progress-state`): estado inmutable `DestinationVisitState`
+ funciones puras `createDestinationVisit`, `getCurrentChallenge`,
`getAnswerOptions`, `submitAnswer`. Coordina `generateChallenge`/`validateAnswer`
(`007`) y `updateSkillProgress` (`006`) sin que `DestinationScene` conozca esos
detalles.

**Motivo**: regla R2 de `game-engine-scenes.md` prohíbe generación de retos,
validación o actualización de progreso dentro de una escena Phaser; un módulo
puro nuevo es la forma más simple de coordinar dos módulos `core/` ya existentes
sin acoplarlos entre sí (principio VII).

**Alternativas descartadas**: (a) coordinar todo dentro de `DestinationScene` —
viola R2 y no sería testeable con Vitest sin Phaser; (b) hacer que `007` importe
directamente `006` — viola R5 de `challenge-engine-contract.md` (evitar
acoplamiento circular entre módulos `core/`).

### Extensión data-driven de `Destination`

**Decisión**: Añadir un campo opcional `challengeConfigs?: readonly
CountingChallengeConfig[]` (sin `difficulty`) a la interfaz `Destination` existente
en `core/content/destinations.ts`, poblado solo para `'moon'` con 3 entradas fijas
(mismo `min`/`max`). `DestinationScene` rama su comportamiento según si el destino
activo tiene `challengeConfigs`: si los tiene, arranca la visita con reto; si no
(ningún otro destino existe todavía), mantiene el comportamiento placeholder actual.

**Motivo**: cumple R5 de `game-engine-scenes.md` ("añadir un destino MUST NOT
requerir modificar el motor genérico ni la navegación; se resuelve añadiendo datos
en `core/content/`") y R3 de `content-model.md` ("una Mission referencia una lista
de `ChallengeConfig`, nunca instancias ya generadas") de forma anticipada a que
`021` formalice `Expedition`/`Mission` — el campo es directamente migrable sin
cambiar su forma.

**Alternativas descartadas**: introducir ya la jerarquía completa
`Expedition > Mission` de `021` — anticipa una spec futura no construida
(principio VIII, YAGNI).

### Overlay de reto reutilizando `Dialog` + `Button` + `Icon`

**Decisión**: Nuevo `src/game/overlay/challenge-dialogue.ts` (mismo patrón que
`bot6-dialogue.ts`): compone `createDialog` (título "BOT-6", `description` = mensaje
narrativo vigente, `content` = un `Icon 'star'` por elemento de
`challenge.items`, `actions` = un `Button` por opción de respuesta de
`getAnswerOptions`). No se crea ningún componente nuevo en `libs/components/`.

**Motivo**: `Dialog.content`/`Dialog.actions` ya aceptan `HTMLElement[]`,
suficiente para el layout necesario; regla de "componente reutilizable
inexistente" de la constitución no aplica (existe composición suficiente con
componentes ya existentes).

**Alternativas descartadas**: crear un componente nuevo `AnswerOptions` en
`libs/components/` — un único caso de uso real (este destino) no justifica
promover una abstracción compartida (principio VI: "al menos dos casos de uso
reales antes de introducirse").

### Ciclo de vida del `SkillProgressState` entre escenas

**Decisión**: Extender `SceneInitData` (`core/navigation/navigation-state.type.ts`,
`004`) con un nuevo campo `skillProgressState: SkillProgressState`. `main.ts` lo
inicializa una única vez con `createInitialSkillProgressState()` (`006`) al
arrancar el juego; cada escena lo guarda como campo público (mismo patrón ya
usado para `navigationState`) y lo reenvía en cada `scene.start(...)` (incluida
la restauración en `popstate`), de forma que sobrevive a las transiciones
mapa↔destino dentro de la misma sesión de navegador, sin persistirlo entre
recargas de página (fuera de alcance, `011`).

**Motivo**: `006`/`007` son módulos puros ya construidos pero ningún escena los
consume todavía — `008` es el primer consumidor real y necesita un lugar donde
viva el estado de habilidad durante la sesión. `SceneInitData` ya es el
mecanismo existente y explícito para "los datos que cada escena recibe en su
`init()` para arrancar con el estado vigente" (docstring original de `004`);
añadir un campo es una extensión aditiva, no una redefinición de su contrato.

**Alternativas descartadas**: crear un singleton/módulo global mutable para el
estado de habilidad — introduce estado mutable compartido fuera del patrón ya
establecido de estado inmutable hilvanado explícitamente por las escenas
(principio VII), y complicaría los tests unitarios de escena si existieran.

## Estrategia de pruebas

* **Unit**: `core/destination-visit/destination-visit-state.test.ts` (Vitest, sin
  Phaser) — creación de la secuencia fija con 3 retos usando el nivel de entrada
  (FR-014), reintento sin límite tras fallo sin regenerar el reto (FR-004/FR-006),
  actualización de habilidad en cada intento correcto/incorrecto (FR-007,
  clarificación Q2), avance solo tras acierto (FR-011), estado `completed` tras el
  último reto (FR-003/FR-009). Extensión de `core/content/bot6-messages.test.ts`
  para los nuevos mensajes (longitud, unicidad de `id`); `destinations.ts` no
  tiene test dedicado (dato trivial, mismo criterio ya aceptado desde `004`).
* **Integration**: N/A dedicada — la integración `DestinationScene` ↔
  `destination-visit`/`challenge-engine`/`skill-progress-state` se valida
  manualmente vía `quickstart.md` (mismo criterio que `004`/`005`, sin Playwright
  todavía — ver `033`/`034`).
* **Contract**: `contracts/destination-visit-contract.md` describe garantías
  (G1-G6) de la API pública del nuevo módulo; verificado por los unit tests de
  arriba.
* **E2E**: N/A — fuera de alcance hasta `034-automated-e2e-testing`.

## Estructura del proyecto

### Documentación de esta funcionalidad

```text
specs/008-moon-destination-counting/
├── spec.md              # Especificación funcional (/speckit-specify)
├── plan.md              # Este fichero (/speckit-plan)
├── research.md          # Fase 0 (/speckit-plan)
├── data-model.md        # Fase 1 (/speckit-plan)
├── quickstart.md        # Fase 1 (/speckit-plan)
├── contracts/           # Fase 1 (/speckit-plan)
└── tasks.md             # Fase 2 (/speckit-tasks - NO creado por /speckit-plan)
```

### Código fuente (raíz del repositorio)

```text
src/game/
├── core/
│   ├── content/
│   │   ├── destinations.ts               # [MODIFICADO] campo `challengeConfigs` opcional
│   │   ├── destinations.constants.ts      # [MODIFICADO] datos del destino "moon"
│   │   ├── bot6-messages.ts               # [sin cambios de forma]
│   │   └── bot6-messages.constants.ts     # [MODIFICADO] nuevos mensajes narrativos
│   ├── challenge-engine/                  # [sin cambios] reutilizado tal cual (007)
│   ├── progress/                          # [sin cambios] reutilizado tal cual (006)
│   ├── navigation/
│   │   └── navigation-state.type.ts       # [MODIFICADO] `SceneInitData.skillProgressState`
│   │   (consumido por MapScene.ts Y DestinationScene.ts, ver más abajo)
│   └── destination-visit/                 # [NUEVO] secuencia + opciones + coordinación
│       ├── destination-visit-state.ts
│       ├── destination-visit-state.type.ts
│       ├── destination-visit-state.constants.ts
│       └── destination-visit-state.test.ts
├── overlay/
│   ├── challenge-dialogue.ts               # [NUEVO] overlay de reto (Dialog+Button+Icon)
│   ├── challenge-dialogue.constants.ts     # [NUEVO]
│   ├── bot6-dialogue.ts                    # [sin cambios] reutilizado para narrativa simple
│   └── hud.ts                              # [MODIFICADO] progreso real (reto N/3) en vez de placeholder
├── scenes/
│   ├── MapScene.ts                         # [MODIFICADO] guarda/reenvía `skillProgressState` en la transición a destino
│   └── DestinationScene.ts                 # [MODIFICADO] guarda `skillProgressState` en `init()`, lo reenvía en
│                                            #              `handleReturnToMap()`; rama a flujo de reto si el destino
│                                            #              tiene `challengeConfigs`; fondo Phaser distintivo (FR-010)
└── main.ts                                 # [MODIFICADO] inicializa `skillProgressState`, lo reenvía en `popstate`
```

**Decisión de estructura**: se mantiene el layout ya fijado por
`game-engine-scenes.md` (`core/` puro + `overlay/` HTML + `scenes/` Phaser); el
único directorio nuevo es `core/destination-visit/`, siguiendo el mismo patrón de
módulo puro que `navigation/`/`progress/`.

## Modelo de datos

Ver `data-model.md` para el detalle completo. Resumen:

* `Destination` (modificada): nuevo campo opcional `challengeConfigs?: readonly
  CountingChallengeConfig[]`.
* `Bot6Message` (sin cambios de forma): nuevos registros de datos (intro, reintento,
  acierto, cierre del destino).
* `DestinationVisitState` (nueva entidad, in-memory, no persistida): secuencia de
  `Challenge` ya generados, índice actual, estado (`in-progress`/`completed`),
  último resultado (para feedback).

## Contratos e interfaces

* **`destination-visit-contract.md`**: contrato de la API pública del nuevo módulo
  `core/destination-visit/` (creación de la visita, obtención del reto/opciones
  actuales, envío de respuesta).
* Sin contratos externos (REST/eventos) nuevos — toda la comunicación es interna
  entre módulos `core/` y la escena, ya cubierta por los contratos existentes de
  `004`/`006`/`007`.

## Riesgos y compromisos

* **Origen de `min`/`max` de los retos antes de `009`**: `challenge-engine-contract.md`
  (R3) indica que el rango debe proceder del futuro módulo de dificultad
  adaptativa (`009-adaptive-difficulty-v1`, aún no construida — es la siguiente
  spec del roadmap tras esta). Se acepta un rango fijo como dato de contenido del
  destino Luna (mismo precedente ya sentado por `007-challenge-engine-core/spec.md`:
  "la dificultad es un parámetro de configuración, no se calcula automáticamente...
  futuras features como 009 pueden usarla"), pasando el nivel de dominio actual de
  "counting" como campo `difficulty` de `CountingChallengeConfig` (mismo rango 1-10
  que `SkillDomain.level`, sin conversión). Mitigación: `009` sustituirá este rango
  fijo por un cálculo real sin rediseñar el contrato (`min`/`max` seguirán siendo
  campos de `CountingChallengeConfig`).
* **Reintentos ilimitados y `failureCount` de `006`**: cada intento fallido cuenta
  para el modelo de habilidad (clarificación Q2 de spec.md), por lo que fallar 3
  veces seguidas el mismo reto puede bajar el nivel de "counting" un punto aunque
  el jugador siga en el mismo destino. Es el comportamiento ya existente y
  aceptado de `006`, sin regla nueva; se documenta para que no se interprete como
  un defecto durante `/speckit-implement`.

## Seguimiento de complejidad

| Punto de atención | Por qué parece necesario | Alternativa más simple descartada |
|---|---|---|
| Principio V no se implementa en su forma completa (`Expedition > Mission`) para el destino Luna | Esta feature es un vertical slice incremental (`004`→`008`) anterior a `021-expedition-mission-structure`, que aún no está construida; introducir la jerarquía completa ahora violaría el principio VIII ("una funcionalidad futura MUST NOT implementarse antes de ser necesaria") | Construir `Expedition`/`Mission` ya en esta feature — descartado: no hay un segundo caso de uso real todavía (solo existe el destino Luna), y `021` es la spec explícitamente responsable de esa estructura en el roadmap (`specs_pending/ROADMAP.md`) |

No se detectan otras violaciones de `constitution.md` que requieran justificación.
