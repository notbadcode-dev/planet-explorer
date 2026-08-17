---
title: "Convención: Reglas visuales e iconografía compartida"
type: "convention"
version: "1.5"
created: "2026-08-16"
updated: "2026-08-16"
status: "Approved"
source: "specs/003-shared-components-base/"
tags: [convention, design-system, accessibility]
---

# Convención: Reglas visuales e iconografía compartida

**Fuente**: specs/003-shared-components-base/ (reglas transversales para toda la librería de componentes).

> Migrado desde `specs/003-shared-components-base/contracts/shared-components-visual-rules.md`
> (2026-08-16) a `docs/` por ser una convención transversal aplicable a toda la librería de
> componentes. La evidencia de cumplimiento auditada específicamente para la feature
> `003-shared-components-base` permanece en ese fichero original (no se migra, es historial
> de una feature concreta, no una convención).

## Propósito

Fijar reglas obligatorias transversales para estilos, tokens, uso de iconos, estabilidad de API y quality gates que aplican a **todos** los componentes de `libs/components/`. Es el equivalente, para la librería compartida en su conjunto, al contrato de convención estructural de [`structure.md`](./structure.md).

La interfaz pública específica de cada componente (props, reglas de comportamiento propias) se define en su propio contrato individual, dentro de `specs/003-shared-components-base/contracts/` (u otra feature que lo introduzca).

## Reglas de API transversales

- A1: La API pública de cada componente MUST permanecer pequeña y estable; cambios mayores requieren nueva feature spec.
- A2: `Input` y `Dialog` MUST exponer `size` con el mismo catálogo cerrado `'small' | 'medium' | 'large'` (por defecto `'medium'`) ya definido por `ButtonSize`, sin escalas divergentes. Ver [`api-patterns.md`](./api-patterns.md) (P1-P13) para el resto de patrones de forma de API (factory, validación, callbacks, composición). Ver también [`css.md`](./css.md) R10 sobre cómo el `size` es un ancho objetivo, no una cota estricta, cuando el contenido no cabe.

## Reglas visuales

- V1: Todo valor visual (colores, espacios, radios, sombras, tipografía, tamaños y estados) MUST derivar de tokens globales en `src/styles/` (ver catálogo en [`../design-system/design-tokens.md`](../design-system/design-tokens.md) y [`../design-system/typography.md`](../design-system/typography.md)).
- V2: Un componente MUST NOT introducir colores hardcoded, medidas hardcoded ni fuentes directas en su CSS.
- V3: Si falta un token reusable, MUST añadirse primero al archivo global adecuado antes de consumirlo (ver T1-T2 en [`../design-system/design-tokens.md`](../design-system/design-tokens.md)).
- V4: Los archivos `*.constants.ts` MUST centralizar strings y números de uso productivo para evitar valores mágicos en implementación.

## Reglas de iconografía

- I1: Ningún componente compartido puede importar iconos directamente de `@phosphor-icons/core` ni rutas SVG de Phosphor.
- I2: Todo icono consumido por componentes compartidos MUST renderizarse mediante el componente `Icon` en `libs/components/icon`.
- I3: Si falta un icono requerido, primero MUST ampliarse el catálogo central de `Icon`.
- I4: Iconos decorativos MUST renderizarse con `aria-hidden`.
- I5: Iconos con significado MUST proporcionar nombre accesible mediante `ariaLabel`.

## Reglas de validación

- Q1: `npm run lint` MUST pasar, incluyendo `check-components.mjs`.
- Q2: `npm run test` MUST pasar con foco en comportamiento y accesibilidad básica (ver entorno y estrategia de selectores en [`testing.md`](./testing.md)).
- Q3: `npm run build` MUST pasar.
- Q4: `npm run build-storybook` MUST pasar.
- Q5: Storybook MUST cubrir cada estado/variante/rama visual distinguible de cada componente mediante una historia nombrada e individual, no solo un playground con controles interactivos (ver [`storybook.md`](./storybook.md)).
- Q6: Storybook MUST demostrar mediante historias nombradas las combinaciones de casos límite documentadas en el `spec.md` de la feature que introduce el componente.
- Q7: Componentes tipo `Dialog` (u overlay equivalente) MUST incluir al menos 2 historias completamente interactivas que lo abran desde un control real distinto y demuestren visualmente el retorno de foco al invocador al cerrar.
- Q8: Storybook MUST cubrir cada estado/variante/rama visual distinguible de cada componente nuevo mediante una historia nombrada e individual, siguiendo el mismo estándar exigido por Q5.
- Q9: Componentes de selección (p. ej. `CardTile`, `Select`, `RadioGroup`, `CheckboxGroup`) MUST ser completamente operables por teclado y MUST exponer su estado de selección/bloqueo a tecnologías de asistencia sin fallos.
- Q10: Componentes con patrones WAI-ARIA específicos (p. ej. `Tabs`, `Toast`/`Snackbar`, `Accordion`) MUST cumplir el patrón correspondiente (pestaña/panel, región en vivo, expandido/colapsado) sin fallos en pruebas. Ver [`interaction-patterns.md`](./interaction-patterns.md) (R1-R8) para el detalle concreto de cada patrón (form controls, modales, pestañas, notificaciones, tooltips).

## Fuera de alcance

* La interfaz pública específica de cada componente (props, comportamiento propio): vive en su contrato individual dentro de `specs/003-shared-components-base/contracts/` (u otra feature que lo introduzca).
* La evidencia de auditoría de cumplimiento para la feature `003-shared-components-base`: permanece en `specs/003-shared-components-base/contracts/shared-components-visual-rules.md` (no se migra, es historial de una feature concreta, no una convención).
* Los patrones de forma de API (factory, validación, callbacks) — viven en [`api-patterns.md`](./api-patterns.md).
* El entorno y los selectores de testing — viven en [`testing.md`](./testing.md).
* La nomenclatura y cobertura de Storybook — viven en [`storybook.md`](./storybook.md).
* El comportamiento concreto de accesibilidad por tipo de componente — vive en [`interaction-patterns.md`](./interaction-patterns.md).
* Las decisiones de arquitectura y alternativas descartadas (Web Components, CSS-in-JS, etc.) — cada patrón cita su alternativa descartada en el propio documento que lo define ([`api-patterns.md`](./api-patterns.md), [`css.md`](./css.md)); no existe un registro aparte.
