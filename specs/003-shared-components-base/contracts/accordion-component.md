---
title: "Contrato: Interfaz pública del componente Accordion"
feature: "003-shared-components-base"
type: "contract"
version: "1.1"
created: "2026-08-16"
updated: "2026-08-19T00:00:00Z"
status: "Approved"
spec: "../spec.md"
plan: "../plan.md"
data_model: "../data-model.md"
tags: [frontend, ui, contract, accessibility]
dependencies: ["002-button-variants"]
related_specs: ["001-component-library-architecture", "002-button-variants"]
---

# Contrato: Interfaz pública del componente `Accordion`

**Trazabilidad**: FR-031, US11, DM-017 (`AccordionProps`)

**Estado de implementación**: Implementado (oleada de prioridad P3, ampliación 2026-08-16; ver evidencia T148).

## Propósito

Definir la API pública mínima y estable de `Accordion` en `libs/components/accordion/`, para mostrar contenido expandible/colapsable (p. ej. curiosidades, FAQ por planeta).

## Punto de entrada

```ts
export { createAccordion } from './Accordion';
export type { AccordionProps } from './Accordion';
```

## Firma pública

```ts
interface AccordionProps {
    sections: { id: string; title: string; content: HTMLElement }[];
    defaultExpandedIds?: string[];
    exclusive?: boolean;
    onToggle?: (id: string, expanded: boolean) => void;
}

function createAccordion(props: AccordionProps): HTMLElement;
```

## Reglas del contrato

* **R1 (VAL-1701)**: Cada sección MUST exponer su estado expandido/colapsado mediante `aria-expanded` sobre su encabezado activable.
* **R2 (VAL-1702)**: Varias secciones MUST poder estar expandidas simultáneamente de forma independiente por defecto (decisión de `/speckit-clarify` sesión previa, R-026).
* **R3 (VAL-1703)**: Una sección con `content` vacío MUST renderizarse igualmente expandible/colapsable, sin contenido visible al expandirse.
* **R4 (FR-033)**: El cambio expandido/colapsado MUST animarse mediante transición CSS (tokens de movimiento compartidos), en lugar de un cambio instantáneo de visibilidad, salvo `prefers-reduced-motion: reduce` (FR-045).
* **R5 (FR-034)**: Con `exclusive: true`, expandir una sección MUST colapsar automáticamente el resto; por defecto (`false`), las secciones MUST permanecer independientes (R-026).
* **R6 (FR-035)**: Cada encabezado MUST incluir un icono indicador decorativo (`aria-hidden`) del estado expandido/colapsado, con contraste suficiente respecto al fondo.

## Ejemplo de uso

```ts
import { createAccordion } from 'libs/components/accordion';

const trivia = createAccordion({
    sections: [
        { id: 'moons', title: '¿Cuántas lunas tiene?', content: moonsContentEl },
        { id: 'rings', title: '¿Tiene anillos?', content: ringsContentEl },
    ],
});
```

## Evidencia de cumplimiento (T148, auditoría de ausencia de lógica de dominio)

Verificado en `Accordion.ts`: gestiona únicamente el estado expandido/colapsado por sección (`aria-expanded`, expansión múltiple independiente) y `onToggle`; `content` es un `HTMLElement` opaco definido por el consumidor. Cobertura: `Accordion.test.ts` (4 casos) sobre VAL-1701..VAL-1703. Validación automatizada de respaldo: `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook` en verde en la última ejecución (Phase 17, T152).

## Evidencia de cumplimiento — Fase 18 (T157-T163, 2026-08-19)

Verificado en `Accordion.ts`/`Accordion.css`: el panel expandido/colapsado no se recrea al hacer toggle (mismo nodo DOM) y anima su aparición mediante `@keyframes accordion-panel-reveal` consumiendo `--motion-duration-base`/`--motion-easing-standard` de `src/styles/_motion.css`; el modo `exclusive` colapsa el resto de secciones al expandir una (probado en `Accordion.test.ts`); el encabezado incluye un icono `caret-down` decorativo (`aria-hidden="true"`) que rota 180° vía `transform` al expandirse. Cobertura ampliada: `Accordion.test.ts` (8 casos). Gates: `npm run lint`, `npm test` (129/129), `npm run build`, `npm run build-storybook` en verde.

## Fuera de alcance

* Anidamiento de acordeones (acordeón dentro de otro acordeón): fuera de alcance de esta versión.
