---
title: "Destino: la Luna con retos de conteo"
feature: "008-moon-destination-counting"
type: "feature-spec"
version: "1.1"
created: "2026-08-20"
updated: "2026-08-20"
status: "Implemented"
priority: "P1"
tags: ["game", "education", "challenges", "narrative", "planets"]
dependencies: ["004-core-game-loop", "005-bot6-narrative-shell", "007-challenge-engine-core"]
related_specs: ["006-skill-progress-model"]
---

# Especificación de funcionalidad: Destino: la Luna con retos de conteo

**Rama de la funcionalidad**: `008-quiero-convertir-destino`

**Creado**: 2026-08-20

**Estado**: Draft

**Entrada**: Descripción del usuario: "Quiero convertir el destino placeholder en la Luna, con 2-3 retos de conteo presentados como una situación narrativa junto a BOT-6 (por ejemplo, recolectar muestras), con feedback inmediato, reintento sin penalización, y actualización del nivel de dominio de la habilidad counting al terminar."

## Clarifications

### Session 2026-08-20

- Q: ¿Cómo debe responder el jugador a cada reto de conteo en el destino Luna? → A: Selección entre varias opciones numéricas mediante botones táctiles (ninguna entrada de teclado numérico ni interacción de conteo directo objeto a objeto).
- Q: ¿Los intentos fallidos durante un reintento deben contar como fallo en el modelo de progreso de la habilidad "counting"? → A: Sí, cada intento (correcto o incorrecto) llama a `validateAnswer` y actualiza el modelo de habilidad; el reintento no afecta vidas/puntuación del juego, pero sí cuenta como fallo en el modelo de dificultad adaptativa ya existente (006/007), sin reglas nuevas.
- Q: ¿La secuencia de retos del destino Luna debe generarse toda de una vez al entrar, o reto a reto según el nivel más reciente del jugador? → A: Se genera toda la secuencia (2-3 retos) de una vez al entrar al destino, usando el nivel de "counting" del jugador en ese momento; no se regenera aunque el nivel cambie durante la visita. La adaptación de dificultad dentro de una misma visita queda fuera de alcance (ver 009).

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Resolver el primer reto de conteo narrativo (Prioridad: P1)

Un jugador entra en el destino "la Luna" desde el mapa y BOT-6 le plantea una situación narrativa (por ejemplo, contar muestras recolectadas) en lugar de un ejercicio aritmético desnudo. El jugador responde correctamente y recibe feedback inmediato de acierto.

**Por qué tiene esta prioridad**: Es el primer cierre completo del vertical slice (mapa → destino real → reto educativo → resultado) y demuestra directamente el principio "juego antes que ejercicio". Sin esta historia no existe destino jugable real.

**Prueba independiente**: Puede probarse entrando en el destino Luna, verificando que el primer reto se presenta envuelto en un mensaje narrativo de BOT-6 (no como una expresión aritmética aislada), respondiendo correctamente y comprobando que aparece feedback positivo inmediato.

**Escenarios de aceptación**:

1. **Given** el jugador ha seleccionado el destino Luna desde el mapa, **When** la escena de destino se carga, **Then** BOT-6 presenta el primer reto de conteo dentro de una frase narrativa (p. ej. relacionada con recolectar muestras), no como una operación aritmética desnuda.
2. **Given** el jugador ve el primer reto narrativo, **When** responde con el valor correcto, **Then** el sistema muestra feedback inmediato de acierto y avanza al siguiente reto de la secuencia (o al estado de destino completado si era el último).

---

### Historia de usuario 2 - Reintentar un reto tras un error, sin penalización (Prioridad: P1)

Un jugador responde incorrectamente a un reto del destino Luna. El sistema le indica con claridad que la respuesta no era correcta y le permite volver a intentarlo, sin perder puntuación, vidas ni ningún otro recurso de juego.

**Por qué tiene esta prioridad**: El principio "experiencia centrada en el niño" exige feedback inmediato y reintento sin penalización; sin esta historia el error se convertiría en un castigo, contradiciendo la constitución del proyecto.

**Prueba independiente**: Puede probarse respondiendo incorrectamente a un reto del destino Luna y verificando que (a) aparece feedback de error inmediato, (b) el mismo reto sigue disponible para reintentarlo, y (c) no se observa ninguna reducción de puntuación, vidas o tiempo disponible.

**Escenarios de aceptación**:

1. **Given** el jugador ve un reto de conteo del destino Luna, **When** responde con un valor incorrecto, **Then** el sistema muestra feedback inmediato indicando que la respuesta no era correcta, sin penalizar al jugador.
2. **Given** el jugador acaba de fallar un reto, **When** observa la pantalla, **Then** el mismo reto (con su misma ambientación narrativa) sigue disponible para volver a intentarlo, sin límite de reintentos.
3. **Given** el jugador ha fallado un reto una o varias veces, **When** finalmente responde correctamente, **Then** el sistema muestra el mismo feedback de acierto que si lo hubiera resuelto a la primera y avanza al siguiente reto.

---

### Historia de usuario 3 - Completar el destino y ver reflejado el progreso en counting (Prioridad: P2)

Un jugador resuelve los 2-3 retos de conteo del destino Luna hasta el final. Al completar la secuencia, BOT-6 confirma la finalización del destino y el nivel de dominio de la habilidad "counting" del jugador queda actualizado según sus aciertos y fallos durante la visita.

**Por qué tiene esta prioridad**: Cierra el vertical slice completo (destino → reto → actualización de habilidad) y conecta este destino con el modelo de progreso ya construido en 006/007. Aporta valor incremental sobre las historias 1 y 2, que ya son jugables por sí solas.

**Prueba independiente**: Puede probarse completando la secuencia completa de retos del destino Luna (con una mezcla de aciertos y fallos) y comparando el nivel de dominio de "counting" antes y después de la visita, verificando que refleja los resultados obtenidos.

**Escenarios de aceptación**:

1. **Given** el jugador ha respondido correctamente a todos los retos de la secuencia del destino Luna, **When** completa el último reto, **Then** el sistema muestra un mensaje de cierre de BOT-6 confirmando la finalización del destino y permite volver al mapa.
2. **Given** el jugador tenía un nivel de dominio conocido en "counting" antes de entrar al destino Luna, **When** completa la secuencia con una mezcla de aciertos y fallos, **Then** el nivel de dominio de "counting" tras la visita refleja esos resultados según las reglas ya definidas en el modelo de progreso por habilidades.

---

### Casos límite

* ¿Qué sucede si el jugador vuelve al mapa antes de terminar la secuencia completa de retos? El destino no registra progreso parcial entre visitas (sin persistencia, ver exclusiones); al volver a entrar, la secuencia se reinicia desde el primer reto.
* ¿Qué sucede si el jugador falla el mismo reto varias veces seguidas (p. ej. 5 intentos)? Puede seguir reintentando sin límite ni penalización de juego; el nivel de dominio de "counting" evoluciona según las reglas ya existentes del modelo de progreso (que sí contempla bajadas de nivel tras fallos acumulados).
* ¿Qué sucede si el nivel de dominio de "counting" del jugador ya está en el máximo soportado y acierta todos los retos? El destino se completa con normalidad; el nivel permanece en el máximo, sin error.
* ¿Qué sucede si el jugador reintenta un reto y luego decide volver al mapa sin haberlo resuelto? El sistema permite la salida en cualquier momento (comportamiento ya validado en el bucle base) sin dejar la aplicación en un estado inconsistente.

## Requisitos *(obligatorio)*

### Requisitos funcionales

* **FR-001**: The system MUST replace the current placeholder destination scene with a Moon destination scene that presents a sequence of counting challenges, with a fixed length between 2 and 3 challenges determined by content data (currently 3, see Suposiciones).
* **FR-002**: WHEN the player enters the Moon destination scene, the system MUST present the first challenge of the sequence wrapped in a narrative message from BOT-6, not as a bare arithmetic expression.
* **FR-003**: WHEN the player submits a correct answer to the current challenge, the system MUST display immediate positive feedback and advance to the next challenge in the sequence, or to the destination completion state if it was the last one.
* **FR-004**: WHEN the player submits an incorrect answer to the current challenge, the system MUST display immediate feedback indicating the answer was incorrect, MUST keep that same challenge available for retry, and MUST NOT apply any in-game penalty (e.g., score, lives, or available time).
* **FR-005**: WHILE the player is retrying a challenge after an incorrect answer, the system MUST preserve the narrative framing already shown for that challenge instead of resetting it to a bare exercise.
* **FR-006**: The system MUST allow an unlimited number of retries on the same challenge before the player answers correctly.
* **FR-007**: WHEN the player submits an answer to a challenge — whether it is correct or incorrect, and including every retry attempt on the same challenge — the system MUST update the player's "counting" skill level through the existing skill progress model for that specific attempt's outcome, without introducing any new rule beyond the existing model's behavior.
* **FR-008**: The system MUST present each challenge of the Moon destination sequence using the existing "counting" challenge type from the generic challenge engine, without introducing a new challenge type.
* **FR-009**: WHEN the player completes the last challenge of the sequence, the system MUST display a closing narrative message from BOT-6 confirming the destination is complete and MUST allow the player to return to the map.
* **FR-010**: The system MUST display basic visual ambientation for the Moon destination scene that visually distinguishes it from the previous empty placeholder destination scene.
* **FR-011**: WHILE the destination sequence is in progress, the system MUST NOT advance past the current challenge until the player answers it correctly.
* **FR-012**: The system MUST allow the player to return to the map at any point during the Moon destination sequence, consistent with the existing map↔destination navigation loop.
* **FR-013**: The system MUST present the candidate answer for each challenge as a set of selectable numeric options (e.g., tappable buttons), not as free-form numeric text input nor as a one-by-one object-tapping counting interaction.
* **FR-014**: WHEN the player enters the Moon destination scene, the system MUST generate the full sequence of counting challenges (fixed length per FR-001, currently 3) up front, using the player's "counting" skill level at that moment; the sequence MUST NOT be regenerated or altered mid-visit even if the skill level changes as a result of answering earlier challenges in the same sequence.

## Entidades clave

* **Destino Luna**: escena de destino real que sustituye al placeholder; representa una situación narrativa concreta (ambientada en la Luna) y contiene una secuencia ordenada de 2-3 retos de conteo.
* **Secuencia de retos del destino**: lista ordenada de instancias de reto de tipo "counting" generadas para una visita al destino Luna, con su posición actual dentro de la secuencia y su estado (pendiente, en curso, superado).
* **Mensaje narrativo de BOT-6**: contenido textual que envuelve la presentación de cada reto, el feedback de acierto/error, y el cierre del destino, reutilizando el mecanismo de diálogo ya definido en la narrativa de BOT-6.

## Criterios de éxito *(obligatorio)*

### Resultados medibles

* **SC-001**: Un jugador nuevo puede completar la secuencia completa del destino Luna (2-3 retos) en menos de 3 minutos en su primera visita.
* **SC-002**: El 100% de los retos presentados en el destino Luna aparecen envueltos en una frase narrativa de BOT-6, ninguno se presenta como una expresión aritmética desnuda.
* **SC-003**: Tras responder incorrectamente a un reto, el jugador puede reintentarlo sin observar ninguna reducción de puntuación, vidas o tiempo disponible.
* **SC-004**: Al completar el destino Luna, el nivel de dominio de la habilidad "counting" del jugador refleja los aciertos y fallos obtenidos durante la visita, verificable comparando el nivel antes y después.
* **SC-005**: El jugador puede volver al mapa en cualquier momento durante la secuencia del destino Luna sin que la aplicación quede en un estado de error o inconsistente.

## Suposiciones

* El destino Luna sustituye completamente al destino placeholder existente (004); ambos no coexisten como opciones seleccionables.
* Los retos de conteo reutilizan el motor genérico ya construido en 007 (generación y validación) sin introducir nuevas reglas de generación específicas para este destino.
* La actualización del nivel de dominio reutiliza la función ya definida en el modelo de progreso por habilidades (006) sin modificar su algoritmo (incluyendo su tratamiento de fallos acumulados y de los niveles mínimo/máximo).
* El diálogo narrativo de BOT-6 reutiliza el mecanismo de overlay ya construido en 005, incluyendo su límite de longitud por mensaje.
* No existe persistencia de progreso entre visitas al destino, ni dentro de la misma sesión ni entre sesiones (011 y 022 quedan fuera de alcance): si el jugador abandona a mitad de la secuencia y vuelve a entrar, la secuencia se reinicia desde el primer reto.
* El número exacto de retos por visita se fija en 3 por defecto, dentro del rango 2-3 indicado en el objetivo de la funcionalidad.
* Los datos astronómicos reales de la Luna quedan fuera de alcance (023); la ambientación visual de esta funcionalidad es temática/genérica, no pretende ser educativa en sí misma sobre el satélite.
