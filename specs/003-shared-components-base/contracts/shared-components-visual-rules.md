---
title: "Contrato: Reglas visuales e iconografía compartida"
feature: "003-shared-components-base"
type: "contract"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16"
status: "Approved"
spec: "../spec.md"
plan: "../plan.md"
data_model: "../data-model.md"
tags: [contract, design-system, accessibility]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Contrato: Reglas visuales e iconografía compartida

## Propósito

Fijar reglas obligatorias para estilos, tokens y uso de iconos en los nuevos componentes compartidos.

## Reglas visuales

- V1: Todo valor visual (colores, espacios, radios, sombras, tipografía, tamaños y estados) MUST derivar de tokens globales en `src/styles/`.
- V2: Un componente MUST NOT introducir colores hardcoded, medidas hardcoded ni fuentes directas en su CSS.
- V3: Si falta un token reusable, MUST añadirse primero al archivo global adecuado antes de consumirlo.
- V4: Los archivos `*.constants.ts` MUST centralizar strings y números de uso productivo para evitar valores mágicos en implementación.

## Reglas de iconografía

- I1: Ningún componente compartido puede importar iconos directamente de `@phosphor-icons/core` ni rutas SVG de Phosphor.
- I2: Todo icono consumido por componentes compartidos MUST renderizarse mediante el componente `Icon` en `libs/components/icon`.
- I3: Si falta un icono requerido, primero MUST ampliarse el catálogo central de `Icon`.
- I4: Iconos decorativos MUST renderizarse con `aria-hidden`.
- I5: Iconos con significado MUST proporcionar nombre accesible mediante `ariaLabel`.

## Reglas de validación

- Q1: `npm run lint` MUST pasar, incluyendo `check-components.mjs`.
- Q2: `npm run test` MUST pasar con foco en comportamiento y accesibilidad básica.
- Q3: `npm run build` MUST pasar.
- Q4: `npm run build-storybook` MUST pasar.
- Q5: Storybook MUST cubrir estados visuales relevantes de cada componente nuevo.

## Trazabilidad

- Requisitos: FR-005, FR-006, FR-007, FR-008, FR-016, FR-017, FR-018.
- Criterios de éxito: SC-002, SC-003, SC-004, SC-005, SC-006, SC-007.

## Evidencia de cumplimiento (auditoría T038/T045)

- **V1-V3 (tokens)**: los CSS de `input`, `panel`, `badge`, `progress` y `dialog` solo consumen `var(--...)` de `src/styles/`; no se detectan colores/medidas/fuentes hardcoded. Los tokens de icono de estado (`--size-icon-xs`, `--size-icon-sm`) ya existían en `_spacing.css`, sin necesidad de ampliar el set global.
- **V4 (constantes)**: `check-components.mjs` (regla `isMagicLiteral`) pasa sin incidencias sobre los cinco componentes, confirmando ausencia de literales mágicos fuera de `*.constants.ts`.
- **I1-I3 (iconografía centralizada)**: `grep` sobre `libs/components/**` confirma que los imports de `@phosphor-icons/core` existen únicamente en `libs/components/icon/Icon.constants.ts`; el catálogo se amplió ahí (`check-circle`, `warning-circle`, `x-circle`, `info-circle`) para cubrir los iconos de estado no-color de `Badge`/`Panel`.
- **I4-I5 (decorativo vs. informativo)**: los iconos de estado automáticos de `Badge`/`Panel` se crean sin `ariaLabel` (decorativos, `aria-hidden`); el icono opcional de `Badge` y las acciones de `Dialog` exponen `ariaLabel`/texto accesible cuando transmiten significado.
- **Q1-Q5 (gates)**: última ejecución registrada — `npm run lint` OK, `npm test` 40/40 OK, `npm run build` OK, `npm run build-storybook` OK; Storybook cubre las 5 variantes de `Badge` y las 3 de `Panel` mediante controles interactivos (`argTypes.variant`).