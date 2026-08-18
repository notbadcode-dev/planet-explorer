---
title: "Base ampliada de componentes compartidos reutilizables"
feature: "003-shared-components-base"
type: "feature-spec"
version: "1.5"
created: "2026-08-16T00:00:00Z"
updated: "2026-08-19T00:00:00Z"
status: "Implemented"
priority: "P1"
tags: [ui, components, accessibility, testing, architecture, design-system]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Especificación de funcionalidad: Base ampliada de componentes compartidos reutilizables

**Rama de la funcionalidad**: `003-shared-components-base`

**Creado**: 2026-08-16

**Estado**: Draft

**Entrada**: Descripción del usuario: "Crear una base mínima de componentes compartidos reutilizables en libs/components para construir vistas sin duplicar UI, incorporando Input, Panel, Badge, Progress y Dialog con accesibilidad, composición, pruebas y consistencia visual."

## Clarifications

### Session 2026-08-16

- Q: ¿Qué alcance de compatibilidad de navegación debe ser obligatorio para aceptar esta feature? → A: Navegadores evergreen de escritorio y móvil (últimas 2 versiones estables).
- Q: ¿Qué comportamiento de teclado debe ser obligatorio para Dialog al abrirse y cerrarse? → A: Al abrir, foco inicial dentro del diálogo; Tab atrapado dentro; Escape cierra; al cerrar, retorno del foco al elemento invocador.
- Q: ¿Cómo debe demostrarse en Storybook cada estado/variante de un componente compartido? → A: Cada rama visual distinguible de la API pública (variantes, estados de error/deshabilitado, valores límite, etc.) debe tener su propia historia nombrada en Storybook, no solo un playground interactivo con controles; es la convención ya seguida por `Button`.
- Q: ¿Qué umbral de latencia debe alcanzar cada escenario crítico (Input al escribir, Progress al actualizar, Dialog abrir/cerrar) para que SC-006 se considere cumplido de forma verificable? → A: <= 100 ms en al menos 8 de 10 iteraciones por navegador objetivo.

### Session 2026-08-17

- Q: Tras revisión manual de Storybook, ¿Input y Dialog deben soportar variantes de tamaño como Button? → A: Sí, ambos adoptan el mismo catálogo cerrado `small | medium | large` (por defecto `medium`) ya definido por Button, sin romper su API existente.
- Q: ¿Qué nivel de cobertura debe tener Storybook para componentes con ciclo de vida interactivo como Dialog? → A: Además de las historias nombradas por estado/variante, Dialog debe incluir al menos dos historias completamente interactivas que lo abran desde un control real invocador de distinto tipo (por ejemplo, un botón y, por separado, un input) y demuestren visualmente el retorno de foco exacto a ese control al cerrarse.
- Q: ¿Deben las historias de Storybook combinar los casos límite ya documentados (ayuda+error en Input, icono de consumidor en Badge, valor negativo/oculto en Progress, contenido múltiple en Panel/Dialog) o basta con demostrarlos por separado? → A: Cada combinación de casos límite documentada en la especificación debe tener su propia historia nombrada que la demuestre explícitamente, no solo sus componentes por separado.

### Session 2026-08-16 (ampliación de catálogo)

- Q: Un juego educativo de astronomía (selección de planetas, quizzes, progreso) necesita componentes adicionales que hoy no existen. ¿Se amplia esta misma spec/rama o se abre una spec nueva? → A: Se amplia esta misma spec (`003-shared-components-base`), en la misma rama, ya que forma parte del mismo esfuerzo de librería compartida.
- Q: ¿Qué prioridad relativa tienen los 8 grupos de componentes solicitados? → A: `Card/Tile` y `Select/Dropdown` son P1 (bloquean la pantalla principal de selección de planetas); `RadioGroup/Checkbox`, `Tabs` y `Toast/Snackbar` son P2 (necesarios para las pantallas de quiz/ficha de planeta); `Tooltip`, `Spinner/Loader` y `Accordion` son P3 (se añaden según se necesiten).
- Q: ¿Estos componentes nuevos deben seguir siendo agnósticos de dominio, igual que los 5 componentes base? → A: Sí, se mantiene FR-004 sin excepciones: ninguno de los componentes nuevos incorpora lógica de juego/educación/astronomía; el contexto de planetas/quiz solo motiva el caso de uso, no forma parte de la API pública.

### Session 2026-08-16 (clarificación de ampliación de catálogo)

- Q: Para Select/Dropdown, ¿debe implementarse sobre el `<select>` nativo del navegador o como un listbox personalizado con ARIA? → A: `<select>` nativo del navegador; hereda accesibilidad y teclado del sistema operativo, con estilo limitado a lo que el elemento nativo permite.
- Q: Cuando se disparan varias notificaciones Toast/Snackbar de forma simultánea, ¿cómo debe comportarse el sistema? → A: Se apilan; todas las notificaciones activas se muestran simultáneamente en una pila/lista, sin descartar ni retrasar ninguna.
- Q: ¿Qué duración por defecto debe tener un Toast/Snackbar antes de auto-descartarse? → A: 4000 ms por defecto.
- Q: Tooltip se activa por hover/foco de teclado, pero en dispositivos táctiles no existe hover. ¿Cómo debe activarse en pantallas táctiles? → A: Tap para alternar mostrar/ocultar (toggle).
- Q: ¿Card/Tile necesita un estado visual "seleccionado/actualmente activo" propio, distinto de bloqueado/descubierto? → A: No; la selección persistente es responsabilidad del consumidor. Card/Tile solo expone bloqueado/descubierto y el callback de activación.

### Session 2026-08-18 (refinamiento de interacción y microanimaciones)

- Q: El acordeón (Accordion) no anima al expandir/colapsar. ¿Debe incorporar una transición? → A: Sí, debe expandirse/colapsarse mediante una transición CSS fluida en vez de un cambio instantáneo de visibilidad.
- Q: ¿El modo "solo una sección abierta a la vez" de Accordion debe ser el comportamiento por defecto? → A: No; se añade como un modo de expansión exclusiva opcional y configurable por el consumidor, manteniendo la expansión múltiple independiente como comportamiento por defecto (sin romper FR-031).
- Q: Visualmente Accordion no se percibe con claridad como tal. ¿Qué debe reforzarse? → A: La affordance visual del encabezado (icono indicador de expandido/colapsado a través del catálogo Icon y mayor contraste/jerarquía visual del encabezado), sin introducir un nuevo componente.
- Q: El iframe de la historia de Dialog en Storybook recorta el modal. ¿Cómo debe comportarse el entorno de demostración? → A: El iframe de cada historia debe ajustar su altura al contenido renderizado del componente de prueba en lugar de usar una altura fija, evitando que contenido como el modal de Dialog quede cortado.
- Q: RadioGroup y Checkbox(-group) cambian de estado marcado/desmarcado sin transición. ¿Debe añadirse una? → A: Sí, deben incorporar una transición CSS suave al marcar y desmarcar sus controles.
- Q: El indicador de apertura de Select usa el marcador nativo del navegador pegado al borde derecho. ¿Cómo debe resolverse? → A: Debe sustituirse visualmente por un icono del catálogo compartido Icon, con separación consistente respecto al borde derecho del campo, sin alterar que Select siga basado en el `<select>` nativo (FR-025).
- Q: ¿El texto visible de Spinner debe seguir siendo, en la práctica, obligatorio para que el componente comunique su estado? → A: No; el texto visible debe quedar explícitamente opcional, permitiendo un Spinner puramente visual (icono girando) que conserve un nombre accesible aunque no se muestre texto.
- Q: ¿El cambio de panel activo en Tabs debe animarse? → A: Sí, debe incorporar una transición CSS fluida al cambiar entre paneles.
- Q: ¿Tabs debe soportar pestañas individualmente deshabilitadas? → A: Sí; una pestaña deshabilitada no debe activarse por clic ni por teclado, se omite de la navegación por flechas entre pestañas y comunica su estado deshabilitado a tecnologías de asistencia.
- Q: ¿Tabs debe soportar iconos por pestaña? → A: Sí, de forma todo-o-nada: o todas las pestañas del grupo incluyen icono o ninguna lo incluye; una combinación mixta se trata como error de configuración, igual que la validación ya existente de Card/Tile (FR-022).
- Q: Toast/Snackbar aparece y desaparece de forma abrupta. ¿Debe suavizarse? → A: Sí, debe incorporar una transición de entrada y de salida en vez de una aparición/desaparición instantánea.
- Q: Tooltip aparece de forma instantánea al recibir hover/foco. ¿Debe retrasarse? → A: Sí, debe incorporar un pequeño retardo por defecto antes de mostrarse (no aplica al ocultarse ni a la activación por tap en dispositivos táctiles, que permanecen inmediatos).

### Session 2026-08-19 (clarificación de refinamiento de interacción)

- Q: ¿Qué retardo por defecto exacto debe aplicar Tooltip antes de mostrarse tras hover/foco de teclado? → A: 300 ms por defecto.
- Q: ¿Las nuevas transiciones/duraciones deben apoyarse en un nuevo conjunto de tokens globales de movimiento, o cada componente define sus propios valores ad hoc? → A: Se crea un token global de movimiento (duración + easing) reutilizable, consumido por los 5 componentes afectados (Accordion, RadioGroup/Checkbox, Tabs, Toast/Snackbar y el retardo de Tooltip), coherente con FR-007/FR-008.
- Q: Cuando la persona usuaria tiene activada `prefers-reduced-motion: reduce`, ¿las transiciones/retardo nuevos deben desactivarse por completo o solo acortarse? → A: Se desactivan por completo: la duración de las transiciones y el retardo de Tooltip pasan a 0, produciendo cambios de estado instantáneos.

### Session 2026-08-19 (ampliación de catálogo: control deslizante de volumen)

- Q: El ajuste de volumen del HUD de audio (`specs_pending/024-audio-and-sound-design.md`) y del panel parental (`specs_pending/027-parental-dashboard.md`) necesita un control numérico continuo que hoy no existe (`Input` solo cubre texto libre, `Progress` es de solo lectura). ¿Se amplía esta misma spec/rama o se abre una spec nueva? → A: Se amplía esta misma spec (`003-shared-components-base`), en la misma rama, por el mismo criterio ya aplicado a las ampliaciones anteriores: forma parte del mismo esfuerzo de librería compartida.
- Q: ¿Qué prioridad relativa tiene este componente frente al resto del catálogo? → A: P3, igual que Tooltip/Spinner/Accordion; no bloquea ninguna pantalla principal, se necesita en ajustes de audio y en el panel parental.
- Q: ¿Debe seguir siendo agnóstico de dominio, igual que el resto de componentes de esta spec? → A: Sí, sin excepciones, por el mismo criterio ya establecido en FR-004/FR-032.

### Session 2026-08-17

- Q: ¿El componente Slider debe construirse sobre el elemento nativo `<input type="range">` del navegador, o como un control deslizante personalizado con semántica ARIA (`role="slider"`)? → A: `<input type="range">` nativo del navegador; hereda teclado y accesibilidad del sistema, con estilo del track limitado a lo que el elemento nativo permite (igual que Select con `<select>`).
- Q: ¿Slider debe adoptar el mismo catálogo cerrado de tamaños `small | medium | large` que ya usan Button, Input y Dialog? → A: Sí, adopta `small | medium | large` (por defecto `medium`), igual que Button/Input/Dialog, garantizando un manejador suficientemente grande para uso táctil infantil (principio I).
- Q: ¿Slider debe mostrar siempre el valor numérico actual como texto visible, o queda a discreción de quien lo use? → A: Slider expone una prop opcional `showValue` (como Progress), con valor por defecto `true` siguiendo el mismo precedente ya establecido por Progress (`showValue = true`).
- Q: Cuando no se proporciona la prop `value`, ¿Slider debe usar `min` como valor por defecto, o `value` debe ser una prop obligatoria? → A: `value` es opcional; si se omite, Slider usa `min` como valor por defecto, evitando estados `undefined`/`NaN` accidentales.

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Construir entradas y feedback consistentes (Prioridad: P1)

Como desarrollador de vistas de la aplicación, quiero usar componentes compartidos de entrada y feedback para capturar datos y comunicar estado sin reescribir UI en cada pantalla.

**Por qué tiene esta prioridad**: habilita el flujo más frecuente (captura de datos y estado) y reduce duplicación desde el primer uso.

**Prueba independiente**: puede validarse creando una vista simple con Input, Badge y Progress, verificando que cubre estados visuales y requisitos básicos de accesibilidad.

**Escenarios de aceptación**:

1. **Given** una vista nueva sin componentes locales, **When** el desarrollador integra Input, Badge y Progress compartidos, **Then** la vista puede capturar texto y mostrar estado/avance sin crear componentes duplicados.
2. **Given** un Input con error y ayuda contextual, **When** se renderiza el campo, **Then** el estado inválido y la descripción asociada son anunciables por tecnologías de asistencia.
3. **Given** valores de progreso fuera de rango, **When** se renderiza Progress, **Then** el valor mostrado y anunciado se normaliza al rango válido definido.
4. **Given** un Input configurado en cada tamaño soportado (`small`, `medium`, `large`), **When** se renderiza, **Then** conserva foco, legibilidad de etiqueta y perceptibilidad de estado deshabilitado en los tres tamaños.

---

### Historia de usuario 2 - Componer bloques de contenido reutilizables (Prioridad: P2)

Como desarrollador, quiero encapsular contenido y acciones en Panel y Dialog para crear secciones y modales reutilizables sin acoplarlas a una feature concreta.

**Por qué tiene esta prioridad**: permite composición estructural de pantallas y acciones críticas (confirmaciones, alertas, tareas guiadas).

**Prueba independiente**: puede validarse montando un Panel con contenido dinámico y un Dialog con acciones de cierre y botones reutilizados.

**Escenarios de aceptación**:

1. **Given** contenido compuesto por elementos HTML existentes, **When** se pasa a Panel o Dialog, **Then** el contenido se renderiza sin pérdida de estructura ni restricciones de dominio.
2. **Given** un Dialog abierto con acción de cierre visible, **When** la persona usuaria activa cerrar, **Then** se dispara el callback de cierre exactamente una vez por interacción.
3. **Given** variantes visuales de Panel, **When** se representan en Storybook, **Then** cada variante se distingue de forma clara por más de una señal visual.
4. **Given** un Dialog abierto desde un botón invocador y, en un escenario distinto, desde un input invocador, **When** la persona usuaria lo cierra, **Then** el foco regresa exactamente al control que lo invocó en cada caso.
5. **Given** un Dialog configurado en cada tamaño soportado (`small`, `medium`, `large`), **When** se renderiza, **Then** conserva su semántica modal y legibilidad de contenido en los tres tamaños.

---

### Historia de usuario 3 - Mantener coherencia del sistema de componentes (Prioridad: P3)

Como responsable de la librería compartida, quiero que los nuevos componentes respeten reglas de tokens, iconografía centralizada y API pública mínima para sostener mantenibilidad y evolución.

**Por qué tiene esta prioridad**: protege coherencia transversal y evita deuda de diseño/accesibilidad en futuras features.

**Prueba independiente**: puede validarse revisando el catálogo de componentes, sus APIs públicas y los artefactos de pruebas/historias, junto con las validaciones automáticas del repositorio.

**Escenarios de aceptación**:

1. **Given** un componente compartido que necesita iconografía, **When** incorpora un icono, **Then** el icono proviene del catálogo central y no de fuentes externas directas.
2. **Given** estilos visuales de componentes compartidos, **When** se inspeccionan sus reglas de estilo, **Then** los valores visuales consumen tokens globales reutilizables y no valores ad hoc.
3. **Given** un cambio en componentes compartidos, **When** se ejecuta el gate de calidad del repositorio, **Then** no se reportan fallos en lint, pruebas, build de aplicación ni build de Storybook.

---

### Historia de usuario 4 - Construir la cuadrícula de selección de planetas (Prioridad: P1)

Como desarrollador de la pantalla principal del juego, quiero un componente de tarjeta clicable con icono/imagen, título y `Badge` de estado (bloqueado/descubierto) para construir la cuadrícula de selección de planetas, sin forzar a `Panel` a un uso interactivo/seleccionable para el que no fue pensado.

**Por qué tiene esta prioridad**: es la pieza que falta para arrancar la pantalla principal del juego; sin ella no puede construirse el flujo de selección.

**Prueba independiente**: puede validarse renderizando una cuadrícula de tarjetas con estados bloqueado/descubierto, verificando activación por clic/teclado y anuncio accesible del estado.

**Escenarios de aceptación**:

1. **Given** una colección de planetas, **When** se renderiza cada uno como una tarjeta con icono, título y `Badge` de estado, **Then** cada tarjeta es clicable y activable por teclado como unidad seleccionable.
2. **Given** una tarjeta en estado bloqueado, **When** la persona usuaria intenta activarla, **Then** el sistema comunica el estado bloqueado de forma accesible y no dispara la acción de selección.
3. **Given** una tarjeta en estado descubierto, **When** se activa por clic o por teclado, **Then** dispara su callback de selección exactamente una vez por interacción.

---

### Historia de usuario 5 - Elegir planeta, categoría o dificultad desde una lista (Prioridad: P1)

Como desarrollador, quiero un componente de lista desplegable para elegir una opción de un conjunto cerrado (planeta, categoría, dificultad), ya que `Input` solo cubre texto libre.

**Por qué tiene esta prioridad**: junto con la tarjeta de selección, es la otra pieza imprescindible para arrancar la pantalla principal del juego.

**Prueba independiente**: puede validarse renderizando el componente con una lista de opciones y verificando selección por teclado/puntero y anuncio accesible de la opción elegida.

**Escenarios de aceptación**:

1. **Given** una lista cerrada de opciones, **When** se renderiza el componente, **Then** la persona usuaria puede elegir exactamente una opción mediante teclado o puntero.
2. **Given** una opción ya seleccionada, **When** se vuelve a renderizar el componente, **Then** refleja la selección previa sin perderla.
3. **Given** el componente sin etiqueta visible, **When** se le asigna un nombre accesible alternativo, **Then** el nombre accesible es anunciable por tecnologías de asistencia.
4. **Given** el componente renderizado, **When** se muestra su indicador visual de apertura, **Then** el indicador se representa mediante el catálogo compartido Icon y conserva separación visible respecto al borde derecho del campo, sin depender del marcador nativo del navegador.

---

### Historia de usuario 6 - Capturar respuestas de quiz de opción única o múltiple (Prioridad: P2)

Como desarrollador de la pantalla de quiz, quiero componentes de grupo de opciones (única y múltiple) para capturar respuestas, ya que hoy no existe ningún control de selección múltiple.

**Por qué tiene esta prioridad**: se necesita al construir la pantalla de quiz, después de resolver la selección principal de planetas.

**Prueba independiente**: puede validarse renderizando un grupo de opción única y otro de opción múltiple, verificando exclusividad/no exclusividad de selección y agrupación accesible.

**Escenarios de aceptación**:

1. **Given** un grupo de opción única con varias alternativas, **When** la persona usuaria selecciona una, **Then** las demás alternativas del grupo se deseleccionan automáticamente.
2. **Given** un grupo de opción múltiple con varias alternativas, **When** la persona usuaria selecciona varias, **Then** todas las selecciones se mantienen de forma independiente.
3. **Given** cualquiera de los dos grupos, **When** se renderiza, **Then** expone una agrupación accesible con nombre de grupo anunciable.
4. **Given** una opción de cualquiera de los dos grupos, **When** la persona usuaria la marca o desmarca, **Then** el cambio de estado visual se acompaña de una transición suave en vez de un cambio instantáneo.

---

### Historia de usuario 7 - Organizar secciones de la ficha de un planeta (Prioridad: P2)

Como desarrollador de la ficha de planeta, quiero un componente de pestañas para organizar secciones ("Datos", "Curiosidades", "Quiz") sin abrir varios `Dialog`.

**Por qué tiene esta prioridad**: se necesita al construir la ficha de detalle de planeta.

**Prueba independiente**: puede validarse renderizando pestañas con varias secciones y verificando navegación por teclado y asociación accesible pestaña/panel.

**Escenarios de aceptación**:

1. **Given** varias secciones de contenido, **When** se activan mediante pestañas, **Then** solo el panel de la pestaña activa es visible y anunciado.
2. **Given** el foco en una pestaña, **When** se navega con flechas de teclado, **Then** el foco se mueve entre pestañas siguiendo el patrón de navegación accesible estándar.
3. **Given** una pestaña marcada como deshabilitada, **When** la persona usuaria intenta activarla por clic o teclado, **Then** el sistema no cambia el panel activo y comunica el estado deshabilitado a tecnologías de asistencia.
4. **Given** la navegación por flechas de teclado entre pestañas, **When** una pestaña adyacente está deshabilitada, **Then** el foco la omite y se mueve a la siguiente pestaña habilitada.
5. **Given** un grupo de pestañas donde al menos una define icono, **When** no todas las pestañas del grupo definen icono, **Then** el sistema señala una configuración inválida en vez de mezclar pestañas con y sin icono.
6. **Given** el cambio de pestaña activa, **When** se activa una nueva pestaña, **Then** el panel visible cambia mediante una transición CSS fluida.

---

### Historia de usuario 8 - Comunicar feedback inmediato no bloqueante (Prioridad: P2)

Como desarrollador, quiero un componente de notificación breve para mostrar mensajes no bloqueantes ("¡Correcto!", "Logro desbloqueado"), distinto de `Dialog`, que exige interacción y bloquea la pantalla.

**Por qué tiene esta prioridad**: se necesita en las pantallas de quiz y progreso para dar feedback inmediato sin interrumpir el flujo.

**Prueba independiente**: puede validarse disparando la notificación y verificando que se anuncia por tecnologías de asistencia sin robar el foco ni bloquear el resto de la pantalla.

**Escenarios de aceptación**:

1. **Given** un evento de feedback inmediato, **When** se muestra la notificación, **Then** el mensaje se anuncia mediante una región accesible en vivo sin mover el foco de la persona usuaria.
2. **Given** una notificación visible, **When** transcurre su tiempo de vida (4000 ms por defecto) o se descarta, **Then** desaparece sin requerir una acción de cierre obligatoria como `Dialog`.
3. **Given** una notificación que aparece o se descarta, **When** cambia su visibilidad, **Then** lo hace mediante una transición de entrada/salida en vez de un cambio brusco.

---

### Historia de usuario 9 - Mostrar ayuda contextual bajo demanda (Prioridad: P3)

Como desarrollador, quiero un componente de pista contextual para mostrar texto explicativo al pasar o enfocar un elemento, útil en un juego infantil para explicar términos sin saturar la pantalla.

**Por qué tiene esta prioridad**: complementa a `Icon`/`Badge`; se añade según se necesite en pantallas concretas.

**Prueba independiente**: puede validarse enfocando/pasando el puntero sobre un elemento asociado y verificando aparición, anuncio accesible y desaparición al perder foco/hover.

**Escenarios de aceptación**:

1. **Given** un elemento con texto explicativo asociado, **When** recibe foco de teclado o hover de puntero, **Then** la pista se muestra y su contenido es anunciable por tecnologías de asistencia.
2. **Given** la pista visible, **When** el elemento pierde foco o el puntero se aleja, **Then** la pista se oculta.
3. **Given** un elemento con pista asociada, **When** recibe hover de puntero o foco de teclado, **Then** la pista se muestra tras un pequeño retardo por defecto en vez de aparecer instantáneamente.

---

### Historia de usuario 10 - Indicar carga indeterminada (Prioridad: P3)

Como desarrollador, quiero un componente de carga indeterminada para representar estados de carga (assets, transición entre pantallas), ya que `Progress` solo cubre avance determinado con `value`/`max`.

**Por qué tiene esta prioridad**: se añade según se necesite en transiciones/carga de assets del juego.

**Prueba independiente**: puede validarse renderizando el componente durante una carga simulada y verificando semántica accesible de estado ocupado/indeterminado.

**Escenarios de aceptación**:

1. **Given** un proceso de carga sin progreso medible, **When** se renderiza el componente, **Then** expone semántica accesible de carga indeterminada distinta de `Progress`.
2. **Given** que la carga finaliza, **When** el componente se retira, **Then** deja de anunciarse como estado de carga activo.
3. **Given** el componente sin texto visible configurado, **When** se renderiza, **Then** muestra únicamente el indicador visual girando y conserva un nombre accesible anunciable, sin forzar texto visible.

---

### Historia de usuario 11 - Exponer contenido expandible/colapsable (Prioridad: P3)

Como desarrollador, quiero un componente acordeón para mostrar contenido expandible/colapsable (curiosidades, FAQ por planeta) sin recurrir a pestañas ni a un `Dialog` completo.

**Por qué tiene esta prioridad**: se añade según se necesite en pantallas de detalle/curiosidades.

**Prueba independiente**: puede validarse renderizando varias secciones y verificando expansión/colapso accesible por teclado y puntero.

**Escenarios de aceptación**:

1. **Given** una sección colapsada, **When** se activa su encabezado, **Then** se expande y expone su estado mediante semántica accesible.
2. **Given** varias secciones, **When** se expande una, **Then** las demás permanecen independientes salvo que se documente lo contrario.
3. **Given** una sección que cambia entre colapsada y expandida, **When** se activa su encabezado, **Then** la transición se anima mediante CSS en vez de un cambio instantáneo.
4. **Given** el acordeón configurado en modo de expansión exclusiva, **When** se expande una sección, **Then** cualquier otra sección previamente expandida se colapsa automáticamente.
5. **Given** el acordeón en su configuración por defecto (expansión múltiple), **When** se expande una sección, **Then** las demás secciones permanecen expandidas de forma independiente, igual que en el comportamiento previo a esta ampliación.
6. **Given** el encabezado de una sección de Accordion, **When** se renderiza en cualquier estado, **Then** muestra un indicador visual (icono de expandido/colapsado del catálogo Icon) y contraste suficiente para ser reconocible como control de acordeón.

---

### Historia de usuario 12 - Ajustar un valor numérico continuo, como el volumen (Prioridad: P3)

Como desarrollador de las pantallas de ajustes (HUD de audio, panel parental), quiero un componente de control deslizante para ajustar valores numéricos continuos como el volumen, ya que ningún componente existente soporta esta interacción (`Input` solo cubre texto libre, `Progress` es de solo lectura).

**Por qué tiene esta prioridad**: se necesita en las pantallas de ajustes de audio y en el panel parental; no bloquea el flujo principal del juego, se añade según se necesite.

**Prueba independiente**: puede validarse renderizando el control con un rango cerrado (mínimo, máximo, paso) y verificando ajuste por puntero/teclado, normalización de valores fuera de rango y anuncio accesible del valor actual.

**Escenarios de aceptación**:

1. **Given** un rango cerrado (mínimo, máximo, paso), **When** la persona usuaria arrastra o hace clic sobre el control, **Then** el valor se ajusta dentro del rango y se refleja visualmente.
2. **Given** el foco de teclado en el control, **When** se usan las flechas de teclado, **Then** el valor aumenta o disminuye según el paso configurado.
3. **Given** un valor fuera de rango recibido por el componente, **When** se renderiza, **Then** el valor se normaliza al límite válido (mínimo o máximo) más cercano.
4. **Given** el control sin etiqueta visible, **When** se le asigna un nombre accesible alternativo, **Then** el valor actual y el nombre accesible son anunciables por tecnologías de asistencia.
5. **Given** el control en estado deshabilitado, **When** la persona usuaria intenta interactuar con él, **Then** no se dispara ningún cambio de valor y el estado deshabilitado se comunica a tecnologías de asistencia.
6. **Given** un Slider configurado en cada tamaño soportado (`small`, `medium`, `large`), **When** se renderiza, **Then** conserva foco, operabilidad por teclado y un manejador suficientemente grande para interacción táctil en los tres tamaños.
7. **Given** un Slider con `showValue` en su valor por defecto, **When** se renderiza, **Then** muestra el valor numérico actual como texto visible junto al control; **When** `showValue` se establece en `false`, **Then** el valor numérico no se muestra visualmente pero sigue siendo anunciable por tecnologías de asistencia.

---

### Casos límite

* ¿Qué sucede cuando Input no recibe etiqueta visible pero sí nombre accesible alternativo?
* ¿Cómo gestiona el sistema un Input con ayuda y error simultáneos para evitar descripciones contradictorias?
* ¿Qué sucede cuando Progress recibe `max` menor o igual que cero?
* ¿Qué sucede cuando Progress recibe `value` negativo o mayor que `max`?
* ¿Qué sucede cuando Badge incluye icono puramente decorativo frente a icono con significado?
* ¿Qué sucede cuando Dialog recibe contenido vacío pero mantiene título y acción de cierre?
* ¿Qué sucede cuando Panel recibe una colección de elementos en distinto orden de composición?
* ¿Qué sucede cuando Progress oculta el valor visible (`showValue=false`) pero mantiene la etiqueta accesible?
* ¿Qué sucede cuando Dialog o Panel reciben múltiples elementos de contenido (`content`/`actions` como arreglo) en lugar de uno solo?
* ¿Qué sucede cuando Dialog define un texto de cierre (`closeLabel`) distinto del predeterminado?
* ¿Qué sucede cuando Input, Dialog o Slider reciben un tamaño no soportado por el catálogo cerrado?
* ¿Qué sucede cuando una tarjeta de selección (Card/Tile) en estado bloqueado recibe un intento de activación por teclado?
* ¿Qué sucede cuando el componente de lista desplegable (Select) no tiene ninguna opción disponible?
* ¿Qué sucede cuando un grupo de opción única o múltiple se renderiza sin ninguna opción marcada por defecto?
* ¿Qué sucede cuando una pestaña (Tabs) no tiene contenido asociado?
* ¿Qué sucede cuando se disparan varias notificaciones breves (Toast/Snackbar) de forma simultánea?
* ¿Qué sucede cuando se solicita una pista contextual (Tooltip) sobre un elemento deshabilitado?
* ¿Qué sucede cuando el indicador de carga indeterminada (Spinner/Loader) permanece visible durante un tiempo prolongado sin resolución?
* ¿Qué sucede cuando una sección de acordeón (Accordion) recibe contenido vacío?
* ¿Qué sucede cuando Accordion se configura en modo de expansión exclusiva y se expande una sección mientras otra ya está expandida?
* ¿Qué sucede cuando una historia de Storybook de Dialog se renderiza dentro de un iframe con altura fija menor que el contenido del modal?
* ¿Qué sucede cuando un grupo de Tabs define icono en algunas pestañas y en otras no?
* ¿Qué sucede cuando la persona usuaria navega por teclado hacia una pestaña deshabilitada dentro de Tabs?
* ¿Qué sucede cuando Spinner se renderiza sin ninguna etiqueta de texto configurada?
* ¿Qué sucede con las transiciones añadidas (Accordion, RadioGroup/Checkbox, Tabs, Toast, Tooltip) cuando la persona usuaria tiene activada la preferencia de sistema `prefers-reduced-motion`?
* ¿Qué sucede cuando el control deslizante (Slider) recibe un valor fuera del rango `min`/`max`?
* ¿Qué sucede cuando `step` no divide exactamente el rango entre `min` y `max`?
* ¿Qué sucede cuando el control deslizante se renderiza en estado deshabilitado?

## Requisitos *(obligatorio)*

### Requisitos funcionales

* **FR-001**: The system MUST provide five new shared UI components for data entry, grouping, status labeling, progress display, and modal interaction.
* **FR-002**: The system MUST ensure each new shared component is discoverable from its own public entry point in the shared components catalog.
* **FR-003**: WHEN a shared component is published for reuse, the system MUST include behavior verification and usage demonstration artifacts for that component, providing a dedicated, individually named Storybook story for each distinguishable visual state, variant, or branch defined by its public API, not only a single interactive playground with controls.
* **FR-004**: The system MUST keep each shared component independent from educational, astronomical, or game-specific domain logic.
* **FR-005**: WHERE a shared component needs iconography, the system MUST render icons exclusively through the central shared Icon component.
* **FR-006**: IF an icon conveys meaning, THEN the system MUST require an accessible name; IF it is decorative, THEN the system MUST hide it from assistive technologies.
* **FR-007**: The system MUST ensure visual styling of shared components is based on global reusable tokens for color, spacing, shadows, radii, typography, sizing, states, and motion (transition duration and easing).
* **FR-008**: IF a needed visual token does not exist, THEN the system MUST define it in the corresponding global token set before component usage.
* **FR-009**: WHEN Input is rendered, the system MUST expose a native text input interaction and support value, placeholder, disabled, required, help text, and error feedback states.
* **FR-010**: IF Input receives error feedback, THEN the system MUST expose invalid state semantics and associate descriptive help/error text for assistive technologies.
* **FR-011**: WHEN Panel is rendered, the system MUST support composable content as single or multiple HTML elements and provide reusable visual variants.
* **FR-012**: WHEN Badge is rendered, the system MUST provide compact status/category labeling with distinguishable variants that do not rely on color alone.
* **FR-013**: WHEN Progress is rendered, the system MUST expose an accessible progress indicator, normalize out-of-range values safely, and optionally display visible progress value.
* **FR-014**: WHEN Dialog is rendered, the system MUST expose accessible modal semantics, include a clear close action, and allow composition of external action elements.
* **FR-015**: The system MUST ensure shared component APIs remain small, clear, and stable for long-term reuse (in practice: no breaking changes to an existing public prop/event without a new feature spec, per rule A1 in `docs/conventions/components/visual-rules.md`).
* **FR-016**: WHEN shared component changes are validated, the system MUST pass repository quality gates for linting, tests, application build, Storybook build, and component convention checks.
* **FR-017**: The system MUST support evergreen desktop and mobile browsers in the latest two stable versions as the minimum compatibility baseline for shared components.
* **FR-018**: WHEN Dialog opens, the system MUST place initial keyboard focus inside the dialog, keep sequential keyboard navigation within the dialog while it is open, close on Escape, and restore focus to the invoking element when the dialog closes.
* **FR-019**: Input and Dialog MUST support a closed-catalog `size` property (`small | medium | large`, default `medium`) consistent with Button's existing size convention, defaulting safely to `medium` for omitted or unsupported values at runtime.
* **FR-020**: WHEN a shared component's public API allows combining documented edge-case states (Input help text with error simultaneously, Badge consumer-supplied icon alongside its variant, Progress with negative/hidden-value display, Panel or Dialog with multiple composed content elements, Dialog with a custom close label), the system MUST provide a dedicated, individually named Storybook story demonstrating that exact combination, not only its component states in isolation.
* **FR-021**: WHEN Dialog's interactive open/close lifecycle is demonstrated, the system MUST provide at least two fully interactive Storybook stories, each opening the dialog from a different real triggering control (e.g., a button and, separately, an input), visually demonstrating that focus returns to the exact invoking control when the dialog closes.
* **FR-022**: The system MUST provide a Card/Tile component that renders a clickable, grid-selectable unit composed of an icon or image, a title, and a status Badge (e.g., locked/discovered); Card/Tile MUST expose only locked/discovered state and an activation callback, leaving any persistent "currently selected" visual state as the consuming view's responsibility.
* **FR-023**: IF Card/Tile is in a locked/disabled state, THEN the system MUST prevent its selection action from firing and MUST communicate that state to assistive technologies.
* **FR-024**: WHEN Card/Tile is enabled, the system MUST support activation via pointer click and via keyboard (Enter/Space), invoking its selection callback exactly once per interaction.
* **FR-025**: The system MUST provide a Select/Dropdown component built on the native browser `<select>` element to choose exactly one option from a closed list, exposing an effective accessible name and full keyboard operability inherited from the native element.
* **FR-026**: The system MUST provide RadioGroup and Checkbox(-group) components for single-choice and multiple-choice selection respectively, each exposing an accessible group name distinguishable by assistive technologies.
* **FR-027**: The system MUST provide a Tabs component that associates each tab with exactly one content panel, following the standard accessible tabs/tabpanel pattern, including arrow-key navigation between tabs.
* **FR-028**: The system MUST provide a Tooltip component that reveals contextual help text on pointer hover or keyboard focus, exposes it to assistive technologies, hides it when hover/focus is lost, does not block interaction with the rest of the page, and on touch devices (where hover is unavailable) MUST reveal/hide via a tap-to-toggle interaction on the associated element.
* **FR-029**: The system MUST provide a Toast/Snackbar component for transient, non-blocking feedback messages with a default auto-dismiss duration of 4000 ms, that does not require an explicit closing interaction and does not trap keyboard focus, distinguishing it from Dialog's blocking modal behavior; WHEN multiple Toast/Snackbar notifications are triggered simultaneously, the system MUST stack them so all remain simultaneously visible without discarding or delaying any of them.
* **FR-030**: The system MUST provide a Spinner/Loader component that exposes accessible indeterminate loading semantics, distinct from Progress's determinate value/max semantics.
* **FR-031**: The system MUST provide an Accordion component with independently expandable/collapsible content sections, exposing expanded/collapsed state to assistive technologies.
* **FR-032**: The system MUST keep the nine components introduced by FR-022 to FR-031 independent from educational, astronomical, or game-specific domain logic, per the same rule already stated in FR-004.
* **FR-033**: Accordion MUST animate the expanded/collapsed transition of each section using CSS instead of an instantaneous visibility change.
* **FR-034**: Accordion MUST support an optional, consumer-configurable exclusive-expansion mode where expanding one section automatically collapses any other currently expanded section; the default behavior (independent multi-section expansion, per FR-031) MUST remain unchanged when this mode is not enabled.
* **FR-035**: Accordion's section header MUST expose a clear visual affordance that it is expandable/collapsible (an expanded/collapsed indicator icon rendered through the shared Icon component, plus sufficient header contrast/visual hierarchy), so the control is recognizable as an accordion without relying solely on cursor affordance.
* **FR-036**: The Storybook iframe used to render each component story MUST size its height to the rendered content of that story instead of a fixed height, so that content such as Dialog's modal is not visually clipped.
* **FR-037**: RadioGroup and Checkbox(-group) MUST animate their checked/unchecked visual state transition using CSS instead of an instantaneous state change.
* **FR-038**: Select's dropdown indicator MUST be rendered through the shared Icon component instead of relying on the native browser marker, and MUST maintain visible spacing from the field's right edge, without changing Select's underlying native `<select>` element (FR-025).
* **FR-039**: Spinner's text label MUST remain optional in practice: WHEN no label is provided, the system MUST render only the visual spinning indicator while still exposing an accessible name, without forcing visible text.
* **FR-040**: Tabs MUST animate the transition of the active panel using CSS when switching between tabs.
* **FR-041**: Tabs MUST support individually disabled tabs; a disabled tab MUST NOT activate via pointer click or keyboard, MUST be skipped by arrow-key navigation between tabs, and MUST expose its disabled state to assistive technologies.
* **FR-042**: WHEN any tab in a Tabs group defines an icon, THEN the system MUST require every tab in that same group to define an icon; a group mixing tabs with and without icons MUST be treated as an invalid configuration, consistent with the existing icon/imageSrc validation pattern already used by Card/Tile (FR-022).
* **FR-043**: Toast/Snackbar MUST animate its appearance and dismissal using an enter/exit transition instead of an instantaneous show/hide.
* **FR-044**: Tooltip MUST apply a default show delay of 300 ms before showing on pointer hover or keyboard focus; hiding and the touch tap-to-toggle interaction (FR-028) MUST remain immediate.
* **FR-045**: WHEN the user has `prefers-reduced-motion: reduce` enabled, the system MUST fully disable the CSS transitions introduced by FR-033, FR-037, FR-040, and FR-043, and MUST reduce Tooltip's show delay (FR-044) to 0, so all affected state changes become instantaneous instead of partially shortened.
* **FR-046**: The CSS transitions and show delay introduced by FR-033, FR-037, FR-040, FR-043, and FR-044 MUST consume a shared global motion token set (duration and easing) instead of component-specific ad hoc values, consistent with the token-based styling rule already stated in FR-007/FR-008.
* **FR-047**: The system MUST provide a Slider/Range component built on the native browser `<input type="range">` element, exposing a single continuous numeric value with configurable minimum, maximum, and step, inheriting native keyboard and accessibility support (as already decided for Select's native `<select>`, FR-025), and normalizing any out-of-range value it receives to the nearest valid bound. WHEN `step` does not evenly divide the `[min, max]` range, the system MUST rely on the native browser rounding behavior of `<input type="range">` to snap to the nearest valid step-aligned value, without reimplementing custom rounding logic.
* **FR-048**: The system MUST keep the component introduced by FR-047 independent from educational, astronomical, or game-specific domain logic, per the same rule already stated in FR-004/FR-032.
* **FR-049**: Slider MUST support the same closed-catalog `size` property (`small | medium | large`, default `medium`) already defined by FR-019 for Input and Dialog, ensuring a sufficiently large pointer/touch target at each size for the project's child-focused interaction requirements (constitution principle I).
* **FR-050**: Slider MUST support an optional `showValue` boolean property, defaulting to `true` (consistent with Progress's existing `showValue` default per its implementation), to render its current numeric value as visible text alongside the control; when `showValue` is `false`, the value MUST remain announced to assistive technologies even though it is not visually rendered.
* **FR-051**: Slider's `value` property MUST be optional; when omitted, the component MUST default to the configured `min` bound rather than leaving the value undefined or `NaN`.

### Entidades clave *(incluir si la funcionalidad implica datos)*

* **Shared Component Definition**: representa un componente reutilizable con propósito, API pública, variantes visuales y contratos de accesibilidad.
* **Component Public API**: representa propiedades, callbacks y capacidades de composición expuestas para uso en vistas consumidoras.
* **Visual Variant**: representa una configuración de apariencia y estado que comunica diferencias de uso sin depender únicamente de color.
* **Accessibility Descriptor**: representa metadatos de nombre/estado/descripción que permiten interacción correcta con tecnologías de asistencia.
* **Icon Catalog Entry**: representa un icono disponible en el catálogo central con semántica de uso decorativa o informativa.
* **Selectable Grid Item**: representa una unidad interactiva de cuadrícula (Card/Tile) con estado seleccionable/bloqueado y etiquetado de estado.
* **Closed Option List**: representa el conjunto cerrado de opciones ofrecido por Select, RadioGroup o Checkbox(-group).
* **Choice Group**: representa una agrupación accesible de controles de selección única o múltiple con nombre de grupo.
* **Tab Section**: representa la asociación entre una pestaña y su panel de contenido asociado.
* **Contextual Hint**: representa el texto explicativo bajo demanda mostrado por Tooltip.
* **Transient Notification**: representa un mensaje de feedback no bloqueante con ciclo de vida propio (Toast/Snackbar).
* **Loading Indicator**: representa un estado de carga indeterminada sin valor de progreso medible (Spinner/Loader).
* **Expandable Section**: representa una sección de contenido con estado expandido/colapsado (Accordion).
* **Motion Token**: representa un valor global reutilizable de duración/easing consumido por las transiciones y el retardo de Tooltip introducidos en el refinamiento de interacción.
* **Range Control Value**: representa el valor numérico continuo ajustable expuesto por Slider, junto con sus límites mínimo/máximo y su paso; cuando no se proporciona un valor explícito, se inicializa con el límite mínimo configurado.

## Suposiciones y dependencias

* Se asume que la librería compartida existente mantiene los patrones de `Button` e `Icon` como referencias de reutilización.
* Se asume que los consumidores de estos componentes operan en el mismo entorno de renderizado HTML del repositorio.
* Se asume que la validación automática del repositorio continuará siendo la puerta de calidad para aceptar cambios en componentes compartidos.
* Dependencia funcional: la nueva base de componentes extiende la arquitectura definida en `001-component-library-architecture` y convive con los contratos de `002-button-variants`.
* Se asume que los 9 componentes añadidos en la ampliación 2026-08-16 (Card/Tile, Select, RadioGroup, Checkbox, Tabs, Tooltip, Toast/Snackbar, Spinner/Loader, Accordion), aunque motivados por las pantallas de un juego educativo de astronomía (selección de planetas, quiz, progreso), permanecen agnósticos de dominio igual que los componentes base, por FR-004/FR-032; el contexto de juego solo motiva el caso de uso y no forma parte de la API pública.
* Se asume una implementación incremental por oleadas de prioridad: P1 (Card/Tile, Select) antes que P2 (RadioGroup/Checkbox, Tabs, Toast/Snackbar) antes que P3 (Tooltip, Spinner/Loader, Accordion), sin bloquear una oleada a la siguiente.
* Se asume que el refinamiento de interacción y microanimaciones incorporado en la sesión 2026-08-18 (FR-033 a FR-045) extiende esta misma spec/rama (`003-shared-components-base`), por el mismo criterio ya aplicado a la ampliación de catálogo del 2026-08-16: forma parte del mismo esfuerzo de librería compartida y no requiere una spec ni una rama independiente.
* Se asume que el componente Slider incorporado en la sesión 2026-08-19 (FR-047/FR-048), aunque motivado por el control de volumen del HUD de audio (`specs_pending/024`) y del panel parental (`specs_pending/027`), permanece agnóstico de dominio igual que el resto del catálogo, por el mismo criterio ya aplicado a las ampliaciones anteriores; se implementa con prioridad P3, sin bloquear el resto de oleadas ya en curso.

## Criterios de éxito *(obligatorio)*

### Resultados medibles

* **SC-001**: El catálogo compartido incorpora los 5 componentes base originales de esta feature (Input, Panel, Badge, Progress y Dialog) con entrada pública independiente y sin duplicar componentes de feature. Junto con los 9 componentes adicionales de la ampliación 2026-08-16 (regidos por SC-010) y el componente Slider de la ampliación 2026-08-19 (regido por SC-021), esta feature aporta un total de 15 componentes nuevos al catálogo compartido.
* **SC-002**: El 100% de los nuevos componentes incluye cobertura de pruebas de comportamiento y accesibilidad básica, además de una historia de Storybook dedicada y nombrada por cada estado/variante/rama visual distinguible de su API pública (por ejemplo: variantes de Badge/Panel, estados de error/deshabilitado/ayuda de Input, valores límite de Progress, flujos de Dialog), sin depender únicamente de un playground interactivo con controles.
* **SC-003**: El 100% de los estilos de los nuevos componentes consume tokens globales reutilizables y registra 0 incidencias por valores visuales ad hoc en la validación de revisión.
* **SC-004**: El 100% de usos de iconografía en nuevos componentes se resuelve mediante el catálogo central de Icon y registra 0 importaciones directas de fuentes de iconos externas.
* **SC-005**: El gate de calidad del repositorio se completa con éxito en cada cambio de esta feature, incluyendo lint, pruebas, build de aplicación, build de Storybook y validación de convenciones de componentes.
* **SC-006**: El 100% de escenarios críticos de uso de los 5 componentes (Input al escribir, Progress al actualizar, Dialog al abrir/cerrar) registra latencia <= 100 ms en al menos 8 de 10 iteraciones, por cada navegador evergreen de escritorio y móvil objetivo dentro de las últimas 2 versiones estables.
* **SC-007**: El 100% de pruebas de accesibilidad de Dialog valida ciclo completo de foco de teclado (entrada, confinamiento durante apertura, cierre por Escape y retorno al invocador) sin fallos.
* **SC-008**: El 100% de las variantes de tamaño (`small`, `medium`, `large`) de Input y Dialog se renderiza correctamente y pasa las validaciones de estilo/accesibilidad existentes, siguiendo el mismo patrón que Button.
* **SC-009**: El 100% de las combinaciones de casos límite documentadas (ayuda+error en Input, icono de consumidor en Badge, valor negativo/oculto en Progress, contenido múltiple en Panel/Dialog, `closeLabel` personalizado en Dialog) cuenta con una historia de Storybook nombrada que la demuestra explícitamente, y Dialog incluye al menos 2 historias interactivas (invocador botón e invocador input) con retorno de foco verificado visualmente.
* **SC-010**: El catálogo compartido incorpora los 9 componentes adicionales de esta ampliación (Card/Tile, Select, RadioGroup, Checkbox, Tabs, Tooltip, Toast/Snackbar, Spinner/Loader, Accordion) con entrada pública independiente, implementados en 3 oleadas de prioridad (P1: Card/Tile y Select; P2: RadioGroup/Checkbox, Tabs y Toast/Snackbar; P3: Tooltip, Spinner/Loader y Accordion).
* **SC-011**: El 100% de los componentes de esta ampliación incluye cobertura de pruebas de comportamiento/accesibilidad básica y al menos una historia de Storybook nombrada por estado/variante distinguible, siguiendo el mismo estándar exigido por SC-002.
* **SC-012**: El 100% de los componentes de selección (Card/Tile, Select, RadioGroup, Checkbox) es completamente operable por teclado y expone su estado de selección/bloqueo a tecnologías de asistencia sin fallos.
* **SC-013**: El 100% de Tabs, Toast/Snackbar y Accordion cumple los patrones de accesibilidad WAI-ARIA correspondientes (pestaña/panel, región en vivo, expandido/colapsado) sin fallos en pruebas.
* **SC-014**: El 100% de las transiciones añadidas a Accordion, RadioGroup/Checkbox, Tabs y Toast/Snackbar se ejecuta mediante CSS consumiendo el token global de movimiento (sin animar frame a frame por JavaScript ni valores de duración/easing ad hoc) y resulta perceptible visualmente en la validación manual de Storybook.
* **SC-015**: El acordeón en modo de expansión exclusiva mantiene como máximo una sección expandida en todo momento durante pruebas automatizadas, mientras que en su configuración por defecto conserva expansión múltiple independiente sin regresiones.
* **SC-016**: El 100% de las historias de Storybook de Dialog se visualiza sin recorte de contenido dentro de su iframe.
* **SC-017**: El 100% de los grupos de Tabs con configuración de iconos mixta (algunas pestañas con icono y otras sin) es detectado como configuración inválida en pruebas automatizadas; el 100% de pestañas deshabilitadas es ignorado correctamente por la navegación por teclado y por la activación por puntero.
* **SC-018**: El 100% de instancias de Spinner sin etiqueta configurada conserva un nombre accesible verificable, sin renderizar texto visible.
* **SC-019**: Tooltip muestra su contenido tras un retardo por defecto de 300 ms (no instantáneamente) en el 100% de pruebas de interacción por hover/foco, mientras que su ocultamiento y la activación táctil por tap permanecen inmediatos.
* **SC-020**: El 100% de pruebas automatizadas con `prefers-reduced-motion: reduce` activo verifica que las transiciones de Accordion, RadioGroup/Checkbox, Tabs y Toast/Snackbar, y el retardo de Tooltip, se comportan de forma instantánea (duración/retardo en 0), sin regresiones respecto al comportamiento animado por defecto.
* **SC-021**: El 100% de instancias de Slider expone semántica ARIA de control deslizante (rol, valor actual, mínimo y máximo anunciables), es completamente operable por teclado (flechas) y normaliza el 100% de los valores fuera de rango recibidos en pruebas automatizadas. El 100% de sus variantes de tamaño (`small`, `medium`, `large`) se renderiza correctamente y pasa las validaciones de estilo/accesibilidad existentes, siguiendo el mismo patrón que Button/Input/Dialog (SC-008).
