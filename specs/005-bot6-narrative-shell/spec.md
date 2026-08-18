---
title: "Cascarón narrativo de BOT-6"
feature: "005-bot6-narrative-shell"
type: "feature-spec"
version: "1.1"
created: "2026-08-18"
updated: "2026-08-19"
status: "Implemented"
priority: "P1"
tags: ["game", "narrative", "education"]
dependencies: ["004-core-game-loop"]
related_specs: []
---

# Especificación de funcionalidad: Cascarón narrativo de BOT-6

**Rama de la funcionalidad**: `005-bot6-narrative-shell`

**Creado**: 2026-08-18

**Estado**: Draft

**Entrada**: Descripción del usuario: "Quiero añadir a BOT-6 como robot acompañante con un sistema simple de diálogo (texto corto + retrato) que salude al jugador en el mapa y al entrar en un destino, sin lógica educativa todavía, dejando clara la separación entre narrativa ficticia y futuros datos científicos."

## Clarifications

### Session 2026-08-18

- Q: ¿Debe BOT-6 repetir el mensaje de bienvenida cada vez que el jugador entra en la escena del mapa, o solo debe mostrarse una vez por sesión de juego? → A: Cada vez que el jugador entra en la escena del mapa, sin importar si ya se mostró antes en la misma sesión.
- Q: ¿Cada evento (bienvenida en el mapa, transición al destino) debe mostrar un único mensaje corto de BOT-6, o una secuencia de varios mensajes encadenados? → A: Un único mensaje corto por evento, sin encadenar varias líneas.
- Q: ¿Cuál debe ser el mecanismo concreto para distinguir el diálogo narrativo de BOT-6 de futuros datos científicos reales, de forma que FR-006 sea verificable? → A: El propio retrato/nombre "BOT-6" ya actúa como marca de narrativa ficticia; no se añade ningún elemento visual nuevo en esta spec, se deja para cuando existan datos reales (023).
- Q: ¿Los mensajes de BOT-6 deben tener un límite numérico explícito de longitud (p.ej. caracteres o líneas), o basta con un criterio cualitativo de "frase corta"? → A: Límite explícito de máximo 2 líneas visibles en el cuadro de diálogo, sin importar el número de caracteres.

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - BOT-6 saluda al jugador en el mapa (Prioridad: P1)

Un jugador abre el juego y llega al mapa del sistema solar. BOT-6 aparece con un mensaje corto de bienvenida, mostrando su retrato junto al texto.

**Por qué tiene esta prioridad**: Es el primer contacto del jugador con el personaje central de la narrativa (constitución, principio III) y refuerza que el juego se siente como una aventura acompañada antes que como una colección de ejercicios (principio II). Sin esta historia, BOT-6 no tiene ninguna presencia en el juego.

**Prueba independiente**: Puede probarse por completo cargando el juego hasta el mapa y comprobando que aparece un cuadro de diálogo con el retrato de BOT-6 y un texto corto de bienvenida, sin necesidad de ninguna otra historia de esta spec.

**Escenarios de aceptación**:

1. **Given** el jugador acaba de cargar el juego, **When** entra en la escena del mapa, **Then** el sistema muestra un mensaje de BOT-6 con su retrato y un texto de bienvenida corto y apropiado para ~6 años.
2. **Given** el mensaje de bienvenida de BOT-6 está visible, **When** el jugador toca o hace clic para continuar, **Then** el mensaje se cierra y el jugador puede seguir interactuando con el mapa con normalidad.
3. **Given** el jugador ya ha visto el mensaje de bienvenida en una visita anterior al mapa dentro de la misma sesión, **When** vuelve a entrar en la escena del mapa, **Then** el sistema vuelve a mostrar el mismo mensaje de bienvenida (no se guarda ningún estado de "ya visto" entre visitas).

---

### Historia de usuario 2 - BOT-6 acompaña la entrada a un destino (Prioridad: P2)

Un jugador selecciona el destino placeholder desde el mapa. Al entrar en la escena de destino, BOT-6 muestra un mensaje corto de transición.

**Por qué tiene esta prioridad**: Refuerza la continuidad narrativa entre escenas ya existentes (spec 004), pero depende de que el sistema de diálogo de la Historia 1 ya exista; sin la Historia 1 no hay componente que reutilizar.

**Prueba independiente**: Puede probarse por completo entrando al destino placeholder desde el mapa y comprobando que aparece un mensaje distinto de BOT-6, reutilizando el mismo componente de diálogo que la Historia 1.

**Escenarios de aceptación**:

1. **Given** el jugador está en el mapa, **When** selecciona el destino placeholder, **Then** el sistema muestra un mensaje de BOT-6 distinto al de bienvenida, coherente con la transición al destino.
2. **Given** el jugador ha vuelto al mapa desde el destino, **When** vuelve a entrar en el mismo destino, **Then** el sistema vuelve a mostrar el mensaje de transición (no hay persistencia de "ya visto" todavía, ver spec 011).

---

### Casos límite

* ¿Qué sucede si el jugador entra y sale repetidamente del destino? El mensaje de transición de BOT-6 debe volver a mostrarse cada vez, ya que esta spec no incluye persistencia de progreso (reservada a la spec 011).
* ¿Qué sucede si el texto de un mensaje es más largo de lo esperado? El componente de diálogo MUST ajustar el texto (salto de línea) sin cortar palabras a la mitad ni desbordar el área visible.
* ¿Qué sucede si el retrato de BOT-6 todavía no existe como asset final? El componente MUST admitir una imagen de retrato placeholder sin romper el layout del diálogo.
* ¿Qué sucede si el jugador intenta interactuar con la escena mientras el diálogo está visible? El sistema MUST requerir que el jugador cierre el diálogo (toque/clic) antes de permitir otras interacciones de esa escena.

## Requisitos *(obligatorio)*

### Requisitos funcionales

* **FR-001**: WHEN el jugador entra en la escena del mapa, the system MUST mostrar un mensaje de BOT-6 con su retrato y un texto corto de bienvenida.
* **FR-002**: WHEN el jugador entra en la escena del destino placeholder, the system MUST mostrar un mensaje de BOT-6 con su retrato y un texto corto de transición, distinto del mensaje de bienvenida.
* **FR-003**: The system MUST proveer un componente de diálogo reutilizable (texto corto + retrato) que cualquier escena futura pueda invocar sin duplicar su lógica de presentación.
* **FR-003a**: The system MUST mostrar un único mensaje corto por evento (bienvenida, transición), sin encadenar varios mensajes en secuencia; encadenar mensajes queda fuera del alcance de esta spec.
* **FR-004**: WHILE un mensaje de BOT-6 está visible, the system MUST permitir al jugador cerrarlo mediante una acción simple (toque/clic) antes de continuar con otras interacciones de la escena.
* **FR-005**: The system MUST usar frases cortas y vocabulario apropiado para niños de ~6 años en todos los textos de BOT-6 de esta spec, sin superar 2 líneas visibles en el cuadro de diálogo por mensaje.
* **FR-006**: The system MUST distinguir el diálogo narrativo de BOT-6 de cualquier futuro contenido de datos científicos reales; en esta spec esto se cumple porque el retrato y el nombre "BOT-6" son la única marca visual presente y ningún otro tipo de mensaje (dato real) coexiste todavía en pantalla, evitando toda confusión posible por construcción. Un contraste visual adicional (color, icono, etiqueta) queda reservado a cuando se introduzcan datos reales (spec 023).
* **FR-007**: The system MUST NOT incluir en esta spec datos astronómicos reales, audio o voz de BOT-6, ramificación de diálogo, personalización cosmética de BOT-6, ni interpolación del nombre del jugador (reservado a specs 018, 023 y 055, y 012 respectivamente).

### Entidades clave

* **Mensaje de BOT-6**: texto corto asociado a un punto de entrada de escena (mapa, destino), junto con una referencia al retrato de BOT-6 a mostrar.
* **Componente de diálogo**: elemento reutilizable de presentación (texto + retrato) invocado por cualquier escena para mostrar un mensaje de BOT-6, sin conocer los detalles de esa escena.

## Criterios de éxito *(obligatorio)*

### Resultados medibles

* **SC-001**: El 100% de las partidas que llegan al mapa muestran un mensaje de bienvenida de BOT-6 con su retrato.
* **SC-002**: El 100% de las entradas al destino placeholder muestran un mensaje de transición de BOT-6 distinto del de bienvenida.
* **SC-003**: Añadir un nuevo mensaje de BOT-6 a una escena futura no requiere escribir de nuevo la lógica de presentación del diálogo (0 duplicación del componente de diálogo entre escenas).
* **SC-004**: El 100% de los mensajes de BOT-6 de esta funcionalidad ocupan 2 líneas visibles o menos en el cuadro de diálogo, sin truncar palabras.
* **SC-005**: Ninguno de los mensajes de esta funcionalidad contiene un dato astronómico verificable (0 hechos científicos reales mezclados con la narrativa).

## Suposiciones

* No existe todavía persistencia de progreso (spec 011), por lo que los mensajes de bienvenida y transición se muestran en cada entrada a la escena correspondiente, no solo la primera vez.
* El retrato final de BOT-6 puede no estar disponible todavía; se asume el uso de una imagen placeholder mientras no exista el asset definitivo, sin que esto bloquee la funcionalidad.
* El cierre del diálogo se realiza mediante una única acción simple del jugador (toque/clic), sin temporizador automático, para no apresurar la lectura de niños de ~6 años.
* Esta spec depende de las escenas de mapa y destino ya existentes de la spec 004-core-game-loop; no crea escenas nuevas, solo añade el sistema de diálogo sobre ellas.
