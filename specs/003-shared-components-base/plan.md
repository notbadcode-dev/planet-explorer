---

title: "Base mínima de componentes compartidos reutilizables"
feature: "003-shared-components-base"
type: "implementation-plan"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16"
status: "Draft"
spec: "./spec.md"
tags: [frontend, ui, accessibility, testing, architecture]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
------------------------------------------------------------

# Plan de implementación: Base mínima de componentes compartidos reutilizables

**Rama**: `003-shared-components-base` | **Fecha**: 2026-08-16 | **Especificación**: [spec.md](./spec.md)

**Entrada**: Especificación de funcionalidad de `/specs/003-shared-components-base/spec.md`

**Nota**: Esta plantilla se completa mediante el comando `/speckit-plan`; su definición describe el flujo de ejecución.

## Resumen

La funcionalidad crea la base mínima de cinco componentes compartidos nuevos en `libs/components/` (`Input`, `Panel`, `Badge`, `Progress`, `Dialog`) para construir vistas sin duplicar UI, manteniendo independencia de dominio y reutilización transversal. El enfoque técnico sigue la convención existente del repositorio: componente por carpeta con API pública en `index.ts`, estilos co-localizados, tipado explícito, contratos de accesibilidad y validación por tests + Storybook.

Para preservar coherencia de diseño y mantenibilidad, los componentes consumirán tokens globales de `src/styles/`, reutilizarán `Button` e `Icon` cuando corresponda, y aplicarán reglas estrictas de iconografía centralizada y compatibilidad mínima en navegadores evergreen desktop/móvil (últimas 2 versiones estables).

## Contexto técnico

**Lenguaje/Versión**: TypeScript 6 (ESM) + CSS

**Dependencias principales**: Vite 8, Vitest 4 + happy-dom, Storybook 10 (`@storybook/html-vite`), ESLint 10, `@phosphor-icons/core` consumido indirectamente mediante `libs/components/icon`

**Almacenamiento**: N/A

**Testing**: Vitest (unitario/comportamiento/accesibilidad), revisión de estados en Storybook, validación de estructura con `check-components.mjs`

**Plataforma objetivo**: Navegadores evergreen desktop y móvil (últimas 2 versiones estables)

**Tipo de proyecto**: Librería interna de componentes UI para aplicación web estática

**Objetivos de rendimiento**: En la ejecución de la matriz de rendimiento de `quickstart.md`, cada interacción crítica (`Input` al escribir, `Progress` al actualizar, `Dialog` al abrir/cerrar) MUST registrar latencia <= 100 ms en al menos 8 de 10 iteraciones por navegador objetivo, sin bloqueos visibles de la interfaz

**Restricciones**: Sin lógica de dominio educativo/astronómico/juego en componentes; sin iconos directos fuera de `Icon`; sin magic strings/numbers en código productivo fuera de `*.constants.ts`; sin estilos hardcoded fuera de tokens globales

**Escala/Alcance**: 5 componentes nuevos, 5 carpetas nuevas en `libs/components/`, actualización de tokens globales solo si hay huecos reutilizables reales

## Comprobación de la constitución

> **GATE**: Debe superarse antes de iniciar la Fase 0 de investigación. Debe volver a comprobarse después de la Fase 1 de diseño.

**Pre-Fase 0**

* **Simplicidad primero (VI)**: Cumple. Se usa stack existente sin frameworks UI adicionales ni nuevas dependencias de runtime.
* **Componentes compartidos**: Cumple. La funcionalidad expande la librería en `libs/components/` con componentes reutilizables y desacoplados de features.
* **Accesibilidad**: Cumple. La spec exige naming accesible, estados ARIA y flujo de foco completo en `Dialog`.
* **Arquitectura y mantenibilidad**: Cumple. API pública acotada por componente, separación en `type/constants`, y reglas explícitas de contratos.
* **Diseño visual coherente**: Cumple. Se fuerza consumo de tokens globales y prohibición de hardcode visual.

**Post-Fase 1**

* Revalidado: sin nuevas violaciones constitucionales tras diseño de entidades, contratos y guía de validación.

**Resultado**: Gate superado. No se requiere seguimiento de complejidad.

## Investigación técnica

* **Definir baseline de accesibilidad en `Input` y `Dialog`**: concretar manejo de `aria-describedby`, `aria-invalid` y ciclo de foco de modal para alinear tests y contrato.
* **Normalización robusta de `Progress`**: definir reglas de clamp para `value` y `max` fuera de rango sin comportamiento ambiguo.
* **Estrategia de variantes visuales en `Badge` y `Panel` sin depender solo de color**: concretar señales visuales adicionales consistentes con tokens globales.
* **Evolución controlada de tokens globales**: decidir cuándo añadir tokens nuevos y cómo evitar proliferación de valores redundantes.
* **Contrato de composición por `HTMLElement | HTMLElement[]`**: unificar patrón entre `Panel` y `Dialog` para contenido y acciones.

## Decisiones técnicas

### Contrato de accesibilidad primero en Input/Dialog

**Decisión**: Diseñar y probar `Input` y `Dialog` con contrato accesible explícito antes de detalles cosméticos, incluyendo nombre accesible, descripciones vinculadas y flujo de teclado del modal.

**Motivo**: Las reglas de accesibilidad impactan API, constantes y estructura de tests; decidirlas al inicio evita retrabajo transversal.

**Alternativas descartadas**: Definir accesibilidad al final de implementación; se descarta por alto riesgo de cambios de API y fallos en aceptación.

### Normalización determinista para Progress

**Decisión**: Aplicar normalización determinista para `Progress` en límites inválidos (`max <= 0`, `value < 0`, `value > max`) y reflejarla tanto visual como semánticamente.

**Motivo**: Evita resultados inconsistentes entre UI y atributos de accesibilidad; facilita pruebas unitarias reproducibles.

**Alternativas descartadas**: Fallar en runtime con error; se descarta por peor experiencia para consumidores y menor resiliencia.

### Variantes visuales guiadas por tokens globales

**Decisión**: Resolver estilos de `Panel` y `Badge` solo con tokens globales de color/espaciado/sombra/radio/tipografía, añadiendo tokens reutilizables únicamente cuando falte cobertura real.

**Motivo**: Mantiene coherencia de sistema y previene deuda visual por valores ad hoc.

**Alternativas descartadas**: Hardcode local temporal de estilos; se descarta por contradecir requisitos y elevar coste de mantenimiento.

### Reutilización obligatoria de Icon y Button

**Decisión**: Cualquier iconografía en los nuevos componentes se canaliza por `Icon`; las acciones de `Dialog` en documentación/historias se componen con `Button` existente.

**Motivo**: Evita duplicación de componentes base y centraliza consistencia visual/accesible.

**Alternativas descartadas**: Iconos inline o botones ad hoc en stories; se descarta por romper arquitectura acordada.

## Estrategia de pruebas

* **Unit**: Nuevos tests por componente (`Input`, `Panel`, `Badge`, `Progress`, `Dialog`) centrados en comportamiento observable y accesibilidad básica.
* **Integration**: N/A en esta fase (componentes aislados), salvo composición de `Dialog`/`Panel` con `HTMLElement`/`HTMLElement[]` en pruebas de componente.
* **Contract**: Verificación de API pública y reglas de iconografía/tokens contra contratos de `specs/003-shared-components-base/contracts/`.
* **E2E**: N/A para esta fase; la validación transversal se cubre con Storybook + build/lint/test del repositorio.

## Estructura del proyecto

### Documentación de esta funcionalidad

```text
specs/003-shared-components-base/
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
    ├── button/
    ├── icon/
    ├── input/       # NUEVO
    ├── panel/       # NUEVO
    ├── badge/       # NUEVO
    ├── progress/    # NUEVO
    └── dialog/      # NUEVO

src/
└── styles/
    ├── _colors.css
    ├── _spacing.css
    ├── _shadows.css
    ├── _radii.css
    ├── _typography.css
    └── index.css

scripts/
└── check-components.mjs
```

**Decisión de estructura**: Se mantiene el patrón actual de librería interna y se añaden cinco carpetas de componente con la misma convención de archivos obligatorios (`.ts`, `.type.ts`, `.constants.ts`, `.css`, `.test.ts`, `.stories.ts`, `index.ts`).

## Modelo de datos

Ver [data-model.md](./data-model.md). Resumen: se definen cinco nuevas entidades de contrato de componente (`InputProps`, `PanelProps`, `BadgeProps`, `ProgressProps`, `DialogProps`) y un conjunto compartido de reglas de composición/accesibilidad/iconografía.

## Contratos e interfaces

* **Contrato de APIs públicas de la base de componentes compartidos**: ver [contracts/shared-components-api.md](./contracts/shared-components-api.md)
* **Contrato de reglas visuales y de iconografía compartida**: ver [contracts/shared-components-visual-rules.md](./contracts/shared-components-visual-rules.md)

## Riesgos y compromisos

* **Riesgo**: Inconsistencias de naming/tokens entre 5 componentes implementados en paralelo. **Mitigación**: contrato centralizado + validación obligatoria con `check-components.mjs` y revisión Storybook de variantes.
* **Riesgo**: `Dialog` podría incumplir accesibilidad de teclado si se implementa tarde. **Mitigación**: tests de foco/cierre como criterio bloqueante desde el primer commit del componente.
* **Compromiso**: Se prioriza una API mínima y estable sobre opciones avanzadas (p. ej. posicionamiento complejo, theming dinámico), difiriendo extensiones no críticas a features posteriores.

## Seguimiento de complejidad

N/A — no existen violaciones constitucionales que requieran justificación.
