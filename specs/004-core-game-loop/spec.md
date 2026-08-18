---
title: "Bucle de juego base"
feature: "004-core-game-loop"
type: "feature-spec"
version: "1.2"
created: "2026-08-17"
updated: "2026-08-17"
status: "Draft"
priority: "P1"
tags: ["game", "architecture"]
dependencies: ["001-component-library-architecture", "002-button-variants", "003-shared-components-base"]
related_specs: []
---

# Especificación de funcionalidad: Bucle de juego base

**Rama de la funcionalidad**: `004-core-game-loop`

**Creado**: 2026-08-17

**Estado**: Draft

**Entrada**: Descripción del usuario: "Quiero implementar el bucle de juego base: un mapa del sistema solar navegable donde el jugador pueda seleccionar un destino (placeholder), entrar en una escena de destino vacía y volver al mapa, usando Phaser para el renderizado y manteniendo la lógica de navegación desacoplada de las escenas."

## Clarifications

### Session 2026-08-17

- Q: ¿Cuál es el umbral máximo de tiempo (en milisegundos) que puede pasar entre el toque/clic del jugador y la primera respuesta visual de la transición, para que SC-002 sea verificable? → A: 200 ms — más margen para animaciones de transición con efectos.

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Navegar del mapa a un destino (Prioridad: P1)

Un jugador abre el juego y ve un mapa del sistema solar con un destino visible y seleccionable. Al seleccionarlo, el juego le lleva a la escena de ese destino.

**Por qué tiene esta prioridad**: Es el primer vertical slice jugable de extremo a extremo exigido por la constitución (principio VIII); sin esta historia no existe ningún bucle de juego que demostrar.

**Prueba independiente**: Puede probarse por completo cargando el juego, comprobando que el mapa se renderiza con el destino visible, y verificando que un toque/clic sobre él dispara la transición a la escena de destino.

**Escenarios de aceptación**:

1. **Given** el jugador ha abierto el juego, **When** el mapa termina de cargar, **Then** se muestra al menos un destino visualmente identificable y seleccionable.
2. **Given** el mapa está visible, **When** el jugador selecciona el destino disponible, **Then** el juego transiciona a la escena de ese destino.
3. **Given** el jugador ha seleccionado el destino, **And** la transición está en curso, **When** el jugador vuelve a tocar el mismo destino, **Then** el sistema ignora la activación repetida y completa una única transición.

---

### Historia de usuario 2 - Volver al mapa sin perder el estado (Prioridad: P2)

Desde la escena de destino, el jugador puede volver al mapa mediante un control del HUD, y el mapa se muestra exactamente como lo dejó.

**Por qué tiene esta prioridad**: Cierra el bucle de navegación (ida y vuelta); sin ella el jugador queda en un callejón sin salida dentro de la escena de destino.

**Prueba independiente**: Puede probarse entrando en la escena de destino y activando el control de "volver al mapa", verificando que el mapa reaparece con el mismo destino disponible para volver a seleccionarlo.

**Escenarios de aceptación**:

1. **Given** el jugador está en la escena de destino, **When** activa el control "volver al mapa", **Then** el juego transiciona de vuelta al mapa.
2. **Given** el jugador ha vuelto al mapa, **When** observa el mapa, **Then** el destino sigue visible y seleccionable, sin errores ni estados inconsistentes.
3. **Given** el jugador ha completado el recorrido mapa→destino→mapa, **When** repite la selección del destino, **Then** el bucle puede repetirse un número ilimitado de veces sin degradación ni errores.

---

### Historia de usuario 3 - HUD mínimo dentro de la escena de destino (Prioridad: P3)

Dentro de la escena de destino, el jugador ve un HUD mínimo con el control "volver al mapa" y un indicador de progreso vacío/placeholder.

**Por qué tiene esta prioridad**: Aporta la base visual mínima (feedback constante de "dónde estoy" y "cómo vuelvo") sobre la que se apoyarán los HUD de retos futuros, pero no es indispensable para que el bucle básico funcione.

**Prueba independiente**: Puede probarse entrando en la escena de destino y verificando que el HUD muestra el control de retorno y el indicador de progreso placeholder, ambos visibles sin necesidad de leer texto extenso.

**Escenarios de aceptación**:

1. **Given** el jugador está en la escena de destino, **When** observa el HUD, **Then** ve un control "volver al mapa" grande y fácil de identificar sin texto extenso.
2. **Given** el jugador está en la escena de destino, **When** observa el HUD, **Then** ve un indicador de progreso en estado vacío/placeholder (sin datos reales de progreso todavía).

---

### Casos límite

* ¿Qué sucede si el jugador activa el control "volver al mapa" varias veces seguidas durante la transición? El sistema MUST ignorar las activaciones redundantes y completar una única transición.
* ¿Qué sucede si el jugador redimensiona la ventana o cambia de orientación mientras el mapa o la escena de destino están activos? La escena activa MUST seguir siendo usable sin que el jugador quede bloqueado.
* ¿Qué sucede si el jugador intenta usar el botón "atrás" del navegador durante el bucle? El sistema MUST mantener un estado de navegación consistente (sin pantalla en blanco ni error) o, como mínimo, no dejar al jugador en un callejón sin salida (FR-012).
* ¿Qué sucede la primera vez que Phaser tarda en inicializar (carga de assets)? El sistema MUST mostrar un estado de carga simple en vez de una pantalla vacía o un error (FR-011).
* ¿Qué sucede si solo existe un destino disponible en el mapa (caso de este slice)? El sistema MUST seguir permitiendo seleccionarlo y completar el bucle igual que si hubiera varios.

## Requisitos *(obligatorio)*

### Requisitos funcionales

* **FR-001**: The system MUST display, on game load, a navigable map scene with at least one visually identifiable and selectable destination.
* **FR-002**: WHEN the player selects the available destination, the system MUST transition from the map scene to that destination's scene.
* **FR-003**: The system MUST display, within the destination scene, a "volver al mapa" control with a tappable area of at least 44×44 px (the project's `--size-touch-target-min` design token) and without requiring extensive text.
* **FR-004**: WHEN the player activates the "volver al mapa" control, the system MUST transition back to the map scene while preserving the previously visible destination as selectable again.
* **FR-005**: WHILE the destination scene is active, the system MUST display a placeholder/empty progress indicator in the HUD.
* **FR-006**: The system MUST implement the navigation state (active scene, selected destination) as logic that is testable with Vitest without instantiating a `Phaser.Scene`.
* **FR-007**: IF the player activates the destination selection or the "volver al mapa" control multiple times while a transition is already in progress, THEN the system MUST ignore the redundant activations and complete only one transition.
* **FR-008**: The system MUST allow the map→destination→map loop to be repeated an unlimited number of times without introducing errors or inconsistent navigation state.
* **FR-009**: WHERE Phaser is used for rendering, the game/navigation logic MUST remain decoupled from Phaser scene classes, per Principle VII of the constitution.
* **FR-010**: The system MUST NOT persist progress across sessions, present real astronomical data, include BOT-6 narrative content, or implement real educational challenges as part of this feature (deferred to other specs).
* **FR-011**: WHILE Phaser is initializing (asset/engine boot), the system MUST display a simple loading state instead of a blank screen or an error.
* **FR-012**: WHEN the player uses the browser's back button during the map↔destination loop, the system MUST keep the navigation state consistent (no blank screen, no error) or, at minimum, MUST NOT leave the player in a dead end.

### Entidades clave

* **Mapa del sistema solar**: escena que contiene los destinos seleccionables; en este slice muestra un único destino placeholder, sin datos astronómicos reales.
* **Destino**: lugar seleccionable dentro del mapa; en este slice es un marcador visual sin contenido educativo asociado.
* **Estado de navegación**: representa la escena activa (mapa o destino) y el destino seleccionado; se gestiona de forma independiente del motor de renderizado para poder probarse sin `Phaser.Scene`.

## Criterios de éxito *(obligatorio)*

### Resultados medibles

* **SC-001**: El 100% de los jugadores puede completar el recorrido mapa→destino→mapa sin quedar atascado ni encontrar un error visible.
* **SC-002**: Desde que el jugador toca/hace clic en el destino o en el control "volver al mapa", la transición correspondiente comienza a mostrar su primera respuesta visual en 200 ms o menos.
* **SC-003**: El 100% de las transiciones de estado de navegación (mapa↔destino) está cubierto por pruebas automatizadas que no dependen de renderizar Phaser.
* **SC-004**: El bucle completo mapa→destino→mapa puede repetirse de forma indefinida sin degradación visible ni errores registrados en consola.

## Suposiciones

* En este slice solo existe un destino real; el mapa debe estar preparado visualmente para soportar más destinos en el futuro, pero no es necesario implementarlos ahora.
* La escena de destino es un placeholder vacío (sin retos, sin narrativa, sin datos astronómicos): su único propósito es demostrar la transición y el HUD mínimo.
* El indicador de progreso del HUD no refleja progreso real todavía (no existe persistencia ni sistema de habilidades en este slice); solo se muestra en estado vacío/placeholder.
* Phaser se integra como dependencia de renderizado; su configuración de build concreta (bundler, versión) es una decisión técnica que corresponde al plan de implementación, no a esta especificación.
