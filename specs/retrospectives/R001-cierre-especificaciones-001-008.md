---
id: 'R001'
type: 'retrospective'
date: '2026-08-20'
scope:
    from: '001'
    to: '008'
    additionally_review: []
specs_reviewed:
    - '001-component-library-architecture'
    - '002-button-variants'
    - '003-shared-components-base'
    - '004-core-game-loop'
    - '005-bot6-narrative-shell'
    - '006-skill-progress-model'
    - '007-challenge-engine-core'
    - '008-moon-destination-counting'
status: 'Completed'
---

# Retrospectiva R001 — Cierre de especificaciones 001 a 008

## Resumen ejecutivo

El proyecto está razonablemente consistente: no se han encontrado contradicciones
confirmadas entre las 8 specs implementadas, ni modelos/contratos compartidos rotos
de forma incompatible. Sí existe deuda relevante pero acotada: la implementación
real de `007-challenge-engine-core` y `008-moon-destination-counting` diverge en dos
puntos concretos de los documentos de arquitectura anticipada
(`docs/conventions/architecture/challenge-engine-contract.md` y
`game-engine-scenes.md`), y esos documentos siguen en `status: Draft` sin
actualizarse pese a que las specs que implementan lo que anticipaban ya están
`Implemented`. Ninguno de los hallazgos exige detener el trabajo, pero conviene
corregir el motor de retos antes de que se acumulen más tipos de reto (specs
014-020, 053) sobre el mismo patrón.

## Hallazgos por categoría

### 1. Contradicciones confirmadas entre specs

Sin hallazgos. Las dependencias declaradas (004←001/002/003, 006←004, 007←006,
008←006/007) son consistentes con el contenido real de cada `spec.md`, y no se ha
encontrado ningún requisito funcional que una spec implementada contradiga
directamente en otra.

### 2. Modelos/entidades compartidos modificados de forma incompatible

Sin hallazgos bloqueantes. `SceneInitData` (`src/game/core/navigation/navigation-state.type.ts`,
definido en 004) fue extendido por 008 con el campo `skillProgressState` de forma
aditiva y compatible; no rompe a los consumidores existentes (`MapScene`,
`main.ts`). `SkillUpdateResult` (definido en 006) es reutilizado sin modificación
por 007 y 008.

### 3. Contratos compartidos modificados de forma incompatible

**Hallazgo (Importante)**: la implementación real de `007-challenge-engine-core`
viola dos reglas explícitas de `docs/conventions/architecture/challenge-engine-contract.md`
(documento de arquitectura anticipada, fuente normativa declarada para 007):

- **R2** de ese documento exige que cada tipo de reto se registre mediante un
  patrón de registro, "no mediante una cadena creciente de `if`/`switch` en el
  núcleo del motor". La implementación real
  (`src/game/core/challenge-engine/challenge-engine.ts`, función `generateChallenge`)
  usa exactamente ese `if (config.type === CHALLENGE_TYPE_COUNTING) { ... }` que la
  convención prohíbe. Con un único tipo de reto (`counting`) hoy no causa un
  problema visible, pero las specs `014` a `020` y `053` (más tipos de reto)
  replicarán el mismo patrón si no se corrige antes.
- **R5** de ese documento exige que "el motor de retos MUST NOT importar
  directamente el modelo de progreso... para evitar acoplamiento circular entre
  módulos de `core/`". `challenge-engine.ts` importa directamente
  `SKILL_UPDATE_RESULT_FAILURE`/`SKILL_UPDATE_RESULT_SUCCESS` desde
  `../progress/skill-progress-state.constants`, en vez de pasar por una capa de
  coordinación explícita. Hoy no es circular (`progress/` no importa
  `challenge-engine/`), pero es exactamente el acoplamiento directo que la regla
  prohíbe, y sienta un precedente para los consumidores futuros (009, 010).

### 4. Decisiones arquitectónicas transversales

**Hallazgo (Importante)**: los 3 documentos de "decisión anticipada" en
`docs/conventions/architecture/` (`game-engine-scenes.md`,
`challenge-engine-contract.md`, `progress-persistence-model.md`) siguen con
`status: "Draft"` y `updated: "2026-08-16"`/`"2026-08-17"`, sin ninguna
actualización desde que las specs 004-008 que implementan lo que anticipaban
pasaron a `status: "Implemented"`. Cada uno de ellos declara explícitamente: "Se
actualizará (nunca se contradirá silenciosamente) en cuanto la primera
implementación real revele un ajuste necesario" — y eso es justo lo que ha
ocurrido sin registrarse:

- El layout propuesto en `game-engine-scenes.md` nombra la carpeta del motor de
  retos `core/challenges/`; la implementación real usa
  `src/game/core/challenge-engine/`. Nombre distinto al anticipado.
- El módulo `src/game/core/destination-visit/` (nuevo en 008) no figura en el
  layout anticipado de `game-engine-scenes.md` (evolución razonable, pero no
  reflejada).
- Los hallazgos R2/R5 de la sección anterior tampoco están reflejados como
  "ajuste necesario" en `challenge-engine-contract.md`.

Ninguno de estos tres puntos por sí solo bloquea la siguiente feature, pero juntos
indican que el mecanismo de "documento anticipado" no se está revisando cuando la
implementación real se completa, lo que reduce su utilidad como fuente de verdad
para las specs pendientes que aún dependen de él (014-020, 042, 053).

### 5. Drift terminológico

**Hallazgo (Informativo)**: `challenge-engine-contract.md` describe conceptualmente
el resultado de validar una respuesta como `ChallengeResult`, con forma
estructurada ("distingue: correcto/incorrecto, número de intentos, pistas usadas").
La implementación real (006/007) usa `SkillUpdateResult`, un string-enum plano
(`'success' | 'failure' | 'hint-used'`), sin campos de intentos ni pistas. No es una
contradicción funcional (007 nunca prometió esa forma en su propio `spec.md`, que sí
documenta correctamente `SkillUpdateResult` con dos valores relevantes para
`validateAnswer`), pero alguien que lea solo el documento de convención esperará un
tipo distinto del que existe realmente en código.

### 6. Deuda acumulada

**Hallazgo (Informativo, ya documentado — no oculto)**: `008-moon-destination-counting`
usa un rango `min`/`max` fijo por destino como dato de contenido en vez de derivar
la dificultad del módulo de dificultad adaptativa (`009-adaptive-difficulty-v1`,
aún no construido), tal como exige R3 de `challenge-engine-contract.md`. Esta
decisión ya está documentada explícitamente en `specs/008-moon-destination-counting/plan.md`
("Constitution Check: parcial por diseño") y no es una desviación silenciosa — se
incluye aquí solo para dejar constancia formal en el histórico de retrospectivas y
que `009`, cuando se implemente, sepa que debe sustituir ese valor fijo.

## Acciones recomendadas

1. **(Importante)** Corregir `challenge-engine.ts` para usar un patrón de registro
   (`Record<SkillChallengeType, ChallengeTypeHandler>` o equivalente) en vez del
   `if`/`switch` actual, y mover el resultado `success`/`failure` a devolverse sin
   importar directamente las constantes de `progress/` (p. ej. devolviendo un
   literal propio o recibiendo un mapeo por parámetro) — antes de empezar a
   implementar más tipos de reto. Vía sugerida: nueva spec pequeña o tarea de
   refactor dentro de la siguiente feature de tipo de reto (`specs_pending/014` en
   adelante) usando `/speckit-specify`, o corrección directa acordada con el
   usuario si se prefiere no abrir spec para esto.
2. **(Importante)** Actualizar `docs/conventions/architecture/game-engine-scenes.md`
   y `challenge-engine-contract.md` para reflejar la implementación real (nombre de
   carpeta `challenge-engine/`, módulo `destination-visit/`, y los ajustes de R2/R5
   una vez corregidos en la acción 1), y considerar promover su `status` de `Draft`
   a algo que indique que ya están validados por implementación real. Vía
   sugerida: `planet-docs-conventions`.
3. **(Informativo)** Al implementar `009-adaptive-difficulty-v1`, sustituir el
   `min`/`max` fijo de contenido de `008` por el valor derivado del nuevo módulo,
   tal como ya prevé su propio `plan.md`. No requiere acción ahora, solo
   seguimiento en `009`.
4. **(Informativo)** Si se desea eliminar el drift terminológico de la sección 5,
   renombrar conceptualmente en `challenge-engine-contract.md` la referencia de
   `ChallengeResult` a `SkillUpdateResult` (el nombre real), o anotar
   explícitamente que la forma estructurada con intentos/pistas queda diferida a
   cuando `010-hints-and-retry-flow` lo requiera. Vía sugerida:
   `planet-docs-conventions`.

## Baseline para la próxima retrospectiva

`to: "008"`. La próxima ejecución de `planet-retrospective-check` debe calcular
`SPECS_IMPLEMENTED_SINCE` a partir de aquí (specs `009` en adelante).
