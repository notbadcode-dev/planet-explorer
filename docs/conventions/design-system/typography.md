---
title: "Convención: Familias tipográficas y tokens semánticos"
type: "convention"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16"
status: "Approved"
source: "constitution.md (sección Tipografía)"
tags: [design-system, typography]
---

# Convención: Familias tipográficas y tokens semánticos

**Fuente**: `constitution.md` (sección Tipografía).

> Extraído de `constitution.md` (sección "Tipografía") el 2026-08-16: la constitución
> mantiene la regla de principio (tokens semánticos, sin fuentes remotas, sin
> hardcodear familias); este documento reúne el mapa concreto de familias/uso y los
> tokens definidos en `src/styles/_typography.css`, que es material de referencia
> y no un principio de gobernanza.

## Propósito

Fijar las familias tipográficas concretas, el mapa de uso semántico y los tokens
definidos en `src/styles/_typography.css`, de forma que cualquier componente o
pantalla pueda consumir la tipografía correcta sin necesidad de reinterpretar la
regla de principio de la constitución.

## Familias tipográficas base

* `Fredoka` para identidad visual, títulos y textos expresivos.
* `Nunito` para controles e interfaz operativa.
* `Atkinson Hyperlegible Next` para texto de lectura dirigido al niño (`Atkinson
  Hyperlegible` MAY mantenerse como fallback por compatibilidad).

## Mapa de uso semántico

* `Fredoka`: logo, H1/H2, nombres de planetas o destinos, recompensas.
* `Nunito`: botones, tabs, inputs, labels, navegación y controles.
* `Atkinson Hyperlegible Next`: instrucciones, preguntas, datos astronómicos y
  cualquier texto que el niño deba leer o comprender.

## Tokens semánticos definidos (`src/styles/_typography.css`)

| Token | Familia resuelta |
|---|---|
| `--font-family-logo` | `--font-family-display` (Fredoka) |
| `--font-family-title` | `--font-family-heading` (Fredoka) |
| `--font-family-planet-name` | `--font-family-display` (Fredoka) |
| `--font-family-reward` | `--font-family-display` (Fredoka) |
| `--font-family-button` | `--font-family-control` (Nunito) |
| `--font-family-tab` | `--font-family-control` (Nunito) |
| `--font-family-input` | `--font-family-control` (Nunito) |
| `--font-family-label` | `--font-family-control` (Nunito) |
| `--font-family-navigation` | `--font-family-control` (Nunito) |
| `--font-family-instruction` | `--font-family-reading` (Atkinson Hyperlegible Next) |
| `--font-family-question` | `--font-family-reading` (Atkinson Hyperlegible Next) |
| `--font-family-astronomy-fact` | `--font-family-reading` (Atkinson Hyperlegible Next) |
| `--font-family-child-copy` | `--font-family-reading` (Atkinson Hyperlegible Next) |

Los componentes y pantallas SHOULD consumir estos tokens semánticos en lugar de
`--font-family-display`/`--font-family-control`/`--font-family-reading` directamente,
y MUST NOT fijar una familia tipográfica concreta cuando exista un token adecuado.

## Otros tokens tipográficos disponibles

* Tamaño: `--font-size-xs` a `--font-size-display`.
* Peso: `--font-weight-regular` a `--font-weight-extrabold`, más los semánticos
  `--font-weight-reading`, `--font-weight-control`, `--font-weight-control-strong`,
  `--font-weight-heading`, `--font-weight-display`.
* Interlineado: `--line-height-tight`, `--line-height-normal`, `--line-height-relaxed`.
* Tracking: `--letter-spacing-default`, `--letter-spacing-label`, `--letter-spacing-display`.

## Carga de fuentes

Las fuentes utilizadas en producción MUST cargarse como assets locales o empaquetados
por Vite (ver `@font-face` en `src/styles/_typography.css` y ficheros bajo
`src/assets/fonts/`). La aplicación MUST NOT depender en runtime de Google Fonts, CDNs
de fuentes u otros proveedores remotos para renderizar su tipografía principal.

## Fuera de alcance

* La regla de principio sobre por qué el sistema tipográfico debe favorecer
  legibilidad, accesibilidad y coherencia visual: vive en la constitución, sección
  "Tipografía".
* La incorporación de una nueva familia tipográfica: MUST justificarse y
  documentarse en la especificación o plan de la feature correspondiente (ver
  constitución).
