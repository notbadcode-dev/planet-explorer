---

title: "Dificultad adaptativa v1"
feature: "009-adaptive-difficulty-v1"
type: "implementation-plan"
version: "1.0"
created: "2026-08-20"
updated: "2026-08-20"
status: "Draft"
spec: "./spec.md"
tags: ["game", "education", "progression", "challenges"]
dependencies: ["006-skill-progress-model", "007-challenge-engine-core"]
related_specs: ["008-moon-destination-counting"]
------------------------------------------------------------

# Plan de implementación: Dificultad adaptativa v1

**Rama**: `009-quiero-implementar-una` | **Fecha**: 2026-08-20 | **Especificación**: [spec.md](./spec.md)

**Entrada**: Especificación de funcionalidad de `/specs/009-adaptive-difficulty-v1/spec.md`

## Resumen

Añadir un nuevo módulo puro `core/difficulty/` con una única función pública,
`getDifficultyConfig(challengeType, skillLevel)`, que mapea de forma explícita y
determinista el nivel de dominio actual de una habilidad (1-10, ya mantenido por
`006-skill-progress-model`) a una `ChallengeConfig` completa y lista para pasar
directamente a `generateChallenge()` (`007-challenge-engine-core`), incluyendo el
campo `difficulty` (clarificación FR-002a). Se define el mapeo para el tipo
`counting` (rango `min`/`max` estrictamente más amplio cuanto mayor es el nivel).
`008-moon-destination-counting` deja de usar un rango `min`/`max` fijo como dato de
contenido y pasa a derivarlo de esta función (FR-008). Como deuda técnica previa
(retrospectiva R001), se corrige `challenge-engine.ts` para usar un patrón de
registro por tipo de reto (R2) y eliminar su import directo de
`progress/skill-progress-state.constants` (R5), sin cambiar su contrato público.

## Contexto técnico

**Lenguaje/Versión**: TypeScript 5 (`strict` mode, ya configurado en `tsconfig.json`)

**Dependencias principales**: ninguna nueva — reutiliza `006-skill-progress-model`
y `007-challenge-engine-core` ya construidos, sin dependencias npm adicionales

**Almacenamiento**: N/A — función pura sin persistencia; no introduce ningún campo
persistido nuevo (NFR-002)

**Testing**: Vitest (unit sobre `core/`, mismo patrón que `004`/`005`/`006`/`007`/`008`)

**Plataforma objetivo**: navegadores modernos, GitHub Pages estático (sin backend)

**Tipo de proyecto**: web-app (módulo puro de `core/`, sin UI propia)

**Objetivos de rendimiento**: N/A — mapeo O(1) (búsqueda en registro + aritmética
simple), sin impacto medible sobre los 60 fps ya garantizados por `004`

**Restricciones**: compatible con GitHub Pages; sin nuevas dependencias npm; sin
literales mágicos fuera de `*.constants.ts` (`scripts/check-components.mjs`);
`core/` sin import de `phaser` (regla R1 de `game-engine-scenes.md`);
`core/challenge-engine/` MUST NOT importar directamente `core/progress/` tras la
corrección de R5 (regla R5 de `challenge-engine-contract.md`)

**Escala/Alcance**: 1 tipo de reto con mapeo definido (`counting`), 10 niveles de
dominio soportados (1-10); la corrección de deuda técnica afecta a un único
fichero existente (`challenge-engine.ts`) sin nuevos tipos de reto

## Comprobación de la constitución

> **GATE**: Debe superarse antes de iniciar la Fase 0 de investigación. Debe volver a comprobarse después de la Fase 1 de diseño.

* **I. Experiencia centrada en el niño**: cumple — ninguna bajada de dificultad se
  comunica al jugador como fracaso o penalización (FR-006); no se introduce
  ninguna UI nueva que pudiera exponerlo (Suposiciones de spec.md).
* **II. Juego antes que ejercicio**: N/A directo — esta feature no presenta
  contenido al jugador; solo ajusta parámetros de configuración consumidos por
  `007`/`008`, que ya cumplen este principio.
* **III. Astronomía real**: N/A — sin contenido astronómico nuevo.
* **IV. Progresión adaptativa por habilidades**: cumple — es la implementación
  directa del principio (FR-001 a FR-004, FR-010); el tiempo de respuesta no es
  un parámetro de entrada de la función (FR-005); la dificultad depende del
  nivel de dominio por habilidad, no del destino (FR-008 sustituye el último
  vestigio de dificultad fija por destino que quedaba en `008`).
* **V. Destinos, expediciones, misiones**: N/A — esta feature no modifica la
  estructura de contenido, solo cómo se calculan los parámetros de un reto ya
  existente.
* **VI. Simplicidad primero**: cumple — se reutiliza el nivel de dominio ya
  existente en `SkillProgressState` (006) en vez de introducir un histórico
  nuevo (Suposición de spec.md); el mapeo nivel→rango es una fórmula lineal
  simple, no una tabla de datos ni un sistema de ML; el registro de R2 introduce
  la abstracción mínima necesaria (un `Record`) para un patrón ya exigido por un
  contrato existente, no una capa especulativa nueva.
* **VII. Separación entre lógica y renderizado**: cumple — `core/difficulty/` es
  un módulo puro sin `phaser`, testeable en Vitest; ninguna escena Phaser conoce
  el cálculo de dificultad (se sigue resolviendo en `core/`).
* **VIII. Desarrollo incremental**: cumple — cierra la deuda pendiente ya
  documentada explícitamente en `007/spec.md` y en el plan de `008`
  ("`009` sustituirá este rango fijo"), sin anticipar funcionalidad de specs
  futuras (`010`, `042`).
* **IX. Contenido dirigido por datos**: cumple — el mapeo nivel→rango es una
  regla explícita y testable (principio IX, "generación procedural MUST estar
  limitada mediante reglas explícitas y testables"), y `destinations.constants.ts`
  deja de embeber un valor de dificultad fijo que no le correspondía como
  contenido.
* **Componentes compartidos**: N/A — sin UI ni componentes de `libs/components/`.

No se detectan violaciones bloqueantes de `constitution.md`. La corrección de R2/R5
(deuda técnica de la retrospectiva R001) no introduce ninguna abstracción nueva más
allá de la ya exigida por `docs/conventions/architecture/challenge-engine-contract.md`
desde su creación; se documenta como corrección, no como violación nueva.

## Investigación técnica

* **Fórmula concreta de mapeo nivel→rango para `counting`**: debe ser explícita,
  determinista, estrictamente monótona en niveles intermedios (SC-001/SC-002) y
  simple (principio VI). Decisión final en `research.md`.
* **Forma mínima de un patrón de registro para `generateChallenge()` con un único
  tipo de reto registrado hoy (R2)**: cómo introducirlo sin sobre-diseñar para
  tipos que aún no existen. Decisión final en `research.md`.
* **Cómo eliminar el import directo de `../progress/skill-progress-state.constants`
  en `challenge-engine.ts` sin romper la compatibilidad de tipos con
  `SkillUpdateResult` (R5)**: dónde deben vivir las constantes de resultado.
  Decisión final en `research.md`.
* **Impacto en el contrato de `createDestinationVisit` (008)**: cómo widen su
  segundo parámetro para dejar de depender de `min`/`max` como dato de contenido
  sin romper las garantías G1-G6 ya documentadas en
  `specs/008-moon-destination-counting/contracts/destination-visit-contract.md`.
  Decisión final en `research.md`.

## Decisiones técnicas

### Nuevo módulo puro `core/difficulty/`

**Decisión**: Crear `src/game/core/difficulty/` (mismo patrón que
`navigation/`, `progress/`, `challenge-engine/`, `destination-visit/`) con una
única función pública `getDifficultyConfig(challengeType: string, skillLevel:
number): ChallengeConfig`, un registro interno `Record<string, (skillLevel:
number) => ChallengeConfig>` con una entrada para `'counting'`, y validación de
`skillLevel` (1-10) y de `challengeType` (debe existir en el registro).

**Motivo**: regla R3 de `challenge-engine-contract.md` exige que la configuración
de dificultad proceda de un módulo dedicado, nunca hardcodeada por destino o
escena; un módulo puro nuevo sigue el mismo patrón ya establecido por el resto de
`core/` (principio VII, consistencia arquitectónica).

**Alternativas descartadas**: (a) añadir la función dentro de
`core/progress/skill-progress-state.ts` — mezclaría dos responsabilidades
distintas (progreso del jugador vs. cálculo de dificultad de un reto) y
obligaría a `progress/` a conocer tipos de `challenge-engine/`, invirtiendo la
dirección de dependencia sin necesidad; (b) añadir la función dentro de
`core/challenge-engine/` — acoplaría el motor genérico a la fuente concreta de
sus parámetros de dificultad, cuando el propio contrato (R3) exige que sea un
módulo separado e intercambiable.

### Fórmula de mapeo nivel → dificultad para "counting"

**Decisión**: Fórmula lineal simple, sin tabla de datos: `min` permanece
constante (`DIFFICULTY_COUNTING_MIN_VALUE = 1`) en todos los niveles; `max` crece
un paso fijo por nivel (`max(level) = DIFFICULTY_COUNTING_MAX_BASE +
(level - 1) * DIFFICULTY_COUNTING_MAX_STEP`, con base `3` y paso `1`, produciendo
`max` de `3` en nivel 1 a `12` en nivel 10). `difficulty` se fija igual a
`skillLevel` (FR-002a). El resultado es estrictamente creciente en `max` en cada
paso de nivel (SC-001/SC-002), sin necesidad de una tabla explícita por nivel.

**Motivo**: satisface FR-002 (mapeo explícito y determinista) con la solución más
simple posible (principio VI); una fórmula de dos constantes es más fácil de
razonar, testear y ajustar en el futuro (`042-difficulty-tuning-v2`) que una
tabla de 10 entradas sin ninguna relación funcional entre ellas.

**Alternativas descartadas**: (a) tabla explícita `Record<SkillLevel,
{min,max}>` con 10 entradas literales — más verboso sin aportar flexibilidad
real hoy (YAGNI); se reconsiderará si `042` introduce curvas no lineales; (b)
cualquier forma de aprendizaje automático o heurística no determinista —
prohibido explícitamente por el objetivo de la feature y por el principio VI.

### Patrón de registro en `generateChallenge()` (corrección R2)

**Decisión**: Sustituir el `if (config.type === CHALLENGE_TYPE_COUNTING) {...}`
actual de `generateChallenge()` por un `Record<string, (config: ChallengeConfig)
=> Challenge>` (`CHALLENGE_GENERATORS`) con una única entrada registrada hoy
(`counting` → `generateCountingChallenge`). `generateChallenge()` pasa a hacer
únicamente `const generator = CHALLENGE_GENERATORS[config.type]; if (!generator)
throw ...; return generator(config);`.

**Motivo**: cumple literalmente la regla R2 de `challenge-engine-contract.md`
("cada tipo de reto se registra mediante un patrón de registro, no mediante una
cadena creciente de `if`/`switch`"), preparando el terreno para `014`-`020`/`053`
sin que ninguna de esas specs futuras tenga que tocar el núcleo del motor
(principio IX, R5 de `game-engine-scenes.md`). No cambia el contrato público
(`generateChallenge`/`validateAnswer` mantienen su firma), por lo que no rompe a
ningún consumidor existente (`008`).

**Alternativas descartadas**: introducir ya una API de "registro dinámico"
(`registerChallengeType(type, generator)`) exportada públicamente — sobre-diseño
para un único tipo de reto existente hoy (principio VI, YAGNI); se puede migrar a
esa forma cuando una spec de tipo de reto concreta lo necesite realmente.

### Eliminar el acoplamiento directo con `progress/` en `challenge-engine.ts` (corrección R5)

**Decisión**: Definir dos nuevas constantes locales en
`challenge-engine.constants.ts` (`CHALLENGE_RESULT_SUCCESS = 'success'`,
`CHALLENGE_RESULT_FAILURE = 'failure'`) y usarlas dentro de `validateAnswer()` en
lugar de importar `SKILL_UPDATE_RESULT_SUCCESS`/`SKILL_UPDATE_RESULT_FAILURE`
desde `../progress/skill-progress-state.constants`. El tipo `SkillUpdateResult`
ya vive en `challenge-engine.type.ts` (no en `progress/`), por lo que esta
corrección no requiere mover ningún tipo, solo las dos constantes de valor.

**Motivo**: cumple literalmente la regla R5 de `challenge-engine-contract.md`
("el motor de retos MUST NOT importar directamente el modelo de progreso...
para evitar acoplamiento circular entre módulos de `core/`"). Los valores
`'success'`/`'failure'` son literales de cadena estables ya fijados por el tipo
union `SkillUpdateResult`; definirlos localmente en ambos módulos no introduce
riesgo real de divergencia (ambos son readonly y cubiertos por tests).

**Alternativas descartadas**: (a) mover `SkillUpdateResult` y sus constantes a
un tercer módulo compartido neutral — sobre-diseño para dos constantes de texto
que ya son estables desde `006`/`007` (principio VI); (b) dejar el acoplamiento
tal cual — incumple explícitamente R5 y el hallazgo ya documentado en R001.

### Integración con `core/destination-visit/` (`008`)

**Decisión**: `createDestinationVisit` (008) deja de recibir
`CountingChallengeConfig[]` con `min`/`max` ya fijados; su segundo parámetro pasa
a ser `readonly ChallengeConfig[]` (solo `type`, sin `min`/`max`/`difficulty`), y
la generación de cada reto pasa de `generateChallenge({ ...config, difficulty:
skillLevel })` a `generateChallenge(getDifficultyConfig(config.type,
skillLevel))`. `destinations.constants.ts` simplifica `createMoonChallengeConfigs()`
para devolver solo `{ type: 'counting' }` por entrada, eliminando las constantes
`MOON_COUNTING_MIN`/`MOON_COUNTING_MAX` (ya sin uso, FR-008).

**Motivo**: FR-008 exige sustituir el rango fijo de `008` por el valor derivado
de esta feature; el resto de garantías ya documentadas en
`destination-visit-contract.md` (G1-G6) no cambian de comportamiento observable
(la secuencia sigue generándose una sola vez al entrar, con el mismo número de
retos). Se documenta aquí, en el plan de `009`, en vez de reescribir
retroactivamente los artefactos ya `Implemented` de `008` (coherente con el
tratamiento ya dado por la propia retrospectiva R001, que solo recomienda
acciones hacia adelante).

**Alternativas descartadas**: mantener `min`/`max` en `destinations.constants.ts`
como "valor por defecto" ignorado en tiempo de ejecución — dejaría datos muertos
y confusos en el contenido, contradiciendo el principio IX.

## Estrategia de pruebas

* **Unit**: `core/difficulty/difficulty.test.ts` (Vitest, sin Phaser) — mapeo
  estrictamente creciente de `max` entre niveles consecutivos 1-10 (SC-001),
  `difficulty` igual al nivel solicitado (FR-002a), configuración estable en los
  límites 1 y 10 (FR-010), excepción clara ante nivel fuera de 1-10 (FR-009) y
  ante tipo de reto sin mapeo definido (FR-009a), y verificación de que la
  configuración devuelta es directamente aceptada por `generateChallenge()`
  (FR-007, test de integración ligera dentro del mismo fichero). Actualización de
  `core/challenge-engine/challenge-engine.test.ts` para cubrir el registro (R2:
  mismo comportamiento externo, más un caso de tipo no registrado) y confirmar
  ausencia de import de `progress/` (R5, aserción estática vía lectura de
  imports o comentario de test dedicado). Actualización de
  `core/destination-visit/destination-visit-state.test.ts` para el nuevo rango
  derivado en vez del fijo anterior.
* **Integration**: N/A dedicada — la integración `destination-visit` ↔
  `difficulty` ↔ `challenge-engine` se valida vía los unit tests de arriba y
  `quickstart.md` (mismo criterio que `008`, sin Playwright todavía).
* **Contract**: `contracts/difficulty-contract.md` describe la API pública y
  garantías (G1-G5) del nuevo módulo; verificado por los unit tests de arriba.
* **E2E**: N/A — fuera de alcance hasta `034-automated-e2e-testing`.

## Estructura del proyecto

### Documentación de esta funcionalidad

```text
specs/009-adaptive-difficulty-v1/
├── spec.md              # Especificación funcional (/speckit-specify)
├── plan.md              # Este fichero (/speckit-plan)
├── research.md          # Fase 0 (/speckit-plan)
├── data-model.md         # Fase 1 (/speckit-plan)
├── quickstart.md         # Fase 1 (/speckit-plan)
├── contracts/            # Fase 1 (/speckit-plan)
└── tasks.md              # Fase 2 (/speckit-tasks - NO creado por /speckit-plan)
```

### Código fuente (raíz del repositorio)

```text
src/game/core/
├── difficulty/                              # [NUEVO] módulo de mapeo nivel → dificultad
│   ├── difficulty.ts
│   ├── difficulty.type.ts
│   ├── difficulty.constants.ts
│   └── difficulty.test.ts
├── challenge-engine/
│   ├── challenge-engine.ts                  # [MODIFICADO] registro por tipo (R2), sin import de progress/ (R5)
│   ├── challenge-engine.constants.ts        # [MODIFICADO] nuevas constantes CHALLENGE_RESULT_SUCCESS/FAILURE
│   └── challenge-engine.test.ts             # [MODIFICADO] cobertura del registro y de la ausencia de acoplamiento
├── destination-visit/
│   ├── destination-visit-state.ts           # [MODIFICADO] usa getDifficultyConfig() en vez de min/max fijo
│   └── destination-visit-state.test.ts      # [MODIFICADO] nuevo rango derivado
└── content/
    └── destinations.constants.ts            # [MODIFICADO] challengeConfigs solo con `type`, sin min/max fijo

docs/conventions/architecture/
├── challenge-engine-contract.md             # [MODIFICADO] refleja R2/R5 ya corregidas
└── game-engine-scenes.md                    # [MODIFICADO] referencia al nuevo módulo core/difficulty/
```

**Decisión de estructura**: se mantiene el layout ya fijado por
`game-engine-scenes.md` (`core/<módulo>/` puro, sin Phaser); el único directorio
nuevo es `core/difficulty/`, siguiendo el mismo patrón de módulo puro que
`navigation/`/`progress/`/`destination-visit/`.

## Modelo de datos

Ver `data-model.md` para el detalle completo. Resumen:

* **Sin entidades persistidas nuevas** — `getDifficultyConfig()` es una función
  pura sin estado propio; consume `SkillProgressState` (006, ya existente) y
  produce una `ChallengeConfig` (007, ya existente).
* **Tabla de mapeo nivel → dificultad** (conceptual, no una estructura de datos
  persistida): fórmula documentada en `data-model.md`, con una entrada de
  registro por tipo de reto soportado (`counting` en esta versión).

## Contratos e interfaces

* **`difficulty-contract.md`**: contrato de la API pública del nuevo módulo
  `core/difficulty/` (única función `getDifficultyConfig`, garantías y errores).
* Sin contratos externos (REST/eventos) nuevos — toda la comunicación es interna
  entre módulos `core/`, ya cubierta por los contratos existentes de `006`/`007`
  y por este nuevo contrato.
* El contrato ya existente `specs/008-moon-destination-counting/contracts/destination-visit-contract.md`
  no se reescribe retroactivamente; el cambio de firma de `createDestinationVisit`
  se documenta hacia adelante en este `plan.md` (sección "Decisiones técnicas") y
  en `data-model.md`.

## Riesgos y compromisos

* **Cambio de comportamiento observable en el destino Luna**: al sustituir el
  rango fijo (`min: 2, max: 8`) por el derivado del nivel de dominio, los retos
  del destino Luna serán más fáciles que antes en niveles bajos (p. ej. nivel 1:
  `min 1, max 3`) y más difíciles en niveles altos (nivel 10: `min 1, max 12`).
  Es el efecto perseguido explícitamente por esta feature (FR-008), no una
  regresión; se deja constancia para que `/speckit-implement` no lo interprete
  como un error de los tests existentes de `008` que deban revertirse.
* **Segundo tipo de reto sin mapeo definido**: cualquier feature futura
  (`014`-`020`, `053`) que registre un nuevo tipo en `challenge-engine.ts` (R2)
  MUST también añadir su propia entrada en el registro de `core/difficulty/`
  antes de poder generar retos de ese tipo con dificultad adaptativa — en caso
  contrario, `getDifficultyConfig()` lanza una excepción clara (FR-009a). Se deja
  documentado aquí para que no se interprete como una limitación oculta.

## Seguimiento de complejidad

No se detectan violaciones de `constitution.md` que requieran justificación en
esta tabla. Los dos registros (`Record`) introducidos (uno en `core/difficulty/`,
otro como corrección R2 en `core/challenge-engine/`) sustituyen patrones
`if`/tabla ad-hoc ya exigidos por contratos existentes, no añaden una capa nueva
de abstracción especulativa.
