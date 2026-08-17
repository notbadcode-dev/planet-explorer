---
title: "Contrato: Interfaz pública del componente Spinner"
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

# Contrato: Interfaz pública del componente `Spinner`

**Trazabilidad**: FR-030, US10, DM-016 (`SpinnerProps`)

**Estado de implementación**: Implementado (oleada de prioridad P3, ampliación 2026-08-16; ver evidencia T148).

## Propósito

Definir la API pública mínima y estable de `Spinner`/`Loader` en `libs/components/spinner/`, para representar estados de carga indeterminada, distinta de la semántica determinada de `Progress`.

## Punto de entrada

```ts
export { createSpinner } from './Spinner';
export type { SpinnerProps } from './Spinner';
```

## Firma pública

```ts
interface SpinnerProps {
    label?: string;
    ariaLabel?: string;
    size?: 'small' | 'medium' | 'large';
}

function createSpinner(props: SpinnerProps): HTMLElement;
```

## Reglas del contrato

* **R1 (VAL-1601)**: MUST exponer semántica accesible de carga indeterminada (p. ej. `role="status"` + `aria-busy="true"`), distinta de `Progress`.
* **R2 (VAL-1602)**: Al retirarse del DOM, MUST dejar de anunciarse como estado de carga activo.
* **R3 (VAL-1603)**: `size`, si se declara, MUST reutilizar el mismo catálogo cerrado `ComponentSize` que `Button`.

## Ejemplo de uso

```ts
import { createSpinner } from 'libs/components/spinner';

const loadingIndicator = createSpinner({
    label: 'Cargando misión…',
});
```

## Evidencia de cumplimiento (T148, auditoría de ausencia de lógica de dominio)

Verificado en `Spinner.ts`: expone únicamente semántica de carga indeterminada (`role="status"` + `aria-busy="true"`) y tamaño, reutilizando el catálogo `small`/`medium`/`large` de `Button`; no calcula progreso ni conoce el estado de la operación en curso. Cobertura: `Spinner.test.ts` (5 casos) sobre VAL-1601..VAL-1603. Validación automatizada de respaldo: `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook` en verde en la última ejecución (Phase 17, T152).

## Fuera de alcance

* Progreso determinado con valor conocido (ver `Progress`, componente distinto — FR-013).

## Evidencia de cumplimiento — Fase 18 (T183, 2026-08-19, FR-039)

Sin cambios de código en `Spinner.ts`/`Spinner.constants.ts`: la implementación existente ya satisfacía FR-039. Se añadió una prueba explícita en `Spinner.test.ts` que confirma que, sin `label`, el spinner conserva un nombre accesible efectivo (`aria-label`/`ariaLabel`) sin renderizar texto visible en el DOM. Cobertura ampliada: `Spinner.test.ts` (6 casos). Gates: `npm run lint`, `npm test` (129/129), `npm run build`, `npm run build-storybook` en verde.
