---

title: "Investigación: Pistas y reintento sin penalización"
feature: "010-hints-and-retry-flow"
type: "research"
version: "1.0"
created: "2026-08-21"
updated: "2026-08-21"
status: "Draft"
spec: "./spec.md"
------------------------------------------------------------

# Investigación: Pistas y reintento sin penalización

## 1. ¿Dónde debe vivir `requestHint()`?

**Decisión**: Función pura genérica en `core/challenge-engine/challenge-engine.ts`
(mismo módulo que `generateChallenge`/`validateAnswer`), **sin** patrón de
registro por tipo de reto.

**Motivo**: `docs/conventions/architecture/challenge-engine-contract.md` (R4) ya
anticipaba esta operación como parte del contrato conceptual del motor:
`requestHint(challenge, hintIndex): Hint | undefined`. A diferencia de
`generateChallenge`/`validateAnswer` (que sí varían por tipo de reto y usan un
registro, R2), la lógica de "obtener la pista N de `challenge.hints`" es
idéntica para cualquier tipo de reto — es una simple indexación de array. Un
registro por tipo sería una abstracción prematura (principio VI, YAGNI) para
una operación que no tiene variación por tipo.

**Alternativas descartadas**: (a) definirla dentro de
`core/destination-visit/destination-visit-state.ts` — mezclaría una operación
de dominio del motor de retos (acceso a `challenge.hints`) con la orquestación
de la visita, cuando el propio contrato de `007` ya reserva este espacio
conceptual para el motor (R4); (b) registrarla en el mismo
`CHALLENGE_GENERATORS`-style registry que `generateChallenge` — sobre-diseño,
ya que no existe variación de comportamiento por tipo a registrar.

## 2. ¿Cómo trackear cuántas pistas se han revelado para el reto actual?

**Decisión**: Nuevo campo `hintsRevealedCount: number` en
`DestinationVisitState` (008), inicializado a `0` en `createDestinationVisit` y
reiniciado a `0` cada vez que `submitAnswer` avanza `currentIndex` tras un
acierto (nuevo reto = pistas frescas). En un fallo (reintento), el campo NO se
reinicia — las pistas ya reveladas para ese intento siguen "gastadas" y no se
repiten (FR-005/FR-010).

**Motivo**: es el equivalente exacto, para pistas, del patrón ya usado por
`currentIndex`/`lastOutcome` en el mismo estado: información derivada de la
visita en curso, sin persistencia entre sesiones (fuera de alcance, ver
Restricciones de `spec.md`). Añadir el campo aquí evita crear un tercer módulo
de estado solo para esto (principio VI).

**Alternativas descartadas**: mantener el contador como estado local de
`DestinationScene` (fuera de `core/`) — rompería la regla ya establecida de que
toda la lógica de progresión de una visita vive en `core/destination-visit/`
sin dependencia de Phaser (principio VII); el contador de pistas es tan parte
del estado de la visita como `currentIndex`.

## 3. ¿Contenido concreto de las pistas para el reto `counting` existente?

**Decisión**: Dos pistas progresivas, genéricas (no dependen del valor
concreto de `correctAnswer`, que es aleatorio), definidas como constantes en
`challenge-engine.constants.ts` y adjuntas a todo `CountingChallenge` generado:

1. "Señala cada estrella con el dedo y cuenta de una en una."
2. "Agrupa las estrellas de dos en dos: así cuentas más rápido."

**Motivo**: dos pistas son suficientes para demostrar la progresión (FR-005)
sin sobre-diseñar contenido para un único tipo de reto (principio VI, YAGNI);
al ser estrategias de conteo genéricas (no el número exacto), funcionan para
cualquier `correctAnswer` generado por `007`/`009`, evitando acoplar el
contenido de la pista al valor aleatorio del reto.

**Alternativas descartadas**: pistas que revelen parcialmente el número
correcto (p. ej. "el número está entre X e Y") — más cerca de "dar la
respuesta" que de enseñar una estrategia, lo que se aleja del espíritu
pedagógico del principio II ("juego antes que ejercicio"); contenido de pistas
data-driven en un fichero JSON separado — sobre-diseño para 2 strings en una
única feature con un único tipo de reto (principio VI).

## 4. ¿Cómo se muestra el botón "Pedir pista" en la UI sin romper el patrón visual existente?

**Decisión**: Extender `overlay/challenge-dialogue.ts` (mismo componente ya
usado por `008`) con props opcionales `hints`, `hintsRevealedCount` y
`onRequestHint`. Cuando se proporcionan y quedan pistas por revelar, se añade
un botón adicional con variante `'secondary'` (catálogo ya existente de
`libs/components/button`, `BUTTON_VARIANTS = ['primary', 'secondary',
'danger']`) junto a las opciones de respuesta (variante `'primary'`). Las
pistas ya reveladas se muestran como contenido de texto adicional dentro del
mismo diálogo, por encima de los iconos de conteo. Cuando se han revelado
todas las pistas disponibles, el botón se sustituye por un texto amable fijo
en vez de desaparecer sin explicación (FR-005).

**Motivo**: reutiliza el componente ya validado en `008` (Dialog + Button +
Icon de `libs/components/`) sin crear un overlay nuevo; `'secondary'` distingue
visualmente "pedir ayuda" de "responder" sin usar `'danger'` (rojo/alerta),
cumpliendo NFR-001/NFR-003 (nunca presentar la pista como algo negativo).

**Alternativas descartadas**: overlay HTML separado y superpuesto para pistas
— duplicaría la lógica de montaje/limpieza ya resuelta por `createDialog`, y
complicaría la coordinación con `DestinationScene` (dos elementos flotantes en
vez de uno); usar variante `'danger'` para diferenciar el botón de pista —
contradice directamente NFR-001 (nunca alertas/rojo asociadas a pedir ayuda).

## 5. ¿Cuándo se muestra el botón "Pedir pista" por primera vez?

**Decisión**: Solo tras el primer fallo del reto actual — es decir, en la
rama de reintento de `DestinationScene.handleAnswerSelected` (ya existente,
donde hoy se reconstruye el diálogo con `MOON_CHALLENGE_RETRY_MESSAGE`). El
primer intento de un reto nunca muestra el botón de pista.

**Motivo**: coincide exactamente con el criterio ya fijado en `spec.md`
("el flujo de pistas se dispara solo tras un error", casos límite) y con
FR-003 ("WHEN a player submits an incorrect answer... alongside a Request
Hint button"). No requiere ningún estado nuevo más allá del ya existente
`lastOutcome`/rama de reintento.

**Alternativas descartadas**: mostrar el botón desde el primer intento —
contradice explícitamente el edge case ya definido en `spec.md` ("¿Qué sucede
si el jugador solicita una pista sin haber fallado? Fuera de alcance").
