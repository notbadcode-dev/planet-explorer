---

title: "Investigación técnica: Destino: la Luna con retos de conteo"
feature: "008-moon-destination-counting"
type: "research"
version: "1.0"
created: "2026-08-20"
updated: "2026-08-20"
status: "Draft"
spec: "./spec.md"
------------------------------------------------------------

# Investigación técnica (Fase 0)

## 1. Origen de `min`/`max` para los retos `counting` sin `009` construida

**Pregunta**: `docs/conventions/architecture/challenge-engine-contract.md` (R3)
exige que el rango de un `ChallengeConfig` proceda del futuro módulo de dificultad
adaptativa (`009-adaptive-difficulty-v1`/`042`). Esa spec no existe todavía y no es
dependencia de `008`. ¿Cómo generar retos de conteo reales sin ella?

**Decisión**: Usar un rango fijo (`min`/`max`) como dato de contenido del destino
Luna (constante en `destinations.constants.ts`), y pasar el nivel de dominio actual
de "counting" (`SkillDomain.level`, 1-10) directamente como campo `difficulty` de
`CountingChallengeConfig` en el momento de generar cada reto (mismo rango 1-10, sin
conversión).

**Motivo**: `specs/007-challenge-engine-core/spec.md` ya sienta este precedente
textualmente: "la dificultad (campo `difficulty`) es un parámetro de configuración,
no se calcula automáticamente en este motor; futuras features como
`009-adaptive-difficulty-v1` pueden usarla para ajustar futuras configuraciones."
`008` no inventa un mecanismo nuevo: simplemente es el primer consumidor real de
ese campo ya definido. Cuando `009` exista, sustituirá el rango fijo por un cálculo
real sin tocar el contrato de `CountingChallengeConfig` (mismos campos).

**Alternativas descartadas**:
- Construir ya un mini-módulo de "dificultad adaptativa" dentro de `008` — duplica
  el trabajo de la futura `009`/`042` y viola el principio VI (YAGNI, evitar
  abstracciones anticipadas sin 2+ casos de uso reales).
- Hardcodear `min`/`max` iguales para todos los niveles de habilidad — no
  respondería a FR-014 ("usando el nivel de habilidad del jugador en ese momento").

## 2. Generación de opciones de respuesta múltiples (distractores)

**Pregunta**: FR-013 exige presentar la respuesta como opciones numéricas
seleccionables (botones), pero el motor de `007` solo expone `generateChallenge` y
`validateAnswer` — no genera candidatos de respuesta incorrectos ni sabe nada de
presentación (por diseño, contrato agnóstico de tipo).

**Decisión**: Añadir una función pura nueva, `getAnswerOptions(visit)`, dentro del
nuevo módulo `core/destination-visit/`, que a partir de `challenge.correctAnswer`
genera 3 distractores numéricos cercanos (evitando duplicados y valores fuera de
`[MIN_COUNTING_VALUE, ...]`) y devuelve las 4 opciones mezcladas.

**Motivo**: Es lógica de juego pura (principio VII), pero específica de cómo *este*
destino presenta un reto de tipo `counting` con respuesta numérica — no es una
responsabilidad genérica del motor `007` (su contrato dice explícitamente que no
debe conocer detalles de presentación). Colocarla junto a la coordinación de la
visita (en vez de dentro de `007`) evita acoplar el motor ya cerrado/"Implemented"
a una decisión de UI de un único destino.

**Alternativas descartadas**:
- Añadir `getAnswerOptions` al motor de `007` — rompe su contrato de neutralidad de
  presentación y obligaría a reabrir una spec ya implementada para un caso de uso
  todavía único.
- Generar los distractores directamente en `challenge-dialogue.ts` (overlay) — el
  overlay vive fuera de `core/` y no puede ser válido bajo Vitest sin DOM;
  violaría la regla de mantener lógica de juego fuera de la capa de presentación.

## 3. Composición del overlay de reto con componentes ya existentes

**Pregunta**: ¿Hace falta un componente nuevo en `libs/components/` para mostrar
narrativa + items a contar + opciones de respuesta?

**Decisión**: No. `DialogProps.content` y `DialogProps.actions` (ambos
`HTMLElement | HTMLElement[]`, confirmado en `libs/components/dialog/Dialog.type.ts`)
son suficientes: `content` aloja un `Icon 'star'` por elemento a contar, `actions`
aloja un `Button` por opción de respuesta. Se crea `overlay/challenge-dialogue.ts`
como composición feature-specific, igual patrón que `overlay/bot6-dialogue.ts`.

**Motivo**: cumple la regla de la constitución de no crear un componente
compartido nuevo sin que exista ya un caso de uso repetido (principio VI); la
composición reutiliza primitivas ya construidas y probadas (`003`).

**Alternativas descartadas**:
- Crear `AnswerOptions`/`CountingBoard` en `libs/components/` — un único caso de
  uso real (este destino) no justifica una abstracción compartida todavía.

## Resumen de decisiones

| # | Tema                                   | Decisión                                                        |
| - | --------------------------------------- | ---------------------------------------------------------------- |
| 1 | Rango de dificultad sin `009`            | Rango fijo como dato + `difficulty` = nivel de habilidad actual  |
| 2 | Opciones de respuesta múltiples          | Nueva función pura en `core/destination-visit/`                  |
| 3 | Overlay de reto                          | Composición `Dialog`+`Icon`+`Button`, sin componente nuevo        |
