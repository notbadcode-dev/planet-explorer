---

title: "Librería de componentes UI: arquitectura y componente Button"
feature: "001-component-library-architecture"
type: "implementation-plan"
version: "1.0"
created: "2026-08-15"
updated: "2026-08-15"
status: "Implemented"
spec: "./spec.md"
tags: [frontend, ui, testing, documentation, architecture]
dependencies: []
related_specs: []
------------------------------------------------------------

# Plan de implementación: Librería de componentes UI: arquitectura y componente Button

**Rama**: `001-component-library-architecture` | **Fecha**: 2026-08-15 | **Especificación**: [spec.md](./spec.md)

**Entrada**: Especificación de funcionalidad de `/specs/001-component-library-architecture/spec.md`

**Nota**: Esta plantilla se completa mediante el comando `/speckit-plan`; su definición describe el flujo de ejecución.

## Resumen

La funcionalidad establece la arquitectura de una librería de componentes de interfaz reutilizables en `libs/components/`, ya prevista por la constitución del proyecto. Cada componente publicado MUST ser "dummy" (presentacional, sin lógica de negocio), MUST incluir su propia suite de pruebas unitarias con Vitest y MUST incluir una historia de Storybook para su presentación visual. Como primer componente se implementa `Button`, con estado habilitado/deshabilitado y soporte de etiqueta accesible cuando no lleva texto visible.

El enfoque técnico seleccionado evita introducir un framework de UI (Angular/React/Vue están prohibidos sin justificación explícita): los componentes se implementan como funciones TypeScript que crean y actualizan elementos HTML nativos, se prueban con Vitest sobre un DOM simulado, y se documentan visualmente con el renderer "html" de Storybook sobre Vite (sin adaptador de framework).

## Contexto técnico

**Lenguaje/Versión**: TypeScript (modo `strict`, según constitución)

**Dependencias principales**: Vite (build/dev server), Vitest (test runner), Storybook con `@storybook/html-vite` (presentación visual, sin framework de UI), ESLint + Prettier (calidad y formato)

**Almacenamiento**: N/A (los componentes no persisten datos)

**Testing**: Vitest, con un DOM simulado en memoria (`happy-dom`) para probar renderizado e interacción de los componentes

**Plataforma objetivo**: Navegadores modernos (escritorio, tablet y móvil), con despliegue estático compatible con GitHub Pages

**Tipo de proyecto**: Librería interna de componentes dentro del mismo repositorio del juego (paquete único, no monorepo/workspaces)

**Objetivos de rendimiento**: N/A específico para esta funcionalidad; se mantiene el principio constitucional de evitar dependencias pesadas y cargas iniciales excesivas

**Restricciones**: Sin frameworks de UI (Angular/React/Vue) sin justificación explícita; sin lógica de negocio en `libs/components/`; compatibilidad total con hosting estático (GitHub Pages); Storybook es una herramienta de desarrollo local, no se despliega en esta iteración (ver Suposiciones de `spec.md`)

**Escala/Alcance**: 1 componente inicial (`Button`) más la arquitectura y convención reutilizable para futuros componentes de la librería

## Comprobación de la constitución

> **GATE**: Debe superarse antes de iniciar la Fase 0 de investigación. Debe volver a comprobarse después de la Fase 1 de diseño.

* **Simplicidad primero (VI)**: Cumple. No se introduce ningún framework de UI, patrón arquitectónico adicional ni capa de abstracción; los componentes son funciones TypeScript simples sobre el DOM nativo.
* **Componentes compartidos**: Cumple. La funcionalidad crea explícitamente `libs/components/` según lo previsto por la constitución, y `Button` es un componente genuinamente reutilizable y transversal (no específico de una feature).
* **Arquitectura y tecnología**: Cumple. Usa exclusivamente el stack base (TypeScript strict, Vite, Vitest, ESLint, Prettier). Angular/React/Vue no se incorporan.
* **Documentación (idiomas)**: Cumple. Documentación funcional/técnica en castellano; identificadores, ficheros y código en inglés.
* **Rendimiento y accesibilidad**: Cumple. `Button` es un elemento interactivo simple, operable por táctil, ratón y teclado, sin depender exclusivamente del color ni del hover.
* **Compatibilidad con GitHub Pages**: Cumple. Ningún elemento de esta funcionalidad requiere backend, SSR ni infraestructura server-side; Storybook es únicamente una herramienta de desarrollo local.
* **Nuevas dependencias**: Storybook (y su renderer `html-vite`) y `happy-dom` son dependencias nuevas de desarrollo, justificadas explícitamente por el requisito del usuario de presentar visualmente los componentes y por la necesidad de probarlos sobre un DOM simulado. Ninguna afecta al bundle de producción del juego.

**Resultado**: Sin violaciones constitucionales. No se requiere `Complexity Tracking`.

## Investigación técnica

* **Implementación de componentes sin framework de UI**: Determinar cómo estructurar `Button` (y futuros componentes) como funciones TypeScript sobre el DOM nativo, sin Angular/React/Vue, manteniendo una API pública pequeña y clara.
* **Integración de Storybook sin framework de UI**: Determinar qué renderer de Storybook permite documentar componentes basados en DOM nativo/Vite sin introducir un framework prohibido por la constitución.
* **Entorno de pruebas DOM en Vitest**: Determinar qué entorno de DOM simulado usar en Vitest para probar renderizado, estados y eventos de los componentes.
* **Convención de carpetas/archivos por componente**: Determinar la estructura de ficheros dentro de `libs/components/` para que implementación, tests y story queden co-localizados de forma consistente.
* **Estructura del paquete/repositorio**: Determinar si `libs/components/` requiere su propio `package.json`/workspace o si basta con un único paquete en la raíz del repositorio.

## Decisiones técnicas

### Componentes como funciones TypeScript sobre el DOM nativo

**Decisión**: Cada componente se implementa como una función TypeScript pura (`createButton(props): HTMLButtonElement`) que crea y devuelve un elemento DOM nativo, sin virtual DOM ni framework de UI.

**Motivo**: Es la solución más simple que satisface FR-001/FR-002 (componente "dummy", sin lógica de negocio) y respeta la prohibición constitucional de incorporar Angular/React/Vue sin necesidad concreta aprobada.

**Alternativas descartadas**: Adoptar React/Vue/Angular únicamente para esta librería (prohibido sin justificación y añadiría una dependencia pesada para un caso de uso que no la necesita); usar Web Components/Custom Elements (viable, pero añade complejidad de ciclo de vida y Shadow DOM innecesaria para un componente "dummy" como `Button` en esta primera iteración).

### Storybook con renderer HTML sobre Vite

**Decisión**: Usar Storybook con el renderer `@storybook/html-vite`, que documenta componentes basados en funciones que devuelven HTML/elementos DOM, reutilizando la configuración de Vite ya presente en el stack.

**Motivo**: Satisface FR-004 (historia de Storybook por componente) sin requerir ningún framework de UI adicional, coherente con la decisión anterior.

**Alternativas descartadas**: Adaptadores de Storybook para React/Vue/Angular (exigirían introducir ese framework solo para la documentación visual, violando la restricción constitucional).

### Vitest con `happy-dom`

**Decisión**: Configurar Vitest con entorno `happy-dom` para las pruebas de `libs/components/`.

**Motivo**: Permite probar renderizado, atributos de accesibilidad y disparo/bloqueo de eventos (FR-003, FR-007, FR-011) sin un navegador real, con menor coste que `jsdom` para el alcance de componentes "dummy".

**Alternativas descartadas**: `jsdom` (más pesado y más lento; no aporta ventajas relevantes para componentes tan simples como `Button`).

### Convención de carpetas por componente

**Decisión**: Cada componente vive en su propia carpeta dentro de `libs/components/`, co-localizando implementación, test y story:

```text
libs/components/button/
├── Button.ts
├── Button.test.ts
├── Button.stories.ts
└── index.ts
```

**Motivo**: Hace explícito y verificable el requisito de que todo componente incluya tests y story (FR-003, FR-004, FR-009), y facilita detectar nombres duplicados (FR-010) al comprobar la carpeta antes de crear una nueva.

**Alternativas descartadas**: Carpetas separadas por tipo de artefacto (`components/`, `tests/`, `stories/`); se descarta por dificultar ver de un vistazo si un componente cumple el requisito de completitud (FR-009).

### Paquete único en la raíz del repositorio

**Decisión**: `libs/components/` forma parte del mismo `package.json` raíz del proyecto; no se introduce un monorepo ni workspaces de npm/pnpm.

**Motivo**: Es la opción más simple que satisface el alcance actual (uso interno del propio proyecto, según las Suposiciones de `spec.md`); introducir workspaces sería complejidad prematura sin una necesidad demostrada (YAGNI, principio VI de la constitución).

**Alternativas descartadas**: Monorepo con workspaces (pnpm/npm) para publicar `libs/components/` como paquete independiente; se descarta porque la spec asume uso interno exclusivo del proyecto en esta iteración.

## Estrategia de pruebas

* **Unit**: Vitest + `happy-dom` para cada componente de `libs/components/` (incluido `Button`): renderizado, contenido/etiqueta, estado deshabilitado (bloqueo del evento de clic, FR-007), y presencia de una etiqueta accesible cuando no hay texto visible (FR-011).
* **Integration**: N/A — los componentes son unidades presentacionales independientes; su integración real ocurre al consumirlos desde otras features, fuera del alcance de esta funcionalidad.
* **Contract**: Verificación manual/de revisión de que la API pública de `Button` (ver `contracts/button-component.md`) se respeta en su implementación.
* **E2E**: N/A — no aplica en esta iteración; no existe un flujo de usuario final que involucre pantallas completas del juego.

## Estructura del proyecto

### Documentación de esta funcionalidad

```text
specs/001-component-library-architecture/
├── spec.md              # Especificación funcional (/speckit-specify)
├── plan.md              # Este fichero (/speckit-plan)
├── research.md          # Fase 0 (/speckit-plan)
├── data-model.md        # Fase 1 (/speckit-plan)
├── quickstart.md        # Fase 1 (/speckit-plan)
├── contracts/           # Fase 1 (/speckit-plan)
└── tasks.md             # Fase 2 (/speckit-tasks - NO creado por /speckit-plan)
```

### Código fuente (raíz del repositorio)

```text
index.html              # Entry point mínimo de Vite (requerido por `vite build`;
                         # el juego/Phaser se incorporará en una futura funcionalidad)

libs/
└── components/
    └── button/
        ├── Button.ts
        ├── Button.test.ts
        ├── Button.stories.ts
        └── index.ts

.storybook/
├── main.ts
└── preview.ts
```

**Decisión de estructura**: Se crea `libs/components/` en la raíz del repositorio (tal como establece la constitución en "Componentes compartidos" y "Modularidad"), con una carpeta por componente. La configuración de Storybook vive en `.storybook/` en la raíz, reutilizando la configuración de Vite del proyecto. `index.html` se añade en la raíz como punto de entrada mínimo exigido por Vite para que `vite build` funcione; no contiene lógica de juego ni de `libs/components/`. No se crea `src/game/` en esta funcionalidad: queda fuera de alcance (se creará cuando exista una feature de juego que lo requiera).

## Modelo de datos

Ver [data-model.md](./data-model.md). Resumen: no existen datos persistentes; se modela conceptualmente la API pública de `Button` (`ButtonProps`) y la estructura mínima que debe cumplir cualquier componente de la librería para considerarse completo (FR-009).

## Contratos e interfaces

* **Interfaz pública del componente `Button`**: Ver [contracts/button-component.md](./contracts/button-component.md).
* **Convención estructural de la librería de componentes**: Ver [docs/conventions/components/structure.md](../../docs/conventions/components/structure.md).

## Riesgos y compromisos

* **Riesgo**: Empezar sin un framework de UI podría requerir reescribir componentes si en el futuro una especificación justifica adoptar Angular/React/Vue. *Mitigación*: la API pública de cada componente (props de entrada, comportamiento) se documenta en `contracts/`, de forma que una futura migración pueda reimplementar el "cómo" sin cambiar el "qué" consumido por el resto del proyecto.
* **Compromiso**: Se acepta que Storybook solo se ejecute en local en esta iteración (sin publicar/desplegar), tal como documenta `spec.md` en Suposiciones; esto limita la visibilidad del catálogo fuera del equipo de desarrollo hasta que una futura especificación lo requiera.

## Seguimiento de complejidad

N/A — no existen violaciones constitucionales que requieran justificación.
