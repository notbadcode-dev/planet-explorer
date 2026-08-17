---
title: "Variantes del componente Button — Investigación técnica"
feature: "002-button-variants"
type: "research"
version: "1.0"
created: "2026-08-15"
updated: "2026-08-15"
status: "Approved"
spec: "./spec.md"
plan: "./plan.md"
tags: [frontend, ui, accessibility]
dependencies: ["001-component-library-architecture"]
related_specs: ["001-component-library-architecture"]
---

# Investigación técnica: Variantes del componente Button

**Entrada**: `spec.md`, `plan.md` y contexto técnico disponible en `/specs/002-button-variants/`

**Propósito**: Resolver las incertidumbres técnicas necesarias para ampliar `Button` con las props `variant` y `size`, manteniendo la solución más simple posible y sin romper la compatibilidad retro exigida por US3 de `spec.md`.

## Objetivo de la investigación

Determinar cómo introducir estilos visuales reales por primera vez en el proyecto (el componente `Button` actual no tiene ningún CSS) sin incorporar CSS-in-JS ni un framework de UI, y cómo aplicar de forma segura un catálogo cerrado de `variant`/`size` incluso ante consumidores JavaScript sin tipos.

## Fuentes y restricciones

* **Constitución**: `../../.specify/memory/constitution.md` — secciones "Arquitectura y tecnología", "Simplicidad primero", "Accesibilidad", "Componentes compartidos".
* **Especificación**: `./spec.md` (incluida la sección `## Clarifications`, sesión 2026-08-15)
* **Plan**: `./plan.md`
* **Código existente**: `libs/components/button/Button.ts`, `Button.test.ts`, `Button.stories.ts`, `index.ts` (`001-component-library-architecture`) — ningún fichero `.css` existe todavía en el repositorio.
* **Contratos existentes**: `../001-component-library-architecture/contracts/button-component.md` (v1.0), `../../docs/conventions/components/structure.md` (v1.0).
* **Restricciones aplicables**: Sin Angular/React/Vue ni CSS-in-JS sin justificación explícita; ningún uso existente de `createButton` puede cambiar de comportamiento; `danger` no puede depender solo del color; `small` MUST mantener 44×44 px CSS de área táctil (aclaración de `/speckit-clarify`).

## Resumen de decisiones

| ID    | Tema                                              | Decisión                                                              | Estado   |
| ----- | -------------------------------------------------- | ------------------------------------------------------------------------ | -------- |
| R-006 | Introducción del primer CSS del proyecto           | Fichero `Button.css` co-localizado, importado por Vite                  | Resolved |
| R-007 | Aplicación de `variant`/`size` al elemento          | Clases CSS prefijadas (`button--<variant>`, `button--<size>`)            | Resolved |
| R-008 | Guard de valores inválidos en runtime               | Listas de valores permitidos + fallback silencioso al valor por defecto  | Resolved |
| R-009 | Área táctil mínima de `size: 'small'`               | `min-width`/`min-height: 44px` en `.button--small`                       | Resolved |

(Continúa la numeración de `001-component-library-architecture`, que llega hasta R-005.)

## R-006 — Introducción del primer CSS del proyecto

### Pregunta

¿Cómo deben cargarse los estilos de `variant`/`size` si el proyecto no tiene todavía ningún fichero `.css`, sin introducir CSS-in-JS ni un preprocesador?

### Contexto

`Button` es hoy un `<button>` HTML sin ningún estilo propio (todo el aspecto visual depende del user-agent stylesheet). La constitución permite explícitamente CSS como parte del stack base, pero no fija ninguna convención de carga porque hasta ahora no ha sido necesaria.

### Criterios de decisión

* Compatibilidad con Vite y con Storybook (`@storybook/html-vite`) sin configuración adicional.
* Ninguna dependencia nueva.
* Co-localización con el resto de ficheros del componente (ya establecida en `001`).

### Opciones consideradas

#### Opción A — Fichero `.css` co-localizado, importado por el módulo TypeScript

**Descripción**: `Button.css` junto a `Button.ts`, cargado con `import './Button.css'` desde `Button.ts`. Vite (y por tanto Storybook, que reutiliza su pipeline) procesa el import de forma nativa sin configuración adicional.

**Ventajas**: Cero dependencias nuevas; funciona igual en build de producción y en Storybook; mantiene la convención de co-localización ya usada para test/story.

**Inconvenientes**: Ninguno relevante para el alcance actual (un componente, estilos simples).

**Impacto**: Ninguna dependencia nueva; un fichero adicional por componente que lo necesite.

#### Opción B — CSS-in-JS (estilos generados desde TypeScript)

**Descripción**: Definir los estilos como objetos/strings de JavaScript aplicados vía `style` inline o una librería de CSS-in-JS.

**Ventajas**: Co-localización aún más estricta (un único fichero).

**Inconvenientes**: Una librería de CSS-in-JS sería una dependencia nueva sin justificación (viola Simplicidad primero, VI); los estilos inline dificultan expresar variantes combinables (`variant` × `size`) sin duplicar lógica condicional en TypeScript.

**Impacto**: Dependencia nueva no justificada, o lógica de presentación mezclada con la función factory.

### Decisión

**Decisión seleccionada**: Opción A — `Button.css` co-localizado, importado por Vite.

**Motivo**: Es la solución más simple compatible con el stack ya fijado por la constitución; no añade dependencias y reutiliza capacidades ya presentes (Vite).

**Alternativas descartadas**: CSS-in-JS — descartada por añadir una dependencia no justificada o por mezclar presentación con lógica en TypeScript.

### Consecuencias

Se documenta en la convención ampliada (`docs/conventions/components/css.md`) que un componente de `libs/components/` MAY incluir opcionalmente un fichero `<ComponentName>.css` co-localizado, importado desde su implementación.

---

## R-007 — Aplicación de `variant`/`size` al elemento

### Pregunta

¿Cómo debe reflejar `createButton` los valores de `variant` y `size` en el elemento `<button>` devuelto?

### Contexto

`variant` y `size` son catálogos cerrados (FR-001, FR-003). El mecanismo elegido debe ser fácilmente verificable en pruebas Vitest con `happy-dom` (que no calcula estilos reales, pero sí refleja atributos/clases).

### Opciones consideradas

#### Opción A — Clases CSS prefijadas

**Descripción**: `button.classList.add('button', `button--${variant}`, `button--${size}`)`.

**Ventajas**: Verificable directamente en tests (`classList.contains(...)`); patrón estándar y ampliamente reconocido; permite que Storybook muestre el resultado real aplicando el CSS.

**Inconvenientes**: Ninguno relevante.

#### Opción B — Atributos `data-variant`/`data-size` + selectores de atributo en CSS

**Descripción**: `button.dataset.variant = variant`, con CSS `[data-variant="danger"] { ... }`.

**Ventajas**: Funcionalmente equivalente.

**Inconvenientes**: Menos convencional en este stack; sin ninguna ventaja concreta sobre clases para este caso.

### Decisión

**Decisión seleccionada**: Opción A — clases CSS prefijadas.

**Motivo**: Es el patrón más simple y verificable, y es coherente con cómo se probará el componente en `Button.test.ts`.

**Alternativas descartadas**: Atributos `data-*` — descartados por no aportar ninguna ventaja sobre las clases en este caso.

### Consecuencias

`Button.css` define selectores de clase (`.button`, `.button--primary`, `.button--secondary`, `.button--danger`, `.button--small`, `.button--medium`, `.button--large`); `Button.test.ts` verifica `classList` en vez de estilos computados.

---

## R-008 — Guard de valores inválidos en runtime

### Pregunta

¿Cómo debe comportarse `createButton` si recibe un `variant`/`size` fuera del catálogo cerrado (por ejemplo, desde JavaScript sin tipos), según exige FR-008?

### Opciones consideradas

#### Opción A — Fallback silencioso al valor por defecto

**Descripción**: Comprobar el valor recibido contra una lista de valores permitidos (`VALID_VARIANTS`, `VALID_SIZES`); si no está incluido, usar `'primary'`/`'medium'`.

**Ventajas**: El componente sigue siendo utilizable y visualmente coherente; comportamiento predecible y fácil de testear.

**Inconvenientes**: Un valor incorrecto no se reporta explícitamente al desarrollador (se acepta como compromiso menor, ya que TypeScript ya previene este caso en el 99% de los usos tipados).

#### Opción B — Lanzar un error (igual que R1 del contrato de accesibilidad)

**Descripción**: Lanzar `Error` si `variant`/`size` no es válido.

**Ventajas**: Detecta el problema de forma temprana y ruidosa.

**Inconvenientes**: Un `variant`/`size` inválido es un problema puramente visual, no de accesibilidad ni de integridad funcional del botón; romper la ejecución sería desproporcionado comparado con degradar a un estilo por defecto razonable.

### Decisión

**Decisión seleccionada**: Opción A — fallback silencioso al valor por defecto.

**Motivo**: Proporciona el comportamiento mínimo exigido por FR-008 (no lanzar, no renderizar sin estilo) sin sobredimensionar la respuesta a un problema de bajo impacto.

**Alternativas descartadas**: Lanzar error — reservado para violaciones de accesibilidad (ausencia de nombre accesible), no para valores de estilo fuera de catálogo.

### Consecuencias

`Button.test.ts` incluye un caso que fuerza un valor inválido (`as never`/`as unknown as ButtonProps['variant']`) y verifica que el resultado usa las clases por defecto (`button--primary`, `button--medium`).

---

## R-009 — Área táctil mínima de `size: 'small'`

### Pregunta

¿Qué técnica CSS garantiza de forma más simple que `size: 'small'` mantenga un área táctil mínima de 44×44 px CSS (aclaración registrada en `spec.md`), sin agrandar el contenido visible del botón?

### Opciones consideradas

#### Opción A — `min-width`/`min-height: 44px` en `.button--small`

**Descripción**: La clase de tamaño pequeño fija un mínimo de 44×44 px CSS de área ocupada por el propio `<button>`, además de su padding/tipografía reducidos.

**Ventajas**: Una única regla CSS, sin nodos DOM adicionales; explícita y fácil de verificar visualmente en Storybook.

**Inconvenientes**: Ninguno relevante para el alcance actual.

#### Opción B — Contenedor invisible más grande alrededor del botón

**Descripción**: Envolver el `<button>` pequeño en un `<div>` con el área mínima, y el botón visualmente más pequeño dentro.

**Ventajas**: Ninguna ventaja adicional sobre la Opción A para este caso.

**Inconvenientes**: Añade un nodo DOM extra y complejidad no justificada (YAGNI).

### Decisión

**Decisión seleccionada**: Opción A — `min-width`/`min-height: 44px` en `.button--small`.

**Motivo**: Es la técnica más simple y directa, sin nodos DOM adicionales, y cumple literalmente la aclaración registrada en `spec.md`.

**Alternativas descartadas**: Contenedor invisible adicional — descartado por complejidad no justificada.

### Consecuencias

`Button.css` incluye `min-width: 44px; min-height: 44px;` en `.button--small`. La verificación del área táctil en Storybook es visual/manual (no computable de forma fiable con `happy-dom` en Vitest, que no calcula layout real).
