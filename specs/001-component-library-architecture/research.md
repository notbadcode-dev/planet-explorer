---
title: "Librería de componentes UI: arquitectura y componente Button — Investigación técnica"
feature: "001-component-library-architecture"
type: "research"
version: "1.0"
created: "2026-08-15"
updated: "2026-08-15"
status: "Approved"
spec: "./spec.md"
plan: "./plan.md"
tags: [frontend, ui, testing, documentation, architecture]
dependencies: []
related_specs: []
---

# Investigación técnica: Librería de componentes UI: arquitectura y componente Button

**Entrada**: `spec.md`, `plan.md` y contexto técnico disponible en `/specs/001-component-library-architecture/`

**Propósito**: Resolver las incertidumbres técnicas necesarias para completar el diseño de la arquitectura de `libs/components/` y del primer componente, `Button`.

## Objetivo de la investigación

Determinar cómo implementar y documentar componentes de interfaz reutilizables (empezando por `Button`) sin infringir la restricción constitucional de no incorporar Angular/React/Vue sin justificación, manteniendo la solución más simple posible (principio de Simplicidad primero) y compatible con el resto del stack ya fijado por la constitución (TypeScript strict, Vite, Vitest, ESLint, Prettier).

## Fuentes y restricciones

* **Constitución**: `../../.specify/memory/constitution.md` — secciones "Arquitectura y tecnología", "Componentes compartidos", "Simplicidad primero", "Accesibilidad", "CI/CD y despliegue".
* **Especificación**: `./spec.md`
* **Plan**: `./plan.md`
* **Código existente**: N/A — el repositorio no contiene todavía `package.json` ni código fuente; esta es la primera funcionalidad implementada.
* **Documentación oficial**: Documentación de Storybook (renderers `html-vite`), documentación de Vitest (`environment`), documentación de `happy-dom`.
* **Restricciones aplicables**: Sin Angular/React/Vue sin justificación explícita; compatibilidad total con GitHub Pages (hosting estático, sin server-side); componentes sin lógica de negocio.

## Resumen de decisiones

| ID    | Tema                                             | Decisión                                                        | Estado     |
| ----- | ------------------------------------------------ | ----------------------------------------------------------------- | ---------- |
| R-001 | Implementación de componentes sin framework de UI | Funciones TypeScript que crean elementos DOM nativos               | Resolved   |
| R-002 | Integración de Storybook sin framework de UI      | Storybook con renderer `@storybook/html-vite`                      | Resolved   |
| R-003 | Entorno de pruebas DOM en Vitest                  | `happy-dom`                                                        | Resolved   |
| R-004 | Convención de carpetas/archivos por componente    | Carpeta por componente, co-localizando implementación/test/story   | Resolved   |
| R-005 | Estructura del paquete/repositorio                | Paquete único en la raíz (sin monorepo/workspaces)                 | Resolved   |

## R-001 — Implementación de componentes sin framework de UI

### Pregunta

¿Cómo debe implementarse `Button` (y los futuros componentes de `libs/components/`) para cumplir FR-001/FR-002 (componente "dummy", reutilizable) sin incorporar Angular, React o Vue, que la constitución prohíbe sin una necesidad concreta aprobada?

### Contexto

FR-002 exige que los componentes de `libs/components/` sean presentacionales, sin lógica de negocio. La constitución fija el stack base en TypeScript, Phaser, Vite, HTML, CSS, Vitest, ESLint y Prettier, y prohíbe explícitamente Angular/React/Vue sin justificación. No existe todavía ningún componente ni convención previa en el repositorio.

### Criterios de decisión

* Compatibilidad con la restricción constitucional (sin framework de UI adicional).
* Simplicidad y tamaño de la API pública.
* Testabilidad con Vitest.
* Compatibilidad con Storybook sin adaptador de framework.

### Opciones consideradas

#### Opción A — Funciones TypeScript sobre el DOM nativo

**Descripción**: Cada componente es una función (`createButton(props): HTMLButtonElement`) que construye y devuelve un elemento DOM nativo usando la API estándar del navegador (`document.createElement`, atributos, listeners).

**Ventajas**:

* No requiere ningún framework de UI ni dependencias adicionales de runtime.
* Fácil de probar con Vitest + un DOM simulado.
* API pública mínima y explícita (una función con props de entrada).

**Inconvenientes**:

* Sin reactividad automática; actualizar el DOM ante cambios de props requiere lógica explícita (asumible para componentes "dummy" simples como `Button`).

**Impacto**: Ninguna dependencia nueva de runtime; compatible de forma directa con Vite y GitHub Pages.

#### Opción B — Web Components (Custom Elements)

**Descripción**: Cada componente se define como un `customElements.define(...)`, con su propio ciclo de vida y, opcionalmente, Shadow DOM.

**Ventajas**:

* Estándar de plataforma, sin dependencias de framework.
* Encapsulación de estilos mediante Shadow DOM.

**Inconvenientes**:

* Añade complejidad de ciclo de vida (`connectedCallback`, `attributeChangedCallback`, etc.) innecesaria para un componente "dummy" tan simple como `Button` en esta primera iteración.
* Mayor curva de aprendizaje y más código repetido por componente para casos de uso sencillos.

**Impacto**: Viable, pero introduce complejidad no justificada por el alcance actual (principio de Simplicidad primero / YAGNI).

### Decisión

**Decisión seleccionada**: Opción A — funciones TypeScript que crean elementos DOM nativos.

**Motivo**: Es la solución más simple que satisface los requisitos funcionales actuales (FR-001, FR-002, FR-005, FR-006, FR-007, FR-011) sin introducir complejidad ni dependencias no justificadas. Web Components queda como alternativa razonable a reconsiderar si en el futuro los componentes necesitan encapsulación de estilos o ciclo de vida más rico.

**Alternativas descartadas**:

* **Web Components**: descartada para esta iteración por complejidad no justificada (YAGNI); podría reconsiderarse cuando exista una necesidad real de encapsulación (Shadow DOM) en un componente futuro.
* **Angular/React/Vue**: descartada porque la constitución las prohíbe sin una necesidad concreta aprobada mediante especificación, y no existe tal necesidad para un componente "dummy" como `Button`.

### Consecuencias

Cada componente expone una función factory documentada en `contracts/`. Las actualizaciones de estado (p. ej. deshabilitar el botón) se resuelven recreando o actualizando explícitamente los atributos del elemento devuelto, sin necesidad de un sistema de reactividad.

---

## R-002 — Integración de Storybook sin framework de UI

### Pregunta

¿Qué renderer de Storybook permite documentar visualmente componentes basados en funciones que devuelven DOM nativo, cumpliendo FR-004, sin introducir Angular/React/Vue?

### Contexto

El usuario pidió explícitamente Storybook para la presentación visual de los componentes (FR-004). La decisión R-001 implica que los componentes no usan ningún framework de UI, por lo que el renderer de Storybook debe soportar ese mismo modelo.

### Criterios de decisión

* Coherencia con la decisión R-001 (sin framework de UI).
* Reutilización de la configuración de Vite ya presente en el stack.
* Madurez y soporte oficial del renderer.

### Opciones consideradas

#### Opción A — `@storybook/html-vite`

**Descripción**: Renderer oficial de Storybook para componentes basados en HTML/DOM nativo, con Vite como builder.

**Ventajas**:

* No requiere ningún framework de UI.
* Reutiliza Vite, ya parte del stack constitucional.
* Soporte oficial de Storybook.

**Inconvenientes**:

* Los "args"/controles de Storybook deben mapearse manualmente a las props de la función factory (algo más de código repetitivo que con adaptadores de framework), asumible para el alcance actual.

**Impacto**: Ninguna dependencia de framework de UI; solo dependencias de desarrollo (Storybook + renderer).

#### Opción B — Adaptador de React/Vue/Angular

**Descripción**: Usar Storybook con un adaptador de framework, lo que implicaría envolver cada componente en un componente de dicho framework solo para su documentación visual.

**Ventajas**:

* Ecosistema de addons ligeramente más amplio en algunos frameworks.

**Inconvenientes**:

* Obligaría a incorporar Angular/React/Vue, prohibido por la constitución sin justificación concreta, y solo para la documentación visual.

**Impacto**: Viola la restricción constitucional; descartada.

### Decisión

**Decisión seleccionada**: Opción A — Storybook con `@storybook/html-vite`.

**Motivo**: Es la única opción coherente con R-001 y con la restricción constitucional de no introducir frameworks de UI sin necesidad.

**Alternativas descartadas**:

* **Adaptador de framework (React/Vue/Angular)**: descartada por violar la restricción constitucional.

### Consecuencias

La configuración de Storybook (`.storybook/main.ts`, `.storybook/preview.ts`) usa el framework `@storybook/html-vite`. Cada historia (`Button.stories.ts`) invoca la función factory del componente y devuelve el elemento DOM resultante.

---

## R-003 — Entorno de pruebas DOM en Vitest

### Pregunta

¿Qué entorno de DOM simulado debe configurarse en Vitest para probar el renderizado y el comportamiento (incluido el bloqueo de eventos en estado deshabilitado, FR-007) de los componentes de `libs/components/`?

### Contexto

Los componentes manipulan el DOM directamente (R-001), por lo que las pruebas unitarias (FR-003) necesitan un entorno DOM disponible en Node.js durante la ejecución de Vitest.

### Criterios de decisión

* Velocidad de ejecución de los tests.
* Compatibilidad suficiente con las APIs DOM usadas por componentes "dummy" simples (elementos, atributos, eventos).
* Simplicidad de configuración.

### Opciones consideradas

#### Opción A — `happy-dom`

**Descripción**: Implementación ligera de DOM en JavaScript, orientada a velocidad, usada habitualmente como entorno de test en proyectos Vite/Vitest.

**Ventajas**:

* Arranque y ejecución más rápidos que `jsdom`.
* Suficiente para las necesidades actuales: creación de elementos, atributos, clases, eventos de clic.

**Inconvenientes**:

* Cobertura de APIs DOM algo menor que `jsdom` en casos muy avanzados (no relevante para componentes "dummy" simples como `Button`).

**Impacto**: Dependencia de desarrollo adicional, ligera.

#### Opción B — `jsdom`

**Descripción**: Implementación de DOM más completa y madura, ampliamente usada en el ecosistema de testing de JavaScript.

**Ventajas**:

* Cobertura de APIs DOM muy amplia y probada.

**Inconvenientes**:

* Mayor tiempo de arranque y ejecución que `happy-dom`.
* Cobertura adicional no necesaria para el alcance actual (componentes "dummy" simples).

**Impacto**: Dependencia de desarrollo adicional, algo más pesada.

### Decisión

**Decisión seleccionada**: Opción A — `happy-dom`.

**Motivo**: Cubre sobradamente las necesidades de prueba de `Button` (renderizado, atributos de accesibilidad, eventos de clic) con menor coste de ejecución, alineado con el principio de Simplicidad primero. Si un futuro componente requiere APIs DOM no soportadas por `happy-dom`, podrá reevaluarse por `jsdom` en esa feature concreta.

**Alternativas descartadas**:

* **`jsdom`**: descartada por ahora por ser más pesada sin aportar ventajas relevantes para el alcance actual.

### Consecuencias

`vitest.config.ts` (o la sección `test` de `vite.config.ts`) configura `environment: 'happy-dom'` para los tests de `libs/components/`.

---

## R-004 — Convención de carpetas/archivos por componente

### Pregunta

¿Qué estructura de ficheros debe seguir cada componente dentro de `libs/components/` para que su implementación, sus pruebas y su historia de Storybook queden localizadas de forma consistente y se pueda verificar fácilmente su completitud (FR-009)?

### Contexto

FR-003, FR-004 y FR-009 exigen que todo componente tenga tests y story, y que se considere incompleto si le falta alguno. FR-010 exige poder detectar nombres duplicados. Una convención clara facilita ambas comprobaciones.

### Criterios de decisión

* Facilidad para comprobar de un vistazo si un componente cumple FR-009.
* Facilidad para detectar nombres duplicados (FR-010).
* Consistencia y previsibilidad para quien añade un nuevo componente.

### Opciones consideradas

#### Opción A — Carpeta por componente (co-localización)

**Descripción**: Cada componente tiene su propia carpeta (`libs/components/<component-name>/`) que contiene su implementación, su test y su story.

**Ventajas**:

* Toda la información de un componente vive en un único lugar.
* Verificar completitud (FR-009) o detectar duplicados (FR-010) se reduce a comprobar el nombre de la carpeta.

**Inconvenientes**:

* Ninguno relevante para el alcance actual.

**Impacto**: Ninguno negativo; mejora la mantenibilidad.

#### Opción B — Carpetas separadas por tipo de artefacto

**Descripción**: Una carpeta global `components/` para implementaciones, otra `tests/` para pruebas y otra `stories/` para historias de Storybook.

**Ventajas**:

* Agrupa artefactos del mismo tipo.

**Inconvenientes**:

* Dificulta comprobar de un vistazo si un componente concreto tiene test y story (FR-009).
* Aumenta el riesgo de desincronización de nombres entre carpetas.

**Impacto**: Mayor coste de mantenimiento a medida que crece la librería.

### Decisión

**Decisión seleccionada**: Opción A — carpeta por componente, co-localizando `Component.ts`, `Component.test.ts`, `Component.stories.ts` e `index.ts`.

**Motivo**: Es la opción más simple y verificable para los requisitos de completitud (FR-009) y de nombres únicos (FR-010).

**Alternativas descartadas**:

* **Carpetas separadas por tipo de artefacto**: descartada por dificultar la verificación de completitud y aumentar el riesgo de desincronización.

### Consecuencias

`Button` se aloja en `libs/components/button/` con `Button.ts`, `Button.test.ts`, `Button.stories.ts` e `index.ts` (punto de entrada público del componente).

---

## R-005 — Estructura del paquete/repositorio

### Pregunta

¿Necesita `libs/components/` su propio `package.json`/workspace independiente, o basta con integrarlo en un único paquete en la raíz del repositorio?

### Contexto

El repositorio no contiene todavía ningún `package.json`. Las Suposiciones de `spec.md` establecen que la librería es de uso interno de este proyecto, sin necesidad de publicarse como paquete independiente en esta iteración.

### Criterios de decisión

* Alcance real declarado en `spec.md` (uso interno, no publicación externa).
* Simplicidad de configuración y mantenimiento (YAGNI).
* Coherencia con la estructura conceptual de la constitución (`libs/components/` dentro del mismo repositorio del juego).

### Opciones consideradas

#### Opción A — Paquete único en la raíz del repositorio

**Descripción**: Un único `package.json` en la raíz del repositorio gestiona dependencias y scripts tanto para el juego como para `libs/components/`.

**Ventajas**:

* Configuración mínima; sin herramientas de workspaces.
* Coherente con el alcance actual (uso interno del proyecto).

**Inconvenientes**:

* Si en el futuro se quisiera publicar `libs/components/` como paquete independiente, requeriría una migración posterior (aceptable: se documenta como riesgo en `plan.md`).

**Impacto**: Ninguna complejidad adicional de tooling.

#### Opción B — Monorepo con workspaces (npm/pnpm)

**Descripción**: `libs/components/` se convierte en un paquete independiente dentro de un monorepo con workspaces.

**Ventajas**:

* Facilitaría publicar la librería como paquete independiente en el futuro.

**Inconvenientes**:

* Añade configuración y complejidad de tooling no demostrada como necesaria en esta iteración (viola YAGNI/Simplicidad primero).

**Impacto**: Complejidad prematura sin necesidad actual.

### Decisión

**Decisión seleccionada**: Opción A — paquete único en la raíz del repositorio.

**Motivo**: Es la opción más simple que satisface el alcance actual (uso interno, un solo componente). Introducir workspaces sin una necesidad demostrada violaría el principio de Simplicidad primero.

**Alternativas descartadas**:

* **Monorepo con workspaces**: descartado por complejidad prematura; podrá reconsiderarse si una futura especificación exige publicar la librería como paquete independiente.

### Consecuencias

Un único `package.json` en la raíz gestiona Vite, Vitest, Storybook, ESLint y Prettier, tanto para el futuro código del juego como para `libs/components/`.
