---
title: "Contrato: Interfaz pública del componente Panel"
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

# Contrato: Interfaz pública del componente `Panel`

**Trazabilidad**: FR-011, US2, DM-004 (`PanelProps`)

## Propósito

Definir la API pública mínima y estable de `Panel` en `libs/components/panel/`, para encapsular contenido compuesto en secciones reutilizables sin acoplarlas a una feature concreta.

## Punto de entrada

```ts
export { createPanel } from './Panel';
export type { PanelProps } from './Panel';
```

## Firma pública

```ts
interface PanelProps {
    title?: string;
    description?: string;
    variant?: 'default' | 'highlight' | 'danger';
    content: HTMLElement | HTMLElement[];
}

function createPanel(props: PanelProps): HTMLElement;
```

## Reglas del contrato

* **R1 (VAL-401)**: `createPanel` MUST renderizar `content` preservando el orden de entrada, aceptando tanto `HTMLElement` único como `HTMLElement[]`.
* **R2 (VAL-402)**: `variant` MUST controlar la apariencia visual del contenedor sin introducir lógica de dominio.
* **R3**: Las variantes de `Panel` MUST distinguirse mediante más de una señal visual, no solo color.

## Ejemplo de uso

```ts
import { createPanel } from 'libs/components/panel';

const panel = createPanel({
    title: 'Datos del planeta',
    variant: 'highlight',
    content: [descriptionEl, factsListEl],
});
```

## Evidencia de cumplimiento (auditoría T038/T045)

Verificado en `Panel.ts`: `content` se añade mediante `append(...toNodes(content))`, preservando el orden de entrada; cada variante semántica añade un icono de estado automático como señal no cromática adicional. Validación automatizada de respaldo: `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook` en verde en la última ejecución.

## Fuera de alcance

* Layout responsivo de pantallas completas.
* Theming dinámico por consumidor.
