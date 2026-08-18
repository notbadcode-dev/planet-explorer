---

title: "Variantes del componente Button"
feature: "002-button-variants"
type: "implementation-plan"
version: "1.0"
created: "2026-08-15"
updated: "2026-08-15"
status: "Implemented"
spec: "./spec.md"
tags: [frontend, ui, accessibility]
dependencies: ["001-component-library-architecture"]
related_specs: ["001-component-library-architecture"]
------------------------------------------------------------

# Plan de implementación: Variantes del componente Button

**Rama**: `002-button-variants` | **Fecha**: 2026-08-15 | **Especificación**: [spec.md](./spec.md)

**Entrada**: Especificación de funcionalidad de `/specs/002-button-variants/spec.md`

**Nota**: Esta plantilla se completa mediante el comando `/speckit-plan`; su definición describe el flujo de ejecución.

## Resumen

La funcionalidad amplía el componente `Button` existente (`libs/components/button/`) con dos nuevas dimensiones visuales opcionales: `variant` (`primary` | `secondary` | `danger`) y `size` (`small` | `medium` | `large`), de forma que el componente compartido pueda cubrir todos los usos de botón previstos en el proyecto sin necesidad de estilos ad-hoc por pantalla. Ambas props son opcionales y por defecto reproducen exactamente el comportamiento visual actual (`primary`/`medium`), por lo que ningún uso existente de `createButton` se rompe.

El enfoque técnico introduce el primer fichero CSS real del proyecto (`Button.css`, co-localizado con el componente), aplicado mediante clases (`button`, `button--<variant>`, `button--<size>`) en lugar de estilos inline o una dependencia de CSS-in-JS. Un guard en tiempo de ejecución hace fallback al valor por defecto si un consumidor sin tipos pasa un `variant`/`size` no soportado, y la variante `small` garantiza un área táctil mínima de 44×44 px CSS mediante `min-width`/`min-height`, conforme a la aclaración registrada en `spec.md`.

## Contexto técnico

**Lenguaje/Versión**: TypeScript (modo `strict`, según constitución) — sin cambios respecto a `001-component-library-architecture`

**Dependencias principales**: Ninguna dependencia nueva. Se reutiliza Vite (ya soporta imports de `.css` de forma nativa), Vitest + `happy-dom`, Storybook `@storybook/html-vite`, ESLint + Prettier

**Almacenamiento**: N/A (sigue sin haber datos persistentes)

**Testing**: Vitest + `happy-dom` para verificar las clases CSS aplicadas según `variant`/`size` y el fallback ante valores inválidos; revisión visual manual en Storybook para las 9 combinaciones (`variant` × `size`) y el área táctil de `small`

**Plataforma objetivo**: Navegadores modernos (escritorio, tablet y móvil), despliegue estático compatible con GitHub Pages — sin cambios respecto a `001`

**Tipo de proyecto**: Ampliación de un componente existente dentro de la librería interna `libs/components/` (mismo paquete único, sin monorepo/workspaces)

**Objetivos de rendimiento**: N/A específico; se mantiene el principio constitucional de evitar dependencias pesadas — el CSS añadido es un único fichero pequeño co-localizado, sin impacto relevante en el bundle

**Restricciones**: Sin frameworks de UI ni CSS-in-JS; sin lógica de negocio en `libs/components/`; ningún uso existente de `createButton` puede cambiar de comportamiento (compatibilidad retro, US3 de `spec.md`); la variante `danger` MUST NOT depender solo del color (FR-009); `size: 'small'` MUST mantener un área táctil mínima de 44×44 px CSS (FR-011, aclaración de `/speckit-clarify`)

**Escala/Alcance**: 1 componente existente ampliado (`Button`); no se crean componentes nuevos ni se modifican otros componentes de la librería

## Comprobación de la constitución

> **GATE**: Debe superarse antes de iniciar la Fase 0 de investigación. Debe volver a comprobarse después de la Fase 1 de diseño.

* **Simplicidad primero (VI)**: Cumple. No se introduce ningún framework de UI, CSS-in-JS ni capa de abstracción adicional; `variant`/`size` son dos props opcionales más y un fichero CSS con clases planas.
* **Componentes compartidos**: Cumple. `Button` ya es un componente compartido en `libs/components/`; esta funcionalidad lo amplía sin duplicarlo ni crear un componente paralelo.
* **Arquitectura y tecnología**: Cumple. CSS está explícitamente permitido por la constitución ("HTML y CSS MAY utilizarse..."); no se incorpora Angular/React/Vue ni ninguna dependencia nueva de runtime.
* **Accesibilidad**: Cumple. La variante `danger` no depende solo del color (FR-009); `size: 'small'` mantiene un área táctil de 44×44 px CSS (FR-011), conforme al requisito constitucional de interacción táctil.
* **Compatibilidad con GitHub Pages**: Cumple. El CSS añadido es un asset estático más, servible igual que el resto del build de Vite.
* **Nuevas dependencias**: Ninguna. No se añade ningún paquete nuevo a `package.json`.
* **Compatibilidad retro**: Cumple explícitamente por diseño (US3): valores por defecto `primary`/`medium` reproducen el comportamiento visual previo a esta funcionalidad.

**Resultado**: Sin violaciones constitucionales. No se requiere `Complexity Tracking`.

## Investigación técnica

* **Introducción del primer CSS del proyecto**: Determinar cómo estructurar y cargar los estilos de `variant`/`size` sin introducir CSS-in-JS ni un preprocesador, dado que el proyecto no tiene ningún fichero `.css` todavía.
* **Aplicación de `variant`/`size` al elemento `<button>`**: Determinar si usar clases CSS, atributos `data-*` o estilos inline para reflejar ambas dimensiones.
* **Guard de valores inválidos en runtime**: Determinar cómo implementar el fallback exigido por FR-008 cuando un consumidor JavaScript sin tipos pasa un `variant`/`size` no soportado.
* **Área táctil mínima de `size: 'small'`**: Determinar la técnica CSS más simple para garantizar 44×44 px CSS de área interactiva sin agrandar el contenido visible del botón.

## Decisiones técnicas

### CSS co-localizado por componente, importado por Vite

**Decisión**: Añadir `libs/components/button/Button.css`, importado directamente desde `Button.ts` (`import './Button.css'`). Vite procesa e inyecta el CSS de forma nativa, tanto en la build del proyecto como en Storybook (`@storybook/html-vite` reutiliza el pipeline de Vite).

**Motivo**: Es la solución más simple que cumple el principio de Simplicidad primero (VI): no requiere ninguna dependencia nueva (CSS-in-JS, preprocesadores), reutiliza una capacidad ya soportada por el stack existente (Vite), y mantiene el CSS co-localizado con su componente, igual que ya ocurre con `.ts`/`.test.ts`/`.stories.ts` (contrato de convención de `001`).

**Alternativas descartadas**: Estilos inline generados en JS (dificulta cachear y reutilizar reglas comunes entre variantes/tamaños, y mezcla presentación con lógica de construcción del elemento); una librería CSS-in-JS (añadiría una dependencia de runtime no justificada para un caso tan simple); un fichero CSS global único para todos los componentes (rompe la co-localización y dificulta saber qué estilos pertenecen a qué componente a medida que la librería crezca).

### `variant`/`size` aplicados como clases CSS

**Decisión**: El elemento `<button>` recibe siempre la clase base `button`, más `button--{variant}` y `button--{size}` (p. ej. `button button--danger button--small`).

**Motivo**: Es el patrón más simple, legible y ampliamente reconocido para variantes visuales cerradas; permite que Storybook y las pruebas verifiquen el resultado inspeccionando `classList` sin depender de estilos computados.

**Alternativas descartadas**: Atributos `data-variant`/`data-size` con selectores de atributo en CSS (funcionalmente equivalente pero menos convencional en este stack y sin ventaja real); estilos inline calculados en JS por combinación (multiplica la lógica condicional en TypeScript en vez de dejar la presentación en CSS, violando la separación de responsabilidades ya buscada en `001`).

### Guard de valores inválidos con fallback a los valores por defecto

**Decisión**: `Button.ts` define arrays de valores permitidos (`VALID_VARIANTS`, `VALID_SIZES`) y, si el `variant`/`size` recibido no está incluido, usa el valor por defecto (`primary`/`medium`) en su lugar, sin lanzar error.

**Motivo**: Satisface FR-008 de forma mínima y testable: el componente sigue siendo utilizable y visualmente coherente incluso si un consumidor sin tipos (JavaScript, o TypeScript con `any`) pasa un valor fuera del catálogo cerrado.

**Alternativas descartadas**: Lanzar un error igual que con la ausencia de nombre accesible (R1 del contrato de `001`) — se descarta porque un `variant`/`size` inválido es un problema puramente visual, no de accesibilidad ni de integridad del componente, y romper la ejecución sería un comportamiento desproporcionado (peor experiencia para quien lo consume) frente a un fallback silencioso a un valor por defecto razonable.

### Área táctil mínima de `small` vía `min-width`/`min-height`

**Decisión**: La clase `.button--small` fija `min-width: 44px; min-height: 44px;` (además de su padding/tipografía reducidos), de modo que el área interactiva nunca baje de 44×44 px CSS aunque el contenido visible sea compacto.

**Motivo**: Es la técnica CSS más simple y directa para garantizar un área táctil mínima sin necesidad de envolver el botón en un elemento adicional ni de JavaScript; cumple la aclaración registrada en `spec.md` (`## Clarifications`) y el requisito constitucional de interacción táctil.

**Alternativas descartadas**: Aumentar el `padding` hasta alcanzar 44px indirectamente (menos explícito y más frágil ante cambios de tipografía); envolver el `<button>` en un contenedor invisible más grande (añade un nodo DOM extra y complejidad no justificada para este caso).

## Estrategia de pruebas

* **Unit**: Vitest + `happy-dom` en `Button.test.ts` (ampliado): verifica que cada `variant` y `size` aplica la clase CSS esperada (`button--primary`/`button--secondary`/`button--danger`, `button--small`/`button--medium`/`button--large`), que el valor por defecto (`primary`/`medium`) se aplica cuando no se especifica, que un valor no soportado (simulado con `as never`/`any`) hace fallback al valor por defecto sin lanzar, y que las reglas de accesibilidad ya existentes (nombre accesible, bloqueo de `onClick` en `disabled`) siguen intactas para todas las combinaciones.
* **Integration**: N/A — sigue sin existir integración con otras features en esta iteración.
* **Contract**: Verificación manual/de revisión de que la API pública ampliada de `Button` respeta `contracts/button-component.md` (v1.1) de esta funcionalidad.
* **E2E**: N/A — no aplica; no existe todavía un flujo de usuario final que use `Button` dentro de una pantalla completa del juego.

## Estructura del proyecto

### Documentación de esta funcionalidad

```text
specs/002-button-variants/
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
libs/
└── components/
    └── button/
        ├── Button.ts          # Ampliado: props `variant`/`size`, guard de valores inválidos
        ├── Button.css         # NUEVO: clases `button`, `button--<variant>`, `button--<size>`
        ├── Button.test.ts     # Ampliado: casos de variant/size/fallback
        ├── Button.stories.ts  # Ampliado: controles y/o historias para variant/size
        └── index.ts           # Sin cambios de forma (sigue reexportando `createButton`/`ButtonProps`)
```

**Decisión de estructura**: No se crean carpetas ni componentes nuevos. Se amplían los cuatro ficheros existentes de `libs/components/button/` y se añade `Button.css`, co-localizado según la convención estructural de `001-component-library-architecture` (ampliada por esta funcionalidad para permitir opcionalmente un fichero `.css` por componente; ver `contracts/`).

## Modelo de datos

Ver [data-model.md](./data-model.md). Resumen: se amplía `ButtonProps` (DM-001, definido en `001-component-library-architecture`) con dos nuevos atributos opcionales, `variant` y `size`, ambos enumeraciones cerradas con valor por defecto. No se introducen entidades nuevas.

## Contratos e interfaces

* **Interfaz pública ampliada del componente `Button`**: Ver [contracts/button-component.md](./contracts/button-component.md) (v1.1, sustituye a efectos prácticos a la v1.0 de `001-component-library-architecture` sin invalidarla como registro histórico).
* **Convención estructural de la librería de componentes (CSS opcional)**: Ver [docs/conventions/components/css.md](../../docs/conventions/components/css.md).

## Riesgos y compromisos

* **Riesgo**: Al ser el primer CSS del proyecto, un fichero `Button.css` mal acotado podría filtrar estilos globales (por ejemplo, un selector `button` sin prefijo que afecte a botones de otros componentes futuros). *Mitigación*: todas las clases se prefijan explícitamente (`button--<variant>`, `button--<size>`) y se documenta en el contrato ampliado que cada componente MUST prefijar sus clases con su propio nombre para evitar colisiones a medida que la librería crezca.
* **Compromiso**: El catálogo de variantes (`primary`/`secondary`/`danger`) y tamaños (`small`/`medium`/`large`) es cerrado en esta iteración (ver Suposiciones de `spec.md`); ampliarlo en el futuro requerirá una nueva funcionalidad, pero evita sobre-diseñar un sistema de theming genérico sin una necesidad demostrada (YAGNI, principio VI).

## Seguimiento de complejidad

N/A — no existen violaciones constitucionales que requieran justificación.
