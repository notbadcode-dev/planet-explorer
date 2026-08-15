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