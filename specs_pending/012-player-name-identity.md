---
id: "012-player-name-identity"
name: "Identidad del jugador: nombre y pantalla de bienvenida"
phase: "Fase 1 — Motor de juego base y primer destino jugable"
depends_on: ["005-bot6-narrative-shell", "011-save-progress-local"]
---

# 012 — Identidad del jugador: nombre y pantalla de bienvenida (player-name-identity)

## Objetivo
La primera vez que se abre el juego, preguntar al niño cómo se llama y usar ese nombre desde entonces tanto en el texto del juego como en los diálogos de BOT-6. En sesiones posteriores, si el nombre ya está guardado, no volver a preguntarlo: en su lugar, mostrar una pantalla de saludo personalizada con un único botón "Seguir jugando" que lleve directamente a donde el jugador lo dejó.

## Contexto / motivación
BOT-6 (005) ya tiene un sistema de diálogo reutilizable pero genérico ("sin lógica educativa todavía"), y la persistencia local (011) ya guarda el dominio por habilidad y los destinos completados, con carga/guardado testeables y fallback seguro ante datos ausentes o corruptos. Esta spec añade una única pieza de identidad que faltaba — el nombre del jugador — reutilizando ambas infraestructuras: el nombre se guarda con el mismo mecanismo de 011 y se usa para personalizar las plantillas de diálogo de 005. Al ser una pieza tan básica (se usa desde el primer mensaje de BOT-6), se sitúa al final de la Fase 1, justo cuando ambas dependencias ya existen, en vez de esperar a la Fase 3 (donde vive el onboarding narrativo completo, 026).

## Alcance incluido
- **Captura del nombre (primera sesión)**: un campo de texto simple y un botón grande de confirmación, con vocabulario y diseño apropiados para ~6 años (principio I): sin teclado virtual complejo, límite corto de caracteres, sin campos adicionales (ni edad, ni email, ni ningún otro dato).
- **Persistencia del nombre**: se guarda usando el mismo esquema versionado de 011 (mismo mecanismo de `localStorage`, mismo fallback seguro ante datos corruptos o ausentes).
- **Interpolación en diálogos de BOT-6**: las plantillas de diálogo de 005 admiten un marcador de nombre (p. ej. `{{playerName}}`) que se sustituye por el nombre guardado; si por cualquier motivo el nombre no está disponible, BOT-6 usa un saludo genérico neutro (nunca un placeholder roto ni un error visible).
- **Pantalla de bienvenida en sesiones posteriores**: si ya existe un nombre guardado al abrir el juego, se omite la pregunta y se muestra una pantalla breve de saludo ("¡Hola, {nombre}!" + un mensaje corto de BOT-6) con un único botón grande "Seguir jugando".
- **Punto de retorno ("Seguir jugando")**: se persiste, junto con el nombre, un puntero mínimo a la última ubicación de navegación conocida (con la granularidad que exista en cada fase: en esta spec, mapa o destino activo — ver "Alcance excluido" para su evolución futura). Pulsar "Seguir jugando" navega directamente ahí en vez de forzar pasar por el mapa desde cero.
- **Inserción segura del nombre**: el nombre introducido por el niño se muestra siempre mediante inserción segura de texto (`textContent`/equivalente), nunca como HTML dinámico sin sanear, ya que es el primer dato de entrada libre que introduce el jugador en todo el proyecto. Esta práctica se generaliza y audita formalmente como línea base transversal en 030 (Fase 4), pero se aplica desde esta spec, no se pospone hasta entonces.

## Alcance excluido
- **Multi-perfil** (ver 029, Fase 3): esta spec asume un único nombre/jugador por dispositivo. 029 reutiliza esta misma base para soportar varios nombres/perfiles distintos en el mismo dispositivo, con selección visual entre ellos.
- **Edición del nombre ya guardado**: cambiar el nombre después de la primera vez no es parte de este slice; puede añadirse como ajuste del panel parental (028) si se prioriza más adelante.
- **Validación de contenido inapropiado en el nombre** (filtros de palabras, listas negras): fuera de alcance de este slice inicial; el campo solo limita longitud y caracteres básicos. Puede revisarse como ampliación si la telemetría/soporte lo justifica.
- **Granularidad completa del punto de retorno**: en esta spec el punto de retorno solo distingue "mapa" o "destino activo", porque la estructura de expediciones/misiones (021) todavía no existe en la Fase 1. Cuando 021 añada esa jerarquía, el mismo puntero de "última ubicación" se refina de forma natural para incluir expedición/misión en curso, sin necesidad de una spec adicional, siempre que su diseño de datos sea genérico desde el principio (mismo criterio ya aplicado en 025-map-navigation-ui).
- **Autenticación o verificación de identidad**: el nombre es solo una etiqueta de personalización, no una credencial; no protege ni restringe nada.

## Dependencias
- 005 (las plantillas de diálogo de BOT-6 que se personalizan con el nombre), 011 (infraestructura de persistencia local ya probada y con fallback seguro, que este slice reutiliza para guardar nombre + punto de retorno).

## Criterios de aceptación de alto nivel
- La primera vez que se abre el juego, se pregunta el nombre del niño antes de continuar; en sesiones posteriores no se vuelve a preguntar.
- BOT-6 se dirige al jugador por su nombre en los mensajes definidos por 005 una vez que el nombre está guardado.
- En una sesión posterior con nombre ya guardado, aparece una pantalla de saludo con un único botón "Seguir jugando" que lleva exactamente a la última ubicación conocida (mapa o destino activo), sin pasar por la pregunta del nombre ni por el mapa por defecto.
- Cerrar y volver a abrir el juego sin haber introducido nunca un nombre no rompe el arranque (se comporta como un jugador nuevo, pidiendo el nombre).
- El nombre se renderiza siempre mediante inserción segura de texto, verificable con una prueba que intente introducir un nombre con caracteres tipo `<script>` sin que se ejecute ni se interprete como HTML.

## Alineación con la constitución
- **I. Experiencia centrada en el niño (NON-NEGOTIABLE)**: personalización simple y cercana (nombre propio) sin fricción — un único campo, un único botón de continuar, sin ayuda de un adulto.
- **VI. Simplicidad primero**: se reutiliza íntegramente la persistencia ya construida en 011 y el sistema de diálogo ya construido en 005; no se introduce infraestructura nueva (sin cuentas, sin autenticación).
- **VII. Separación lógica/renderizado**: la lógica de "¿hay nombre guardado? ¿a dónde debe volver 'Seguir jugando'?" debe ser testeable sin `Phaser.Scene`.

## Frase de entrada sugerida para /speckit-specify
"Quiero que la primera vez que se abre el juego se pregunte al niño su nombre con un campo simple y un botón grande de confirmar, que BOT-6 use ese nombre en sus diálogos a partir de entonces, y que en sesiones posteriores (nombre ya guardado) se muestre en vez de la pregunta una pantalla de saludo personalizada con un único botón 'Seguir jugando' que lleve directamente a la última ubicación conocida del jugador, reutilizando la persistencia local ya existente."
