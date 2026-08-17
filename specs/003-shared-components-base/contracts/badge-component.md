---
title: "Contrato: Interfaz pública del componente Badge"
feature: "003-shared-components-base"
type: "contract"
version: "1.0"
created: "2026-08-16"
updated: "2026-08-16T12:00:00Z"
status: "Approved"
spec: "../spec.md"
plan: "../plan.md"
data_model: "../data-model.md"
tags: [frontend, ui, contract, accessibility]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Contrato: Interfaz pública del componente `Badge`

**Trazabilidad**: FR-012, US1, DM-005 (`BadgeProps`)

## Propósito

Definir la API pública mínima y estable de `Badge` en `libs/components/badge/`, para etiquetado compacto de estado/categoría con variantes distinguibles sin depender únicamente del color.

## Punto de entrada

```ts
export { createBadge } from './Badge';
export type { BadgeProps } from './Badge';
```

## Firma pública

```ts
interface BadgeProps {
    label: string;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    icon?: IconName;
}

function createBadge(props: BadgeProps): HTMLElement;
```

## Reglas del contrato

* **R1 (VAL-501)**: `label` MUST ser obligatorio y no vacío.
* **R2 (VAL-502)**: Si `icon` está presente, MUST provenir del catálogo de `Icon` (`libs/components/icon`).
* **R3 (VAL-503)**: Las variantes MUST distinguirse mediante más de una señal visual, no solo color.

## Ejemplo de uso

```ts
import { createBadge } from 'libs/components/badge';

const statusBadge = createBadge({
    label: 'Descubierto',
    variant: 'success',
});
```

## Evidencia de cumplimiento (auditoría T038/T045)

Verificado en `Badge.ts`: icono siempre renderizado vía `createIcon` de `../icon`; cada variante semántica añade un icono de estado automático (independiente del icono opcional del consumidor) como señal no cromática. Validación automatizada de respaldo: `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook` en verde en la última ejecución.

## Fuera de alcance

* Badges interactivos (clicables/cerrables): fuera de alcance de esta versión.
