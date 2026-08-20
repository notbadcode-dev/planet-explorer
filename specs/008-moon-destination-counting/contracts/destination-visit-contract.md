---

title: "Contrato: core/destination-visit"
feature: "008-moon-destination-counting"
type: "contract"
version: "1.0"
created: "2026-08-20"
updated: "2026-08-20"
status: "Draft"
spec: "./spec.md"
------------------------------------------------------------

# Contrato: `core/destination-visit`

API pública y garantías del nuevo módulo puro que coordina la secuencia de retos
de una visita a un destino con contenido (inicialmente, solo "moon"). Sin
dependencia de `phaser` (regla R1 de `docs/conventions/architecture/game-engine-scenes.md`).

## Superficie pública

```ts
function createDestinationVisit(
    destinationId: string,
    challengeConfigs: readonly CountingChallengeConfig[],
    skillLevel: number,
): DestinationVisitState;

function getCurrentChallenge(visit: DestinationVisitState): Challenge;

function getAnswerOptions(visit: DestinationVisitState): readonly number[];

function submitAnswer(
    visit: DestinationVisitState,
    skillState: SkillProgressState,
    answer: number,
): {
    visit: DestinationVisitState;
    skillState: SkillProgressState;
    outcome: SkillUpdateResult;
};
```

## Garantías

- **G1 (secuencia fija al entrar)**: `createDestinationVisit` genera de una sola
  vez todos los `Challenge` de `challengeConfigs` (uno por config, vía
  `generateChallenge` de `007`), aplicando `skillLevel` como `difficulty`. La
  secuencia resultante nunca se regenera mientras la visita esté activa
  (FR-014).
- **G2 (reintento sin regenerar)**: si `submitAnswer` devuelve `outcome ===
  'failure'`, `visit.currentIndex` no cambia y `getCurrentChallenge(visit)` sigue
  devolviendo el mismo reto (FR-004/FR-006) — no hay límite de reintentos.
- **G3 (avance solo tras acierto)**: si `outcome === 'success'`,
  `visit.currentIndex` avanza en 1 respecto al valor recibido (FR-011).
- **G4 (finalización)**: cuando un acierto hace que `currentIndex` supere el
  último índice de `challenges`, `visit.status` pasa a `'completed'` (FR-003/FR-009).
- **G5 (actualización de habilidad en cada intento)**: `submitAnswer` invoca
  siempre `updateSkillProgress(skillState, 'counting', outcome)` — tanto en
  aciertos como en fallos (FR-007, clarificación Q2) — y devuelve el
  `skillState` resultante sin mutar el original (inmutabilidad, mismo patrón que
  `006`).
- **G6 (pureza)**: ninguna función de este módulo depende de `phaser`, del DOM,
  ni de temporizadores; mismas entradas producen los mismos resultados salvo la
  aleatoriedad ya inherente a `generateChallenge`/`getAnswerOptions` (distractores).
  `getAnswerOptions` MAY devolver un conjunto de distractores distinto en cada
  llamada (p. ej., tras un reintento); el valor correcto
  (`challenge.correctAnswer`) permanece invariante mientras `currentIndex` no
  cambie — esto no constituye un reinicio del reto a efectos de FR-005.

## Notas de uso

- `overlay/challenge-dialogue.ts` MUST NOT renderizar directamente
  `challenge.question` (texto genérico del motor `007`, p. ej. "¿Cuántas
  estrellas ves?"); la narrativa visible al jugador MUST proceder únicamente
  del `Bot6Message` vigente, para preservar SC-002 (100% de los retos
  envueltos en narrativa).

## Errores

- `createDestinationVisit` propaga cualquier error lanzado por `generateChallenge`
  ante una `CountingChallengeConfig` inválida (mismo comportamiento que `007`, sin
  wrapping adicional).
- `submitAnswer` propaga cualquier error lanzado por `validateAnswer` ante una
  respuesta `null`/no numérica (mismo comportamiento que `007`).
- Llamar a `getCurrentChallenge`/`getAnswerOptions` con `visit.status ===
  'completed'` es un uso indebido de la API (el llamador —`DestinationScene`—
  MUST comprobar `status` antes de pedir el reto actual); no se define
  comportamiento de recuperación automática.

## Consumidores previstos

- `src/game/scenes/DestinationScene.ts`: crea la visita al entrar (si el destino
  tiene `challengeConfigs`), monta `overlay/challenge-dialogue.ts` con el reto y
  las opciones actuales, y llama a `submitAnswer` al pulsar una opción.
