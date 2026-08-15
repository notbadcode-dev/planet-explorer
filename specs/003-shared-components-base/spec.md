---
title: "Base mínima de componentes compartidos reutilizables"
feature: "003-shared-components-base"
type: "feature-spec"
version: "1.0"
created: "2026-08-16T00:00:00Z"
updated: "2026-08-16T00:28:00Z"
status: "Draft"
priority: "P1"
tags: [ui, components, accessibility, testing, architecture, design-system]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Especificación de funcionalidad: Base mínima de componentes compartidos reutilizables

**Rama de la funcionalidad**: `003-shared-components-base`

**Creado**: 2026-08-16

**Estado**: Draft

**Entrada**: Descripción del usuario: "Crear una base mínima de componentes compartidos reutilizables en libs/components para construir vistas sin duplicar UI, incorporando Input, Panel, Badge, Progress y Dialog con accesibilidad, composición, pruebas y consistencia visual."

## Clarifications

### Session 2026-08-16

- Q: ¿Qué alcance de compatibilidad de navegación debe ser obligatorio para aceptar esta feature? → A: Navegadores evergreen de escritorio y móvil (últimas 2 versiones estables).
- Q: ¿Qué comportamiento de teclado debe ser obligatorio para Dialog al abrirse y cerrarse? → A: Al abrir, foco inicial dentro del diálogo; Tab atrapado dentro; Escape cierra; al cerrar, retorno del foco al elemento invocador.

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Construir entradas y feedback consistentes (Prioridad: P1)

Como desarrollador de vistas de la aplicación, quiero usar componentes compartidos de entrada y feedback para capturar datos y comunicar estado sin reescribir UI en cada pantalla.

**Por qué tiene esta prioridad**: habilita el flujo más frecuente (captura de datos y estado) y reduce duplicación desde el primer uso.

**Prueba independiente**: puede validarse creando una vista simple con Input, Badge y Progress, verificando que cubre estados visuales y requisitos básicos de accesibilidad.

**Escenarios de aceptación**:

1. **Given** una vista nueva sin componentes locales, **When** el desarrollador integra Input, Badge y Progress compartidos, **Then** la vista puede capturar texto y mostrar estado/avance sin crear componentes duplicados.
2. **Given** un Input con error y ayuda contextual, **When** se renderiza el campo, **Then** el estado inválido y la descripción asociada son anunciables por tecnologías de asistencia.
3. **Given** valores de progreso fuera de rango, **When** se renderiza Progress, **Then** el valor mostrado y anunciado se normaliza al rango válido definido.

---

### Historia de usuario 2 - Componer bloques de contenido reutilizables (Prioridad: P2)

Como desarrollador, quiero encapsular contenido y acciones en Panel y Dialog para crear secciones y modales reutilizables sin acoplarlas a una feature concreta.

**Por qué tiene esta prioridad**: permite composición estructural de pantallas y acciones críticas (confirmaciones, alertas, tareas guiadas).

**Prueba independiente**: puede validarse montando un Panel con contenido dinámico y un Dialog con acciones de cierre y botones reutilizados.

**Escenarios de aceptación**:

1. **Given** contenido compuesto por elementos HTML existentes, **When** se pasa a Panel o Dialog, **Then** el contenido se renderiza sin pérdida de estructura ni restricciones de dominio.
2. **Given** un Dialog abierto con acción de cierre visible, **When** la persona usuaria activa cerrar, **Then** se dispara el callback de cierre exactamente una vez por interacción.
3. **Given** variantes visuales de Panel, **When** se representan en Storybook, **Then** cada variante se distingue de forma clara por más de una señal visual.

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

### Casos límite

* ¿Qué sucede cuando Input no recibe etiqueta visible pero sí nombre accesible alternativo?
* ¿Cómo gestiona el sistema un Input con ayuda y error simultáneos para evitar descripciones contradictorias?
* ¿Qué sucede cuando Progress recibe `max` menor o igual que cero?
* ¿Qué sucede cuando Progress recibe `value` negativo o mayor que `max`?
* ¿Qué sucede cuando Badge incluye icono puramente decorativo frente a icono con significado?
* ¿Qué sucede cuando Dialog recibe contenido vacío pero mantiene título y acción de cierre?
* ¿Qué sucede cuando Panel recibe una colección de elementos en distinto orden de composición?

## Requisitos *(obligatorio)*

### Requisitos funcionales

* **FR-001**: The system MUST provide five new shared UI components for data entry, grouping, status labeling, progress display, and modal interaction.
* **FR-002**: The system MUST ensure each new shared component is discoverable from its own public entry point in the shared components catalog.
* **FR-003**: WHEN a shared component is published for reuse, the system MUST include behavior verification and usage demonstration artifacts for that component.
* **FR-004**: The system MUST keep each shared component independent from educational, astronomical, or game-specific domain logic.
* **FR-005**: WHERE a shared component needs iconography, the system MUST render icons exclusively through the central shared Icon component.
* **FR-006**: IF an icon conveys meaning, THEN the system MUST require an accessible name; IF it is decorative, THEN the system MUST hide it from assistive technologies.
* **FR-007**: The system MUST ensure visual styling of shared components is based on global reusable tokens for color, spacing, shadows, radii, typography, sizing, and states.
* **FR-008**: IF a needed visual token does not exist, THEN the system MUST define it in the corresponding global token set before component usage.
* **FR-009**: WHEN Input is rendered, the system MUST expose a native text input interaction and support value, placeholder, disabled, required, help text, and error feedback states.
* **FR-010**: IF Input receives error feedback, THEN the system MUST expose invalid state semantics and associate descriptive help/error text for assistive technologies.
* **FR-011**: WHEN Panel is rendered, the system MUST support composable content as single or multiple HTML elements and provide reusable visual variants.
* **FR-012**: WHEN Badge is rendered, the system MUST provide compact status/category labeling with distinguishable variants that do not rely on color alone.
* **FR-013**: WHEN Progress is rendered, the system MUST expose an accessible progress indicator, normalize out-of-range values safely, and optionally display visible progress value.
* **FR-014**: WHEN Dialog is rendered, the system MUST expose accessible modal semantics, include a clear close action, and allow composition of external action elements.
* **FR-015**: The system MUST ensure shared component APIs remain small, clear, and stable for long-term reuse.
* **FR-016**: WHEN shared component changes are validated, the system MUST pass repository quality gates for linting, tests, application build, Storybook build, and component convention checks.
* **FR-017**: The system MUST support evergreen desktop and mobile browsers in the latest two stable versions as the minimum compatibility baseline for shared components.
* **FR-018**: WHEN Dialog opens, the system MUST place initial keyboard focus inside the dialog, keep sequential keyboard navigation within the dialog while it is open, close on Escape, and restore focus to the invoking element when the dialog closes.

### Entidades clave *(incluir si la funcionalidad implica datos)*

* **Shared Component Definition**: representa un componente reutilizable con propósito, API pública, variantes visuales y contratos de accesibilidad.
* **Component Public API**: representa propiedades, callbacks y capacidades de composición expuestas para uso en vistas consumidoras.
* **Visual Variant**: representa una configuración de apariencia y estado que comunica diferencias de uso sin depender únicamente de color.
* **Accessibility Descriptor**: representa metadatos de nombre/estado/descripción que permiten interacción correcta con tecnologías de asistencia.
* **Icon Catalog Entry**: representa un icono disponible en el catálogo central con semántica de uso decorativa o informativa.

## Suposiciones y dependencias

* Se asume que la librería compartida existente mantiene los patrones de `Button` e `Icon` como referencias de reutilización.
* Se asume que los consumidores de estos componentes operan en el mismo entorno de renderizado HTML del repositorio.
* Se asume que la validación automática del repositorio continuará siendo la puerta de calidad para aceptar cambios en componentes compartidos.
* Dependencia funcional: la nueva base de componentes extiende la arquitectura definida en `001-component-library-architecture` y convive con los contratos de `002-button-variants`.

## Criterios de éxito *(obligatorio)*

### Resultados medibles

* **SC-001**: El catálogo compartido incorpora exactamente 5 nuevos componentes reutilizables (Input, Panel, Badge, Progress y Dialog) con entrada pública independiente y sin duplicar componentes de feature.
* **SC-002**: El 100% de los nuevos componentes incluye cobertura de pruebas de comportamiento y accesibilidad básica, además de historias de estados visuales relevantes.
* **SC-003**: El 100% de los estilos de los nuevos componentes consume tokens globales reutilizables y registra 0 incidencias por valores visuales ad hoc en la validación de revisión.
* **SC-004**: El 100% de usos de iconografía en nuevos componentes se resuelve mediante el catálogo central de Icon y registra 0 importaciones directas de fuentes de iconos externas.
* **SC-005**: El gate de calidad del repositorio se completa con éxito en cada cambio de esta feature, incluyendo lint, pruebas, build de aplicación, build de Storybook y validación de convenciones de componentes.
* **SC-006**: El 100% de escenarios críticos de uso de los 5 componentes funciona de forma consistente en navegadores evergreen de escritorio y móvil dentro de las últimas 2 versiones estables.
* **SC-007**: El 100% de pruebas de accesibilidad de Dialog valida ciclo completo de foco de teclado (entrada, confinamiento durante apertura, cierre por Escape y retorno al invocador) sin fallos.
