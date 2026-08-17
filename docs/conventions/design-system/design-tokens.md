---
title: "Convención: Tokens de diseño (color, espaciado, radios, sombras, movimiento)"
type: "convention"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16"
status: "Approved"
source: "src/styles/_colors.css, _spacing.css, _radii.css, _shadows.css, _motion.css"
tags: [design-system, tokens, accessibility]
---

# Convención: Tokens de diseño (color, espaciado, radios, sombras, movimiento)

**Fuente**: `src/styles/_colors.css`, `_spacing.css`, `_radii.css`, `_shadows.css`,
`_motion.css` (importados desde `src/styles/index.css`).

> Extraído el 2026-08-16 al detectar que la regla V1 de
> [`../components/visual-rules.md`](../components/visual-rules.md) ("todo valor visual
> MUST derivar de tokens globales en `src/styles/`") no tenía, a diferencia de
> [`typography.md`](./typography.md), un catálogo consultable de qué tokens existen ya.
> Este documento cierra ese hueco; no introduce ninguna regla nueva.

## Propósito

Catalogar los tokens de diseño no tipográficos disponibles en `src/styles/`, para que
cualquier componente nuevo pueda reutilizarlos sin tener que inspeccionar cada fichero
CSS ni arriesgarse a introducir un valor hardcoded o un token duplicado.

## Reutilización antes de creación

* **T1**: Antes de añadir un token nuevo, MUST comprobarse que no existe ya un token
  semántico equivalente en esta lista.
* **T2**: Si se añade un token nuevo, MUST ubicarse en el archivo global adecuado
  (`_colors.css`, `_spacing.css`, `_radii.css`, `_shadows.css`, `_motion.css`) y
  SHOULD reutilizarse en más de un componente cuando aplique, en lugar de crear un
  token de un solo uso.
* **T3**: Ningún componente MUST introducir un valor de color, espaciado, radio,
  sombra o duración/easing de animación hardcoded cuando exista un token adecuado
  (ver también V1-V3 en [`visual-rules.md`](../components/visual-rules.md)).

## Color (`_colors.css`)

`color-scheme: dark` — la app es dark-first. Los tokens se agrupan por categoría
semántica; consulta el fichero para los valores exactos (hex/RGB):

* **Paleta base**: `--color-black`, `--color-white`, `--color-deep-navy`,
  `--color-cosmic-indigo`, `--color-nebula-purple`, `--color-sky-cyan`,
  `--color-starlight-yellow`, `--color-cosmic-white`, más variantes `-rgb` para
  composición con alpha (`rgb(var(--color-x-rgb) / NN%)`).
* **Fondos y superficies**: `--color-background`, `--color-background-deep`,
  `--color-surface`, `--color-surface-raised`, `--color-surface-muted`,
  `--color-surface-disabled`.
* **Texto**: `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`,
  `--color-text-disabled`, `--color-text-inverse`.
* **Bordes y foco**: `--color-border-subtle`, `--color-border-strong`,
  `--color-border-indigo`, `--color-border-purple`, `--color-border-cyan`,
  `--color-focus-ring`.
* **Acciones**: `--color-primary`/`-hover`/`-pressed`/`-disabled`,
  `--color-secondary`/`-hover`/`-pressed`/`-disabled`,
  `--color-danger`/`-hover`/`-pressed`/`-disabled`.
* **Feedback de formulario**: `--color-input-background`, `--color-input-border`,
  `--color-input-border-focus`, `--color-input-border-error`,
  `--color-input-placeholder`, `--color-validation-success`,
  `--color-validation-error`.
* **Acentos decorativos**: `--color-accent-star`, `--color-accent-planet`,
  `--color-accent-orbit`, `--color-accent-rocket`.
* **Semántica de `Button`**: `--color-button-{primary,secondary,danger,disabled}-*`
  (background/foreground/border, incl. estados hover/pressed) — reutilizables por
  cualquier componente con variantes primary/secondary/danger.
* **Gradientes**: `--color-gradient-*-start`/`-end` y sus `--gradient-*` resueltos
  (p. ej. `--gradient-primary`).

## Espaciado y tamaño (`_spacing.css`)

* **Escala base**: `--space-0` … `--space-20` (progresión ~0.25rem a 5rem).
* **Layout**: `--space-page-inline` (clamp responsive), `--space-page-block`,
  `--space-section-gap`, `--space-panel-padding`, `--space-toolbar-gap`,
  `--space-grid-gap`.
* **Controles**: `--space-control-inline`, `--space-control-block`,
  `--space-control-gap`, `--space-helper-text-gap`, `--space-press-offset`.
* **Tamaño de componente**: `--size-touch-target-min` (44px, mínimo táctil),
  `--size-button-min-width`, `--size-control-sm/md/lg`, `--size-input`.
* **Grosor de borde**: `--size-border-control`, `--size-border-emphasis`.
* **Iconos**: `--size-icon-xs/sm/md/lg/xl`.

## Radios (`_radii.css`)

* **Escala base**: `--radius-none`, `--radius-xs`, `--radius-sm`, `--radius-md`,
  `--radius-lg`, `--radius-xl`, `--radius-pill`.
* **Semánticos** (preferir estos sobre la escala base cuando exista): `--radius-card`,
  `--radius-panel`, `--radius-control`, `--radius-input`, `--radius-badge`.

## Sombras y glow (`_shadows.css`)

* **Elevación**: `--shadow-none`, `--shadow-panel`, `--shadow-control`.
* **Glow por acción**: `--shadow-primary-glow`/`-hover-glow`,
  `--shadow-secondary-glow`/`-hover-glow`, `--shadow-cyan-glow`,
  `--shadow-danger-glow`.
* **Estados de foco/error**: `--shadow-focus-ring`, `--shadow-error-ring`,
  `--shadow-inset-highlight`.

## Movimiento (`_motion.css`)

* **Duración**: `--motion-duration-fast` (150ms), `--motion-duration-base` (220ms),
  `--motion-duration-slow` (320ms).
* **Easing**: `--motion-easing-standard`, `--motion-easing-emphasized`.
* **Retraso**: `--motion-delay-tooltip` (300ms).
* **M1**: Cualquier transición/animación CSS de un componente MUST usar estos
  tokens de duración/easing en lugar de valores hardcoded.
* **M2**: `@media (prefers-reduced-motion: reduce)` MUST respetarse; `_motion.css`
  ya reduce todas las duraciones/retrasos a `0`/`0ms` bajo esa media query, por lo
  que un componente que use estos tokens obtiene la reducción de movimiento sin
  lógica adicional.

## Fuera de alcance

* Los valores exactos (hex, rem, ms) — consultar directamente el fichero `.css`
  correspondiente; este documento cataloga nombres y agrupación semántica, no
  duplica valores que puedan cambiar.
* Los tokens tipográficos — viven en [`typography.md`](./typography.md).
* La regla de principio "todo valor visual deriva de tokens globales" — vive en V1
  de [`visual-rules.md`](../components/visual-rules.md); este documento es su
  catálogo de referencia.
