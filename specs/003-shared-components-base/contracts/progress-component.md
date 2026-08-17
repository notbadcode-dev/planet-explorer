---
title: "Contrato: Interfaz pública del componente Progress"
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

# Contrato: Interfaz pública del componente `Progress`

**Trazabilidad**: FR-013, US1, DM-006 (`ProgressProps`)

## Propósito

Definir la API pública mínima y estable de `Progress` en `libs/components/progress/`, exponiendo un indicador accesible con normalización determinista de valores fuera de rango.

## Punto de entrada

```ts
export { createProgress } from './Progress';
export type { ProgressProps } from './Progress';
```

## Firma pública

```ts
interface ProgressProps {
    value: number;
    max?: number;
    label?: string;
    ariaLabel?: string;
    showValue?: boolean;
}

function createProgress(props: ProgressProps): HTMLElement;
```

## Reglas del contrato

* **R1 (VAL-601)**: `createProgress` MUST garantizar nombre accesible efectivo mediante `label` o `ariaLabel`.
* **R2 (VAL-602/603)**: `value` efectivo MUST normalizarse al rango `[0, maxEfectivo]`; `maxEfectivo` MUST usar un mínimo válido seguro cuando `max` no es válido (`<= 0`).
* **R3 (VAL-604)**: El valor visible (si `showValue` es `true`) MUST coincidir con el valor semántico normalizado.

## Ejemplo de uso

```ts
import { createProgress } from 'libs/components/progress';

const missionProgress = createProgress({
    label: 'Progreso de la misión',
    value: 7,
    max: 10,
    showValue: true,
});
```

## Evidencia de cumplimiento (auditoría T038/T045)

Verificado en `Progress.ts`: `resolveMax`/`clampValue` normalizan valores fuera de rango; nombre accesible resuelto por `label`/`ariaLabel` con fallback. Validación automatizada de respaldo: `npm run lint`, `npm test`, `npm run build`, `npm run build-storybook` en verde en la última ejecución.

## Fuera de alcance

* Progreso indeterminado (ver `Spinner`/`Loader`, componente distinto — FR-030).
