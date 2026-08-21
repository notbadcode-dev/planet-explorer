---

title: "Contrato: Pistas (hints) — extensión de core/challenge-engine y core/destination-visit"
feature: "010-hints-and-retry-flow"
type: "contract"
version: "1.0"
created: "2026-08-21"
updated: "2026-08-21"
status: "Draft"
spec: "./spec.md"
------------------------------------------------------------

# Contrato: Pistas (hints)

Extiende `specs/007-challenge-engine-core/contracts/challenge-interface.md` y
`specs/008-moon-destination-counting/contracts/destination-visit-contract.md`
sin romper ninguna de sus garantías existentes (G1-G6). Sin dependencia de
`phaser` (regla R1 de `docs/conventions/architecture/game-engine-scenes.md`).

## Superficie pública nueva

```ts
// core/challenge-engine/challenge-engine.ts
function requestHint(challenge: Challenge, hintIndex: number): Hint | undefined;

// core/destination-visit/destination-visit-state.ts
function requestNextHint(
    visit: DestinationVisitState,
    skillState: SkillProgressState,
): {
    visit: DestinationVisitState;
    skillState: SkillProgressState;
    hint: Hint | undefined;
};
```

## Garantías

- **H1 (acceso puro y genérico)**: `requestHint` es una función pura,
  independiente del tipo de reto (`challenge.type`); no usa el patrón de
  registro de `generateChallenge` (R2) porque no varía por tipo — simplemente
  indexa `challenge.hints` (R1 de `challenge-engine-contract.md`).
- **H2 (sin pistas = `undefined`)**: si `challenge.hints` es `undefined`, un
  array vacío, o `hintIndex >= challenge.hints.length`, `requestHint` devuelve
  `undefined` sin lanzar excepción (uso normal, no un error).
- **H3 (progresión sin repetición)**: llamadas sucesivas a `requestNextHint`
  con `hintIndex` creciente (gestionado internamente vía
  `hintsRevealedCount`) nunca devuelven la misma pista dos veces mientras
  existan pistas no reveladas (FR-005).
- **H4 (neutralidad garantizada)**: `requestNextHint` invoca
  `updateSkillProgress(skillState, skill, 'hint-used')` **únicamente** cuando
  `requestHint` devuelve una `Hint` real (no en el caso `undefined` de H2);
  esa llamada nunca modifica `level` ni `failureCount` de la habilidad (006,
  regla N4) — verificado por test de regresión dedicado.
- **H5 (independencia de la respuesta final)**: solicitar una pista MUST NOT
  modificar `visit.currentIndex`, `visit.status` ni `visit.lastOutcome`; solo
  `visit.hintsRevealedCount` cambia. La validación de la respuesta final
  (`submitAnswer`, ya existente) no requiere ningún parámetro nuevo y su
  comportamiento no cambia por haber pedido pistas.
- **H6 (reinicio en nuevo reto)**: cuando `submitAnswer` avanza
  `currentIndex` tras un acierto, el `DestinationVisitState` resultante tiene
  `hintsRevealedCount === 0` (pistas frescas para el siguiente reto). Un
  fallo (reintento) no reinicia `hintsRevealedCount`.
- **H7 (pureza)**: ninguna función de este contrato depende de `phaser`, del
  DOM ni de temporizadores; mismas entradas producen los mismos resultados
  (sin aleatoriedad, a diferencia de `generateChallenge`/`getAnswerOptions`).

## Errores

- `requestHint`/`requestNextHint` NUNCA lanzan una excepción por ausencia de
  pistas o por agotamiento de la secuencia — es un camino de uso normal (H2),
  no una condición de error.
- `requestNextHint` propaga cualquier excepción que `updateSkillProgress`
  pudiera lanzar ante una habilidad inválida (mismo comportamiento ya definido
  por `006`); en la práctica no ocurre en uso normal porque
  `destination-visit-state.ts` siempre pasa la habilidad fija ya validada
  (`SKILL_COUNTING_ID`, mismo patrón que `submitAnswer`).

## Notas de uso (UI)

- `overlay/challenge-dialogue.ts` MUST mostrar el botón "Pedir pista" (variante
  `'secondary'`, nunca `'danger'`) únicamente cuando: (a) el reto actual tiene
  al menos una `Hint` definida, y (b) se está mostrando tras un fallo (rama de
  reintento de `DestinationScene`) — nunca en el primer intento de un reto
  (FR-003, edge case de `spec.md`).
- Cuando `hintsRevealedCount === challenge.hints.length` (todas las pistas ya
  reveladas), el botón MUST sustituirse por un texto amable fijo en vez de
  desaparecer sin explicación (FR-005).
- Las pistas ya reveladas se muestran como contenido adicional del mismo
  diálogo (mismo patrón de composición Dialog + Icon + Button que `008`), sin
  crear un overlay nuevo.

## Consumidores previstos

- `src/game/scenes/DestinationScene.ts`: al mostrar el reto en la rama de
  reintento, pasa `hints`/`hintsRevealedCount`/`onRequestHint` a
  `createChallengeDialogue`; al pulsar "Pedir pista", llama a
  `requestNextHint(visit, skillState)`, actualiza su estado local
  (`destinationVisitState`, `skillProgressState`) y vuelve a renderizar el
  diálogo con la pista revelada.
