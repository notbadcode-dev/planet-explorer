---
title: "Variantes del componente Button"
feature: "002-button-variants"
type: "feature-spec"
version: "1.0"
created: "2026-08-15"
updated: "2026-08-15"
status: "Draft"
priority: "P1"
tags: [frontend, ui, accessibility]
dependencies: ["001-component-library-architecture"]
related_specs: ["001-component-library-architecture"]
---

# Especificación de funcionalidad: Variantes del componente Button

**Rama de la funcionalidad**: `002-button-variants`

**Creado**: 2026-08-15

**Estado**: Draft

**Entrada**: Descripción del usuario: "Quiero que el componente button de libs/components tenga variantes para poder albergar todo los botones necesarios"

## Clarifications

### Session 2026-08-15

- Q: ¿Qué tamaño mínimo de área táctil (hit area) debe garantizar el botón en su variante `small`, para cumplir el requisito constitucional de que las interacciones principales funcionen en pantalla táctil? → A: 44×44 px CSS mínimo garantizado (hit area), incluso si el tamaño visual de `small` es más compacto.

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Elegir el énfasis visual del botón (Prioridad: P1)

Como persona que desarrolla una pantalla del juego, quiero poder indicar si un botón representa la acción principal, una acción secundaria o una acción destructiva/irreversible, para que la interfaz comunique visualmente la importancia y el riesgo de cada acción sin tener que crear un componente distinto para cada caso.

**Por qué tiene esta prioridad**: Es la necesidad explícita que motiva la funcionalidad ("albergar todos los botones necesarios"). Sin esto, cada pantalla seguiría necesitando estilos ad-hoc o componentes duplicados, lo que contradice la convención de componentes compartidos del proyecto.

**Prueba independiente**: Se puede probar completamente creando tres botones con `variant: 'primary'`, `variant: 'secondary'` y `variant: 'danger'` y verificando que cada uno tiene un tratamiento visual distinto y perceptible, y que los tres siguen siendo accesibles y funcionales.

**Escenarios de aceptación**:

1. **Given** ninguna variante ha sido especificada, **When** se crea el botón, **Then** el botón se renderiza con la variante `primary` (comportamiento equivalente al del componente actual).
2. **Given** se especifica `variant: 'secondary'`, **When** se crea el botón, **Then** el botón se renderiza con un tratamiento visual distinto al de `primary`, perceptible sin depender únicamente del color.
3. **Given** se especifica `variant: 'danger'`, **When** se crea el botón, **Then** el botón se renderiza con un tratamiento visual que comunica riesgo/irreversibilidad, distinto de `primary` y `secondary`.
4. **Given** un botón con cualquier variante, **When** el botón está `disabled`, **Then** se aplica el tratamiento visual de deshabilitado de forma consistente, independientemente de la variante.

---

### Historia de usuario 2 - Elegir el tamaño del botón (Prioridad: P2)

Como persona que desarrolla una pantalla del juego, quiero poder indicar el tamaño de un botón (pequeño, mediano o grande), para adaptarlo a distintos contextos de la interfaz (por ejemplo, una barra de herramientas compacta frente a una llamada a la acción destacada).

**Por qué tiene esta prioridad**: Complementa la variante semántica pero no es la necesidad principal expresada por el usuario; sin tamaños, el botón seguiría cubriendo la mayoría de los casos de uso con un único tamaño por defecto.

**Prueba independiente**: Se puede probar completamente creando tres botones con `size: 'small'`, `size: 'medium'` y `size: 'large'` y verificando que cada uno tiene dimensiones (padding/tipografía) perceptiblemente distintas, manteniendo el resto del comportamiento (accesibilidad, eventos) sin cambios.

**Escenarios de aceptación**:

1. **Given** ningún tamaño ha sido especificado, **When** se crea el botón, **Then** el botón se renderiza con el tamaño `medium`.
2. **Given** se especifica `size: 'small'`, **When** se crea el botón, **Then** el botón se renderiza con un tamaño reducido respecto a `medium`, manteniendo un área táctil mínima de 44×44 px CSS aunque el tamaño visible sea menor.
3. **Given** se especifica `size: 'large'`, **When** se crea el botón, **Then** el botón se renderiza con un tamaño mayor respecto a `medium`.
4. **Given** cualquier combinación de `variant` y `size`, **When** se crea el botón, **Then** ambas dimensiones (énfasis visual y tamaño) se aplican de forma independiente y combinable.

---

### Historia de usuario 3 - Mantener la compatibilidad de los usos existentes (Prioridad: P3)

Como persona que mantiene el proyecto, quiero que los botones ya creados antes de esta funcionalidad (sin `variant` ni `size` especificados) sigan funcionando y viéndose igual que antes, para no introducir una regresión visual ni de comportamiento al ampliar el componente.

**Por qué tiene esta prioridad**: Es una condición de seguridad de la migración más que una nueva capacidad; se prioriza en tercer lugar porque depende de que las dos historias anteriores estén implementadas primero, pero es indispensable antes de considerar la funcionalidad completa.

**Prueba independiente**: Se puede probar completamente ejecutando las pruebas unitarias y las historias de Storybook existentes del componente `Button` (previas a esta funcionalidad) sin modificarlas y verificando que siguen pasando.

**Escenarios de aceptación**:

1. **Given** código existente que llama a `createButton` sin `variant` ni `size`, **When** se ejecuta, **Then** el resultado es idéntico en comportamiento y equivalente en apariencia al botón anterior a esta funcionalidad.
2. **Given** las pruebas unitarias y contractuales existentes del componente `Button`, **When** se ejecutan tras esta funcionalidad, **Then** todas continúan pasando sin modificaciones.

---

### Casos límite

* ¿Qué sucede si se pasa un valor de `variant` o `size` no soportado (por ejemplo, desde código JavaScript sin tipos que evite la comprobación de TypeScript)? El sistema MUST aplicar el valor por defecto correspondiente en lugar de lanzar un error o renderizar un botón sin estilo.
* ¿Cómo se combina `disabled` con la variante `danger`? El tratamiento visual de deshabilitado MUST prevalecer y seguir comunicando claramente que el botón no es interactivo.
* ¿Qué sucede con un botón `danger` que solo tiene `ariaLabel` (sin `label` visible, ver Historia de usuario 3 de la spec 001)? MUST seguir siendo obligatorio un nombre accesible, igual que en cualquier otra variante.
* ¿Qué sucede si una pantalla necesita una variante o tamaño no cubierto por este catálogo inicial? Queda fuera de alcance de esta funcionalidad (ver Suposiciones); se resolvería en una futura ampliación del contrato.
* ¿Qué sucede si el tamaño visual de `size: 'small'` es menor que el área táctil mínima requerida? El sistema MUST ampliar el área interactiva (por ejemplo, mediante padding o hit-area invisible) hasta alcanzar al menos 44×44 px CSS, sin necesidad de agrandar el contenido visible.

## Requisitos *(obligatorio)*

### Requisitos funcionales

* **FR-001**: The system MUST support a `variant` prop on the `Button` component with, at least, the values `primary`, `secondary` and `danger`.
* **FR-002**: WHERE no `variant` is provided, the system MUST default to `primary`, preserving the current visual behavior of existing consumers.
* **FR-003**: The system MUST support a `size` prop on the `Button` component with, at least, the values `small`, `medium` and `large`.
* **FR-004**: WHERE no `size` is provided, the system MUST default to `medium`.
* **FR-005**: The system MUST apply `variant` and `size` independently of each other, so any combination of the two is valid.
* **FR-006**: WHILE `disabled` is `true`, the system MUST apply a disabled visual treatment consistently across all variants and sizes.
* **FR-007**: The system MUST preserve every existing contract rule of the `Button` component (accessible name required via `label` or `ariaLabel`, `onClick` MUST NOT fire while disabled, the returned element MUST be a native `<button>`) regardless of the `variant` or `size` selected.
* **FR-008**: IF an unsupported `variant` or `size` value is received at runtime (e.g. from untyped JavaScript callers bypassing the TypeScript union type), THEN the system MUST fall back to the corresponding default value instead of throwing or producing an unstyled element.
* **FR-009**: The system MUST NOT rely exclusively on color to distinguish the `danger` variant from `primary` and `secondary` (e.g. it MUST also differ in another visual trait such as border, icon marker or label convention), in line with the project's accessibility rule against color-only communication.
* **FR-010**: The system MUST document the full set of supported `variant` and `size` values in the component's public contract, so downstream consumers know the closed catalogue available.
* **FR-011**: WHERE `size` is `small`, the system MUST guarantee a minimum touch/tap target of 44×44 CSS px, even when the visible/visual dimensions are smaller (e.g. via invisible padding or an expanded hit area), in line with the project's touch-first accessibility requirement.

### Entidades clave

* **Variante de botón (`variant`)**: dimensión semántica/visual del botón que comunica su énfasis o nivel de riesgo. Valores del catálogo inicial: `primary` (acción principal, por defecto), `secondary` (acción alternativa/menos destacada), `danger` (acción destructiva o irreversible).
* **Tamaño de botón (`size`)**: dimensión visual del botón que determina sus dimensiones relativas. Valores del catálogo inicial: `small`, `medium` (por defecto), `large`.

## Criterios de éxito *(obligatorio)*

### Resultados medibles

* **SC-001**: Cualquier pantalla nueva del proyecto puede expresar sus tres necesidades de botón más comunes (acción principal, acción secundaria, acción destructiva) usando únicamente el componente `Button` compartido, sin crear estilos ni componentes ad-hoc.
* **SC-002**: El 100% de los usos existentes de `createButton` anteriores a esta funcionalidad siguen funcionando y renderizándose de forma equivalente sin cambios en su código de llamada.
* **SC-003**: Las tres variantes (`primary`, `secondary`, `danger`) son distinguibles entre sí por una persona con daltonismo, sin depender únicamente del color.
* **SC-004**: Los tres tamaños (`small`, `medium`, `large`) son perceptiblemente distintos entre sí en una comprobación visual directa (Storybook), manteniendo en todos los casos un área táctil de al menos 44×44 px CSS.

## Suposiciones

* El catálogo inicial de variantes se limita a `primary`, `secondary` y `danger`; variantes adicionales (por ejemplo `tertiary`, `ghost` o `link`) quedan fuera de alcance de esta primera versión y podrán añadirse en una futura ampliación si surge una necesidad concreta.
* El catálogo inicial de tamaños se limita a `small`, `medium` y `large`; no se contemplan tamaños intermedios ni una API de tamaño arbitrario (numérico/CSS libre).
* Los botones con icono incorporado (sin biblioteca de iconos disponible en el proyecto, según el contrato de la spec `001-component-library-architecture`) siguen fuera de alcance; esta funcionalidad no introduce soporte de iconos.
* El comportamiento de accesibilidad ya definido en el contrato actual del componente (nombre accesible obligatorio, `disabled` nativo, `onClick` no se invoca si está deshabilitado) se mantiene sin cambios; esta funcionalidad solo añade dimensiones visuales/semánticas nuevas.
* `variant` y `size` se implementan como props opcionales adicionales de `ButtonProps`, sin romper la firma pública existente (`label`, `ariaLabel`, `onClick`, `disabled`).
